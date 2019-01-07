"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const package_json_1 = __importDefault(require("../package.json"));
const childProcess = __importStar(require("child_process"));
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const winston = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const logform_1 = require("logform");
const yaml = __importStar(require("js-yaml"));
const Registry_1 = __importDefault(require("./ioc/Registry"));
const BackupStateBuilder_1 = __importDefault(require("./backup/BackupStateBuilder"));
const ConfigurationLoader_1 = __importDefault(require("./config/ConfigurationLoader"));
const Logger_1 = __importDefault(require("./logging/Logger"));
const SyncTaskBuilder_1 = __importDefault(require("./task/SyncTaskBuilder"));
const TaskEngine_1 = __importDefault(require("./task/TaskEngine"));
const DateUtils_1 = __importDefault(require("./utils/DateUtils"));
const DigestUtils_1 = __importDefault(require("./utils/DigestUtils"));
const EnvUtils_1 = __importDefault(require("./utils/EnvUtils"));
const FileUtils_1 = __importDefault(require("./utils/FileUtils"));
const NameUtils_1 = __importDefault(require("./utils/NameUtils"));
const PathUtils_1 = __importDefault(require("./utils/PathUtils"));
function prepareLoggers() {
    const dailyTransport = new winston_daily_rotate_file_1.default({
        dirname: Registry_1.default.get('logDir'),
        filename: 'rsync-tracker-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d'
    });
    const loggers = [];
    const simpleFormat = logform_1.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);
    loggers.push(winston.createLogger({
        format: logform_1.format.combine(logform_1.format.timestamp(), simpleFormat),
        transports: [dailyTransport]
    }));
    /* istanbul ignore next */
    if (Registry_1.default.get('consoleLogs')) {
        loggers.push(winston.createLogger({
            format: logform_1.format.combine(logform_1.format.colorize(), logform_1.format.timestamp(), simpleFormat),
            transports: [new winston.transports.Console()]
        }));
    }
    return loggers;
}
class RsyncTracker {
    static main() {
        const envUtils = new EnvUtils_1.default();
        Registry_1.default.registerIfNotExist('childProcess', childProcess);
        Registry_1.default.registerIfNotExist('crypto', crypto);
        Registry_1.default.registerIfNotExist('fs', fs);
        Registry_1.default.registerIfNotExist('path', path);
        Registry_1.default.registerIfNotExist('os', os);
        Registry_1.default.registerIfNotExist('yaml', yaml);
        const fileUtils = new FileUtils_1.default();
        Registry_1.default.register('baseDir', envUtils.val('RT_BASE_DIR', fileUtils.resolve('~/.rsync-tracker')));
        Registry_1.default.register('backupDir', envUtils.val('RT_BCK_DIR', `${Registry_1.default.get('baseDir')}/bck`.replace('//', '/')));
        Registry_1.default.register('logDir', envUtils.val('RT_LOGS_DIR', fileUtils.resolve('~/Library/Logs/rsync-tracker')));
        Registry_1.default.register('consoleLogs', envUtils.val('RT_LOGS_TO_CONSOLE', false));
        Registry_1.default.register('rsyncBin', envUtils.val('RT_BIN_RSYNC', '/usr/bin/rsync'));
        Registry_1.default.register('sshBin', envUtils.val('RT_BIN_SSH', '/usr/bin/ssh'));
        Registry_1.default.registerIfNotExist('loggers', prepareLoggers());
        Registry_1.default.registerIfNotExist('logger', new Logger_1.default());
        Registry_1.default.registerIfNotExist('dateUtils', new DateUtils_1.default());
        Registry_1.default.registerIfNotExist('digestUtils', new DigestUtils_1.default('sha1', 'hex'));
        Registry_1.default.registerIfNotExist('fileUtils', fileUtils);
        Registry_1.default.registerIfNotExist('nameUtils', new NameUtils_1.default());
        Registry_1.default.registerIfNotExist('pathUtils', new PathUtils_1.default());
        Registry_1.default.registerIfNotExist('backupStateBuilder', new BackupStateBuilder_1.default());
        const loader = new ConfigurationLoader_1.default();
        const config = loader.load();
        const taskEngine = new TaskEngine_1.default(config, new SyncTaskBuilder_1.default());
        taskEngine.process();
    }
}
RsyncTracker.version = package_json_1.default.version;
exports.default = RsyncTracker;
//# sourceMappingURL=RsyncTracker.js.map