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
    static get(key) {
        return Registry.deps[key];
    }
    static clear() {
        Registry.deps = {};
    }
}
Registry.deps = {};
exports.default = Registry;
//# sourceMappingURL=Registry.js.map