"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueueTask_1 = require("../queue/QueueTask");
const CommandTask_1 = __importDefault(require("./CommandTask"));
class SimpleTask extends CommandTask_1.default {
    constructor(command) {
        super(QueueTask_1.TaskPriority.NORMAL);
        this._command = command;
    }
    command() {
        return this._command;
    }
}
exports.default = SimpleTask;
//# sourceMappingURL=SimpleTask.js.map