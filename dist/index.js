"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = route;
exports.extract = extract;
exports.createController = createController;
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
function createController(route) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const action = new route.controller()[route.action]({
            req,
            res,
            next,
        });
        if (action instanceof Promise) {
            try {
                const data = yield action;
                if (!res.headersSent) {
                    return res.send(data);
                }
            }
            catch (error) {
                if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes('circular')) {
                    return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.message });
                }
                return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.message });
            }
        }
        //throw error if header throw again
        if (res.headersSent)
            return;
        return res.json(action);
    });
}
const main = { extract, route };
exports.default = main;
