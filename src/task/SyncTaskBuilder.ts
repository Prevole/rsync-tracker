import BackupStateBuilder from '../backup/BackupStateBuilder';
import { RsyncMode } from '../config/RsyncConfiguration';
import TrackerConfiguration from '../config/TrackerConfiguration';
import Inject from '../ioc/Inject';
import ClojureTask from './ClojureTask';
import RsyncTask from './RsyncTask';
import SimpleTask from './SimpleTask';
import SshTask from './SshTask';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';

export default class SyncTaskBuilder implements TaskBuilder {
  @Inject()
  private backupStateBuilder!: BackupStateBuilder;

  build(config: TrackerConfiguration): Taskable[] {
    const backupState = this.backupStateBuilder.build(config);

    const tasks: Taskable[] = [];

    if (config.shouldCreateDest()) {
      if (config.isSsh()) {
        const dest = config.sshConfig.dest.replace('{dest}', backupState.next);
        tasks.push(new SshTask(config.sshConfig, `mkdir -p ${dest}`));
      } else {
        const dest = config.rsyncConfig.dest.replace('{dest}', backupState.next);
        tasks.push(new SimpleTask(`mkdir -p ${dest}`));
      }
    }

    if (config.rsyncConfig.mode === RsyncMode.BACKUP) {
      tasks.push(new RsyncTask(config.rsyncConfig, backupState));

      tasks.push(new ClojureTask(() => {
        this.backupStateBuilder.update(backupState);
        return true;
      }).runIfPreviousTaskFail(true));
    } else {
      tasks.push(new RsyncTask(config.rsyncConfig));
    }

    return tasks;
  }
}
