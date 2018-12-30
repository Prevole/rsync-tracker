"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QueueTask_1 = require("../queue/QueueTask");
const CommandTask_1 = require("./CommandTask");
class SshTask extends CommandTask_1.default {
    constructor(sshConfig, command) {
        super(QueueTask_1.TaskPriority.NORMAL);
        this._sshConfig = sshConfig;
        this._command = command;
    }
    command() {
        return `${this._sshConfig.bin} ${this._sshConfig.args} ${this._command}`;
    }
}
exports.default = SshTask;
//# sourceMappingURL=SshTask.js.map