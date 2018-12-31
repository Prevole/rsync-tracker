"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Registry {
    static register(key, value) {
        if (Registry.deps[key]) {
            throw new Error(`${key} is already registered`);
        }
        else {
            Registry.deps[key] = value;
        }
    }
    static registerIfNotExist(key, value) {
        if (!Registry.deps[key]) {
            Registry.deps[key] = value;
        }
    }
    static get(key) {
        return Registry.deps[key];
    }
    static clear(key) {
        if (key) {
            delete Registry.deps[key];
        }
        else {
            Registry.deps = {};
        }
    }
}
Registry.deps = {};
exports.default = Registry;
//# sourceMappingURL=Registry.js.map