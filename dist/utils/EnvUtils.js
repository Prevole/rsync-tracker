"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EnvUtils {
    val(name, defaultValue) {
        return process.env[name] !== undefined ? process.env[name] : defaultValue;
    }
}
exports.default = EnvUtils;
//# sourceMappingURL=EnvUtils.js.map