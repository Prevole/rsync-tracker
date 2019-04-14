import RsyncConfiguration from '../config/RsyncConfiguration';
import { TaskPriority } from '../queue/QueueTask';
import CommandBuilder from '../utils/CommandBuilder';
import CommandTask from './CommandTask';

export default class RsyncTask extends CommandTask {
  private readonly _rsyncConfig: RsyncConfiguration;
  private readonly _src: string;
  private readonly _dest: string;

  constructor(name: string, rsyncConfig: RsyncConfiguration, src: string, dest: string) {
    super(name, TaskPriority.NORMAL);
    this._rsyncConfig = rsyncConfig;
    this._src = src;
    this._dest = dest;
  }

  protected command(): string {
    const builder = new CommandBuilder()
      .push(this._rsyncConfig.bin);

    builder
      .push(this._rsyncConfig.archivesArgs)
      .pushCollectionPattern('--exclude=%s', this._rsyncConfig.archivesExcludes)
      .push(this._src)
      .push(this._dest);

    return builder.build();
  }
}
