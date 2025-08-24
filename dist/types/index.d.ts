import { NextFunction } from 'express';
import { Response } from 'express';
import { Request } from 'express';
export interface IContext<TReq = any, TRes = any> {
    req: TReq;
    res: TRes;
    next: (...args: any[]) => void;
}
interface RouteOptions {
    protected?: boolean;
}
type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type RouterType = {
    method: HttpMethod;
    path: string;
    action: string;
    options: RouteOptions;
    controller: any;
};
export declare function route(path: string, options?: RouteOptions, method?: string): (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
export declare namespace route {
    export var get: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var post: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var put: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var patch: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    var _a: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export { _a as delete };
}
export declare function extract(...entities: any[]): RouterType[];
export declare function createController(route: any): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
declare const main: {
    extract: typeof extract;
    route: typeof route;
};
export default main;
