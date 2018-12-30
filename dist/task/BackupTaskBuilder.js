"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const RsyncConfiguration_1 = require("../config/RsyncConfiguration");
const Inject_1 = require("../ioc/Inject");
const ClojureTask_1 = require("./ClojureTask");
const RsyncTask_1 = require("./RsyncTask");
const SimpleTask_1 = require("./SimpleTask");
const SshTask_1 = require("./SshTask");
class BackupTaskBuilder {
    constructor(config) {
        this.config = config;
    }
    build() {
        const backupPath = this.backupPathBuilder.nextBackupPath(this.config);
        const tasks = [];
        if (this.config.shouldCreateDest()) {
            if (this.config.isSsh()) {
                const dest = this.config.sshConfig.dest.replace('{dest}', backupPath);
                tasks.push(new SshTask_1.default(this.config.sshConfig, `mkdir -p ${dest}`));
            }
            else {
                const dest = this.config.rsyncConfig.dest.replace('{dest}', backupPath);
                tasks.push(new SimpleTask_1.default(`mkdir -p ${dest}`));
            }
        }
        if (this.config.rsyncConfig.mode === RsyncConfiguration_1.RsyncMode.BACKUP) {
            tasks.push(new RsyncTask_1.default(this.config.rsyncConfig, backupPath));
            tasks.push(new ClojureTask_1.default(() => {
                this.backupPathBuilder.updateLatestBackupPath(this.config, backupPath);
            }).runIfPreviousTaskFail(true));
        }
        else {
            tasks.push(new RsyncTask_1.default(this.config.rsyncConfig));
        }
        return tasks;
    }
}
__decorate([
    Inject_1.default()
], BackupTaskBuilder.prototype, "backupPathBuilder", void 0);
exports.default = BackupTaskBuilder;
//# sourceMappingURL=BackupTaskBuilder.js.map