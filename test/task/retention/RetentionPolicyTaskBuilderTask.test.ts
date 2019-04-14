import dayjs from 'dayjs';

import 'mocha';
import { TaskPriority } from '../../../src/queue/QueueTask';
import ClojureTask from '../../../src/task/ClojureTask';
import ArchiveFolder from '../../../src/task/retention/ArchiveFolder';
import BackupFolder from '../../../src/task/retention/BackupFolder';
import RetentionPolicyTaskBuilder from '../../../src/task/retention/RetentionPolicyTaskBuilder';
import Taskable from '../../../src/task/Taskable';

import { expect } from '../../expect';

import Registry from '../../../src/ioc/Registry';
import RetentionPolicyTaskBuilderTask from '../../../src/task/retention/RetentionPolicyTaskBuilderTask';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';
import TrackerConfiguration from '../../../src/config/TrackerConfiguration';
import TaskEngineState from '../../../src/task/TaskEngineState';

describe('RetentionPolicyTaskBuilderTask', () => {
  class TestRetentionPolicyTaskBuilder implements RetentionPolicyTaskBuilder {
    createArchivesDirectory(archiveDirName: string): Taskable {
      return new ClojureTask('archiveDir', state => true);
    }

    createDeleteBackupFolder(backupFolder: BackupFolder): Taskable {
      return new ClojureTask('delete', state => true);
    }

    createMoveBackupFolderToArchive(backupFolder: BackupFolder, archiveFolderName: string): Taskable {
      return new ClojureTask('move', state => true);
    }

    createSyncBackupToArchiveFolder(backupFolder: BackupFolder, archiveFolder: ArchiveFolder): Taskable {
      return new ClojureTask('sync', state => true);
    }
  }

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
  });

  describe('constructor', () => {
    it('should create a valid calculator', () => {
      const task: any = new RetentionPolicyTaskBuilderTask(
        'task',
        trackerConfig,
        'list',
        now,
        new TestRetentionPolicyTaskBuilder()
      );

      expect(task.config).to.equal(trackerConfig);
      expect(task.now).to.equal(now);
      expect(task.listDirTaskName).to.equal('list');
      expect(task.builder).to.be.instanceOf(TestRetentionPolicyTaskBuilder);
    });
  });

  describe('run', () => {
    it('should create the task to create the archives folder', () => {
      const state = new TaskEngineState();
      state.store('list', '');

      const builderTask = new RetentionPolicyTaskBuilderTask(
        'task',
        trackerConfig,
        'list',
        now,
        new TestRetentionPolicyTaskBuilder()
      );

      builderTask.run(state);

      const tasks = state.flushTasks();
      expect(tasks).to.have.lengthOf(1);

      const createDirTask: any = tasks[0];
      expect(createDirTask.name()).to.equal('archiveDir');
      expect(createDirTask.priority).to.equal(TaskPriority.HIGH);
    });

    it('should not create the task to create the archives folder as it already exist', () => {
      const state = new TaskEngineState();
      state.store('list', '/X/Y/Z/archives/2018/11/01');

      const builderTask = new RetentionPolicyTaskBuilderTask(
        'task',
        trackerConfig,
        'list',
        now,
        new TestRetentionPolicyTaskBuilder()
      );

      builderTask.run(state);

      const tasks = state.flushTasks();
      expect(tasks).to.have.lengthOf(0);
    });

    it('should create the tasks to move backup folders to archive folder', () => {
      const state = new TaskEngineState();
      state.store('list', '/X/Y/Z/archives/2018/10/31\n' +
        '/A/B/C/D/2018/11/01/01\n' +
        '/A/B/C/D/2018/11/02/01');

      const builderTask = new RetentionPolicyTaskBuilderTask(
        'task',
        trackerConfig,
        'list',
        now,
        new TestRetentionPolicyTaskBuilder()
      );
      builderTask.run(state);

      const tasks = state.flushTasks();
      expect(tasks).to.have.lengthOf(2);

      const moveFirstFolderTask: any = tasks[0];
      expect(moveFirstFolderTask.name()).to.equal('move');
      expect(moveFirstFolderTask.priority).to.equal(TaskPriority.HIGH);

      const moveSecondFolderTask: any = tasks[1];
      expect(moveSecondFolderTask.name()).to.equal('move');
      expect(moveSecondFolderTask.priority).to.equal(TaskPriority.HIGH);

      expect(moveFirstFolderTask).not.to.equal(moveSecondFolderTask);
    });

    it('should create the tasks to sync backup folders with archive folder', () => {
      const state = new TaskEngineState();
      state.store('list', '/X/Y/Z/archives/2018/11/01\n' +
        '/X/Y/Z/archives/2018/11/02\n' +
        '/A/B/C/D/2018/11/01/02\n' +
        '/A/B/C/D/2018/11/02/02');

      const builderTask = new RetentionPolicyTaskBuilderTask(
        'task',
        trackerConfig,
        'list',
        now,
        new TestRetentionPolicyTaskBuilder()
      );
      builderTask.run(state);

      const tasks = state.flushTasks();
      expect(tasks).to.have.lengthOf(4);

      const syncFirstFolderTask: any = tasks[0];
      expect(syncFirstFolderTask.name()).to.equal('sync');
      expect(syncFirstFolderTask.priority).to.equal(TaskPriority.HIGH);

      const deleteFirstFolderTask: any = tasks[1];
      expect(deleteFirstFolderTask.name()).to.equal('delete');
      expect(deleteFirstFolderTask.priority).to.equal(TaskPriority.HIGH);

      const syncSecondFolderTask: any = tasks[2];
      expect(syncSecondFolderTask.name()).to.equal('sync');
      expect(syncSecondFolderTask.priority).to.equal(TaskPriority.HIGH);

      const deleteSecondFolderTask: any = tasks[3];
      expect(deleteSecondFolderTask.name()).to.equal('delete');
      expect(deleteSecondFolderTask.priority).to.equal(TaskPriority.HIGH);

      expect(syncFirstFolderTask).not.to.equal(syncSecondFolderTask);
      expect(deleteFirstFolderTask).not.to.equal(syncFirstFolderTask);
    });
  });
});
