import 'mocha';
import RetentionPolicyTaskBuilderTask from '../../src/task/retention/RetentionPolicyTaskBuilderTask';

import { expect, register, sinon } from '../expect';

import BackupState from '../../src/backup/BackupState';
import ClojureTask from '../../src/task/ClojureTask';
import SimpleTask from '../../src/task/SimpleTask';
import SshTask from '../../src/task/SshTask';
import TaskEngineState from '../../src/task/TaskEngineState';
import BackupStateBuilder from '../../src/backup/BackupStateBuilder';
import TrackerConfiguration from '../../src/config/TrackerConfiguration';
import SyncTaskBuilder from '../../src/task/SyncTaskBuilder';
import RsyncTask from '../../src/task/RsyncTask';
import RetentionPolicyParserUtils from '../../src/utils/RetentionPolicyParserUtils';

describe('SyncTaskBuilder', () => {
  describe('build', () => {
    let backupStateBuilderStub: any;
    let now: Date;

    beforeEach(() => {
      backupStateBuilderStub = sinon.createStubInstance(BackupStateBuilder);

      backupStateBuilderStub.build.returns(new BackupState('name', 'next'));

      now = new Date();

      register('rsyncBin', '/bin/rsync');
      register('sshBin', '/bin/ssh');
      register('backupStateBuilder', backupStateBuilderStub);
      register('retentionPolicyParserUtils', new RetentionPolicyParserUtils());
      register('now', now);
    });

    it('should create simple rsync tasks', () => {
      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination'
          }
        )
      );

      expect(tasks).to.have.lengthOf(1);
      expect(tasks[0]).to.be.instanceof(RsyncTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination');
    });

    it('should create simple rsync tasks with dest folder creation', () => {
      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination',
            rsync: {
              createDest: true
            }
          }
        )
      );

      expect(tasks).to.have.lengthOf(2);
      expect(tasks[0]).to.be.instanceof(SimpleTask);
      expect(tasks[1]).to.be.instanceof(RsyncTask);

      const simpleTask = tasks[0] as SimpleTask;
      expect((simpleTask as any).command()).to.equal('mkdir -p destination');

      const rsyncTask = tasks[1] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination');
    });

    it('should create simple rsync tasks with dest folder creation over ssh', () => {
      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination',
            rsync: {
              createDest: true
            },
            ssh: {
              dest: 'remote',
              args: '-p 1234'
            }
          }
        )
      );

      expect(tasks).to.have.lengthOf(2);
      expect(tasks[0]).to.be.instanceof(SshTask);
      expect(tasks[1]).to.be.instanceof(RsyncTask);

      const sshTask = tasks[0] as SshTask;
      expect((sshTask as any).command()).to.equal('/bin/ssh -p 1234 mkdir -p remote');

      const rsyncTask = tasks[1] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination');
    });

    it('should create backup rsync tasks', () => {
      const backupState = new BackupState('name', '2018/11/25/02');

      backupStateBuilderStub.build.returns(backupState);

      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination/{dest}',
            rsync: {
              mode: 'backup'
            }
          }
        )
      );

      expect(tasks).to.have.lengthOf(2);
      expect(tasks[0]).to.be.instanceof(RsyncTask);
      expect(tasks[1]).to.be.instanceof(ClojureTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination/2018/11/25/02');

      const clojureTask = tasks[1] as ClojureTask;
      clojureTask.run(new TaskEngineState());
      expect(backupStateBuilderStub.update).to.have.been.calledWith(backupState);
    });

    it('should create backup rsync tasks and retention tasks', () => {
      const backupState = new BackupState('name', '2018/11/25/02');

      backupStateBuilderStub.build.returns(backupState);

      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination/{dest}',
            rsync: {
              mode: 'backup',
              policies: [{
                groupBy: 'day',
                older: '5 days'
              }]
            }
          }
        )
      );

      expect(tasks).to.have.lengthOf(4);
      expect(tasks[0]).to.be.instanceof(RsyncTask);
      expect(tasks[1]).to.be.instanceof(ClojureTask);
      expect(tasks[2]).to.be.instanceof(SimpleTask);
      expect(tasks[3]).to.be.instanceof(RetentionPolicyTaskBuilderTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination/2018/11/25/02');

      const clojureTask = tasks[1] as ClojureTask;
      clojureTask.run(new TaskEngineState());
      expect(backupStateBuilderStub.update).to.have.been.calledWith(backupState);

      const simpleTask = tasks[2] as SimpleTask;
      expect((simpleTask as any).command()).to.equal('find destination/ -mindepth 1 -maxdepth 4 -type d');

      const retentionPolicyTaskBuilderTask = tasks[3] as RetentionPolicyTaskBuilderTask;
      expect((retentionPolicyTaskBuilderTask as any).listDirTaskName).to.equal('localListDir');
      expect((retentionPolicyTaskBuilderTask as any).now).to.equal(now);
    });

    it('should create backup rsync tasks and retention tasks when ssh mode', () => {
      const backupState = new BackupState('name', '2018/11/25/02');

      backupStateBuilderStub.build.returns(backupState);

      const builder = new SyncTaskBuilder();
      const tasks = builder.build(
        new TrackerConfiguration(
          'configName',
          {
            name: 'configName',
            src: 'source',
            dest: 'destination/{dest}',
            rsync: {
              mode: 'backup',
              policies: [{
                groupBy: 'day',
                older: '5 days'
              }]
            },
            ssh: {
              dest: 'remote',
              args: '-p 1234'
            }
          }
        )
      );

      expect(tasks).to.have.lengthOf(4);
      expect(tasks[0]).to.be.instanceof(RsyncTask);
      expect(tasks[1]).to.be.instanceof(ClojureTask);
      expect(tasks[2]).to.be.instanceof(SshTask);
      expect(tasks[3]).to.be.instanceof(RetentionPolicyTaskBuilderTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination/2018/11/25/02');

      const clojureTask = tasks[1] as ClojureTask;
      clojureTask.run(new TaskEngineState());
      expect(backupStateBuilderStub.update).to.have.been.calledWith(backupState);

      const simpleTask = tasks[2] as SimpleTask;
      expect((simpleTask as any).command()).to.equal('/bin/ssh -p 1234 find remote -mindepth 1 -maxdepth 4 -type d');

      const retentionPolicyTaskBuilderTask = tasks[3] as RetentionPolicyTaskBuilderTask;
      expect((retentionPolicyTaskBuilderTask as any).listDirTaskName).to.equal('remoteListDir');
      expect((retentionPolicyTaskBuilderTask as any).now).to.equal(now);
    });
  });
});
