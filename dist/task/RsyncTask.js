"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueueTask_1 = require("../queue/QueueTask");
const CommandBuilder_1 = require("../utils/CommandBuilder");
const CommandTask_1 = require("./CommandTask");
class RsyncTask extends CommandTask_1.default {
    constructor(rsyncConfig, backupPath) {
        super(QueueTask_1.TaskPriority.NORMAL);
        this._rsyncConfig = rsyncConfig;
        this._backupPath = backupPath ? backupPath : '';
    }
    command() {
        return new CommandBuilder_1.default()
            .push(this._rsyncConfig.bin)
            .pushPattern('--link-dest=%s', this._rsyncConfig.hardLinks)
            .push(this._rsyncConfig.args)
            .pushCollectionPattern('--exclude=%s', this._rsyncConfig.excludes)
            .push(this._rsyncConfig.src)
            .push(this._rsyncConfig.dest.replace('{dest}', this._backupPath))
            .build();
    }
}
exports.default = RsyncTask;
//# sourceMappingURL=RsyncTask.js.map