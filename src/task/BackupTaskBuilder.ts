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

export default class BackupTaskBuilder implements TaskBuilder {
  private readonly config: TrackerConfiguration;

  @Inject()
  private backupPathBuilder!: BackupPathBuilder;

  constructor(config: TrackerConfiguration) {
    this.config = config;
  }

  build(): Taskable[] {
    const backupPath = this.backupPathBuilder.nextBackupPath(this.config);

    const tasks: Taskable[] = [];

    if (this.config.shouldCreateDest()) {
      if (this.config.isSsh()) {
        const dest = this.config.sshConfig.dest.replace('{dest}', backupPath);
        tasks.push(new SshTask(this.config.sshConfig, `mkdir -p ${dest}`));
      } else {
        const dest = this.config.rsyncConfig.dest.replace('{dest}', backupPath);
        tasks.push(new SimpleTask(`mkdir -p ${dest}`));
      }
    }

    if (this.config.rsyncConfig.mode === RsyncMode.BACKUP) {
      tasks.push(new RsyncTask(this.config.rsyncConfig, backupPath));

      tasks.push(new ClojureTask(() => {
        this.backupPathBuilder.updateLatestBackupPath(this.config, backupPath);
      }).runIfPreviousTaskFail(true));
    } else {
      tasks.push(new RsyncTask(this.config.rsyncConfig));
    }

    return tasks;
  }
}
