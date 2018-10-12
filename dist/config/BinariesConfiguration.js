"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BinariesConfiguration {
    constructor(config) {
        this._rsync = '/usr/local/bin/rsync';
        this._ssh = '/usr/bin/ssh';
        if (config.rsync) {
            this._rsync = config.rsync;
        }
        if (config.ssh) {
            this._ssh = config.ssh;
        }
    }
    get rsync() {
        return this._rsync;
    }
    get ssh() {
        return this._ssh;
    }
}
exports.default = BinariesConfiguration;
//# sourceMappingURL=BinariesConfiguration.js.map