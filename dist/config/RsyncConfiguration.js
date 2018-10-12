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
    constructor(binaries, src, dest, config) {
        this._args = '';
        this._excludes = [];
        this._mode = RsyncMode.SYNC;
        this._bin = binaries.rsync;
        this._src = src;
        this._dest = dest;
        if (config) {
            if (config.mode) {
                this._mode = RsyncMode['backup'];
            }
            if (config.args) {
                this._args = config.args;
            }
            else {
                this._args = '';
            }
            if (config.excludes) {
                this._excludes = config.excludes;
            }
            else {
                this._excludes = [];
            }
            if (config.hardlinks) {
                this._hardlinks = `--link-dest=${config.hardlinks.basePath}`;
            }
        }
    }
    init() {
        if (this._src.endsWith('/')) {
            this._src = `${this.path.resolve(this.untildifier.resolve(this._src))}/`;
        }
        else {
            this._src = this.path.resolve(this.untildifier.resolve(this._src));
        }
        if (this._dest.indexOf('{dest}') < 0) {
            this._dest = this.path.resolve(this.untildifier.resolve(this._dest));
        }
    }
    build() {
        return [
            this._bin,
            this._hardlinks ? this._hardlinks : '',
            this._args,
            this._excludes.reduce((memo, exclude) => `${memo} --exclude='${exclude}'`, ''),
            this._src,
            this._dest
        ].join(' ');
    }
    toJson() {
        const json = {
            src: this._src,
            dest: this._dest,
            bin: this._bin,
            args: this._args
        };
        if (this._excludes) {
            json.excludes = this._excludes;
        }
        if (this._hardlinks) {
            json.hardlinks = this._hardlinks;
        }
        return json;
    }
}
__decorate([
    Inject_1.default()
], RsyncConfiguration.prototype, "path", void 0);
__decorate([
    Inject_1.default()
], RsyncConfiguration.prototype, "untildifier", void 0);
exports.default = RsyncConfiguration;
var RsyncMode;
(function (RsyncMode) {
    RsyncMode["BACKUP"] = "backup";
    RsyncMode["SYNC"] = "sync";
})(RsyncMode = exports.RsyncMode || (exports.RsyncMode = {}));
//# sourceMappingURL=RsyncConfiguration.js.map