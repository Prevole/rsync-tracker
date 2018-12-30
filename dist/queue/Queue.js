"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Queue {
    constructor() {
        this.items = [];
    }
    queue(task) {
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.taskIsBefore(task, i)) {
                this.items.splice(i - 1, 0, task);
                return this;
            }
        }
        this.items.push(task);
        return this;
    }
    queueAll(tasks) {
        tasks.forEach((task) => this.queue(task));
        return this;
    }
    dequeue() {
        return this.items.shift();
    }
    isEmpty() {
        return this.items.length === 0;
    }
    taskIsBefore(task, against) {
        return task.priority() < this.items[against].priority();
    }
}
exports.default = Queue;
//# sourceMappingURL=Queue.js.map