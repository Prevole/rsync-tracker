"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Inject_1 = require("../ioc/Inject");
const Configuration_1 = require("./Configuration");
const ConfigurationError_1 = require("./ConfigurationError");
const TrackerConfiguration_1 = require("./TrackerConfiguration");
class ConfigurationLoader {
    load() {
        this.logger.info('start loading configuration');
        const config = new Configuration_1.default();
        this.fs.readdirSync(this.baseDir)
            .filter((file) => file.endsWith('.yml'))
            .forEach((file) => {
            const configFilePath = this.path.join(this.baseDir, file);
            this.logger.info(`Load configuration file: ${configFilePath}`);
            const rawDefinitions = this.yaml.safeLoad(this.fs.readFileSync(configFilePath, 'utf8'));
            rawDefinitions.definitions.forEach((rawConfiguration) => {
                const name = this.nameUtils.name(configFilePath, rawConfiguration.name);
                if (!config.hasTracker(name)) {
                    config.addTracker(new TrackerConfiguration_1.default(name, rawConfiguration).resolve());
                }
                else {
                    throw new ConfigurationError_1.default(`${name} tracker configuration already defined`);
                }
            });
        });
        return config;
    }
}
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "baseDir", void 0);
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "fs", void 0);
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "path", void 0);
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "yaml", void 0);
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "logger", void 0);
__decorate([
    Inject_1.default()
], ConfigurationLoader.prototype, "nameUtils", void 0);
exports.default = ConfigurationLoader;
//# sourceMappingURL=ConfigurationLoader.js.map