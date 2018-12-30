import RsyncConfiguration from '../config/RsyncConfiguration';
import { TaskPriority } from '../queue/QueueTask';
import CommandBuilder from '../utils/CommandBuilder';
import CommandTask from './CommandTask';

export default class RsyncTask extends CommandTask {
  private readonly _rsyncConfig: RsyncConfiguration;
  private readonly _backupPath: string;

  constructor(rsyncConfig: RsyncConfiguration, backupPath?: string) {
    super(TaskPriority.NORMAL);
    this._rsyncConfig = rsyncConfig;
    this._backupPath = backupPath ? backupPath : '';
  }

  protected command(): string {
    return new CommandBuilder()
      .push(this._rsyncConfig.bin)
      .pushPattern('--link-dest=%s', this._rsyncConfig.hardLinks)
      .push(this._rsyncConfig.args)
      .pushCollectionPattern('--exclude=%s', this._rsyncConfig.excludes)
      .push(this._rsyncConfig.src)
      .push(this._rsyncConfig.dest.replace('{dest}', this._backupPath))
      .build();
  }
}
