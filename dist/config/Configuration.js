"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inject_1 = require("../ioc/Inject");
const BinariesConfiguration_1 = require("./BinariesConfiguration");
const TrackerConfiguration_1 = require("./TrackerConfiguration");
class Configuration {
    constructor() {
        this._configurations = [];
    }
    load(configFile) {
        const configFilePath = this.path.resolve(configFile);
        this.logger.info(`Load configuration file: ${configFilePath}`);
        const rawConfigurations = this.yaml.safeLoad(this.fs.readFileSync(configFilePath, 'utf8'));
        const binariesConfiguration = new BinariesConfiguration_1.default(rawConfigurations.binaries);
        rawConfigurations.definitions.forEach((rawConfiguration) => {
            this._configurations.push(new TrackerConfiguration_1.default(binariesConfiguration, rawConfiguration).init());
        });
    }
    get configurations() {
        return this._configurations;
    }
    toJson() {
        return this._configurations.reduce((memo, current) => memo.concat(current.toJson()), []);
    }
}
__decorate([
    Inject_1.default()
], Configuration.prototype, "fs", void 0);
__decorate([
    Inject_1.default()
], Configuration.prototype, "path", void 0);
__decorate([
    Inject_1.default()
], Configuration.prototype, "yaml", void 0);
__decorate([
    Inject_1.default()
], Configuration.prototype, "logger", void 0);
exports.default = Configuration;
//# sourceMappingURL=Configuration.js.map