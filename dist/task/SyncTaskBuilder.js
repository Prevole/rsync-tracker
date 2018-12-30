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
class SyncTaskBuilder {
    build(config) {
        const backupPath = this.backupPathBuilder.nextBackupPath(config);
        const tasks = [];
        if (config.shouldCreateDest()) {
            if (config.isSsh()) {
                const dest = config.sshConfig.dest.replace('{dest}', backupPath);
                tasks.push(new SshTask_1.default(config.sshConfig, `mkdir -p ${dest}`));
            }
            else {
                const dest = config.rsyncConfig.dest.replace('{dest}', backupPath);
                tasks.push(new SimpleTask_1.default(`mkdir -p ${dest}`));
            }
        }
        if (config.rsyncConfig.mode === RsyncConfiguration_1.RsyncMode.BACKUP) {
            tasks.push(new RsyncTask_1.default(config.rsyncConfig, backupPath));
            tasks.push(new ClojureTask_1.default(() => {
                this.backupPathBuilder.updateLatestBackupPath(config, backupPath);
                return true;
            }).runIfPreviousTaskFail(true));
        }
        else {
            tasks.push(new RsyncTask_1.default(config.rsyncConfig));
        }
        return tasks;
    }
}
__decorate([
    Inject_1.default()
], SyncTaskBuilder.prototype, "backupPathBuilder", void 0);
exports.default = SyncTaskBuilder;
//# sourceMappingURL=SyncTaskBuilder.js.map