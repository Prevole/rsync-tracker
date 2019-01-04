"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inject_1 = __importDefault(require("../ioc/Inject"));
const Queue_1 = __importDefault(require("../queue/Queue"));
class TaskEngine {
    constructor(config, builder) {
        this.config = config;
        this.builder = builder;
    }
    process() {
        const queues = this.config.trackers.reduce((queues, tracker) => {
            return queues.concat(new Queue_1.default().queueAll(this.builder.build(tracker)));
        }, []);
        queues.forEach((queue) => {
            let previousResult = true;
            while (!queue.isEmpty()) {
                const task = queue.dequeue();
                if (previousResult || (!previousResult && task.canRunIfPreviousTaskFailed())) {
                    this.logger.info('Task will be run');
                    previousResult = task.run();
                    this.logger.info(`Task ran and was ${previousResult ? 'successful' : 'failure'}`);
                }
                else {
                    this.logger.info('Task is skipped (previous task failed)');
                }
            }
        });
    }
}
__decorate([
    Inject_1.default()
], TaskEngine.prototype, "logger", void 0);
exports.default = TaskEngine;
//# sourceMappingURL=TaskEngine.js.map