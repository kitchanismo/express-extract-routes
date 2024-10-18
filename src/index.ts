interface RouteOptions {
  protected?: boolean
}

type RouterType = {
  method: string
  path: string
  action: string
  options: RouteOptions
  controller: any
}

function route(path: string, options?: RouteOptions, method?: string) {
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

function extract(...entities) {
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
const main = { extract, route }

export default main
