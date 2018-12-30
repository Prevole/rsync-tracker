import pkg from '../package.json';

import * as childProcess from 'child_process';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { format } from 'logform';
import * as yaml from 'js-yaml';

import Registry from './ioc/Registry';

import BackupPathBuilder from './backup/BackupPathBuilder';
import ConfigurationLoader from './config/ConfigurationLoader';
import Logger from './logging/Logger';
import TaskEngine from './task/TaskEngine';

import DateUtils from './utils/DateUtils';
import DigestUtils from './utils/DigestUtils';
import EnvUtils from './utils/EnvUtils';
import FileUtils from './utils/FileUtils';
import NameUtils from './utils/NameUtils';
import PathUtils from './utils/PathUtils';

function prepareLoggers(): winston.Logger[] {
  const dailyTransport = new DailyRotateFile({
    dirname: Registry.get('logDir'),
    filename: 'rsync-tracker-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  const loggers: winston.Logger[] = [];

  const simpleFormat =
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

  loggers.push(winston.createLogger({
    format: format.combine(format.timestamp(), simpleFormat),
    transports: [ dailyTransport ]
  }));

  if (Registry.get('consoleLogs')) {
    loggers.push(winston.createLogger({
      format: format.combine(format.colorize(), format.timestamp(), simpleFormat),
      transports: [ new winston.transports.Console() ]
    }));
  }

  return loggers;
}

export default class RsyncTracker {
  static version: string = (pkg as any).version;

  static main() {
    const envUtils = new EnvUtils();

    Registry.registerIfNotExist('childProcess', childProcess);
    Registry.registerIfNotExist('crypto', crypto);
    Registry.registerIfNotExist('fs', fs);
    Registry.registerIfNotExist('path', path);
    Registry.registerIfNotExist('os', os);

    Registry.registerIfNotExist('yaml', yaml);

    const fileUtils = new FileUtils();

    Registry.register('baseDir', envUtils.val('RT_BASE_DIR', fileUtils.resolve('~/.rsync-tracker')));
    Registry.register('backupDir', envUtils.val('RT_BCK_DIR', `${Registry.get('baseDir')}/bck`.replace('//', '/')));
    Registry.register('logDir', envUtils.val('RT_LOGS_DIR', fileUtils.resolve('~/Library/Logs/rsync-tracker')));
    Registry.register('consoleLogs', envUtils.val('RT_LOGS_TO_CONSOLE', false));

    Registry.register('rsyncBin', envUtils.val('RT_BIN_RSYNC', '/usr/bin/rsync'));
    Registry.register('sshBin', envUtils.val('RT_BIN_SSH', '/usr/bin/ssh'));

    Registry.registerIfNotExist('loggers', prepareLoggers());
    Registry.registerIfNotExist('logger', new Logger());

    Registry.registerIfNotExist('dateUtils', new DateUtils());
    Registry.registerIfNotExist('digestUtils', new DigestUtils('sha1', 'hex'));
    Registry.registerIfNotExist('fileUtils', fileUtils);
    Registry.registerIfNotExist('nameUtils', new NameUtils());
    Registry.registerIfNotExist('pathUtils', new PathUtils());

    Registry.registerIfNotExist('backupPathBuilder', new BackupPathBuilder());

    const loader = new ConfigurationLoader();
    const taskEngine = new TaskEngine(loader.load());

    taskEngine.process();
  }
}
