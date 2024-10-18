"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = route;
exports.extract = extract;
function route(path, options, method) {
    return function (target, key, descriptor) {
        if (key) {
            if (!target.constructor.routes) {
                target.constructor.routes = [];
            }
            target.constructor.routes.push({ method, path, key, options });
        }
        else {
            target.prototype.prefix = path;
            target.prototype.options = options;
        }
    };
}
route.get = (path, options) => route(path, options, 'get');
route.post = (path, options) => route(path, options, 'post');
route.put = (path, options) => route(path, options, 'put');
route.patch = (path, options) => route(path, options, 'patch');
route.delete = (path, options) => route(path, options, 'delete');
function extract(...entities) {
    const routes = entities === null || entities === void 0 ? void 0 : entities.reduce((acc, curr) => {
        var _a, _b, _c, _d;
        const prefix = ((_a = curr.prototype) === null || _a === void 0 ? void 0 : _a.prefix) || '';
        const _options = ((_b = curr.prototype) === null || _b === void 0 ? void 0 : _b.options) || null;
        const routers = (_d = (_c = curr.routes) === null || _c === void 0 ? void 0 : _c.filter((route) => !route.key.startsWith('_'))) === null || _d === void 0 ? void 0 : _d.map(({ method, path, key, options }) => ({
            method,
            path: prefix + path,
            action: key,
            options: options || _options,
            controller: curr,
        })).sort((a, b) => (a.path.includes(':') ? 1 : -1));
        return [...acc, ...routers];
    }, []);
    return routes;
}
const main = { extract, route };
exports.default = main;
