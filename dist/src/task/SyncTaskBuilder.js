"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RsyncConfiguration_1 = require("../config/RsyncConfiguration");
const Inject_1 = __importDefault(require("../ioc/Inject"));
const ClojureTask_1 = __importDefault(require("./ClojureTask"));
const RsyncTask_1 = __importDefault(require("./RsyncTask"));
const SimpleTask_1 = __importDefault(require("./SimpleTask"));
const SshTask_1 = __importDefault(require("./SshTask"));
class SyncTaskBuilder {
    build(config) {
        const backupState = this.backupStateBuilder.build(config);
        const tasks = [];
        if (config.shouldCreateDest()) {
            if (config.isSsh()) {
                const dest = config.sshConfig.dest.replace('{dest}', backupState.next);
                tasks.push(new SshTask_1.default(config.sshConfig, `mkdir -p ${dest}`));
            }
            else {
                const dest = config.rsyncConfig.dest.replace('{dest}', backupState.next);
                tasks.push(new SimpleTask_1.default(`mkdir -p ${dest}`));
            }
        }
        if (config.rsyncConfig.mode === RsyncConfiguration_1.RsyncMode.BACKUP) {
            tasks.push(new RsyncTask_1.default(config.rsyncConfig, backupState));
            tasks.push(new ClojureTask_1.default(() => {
                this.backupStateBuilder.update(backupState);
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
], SyncTaskBuilder.prototype, "backupStateBuilder", void 0);
exports.default = SyncTaskBuilder;
//# sourceMappingURL=SyncTaskBuilder.js.map