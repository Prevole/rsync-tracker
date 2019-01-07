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
const BackupState_1 = __importDefault(require("./BackupState"));
class BackupStateBuilder {
    build(config) {
        const nextPath = this.pathUtils.pathFromDate(this.dateUtils.now());
        const previousPath = this.previousBackupPath(config.name);
        const unconflictedNextPath = this.pathUtils.avoidConflict(previousPath, nextPath);
        return new BackupState_1.default(config.name, unconflictedNextPath, previousPath);
    }
    update(state) {
        const lastFile = this.pathToLastFile(this.digestDir(state.name));
        this.fs.writeFileSync(lastFile, state.next, 'utf8');
    }
    previousBackupPath(name) {
        const digestDir = this.digestDir(name);
        if (!this.fs.existsSync(digestDir)) {
            this.fs.mkdirSync(digestDir);
            this.fs.writeFileSync(`${digestDir}/name`, name, 'utf8');
        }
        else {
            const previous = this.pathToLastFile(digestDir);
            if (this.fs.existsSync(previous)) {
                return this.fs.readFileSync(previous, 'utf8').replace(/^\s+|\s+$/g, '');
            }
        }
        return undefined;
    }
    digestDir(name) {
        return `${this.backupDir}/${this.digestUtils.digest(name)}`;
    }
    pathToLastFile(baseDir) {
        return `${baseDir}/last`;
    }
}
__decorate([
    Inject_1.default()
], BackupStateBuilder.prototype, "backupDir", void 0);
__decorate([
    Inject_1.default()
], BackupStateBuilder.prototype, "dateUtils", void 0);
__decorate([
    Inject_1.default()
], BackupStateBuilder.prototype, "pathUtils", void 0);
__decorate([
    Inject_1.default()
], BackupStateBuilder.prototype, "digestUtils", void 0);
__decorate([
    Inject_1.default()
], BackupStateBuilder.prototype, "fs", void 0);
exports.default = BackupStateBuilder;
//# sourceMappingURL=BackupStateBuilder.js.map