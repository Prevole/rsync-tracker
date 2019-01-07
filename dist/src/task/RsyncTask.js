"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueueTask_1 = require("../queue/QueueTask");
const CommandBuilder_1 = __importDefault(require("../utils/CommandBuilder"));
const CommandTask_1 = __importDefault(require("./CommandTask"));
class RsyncTask extends CommandTask_1.default {
    constructor(rsyncConfig, backupState) {
        super(QueueTask_1.TaskPriority.NORMAL);
        this._rsyncConfig = rsyncConfig;
        this._backupState = backupState;
    }
    command() {
        const builder = new CommandBuilder_1.default()
            .push(this._rsyncConfig.bin);
        if (this._backupState !== undefined && this._backupState.hasPrevious()) {
            builder.pushPattern('--link-dest=%s', `${this._rsyncConfig.hardLinks}${this._backupState.previous}`);
        }
        builder
            .push(this._rsyncConfig.args)
            .pushCollectionPattern('--exclude=%s', this._rsyncConfig.excludes)
            .push(this._rsyncConfig.src);
        if (this._backupState !== undefined) {
            builder.push(this._rsyncConfig.dest.replace('{dest}', this._backupState.next));
        }
        else {
            builder.push(this._rsyncConfig.dest);
        }
        return builder.build();
    }
}
exports.default = RsyncTask;
//# sourceMappingURL=RsyncTask.js.map