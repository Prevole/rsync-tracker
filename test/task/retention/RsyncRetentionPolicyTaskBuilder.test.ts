import dayjs from 'dayjs';

import 'mocha';

import { expect, register } from '../../expect';

import Registry from '../../../src/ioc/Registry';
import TrackerConfiguration from '../../../src/config/TrackerConfiguration';
import RsyncRetentionPolicyTaskBuilder from '../../../src/task/retention/RsyncRetentionPolicyTaskBuilder';
import { TaskPriority } from '../../../src/queue/QueueTask';
import ArchiveFolder from '../../../src/task/retention/ArchiveFolder';
import BackupFolder from '../../../src/task/retention/BackupFolder';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';

describe('RsyncRetentionPolicyTaskBuilder', () => {
  let trackerConfig: TrackerConfiguration;
  let now: Date;

  beforeEach(() => {
    Registry.clear();
    Registry.register('defaultArchivesDirName', 'archives');
    Registry.register('dayjs', dayjs);
    Registry.register('retentionPolicyParserUtils', new RetentionPolicyParserUtils());
  });

  beforeEach(() => {
    trackerConfig = new TrackerConfiguration('test', {
      name: 'test',
      src: '/A/B/C/D',
      dest: '/X/Y/Z',
      rsync: {
        mode: 'backup',
        policies: [{
          groupBy: 'year',
          older: '1 year'
        }, {
          groupBy: 'month',
          older: '3 months'
        }, {
          groupBy: 'day',
          older: '10 days'
        }]
      }
    });

    now = new Date(2018, 10, 25);

    register('rsyncBin', '/usr/bin/rsync');
  });

  describe('constructor', () => {
    it('should create a valid builder', () => {
      const calculator: any = new RsyncRetentionPolicyTaskBuilder(trackerConfig);
      expect(calculator.config).to.equal(trackerConfig);
    });
  });

  describe('createArchivesDirectory', () => {
    it('should create the task to create the archives folder', () => {
      const builder = new RsyncRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createArchivesDirectory('archives');
      expect(task.command()).to.equal('mkdir -p /X/Y/Z/archives');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createMoveBackupFolderToArchive', () => {
    it('should create the task to move backup folder to archive folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const archiveFolder = '2018/11/01';
      const builder = new RsyncRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createMoveBackupFolderToArchive(backupFolder, archiveFolder);
      expect(task.command()).to.equal('mv /A/B/C/D/2018/11/01/01 /X/Y/Z/archives/2018/11/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createDeleteBackupFolder', () => {
    it('should create the task to delete the backup folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const builder = new RsyncRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createDeleteBackupFolder(backupFolder);
      expect(task.command()).to.equal('rm -rf /A/B/C/D/2018/11/01/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createSyncBackupToArchiveFolder', () => {
    it('should create the task to sync backup folder with archive folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const archiveFolder = new ArchiveFolder('/X/Y/Z/archives/2018/11/01');
      const builder = new RsyncRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createSyncBackupToArchiveFolder(backupFolder, archiveFolder);
      expect(task.command()).to.equal('/usr/bin/rsync /A/B/C/D/2018/11/01/01 /X/Y/Z/archives/2018/11/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });
});
