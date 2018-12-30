"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandBuilder {
    constructor() {
        this.parts = [];
    }
    push(value) {
        if (value !== undefined) {
            this.parts.push(value);
        }
        return this;
    }
    pushPattern(pattern, value) {
        if (value !== undefined) {
            this.push(pattern.replace(/%s/g, value));
        }
        return this;
    }
    pushCollection(values) {
        if (values !== undefined) {
            values.forEach((value) => this.parts.push(value));
        }
        return this;
    }
    pushCollectionPattern(pattern, values) {
        if (values !== undefined) {
            values.forEach((value) => this.pushPattern(pattern, value));
        }
        return this;
    }
    build() {
        return this.parts.join(' ');
    }
}
exports.default = CommandBuilder;
//# sourceMappingURL=CommandBuilder.js.map