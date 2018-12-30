"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pad(value) {
    let pathElement = `${value}`;
    return pathElement.length === 1 ? `0${pathElement}` : pathElement;
}
class PathUtils {
    pathFromDate(date) {
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hour = pad(date.getHours());
        return `${date.getFullYear()}/${month}/${day}/${hour}`;
    }
    avoidConflict(previous, next) {
        if (previous === undefined) {
            return next;
        }
        const previousWithoutSuffix = previous.replace(/-.*/, '');
        const nextWithoutSuffix = next.replace(/-.*/, '');
        if (nextWithoutSuffix === previousWithoutSuffix) {
            const previousSuffix = previous.replace(/(?:\d+\/?)+(?:-(\d+))?/g, '$1');
            let nextSuffix = 1;
            if (previousSuffix.match(/\d+/)) {
                nextSuffix = parseInt(previousSuffix, 10) + 1;
            }
            return `${next}-${nextSuffix}`;
        }
        else {
            return next;
        }
    }
}
exports.default = PathUtils;
//# sourceMappingURL=PathUtils.js.map