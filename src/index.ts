interface RouteOptions {
  protected?: boolean
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete'

type RouterType = {
  method: HttpMethod
  path: string
  action: string
  options: RouteOptions
  controller: any
}

export function route(path: string, options?: RouteOptions, method?: string) {
  return function (target: any, key?: string, descriptor?: PropertyDescriptor) {
    if (key) {
      if (!target.constructor.routes) {
        target.constructor.routes = []
      }
      target.constructor.routes.push({ method, path, key, options })
    } else {
      target.prototype.prefix = path
      target.prototype.options = options
    }
  }
}

route.get = (path: string, options?: RouteOptions) =>
  route(path, options, 'get')
route.post = (path: string, options?: RouteOptions) =>
  route(path, options, 'post')
route.put = (path: string, options?: RouteOptions) =>
  route(path, options, 'put')
route.patch = (path: string, options?: RouteOptions) =>
  route(path, options, 'patch')
route.delete = (path: string, options?: RouteOptions) =>
  route(path, options, 'delete')

export function extract(...entities) {
  const routes = entities?.reduce((acc, curr) => {
    const prefix = (curr as any).prototype?.prefix || ''
    const _options = (curr as any).prototype?.options || null

    const routers = (curr as any).routes
      ?.filter((route: any) => !route.key.startsWith('_'))
      ?.map(({ method, path, key, options }) => ({
        method,
        path: prefix + path,
        action: key,
        options: options || _options,
        controller: curr,
      }))
      .sort((a, b) => (a.path.includes(':') ? 1 : -1))

    return [...acc, ...routers]
  }, [])
  return routes as RouterType[]
}

export function createController(route) {
  return async (req, res, next) => {
    const action = new route.controller()[route.action](req, res, next)
    if (action instanceof Promise) {
      try {
        const data = await action
        if (!res.headersSent) {
          return res.send(data)
        }
      } catch (error) {
        if (error?.message?.includes('circular')) {
          return res.status(400).send({ message: error?.message })
        }
        return res.status(400).send({ message: error?.message })
      }
    }
    //throw error if header throw again
    if (res.headersSent) return

    return res.json(action)
  }
}

const main = { extract, route }

export default main
