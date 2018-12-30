"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Configuration {
    constructor() {
        this._trackers = [];
    }
    get trackers() {
        return this._trackers;
    }
    hasTracker(name) {
        return this._trackers
            .find((tracker) => tracker.name === name) !== undefined;
    }
    addTracker(tracker) {
        this._trackers.push(tracker);
    }
    toJson() {
        return this._trackers.map((current) => current.toJson());
    }
}
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map