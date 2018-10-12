"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RsyncConfiguration_1 = require("./RsyncConfiguration");
const SshConfiguration_1 = require("./SshConfiguration");
class TrackerConfiguration {
    constructor(binaries, config) {
        this._name = config.name;
        this._rsync = new RsyncConfiguration_1.default(binaries, config.src, config.dest, config.rsync);
        if (config.ssh) {
            this._ssh = new SshConfiguration_1.default(config.ssh);
        }
        else {
            this._ssh = null;
        }
    }
    init() {
        this._rsync.init();
        if (this._ssh) {
            this._ssh.init();
        }
        return this;
    }
    toJson() {
        return {
            name: this._name,
            rsync: this._rsync.toJson(),
            ssh: this._ssh ? this._ssh.toJson() : undefined
        };
    }
}
exports.default = TrackerConfiguration;
//# sourceMappingURL=TrackerConfiguration.js.map