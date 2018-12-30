"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Task {
    constructor(priority) {
        this._runIfPreviousTaskFail = false;
        this._priority = priority;
    }
    runIfPreviousTaskFail(canRun) {
        this._runIfPreviousTaskFail = canRun;
        return this;
    }
    canRunIfPreviousTaskFailed() {
        return this._runIfPreviousTaskFail;
    }
    priority() {
        return this._priority;
    }
}
exports.default = Task;
//# sourceMappingURL=Task.js.map