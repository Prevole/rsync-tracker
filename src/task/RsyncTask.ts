import BackupState from '../backup/BackupState';
import RsyncConfiguration from '../config/RsyncConfiguration';
import { TaskPriority } from '../queue/QueueTask';
import CommandBuilder from '../utils/CommandBuilder';
import CommandTask from './CommandTask';

export default class RsyncTask extends CommandTask {
  private readonly _rsyncConfig: RsyncConfiguration;
  private readonly _backupState?: BackupState;

  constructor(name: string, rsyncConfig: RsyncConfiguration, backupState?: BackupState) {
    super(name, TaskPriority.NORMAL);
    this._rsyncConfig = rsyncConfig;
    this._backupState = backupState;
  }

  protected command(): string {
    const builder = new CommandBuilder()
      .push(this._rsyncConfig.bin);

    if (this._backupState !== undefined && this._backupState.hasPrevious()) {
      builder.pushPattern('--link-dest=%s', `${this._rsyncConfig.hardLinks}${this._backupState.previous}`);
    }

    builder
      .push(this._rsyncConfig.args)
      .pushCollectionPattern('--exclude=%s', this._rsyncConfig.excludes)
      .push(this._rsyncConfig.src);

    if (this._backupState !== undefined) {
      builder.push(this._rsyncConfig.dest.replace('{dest}', this._backupState.next));
    } else {
      builder.push(this._rsyncConfig.dest);
    }

    return builder.build();
  }
}
