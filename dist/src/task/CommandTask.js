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
const Task_1 = __importDefault(require("./Task"));
class CommandTask extends Task_1.default {
    run() {
        const command = this.command();
        this.logger.info(`Run command: ${command}`);
        try {
            const result = this.childProcess.execSync(command);
            this.logger.info(result);
            return true;
        }
        catch (err) {
            this.logger.error(err);
            return false;
        }
    }
}
__decorate([
    Inject_1.default()
], CommandTask.prototype, "childProcess", void 0);
__decorate([
    Inject_1.default()
], CommandTask.prototype, "logger", void 0);
exports.default = CommandTask;
//# sourceMappingURL=CommandTask.js.map