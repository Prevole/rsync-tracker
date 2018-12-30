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
class BackupPathBuilder {
    nextBackupPath(config) {
        const nextPath = this.pathUtils.pathFromDate(this.dateUtils.now());
        const previousPath = this.previousBackupPath(config.name);
        return this.pathUtils.avoidConflict(previousPath, nextPath);
    }
    updateLatestBackupPath(config, usedPath) {
        const lastFile = this.pathToLastFile(this.digestDir(config.name));
        this.fs.writeFileSync(lastFile, usedPath);
    }
    previousBackupPath(name) {
        const digestDir = this.digestDir(name);
        if (!this.fs.existsSync(digestDir)) {
            this.fs.mkdirSync(digestDir);
            this.fs.writeFileSync(`${digestDir}/name`, name);
        }
        else {
            const previous = this.pathToLastFile(digestDir);
            if (this.fs.existsSync(previous)) {
                return this.fs.readFileSync(previous).replace(/^\s+|\s+$/g, '');
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
], BackupPathBuilder.prototype, "backupDir", void 0);
__decorate([
    Inject_1.default()
], BackupPathBuilder.prototype, "dateUtils", void 0);
__decorate([
    Inject_1.default()
], BackupPathBuilder.prototype, "pathUtils", void 0);
__decorate([
    Inject_1.default()
], BackupPathBuilder.prototype, "digestUtils", void 0);
__decorate([
    Inject_1.default()
], BackupPathBuilder.prototype, "fs", void 0);
exports.default = BackupPathBuilder;
//# sourceMappingURL=BackupPathBuilder.js.map