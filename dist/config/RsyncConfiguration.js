"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inject_1 = require("../ioc/Inject");
class RsyncConfiguration {
    constructor(src, dest, config) {
        this._excludes = [];
        this._mode = RsyncMode.SYNC;
        this._createDest = false;
        this._src = src;
        this._dest = dest;
        if (config) {
            if (config.mode) {
                this._mode = RsyncMode[config.mode.toUpperCase()];
            }
            if (config.args) {
                this._args = config.args;
            }
            if (config.excludes) {
                this._excludes = config.excludes;
            }
            if (config.hardlinks) {
                this._hardlinks = config.hardlinks.basePath;
            }
            if (config.createDest !== undefined) {
                this._createDest = config.createDest;
            }
        }
    }
    get bin() {
        return this._bin;
    }
    get src() {
        return this._src;
    }
    get dest() {
        return this._dest;
    }
    get hardLinks() {
        return this._hardlinks;
    }
    get args() {
        return this._args;
    }
    get excludes() {
        return this._excludes;
    }
    get mode() {
        return this._mode;
    }
    get isCreateDest() {
        return this._createDest;
    }
    resolve() {
        this._src = this.fileUtils.resolve(this._src);
        this._dest = this.fileUtils.resolve(this._dest);
        return this;
    }
    toJson() {
        const json = {
            src: this._src,
            dest: this._dest,
            mode: this._mode,
            bin: this._bin,
            args: this._args,
            createDest: this._createDest,
            excludes: this._excludes
        };
        if (this._hardlinks) {
            json.hardlinks = this._hardlinks;
        }
        return json;
    }
}
__decorate([
    Inject_1.default('rsyncBin')
], RsyncConfiguration.prototype, "_bin", void 0);
__decorate([
    Inject_1.default()
], RsyncConfiguration.prototype, "path", void 0);
__decorate([
    Inject_1.default()
], RsyncConfiguration.prototype, "fileUtils", void 0);
exports.default = RsyncConfiguration;
var RsyncMode;
(function (RsyncMode) {
    RsyncMode["BACKUP"] = "backup";
    RsyncMode["SYNC"] = "sync";
})(RsyncMode = exports.RsyncMode || (exports.RsyncMode = {}));
//# sourceMappingURL=RsyncConfiguration.js.map