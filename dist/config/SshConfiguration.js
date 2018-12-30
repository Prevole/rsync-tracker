"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inject_1 = require("../ioc/Inject");
class SshConfiguration {
    constructor(config) {
        this._dest = config.dest;
        this._args = config.args;
    }
    get dest() {
        return this._dest;
    }
    get bin() {
        return this._bin;
    }
    get args() {
        return this._args;
    }
    toJson() {
        return {
            bin: this._bin,
            dest: this._dest,
            args: this._args
        };
    }
}
__decorate([
    Inject_1.default('sshBin')
], SshConfiguration.prototype, "_bin", void 0);
__decorate([
    Inject_1.default()
], SshConfiguration.prototype, "path", void 0);
__decorate([
    Inject_1.default()
], SshConfiguration.prototype, "fileUtils", void 0);
exports.default = SshConfiguration;
//# sourceMappingURL=SshConfiguration.js.map