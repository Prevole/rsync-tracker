"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BackupState {
    constructor(name, next, previous) {
        this._name = name;
        this._next = next;
        this._previous = previous;
    }
    get name() {
        return this._name;
    }
    get next() {
        return this._next;
    }
    get previous() {
        return this._previous;
    }
    hasPrevious() {
        return this._previous !== undefined;
    }
}
exports.default = BackupState;
//# sourceMappingURL=BackupState.js.map