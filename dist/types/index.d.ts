interface RouteOptions {
    protected?: boolean;
}
type RouterType = {
    method: string;
    path: string;
    action: string;
    options: RouteOptions;
    controller: any;
};
declare function route(path: string, options?: RouteOptions, method?: string): (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
declare namespace route {
    export var get: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var post: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var put: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export var patch: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    var _a: (path: string, options?: RouteOptions) => (target: any, key?: string, descriptor?: PropertyDescriptor) => void;
    export { _a as delete };
}
declare function extract(...entities: any[]): RouterType[];
declare const main: {
    extract: typeof extract;
    route: typeof route;
};
export default main;
