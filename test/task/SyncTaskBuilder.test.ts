import 'mocha';
import ClojureTask from '../../src/task/ClojureTask';
import SimpleTask from '../../src/task/SimpleTask';
import SshTask from '../../src/task/SshTask';

import { expect, register, sinon } from '../expect';

import BackupPathBuilder from '../../src/backup/BackupPathBuilder';
import TrackerConfiguration from '../../src/config/TrackerConfiguration';
import SyncTaskBuilder from '../../src/task/SyncTaskBuilder';
import RsyncTask from '../../src/task/RsyncTask';

describe('BackupTaskBuilder', () => {
  const rsyncTrackerConfig = new TrackerConfiguration(
    'configName',
    {
      name: 'configName',
      src: 'source',
      dest: 'destination'
    }
  );

  const rsyncTrackerConfigWithDestCreate = new TrackerConfiguration(
    'configName',
    {
      name: 'configName',
      src: 'source',
      dest: 'destination',
      rsync: {
        createDest: true
      }
    }
  );

  const rsyncTrackerConfigWithDestCreateAndSsh = new TrackerConfiguration(
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
  );

  const rsyncTrackerConfigInBackupMode = new TrackerConfiguration(
    'configName',
    {
      name: 'configName',
      src: 'source',
      dest: 'destination/{dest}',
      rsync: {
        mode: 'backup'
      }
    }
  );

  describe('build', () => {
    let backupPathBuilderStub: any;

    beforeEach(() => {
      backupPathBuilderStub = sinon.createStubInstance(BackupPathBuilder);

      register('rsyncBin', '/bin/rsync');
      register('sshBin', '/bin/ssh');
      register('backupPathBuilder', backupPathBuilderStub);
    });

    it('should create simple rsync tasks', () => {
      const builder = new SyncTaskBuilder();
      const tasks = builder.build(rsyncTrackerConfig);

      expect(tasks).to.have.lengthOf(1);
      expect(tasks[0]).to.be.instanceof(RsyncTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination');
    });

    it('should create simple rsync tasks with dest folder creation', () => {
      const builder = new SyncTaskBuilder();
      const tasks = builder.build(rsyncTrackerConfigWithDestCreate);

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
      const tasks = builder.build(rsyncTrackerConfigWithDestCreateAndSsh);

      expect(tasks).to.have.lengthOf(2);
      expect(tasks[0]).to.be.instanceof(SshTask);
      expect(tasks[1]).to.be.instanceof(RsyncTask);

      const sshTask = tasks[0] as SshTask;
      expect((sshTask as any).command()).to.equal('/bin/ssh -p 1234 mkdir -p remote');

      const rsyncTask = tasks[1] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination');
    });

    it('should create backup rsync tasks', () => {
      backupPathBuilderStub.nextBackupPath.returns('2018/11/25/02');

      const builder = new SyncTaskBuilder();
      const tasks = builder.build(rsyncTrackerConfigInBackupMode);

      expect(tasks).to.have.lengthOf(2);
      expect(tasks[0]).to.be.instanceof(RsyncTask);
      expect(tasks[1]).to.be.instanceof(ClojureTask);

      const rsyncTask = tasks[0] as RsyncTask;
      expect((rsyncTask as any).command()).to.equal('/bin/rsync source destination/2018/11/25/02');

      const clojureTask = tasks[1] as ClojureTask;
      clojureTask.run();
      expect(backupPathBuilderStub.updateLatestBackupPath)
        .to.have.been.calledWith(rsyncTrackerConfigInBackupMode, '2018/11/25/02');
    });
  });
});
