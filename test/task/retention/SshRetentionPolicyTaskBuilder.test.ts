import dayjs from 'dayjs';

import 'mocha';

import { expect } from '../../expect';

import Registry from '../../../src/ioc/Registry';
import TrackerConfiguration from '../../../src/config/TrackerConfiguration';
import SshRetentionPolicyTaskBuilder from '../../../src/task/retention/SshRetentionPolicyTaskBuilder';
import { TaskPriority } from '../../../src/queue/QueueTask';
import ArchiveFolder from '../../../src/task/retention/ArchiveFolder';
import BackupFolder from '../../../src/task/retention/BackupFolder';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';

describe('SshRetentionPolicyTaskBuilder', () => {
  let trackerConfig: TrackerConfiguration;
  let now: Date;

  beforeEach(() => {
    Registry.clear();
    Registry.register('sshBin', '/path/to/ssh');
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
      },
      ssh: {
        dest: '/U/V/W',
        args: 'remotehost -p1234'
      }
    });

    now = new Date(2018, 10, 25);
  });

  describe('constructor', () => {
    it('should create a valid builder', () => {
      const calculator: any = new SshRetentionPolicyTaskBuilder(trackerConfig);
      expect(calculator.config).to.equal(trackerConfig);
    });
  });

  describe('createArchivesDirectory', () => {
    it('should create the task to create the archives folder', () => {
      const builder = new SshRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createArchivesDirectory('archives');
      expect(task.command())
        .to.equal('/path/to/ssh remotehost -p1234 mkdir -p /U/V/W/archives');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createMoveBackupFolderToArchive', () => {
    it('should create the task to move backup folder to archive folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const archiveFolder = '2018/11/01';
      const builder = new SshRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createMoveBackupFolderToArchive(backupFolder, archiveFolder);
      expect(task.command())
        .to.equal('/path/to/ssh remotehost -p1234 mv /A/B/C/D/2018/11/01/01 /U/V/W/archives/2018/11/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createDeleteBackupFolder', () => {
    it('should create the task to delete the backup folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const builder = new SshRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createDeleteBackupFolder(backupFolder);
      expect(task.command())
        .to.equal('/path/to/ssh remotehost -p1234 rm -rf /A/B/C/D/2018/11/01/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });

  describe('createSyncBackupToArchiveFolder', () => {
    it('should create the task to sync backup folder with archive folder', () => {
      const backupFolder = new BackupFolder('/A/B/C/D/2018/11/01/01');
      const archiveFolder = new ArchiveFolder('/U/V/W/archives/2018/11/01');
      const builder = new SshRetentionPolicyTaskBuilder(trackerConfig);

      const task: any = builder.createSyncBackupToArchiveFolder(backupFolder, archiveFolder);
      expect(task.command())
        .to.equal('/path/to/ssh remotehost -p1234 rsync /A/B/C/D/2018/11/01/01 /U/V/W/archives/2018/11/01');
      expect(task.priority).to.equal(TaskPriority.NORMAL);
    });
  });
});
