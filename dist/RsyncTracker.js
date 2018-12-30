"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pkg = require("./package.json");
const childProcess = require("child_process");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const winston = require("winston");
const yaml = require("js-yaml");
const Registry_1 = require("./ioc/Registry");
const BackupPathBuilder_1 = require("./backup/BackupPathBuilder");
const ConfigurationLoader_1 = require("./config/ConfigurationLoader");
const Logger_1 = require("./logging/Logger");
const DateUtils_1 = require("./utils/DateUtils");
const DigestUtils_1 = require("./utils/DigestUtils");
const EnvUtils_1 = require("./utils/EnvUtils");
const FileUtils_1 = require("./utils/FileUtils");
const NameUtils_1 = require("./utils/NameUtils");
const PathUtils_1 = require("./utils/PathUtils");
class RsyncTracker {
    static main() {
        const envUtils = new EnvUtils_1.default();
        Registry_1.default.registerIfNotExist('childProcess', childProcess);
        Registry_1.default.registerIfNotExist('crypto', crypto);
        Registry_1.default.registerIfNotExist('fs', fs);
        Registry_1.default.registerIfNotExist('path', path);
        Registry_1.default.registerIfNotExist('os', os);
        Registry_1.default.registerIfNotExist('winston', winston);
        Registry_1.default.registerIfNotExist('yaml', yaml);
        Registry_1.default.registerIfNotExist('logger', new Logger_1.default());
        const fileUtils = new FileUtils_1.default();
        Registry_1.default.register('backupDir', envUtils.val('RT_BCK_DIR', 'bck'));
        Registry_1.default.register('baseDir', envUtils.val('RT_BASE_DIR', fileUtils.resolve('~/.rsync-tracker')));
        Registry_1.default.register('rsyncBin', envUtils.val('RT_BIN_RSYNC', '/usr/bin/rsync'));
        Registry_1.default.register('sshBin', envUtils.val('RT_BIN_SSH', '/usr/bin/ssh'));
        Registry_1.default.registerIfNotExist('dateUtils', new DateUtils_1.default());
        Registry_1.default.registerIfNotExist('digestUtils', new DigestUtils_1.default('sha1', 'hex'));
        Registry_1.default.registerIfNotExist('fileUtils', fileUtils);
        Registry_1.default.registerIfNotExist('nameUtils', new NameUtils_1.default());
        Registry_1.default.registerIfNotExist('pathUtils', new PathUtils_1.default());
        Registry_1.default.registerIfNotExist('backupPathBuilder', new BackupPathBuilder_1.default());
        const loader = new ConfigurationLoader_1.default();
        const config = loader.load();
        console.log(config);
    }
}
RsyncTracker.version = pkg.version;
exports.default = RsyncTracker;
//# sourceMappingURL=RsyncTracker.js.map