import BackupPathBuilder from '../backup/BackupPathBuilder';
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
  private backupPathBuilder!: BackupPathBuilder;

  build(config: TrackerConfiguration): Taskable[] {
    const backupPath = this.backupPathBuilder.nextBackupPath(config);

    const tasks: Taskable[] = [];

    if (config.shouldCreateDest()) {
      if (config.isSsh()) {
        const dest = config.sshConfig.dest.replace('{dest}', backupPath);
        tasks.push(new SshTask(config.sshConfig, `mkdir -p ${dest}`));
      } else {
        const dest = config.rsyncConfig.dest.replace('{dest}', backupPath);
        tasks.push(new SimpleTask(`mkdir -p ${dest}`));
      }
    }

    if (config.rsyncConfig.mode === RsyncMode.BACKUP) {
      tasks.push(new RsyncTask(config.rsyncConfig, backupPath));

      tasks.push(new ClojureTask(() => {
        this.backupPathBuilder.updateLatestBackupPath(config, backupPath);
        return true;
      }).runIfPreviousTaskFail(true));
    } else {
      tasks.push(new RsyncTask(config.rsyncConfig));
    }

    return tasks;
  }
}
