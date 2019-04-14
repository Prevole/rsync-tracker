import BackupState from '../backup/BackupState';
import BackupStateBuilder from '../backup/BackupStateBuilder';
import { RsyncMode } from '../config/RsyncConfiguration';
import TrackerConfiguration from '../config/TrackerConfiguration';
import Inject from '../ioc/Inject';
import ClojureTask from './ClojureTask';
import RetentionPolicyTaskBuilderTask from './retention/RetentionPolicyTaskBuilderTask';
import RsyncRetentionPolicyTaskBuilder from './retention/RsyncRetentionPolicyTaskBuilder';
import SshRetentionPolicyTaskBuilder from './retention/SshRetentionPolicyTaskBuilder';
import RsyncTask from './RsyncTask';
import SimpleTask from './SimpleTask';
import SshTask from './SshTask';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';

export default class SyncTaskBuilder implements TaskBuilder {
  @Inject()
  private now!: Date;

  @Inject()
  private backupStateBuilder!: BackupStateBuilder;

  build(config: TrackerConfiguration): Taskable[] {
    const backupState = this.backupStateBuilder.build(config);

    const tasks: Taskable[] = [];

    if (config.shouldCreateDest()) {
      tasks.push(this.tasksForDestinationDirector(config, backupState));
    }

    tasks.push(...this.tasksForBackup(config, backupState));

    if (config.rsyncConfig.hasPolicies()) {
      tasks.push(...this.tasksForRetention(config));
    }

    return tasks;
  }

  private tasksForDestinationDirector(config: TrackerConfiguration, backupState: BackupState): Taskable {
    if (config.isSsh()) {
      const dest = config.sshConfig.dest.replace('{dest}', backupState.next);
      return new SshTask('createRemoteDir', config.sshConfig, `mkdir -p ${dest}`);
    } else {
      const dest = config.rsyncConfig.dest.replace('{dest}', backupState.next);
      return new SimpleTask('createLocalDir', `mkdir -p ${dest}`);
    }
  }

  private tasksForBackup(config: TrackerConfiguration, backupState: BackupState): Taskable[] {
    const tasks: Taskable[] = [];

    if (config.rsyncConfig.mode === RsyncMode.BACKUP) {
      tasks.push(new RsyncTask('rsyncBackup', config.rsyncConfig, backupState));

      tasks.push(new ClojureTask('updateBackupState', () => {
        this.backupStateBuilder.update(backupState);
        return true;
      }).runIfPreviousTaskFail(true));
    } else {
      tasks.push(new RsyncTask('rsync', config.rsyncConfig));
    }

    return tasks;
  }

  private tasksForRetention(config: TrackerConfiguration): Taskable[] {
    const tasks: Taskable[] = [];

    let taskName: string;

    if (config.isSsh()) {
      taskName = 'remoteListDir';
      tasks.push(new SshTask(
        taskName,
        config.sshConfig,
        `find ${config.sshConfig.dest.replace('{dest}', '')} -mindepth 1 -maxdepth 4 -type d`
      ));
    } else {
      taskName = 'localListDir';
      tasks.push(new SimpleTask(
        taskName,
        `find ${config.rsyncConfig.dest.replace('{dest}', '')} -mindepth 1 -maxdepth 4 -type d`
      ));
    }

    if (config.isSsh()) {
      tasks.push(new RetentionPolicyTaskBuilderTask(
        'remoteRetentionBuilderTask',
        config,
        taskName,
        this.now,
        new SshRetentionPolicyTaskBuilder(config)
      ));
    } else {
      tasks.push(new RetentionPolicyTaskBuilderTask(
        'localRetentionBuilderTask',
        config,
        taskName,
        this.now,
        new RsyncRetentionPolicyTaskBuilder(config)
      ));
    }

    return tasks;
  }
}
