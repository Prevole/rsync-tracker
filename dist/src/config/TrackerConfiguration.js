"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RsyncConfiguration_1 = __importDefault(require("./RsyncConfiguration"));
const SshConfiguration_1 = __importDefault(require("./SshConfiguration"));
class TrackerConfiguration {
    constructor(name, config) {
        this._name = name;
        this._rsyncConfig = new RsyncConfiguration_1.default(config.src, config.dest, config.rsync);
        if (config.ssh) {
            this._sshConfig = new SshConfiguration_1.default(config.ssh);
        }
        else {
            this._sshConfig = null;
        }
    }
    get name() {
        return this._name;
    }
    get sshConfig() {
        return this._sshConfig;
    }
    get rsyncConfig() {
        return this._rsyncConfig;
    }
    resolve() {
        this._rsyncConfig.resolve();
        return this;
    }
    shouldCreateDest() {
        return this._rsyncConfig.isCreateDest;
    }
    isSsh() {
        return this._sshConfig !== null;
    }
    toJson() {
        return {
            name: this._name,
            rsync: this._rsyncConfig.toJson(),
            ssh: this._sshConfig ? this._sshConfig.toJson() : undefined
        };
    }
}
exports.default = TrackerConfiguration;
//# sourceMappingURL=TrackerConfiguration.js.map