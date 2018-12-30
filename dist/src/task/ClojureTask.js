"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const QueueTask_1 = require("../queue/QueueTask");
const Task_1 = __importDefault(require("./Task"));
class ClojureTask extends Task_1.default {
    constructor(clojure) {
        super(QueueTask_1.TaskPriority.NORMAL);
        this._clojure = clojure;
    }
    run() {
        return this._clojure();
    }
}
exports.default = ClojureTask;
//# sourceMappingURL=ClojureTask.js.map