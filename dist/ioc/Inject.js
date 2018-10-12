"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const Registry_1 = require("./Registry");
function Inject(ref) {
    return (target, key) => {
        Object.defineProperty(target.constructor.prototype, key, {
            enumerable: true,
            get: function () {
                return Registry_1.default.get(ref ? ref : key);
            }
        });
    };
}
exports.default = Inject;
function InjectInstance(className, ref) {
    return (target, key) => {
        Object.defineProperty(target.constructor.prototype, key, {
            enumerable: true,
            get: function () {
                return new (Registry_1.default.get(ref ? ref : key)[className])();
            }
        });
    };
}
exports.InjectInstance = InjectInstance;
//# sourceMappingURL=Inject.js.map