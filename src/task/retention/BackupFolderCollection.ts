import RetentionPolicyConfiguration from '../../config/RetentionPolicyConfiguration';
import Inject from '../../ioc/Inject';
import BackupFolder from './BackupFolder';

export default class BackupFolderCollection {
  private readonly _folders: BackupFolder[];
  private readonly _now: Date;

  @Inject()
  private dayjs!: any;

  constructor(rawFolders: string, now: Date) {
    const folders = rawFolders.split('\n');

    this._folders = folders
      .filter((folder: string): boolean => folder.match(BackupFolder.PATTERN) !== null)
      .map((folder: string) => new BackupFolder(folder));

    this._now = now;
  }

  find(policy: RetentionPolicyConfiguration): BackupFolder[] {
    const date = this.dayjs(this._now).subtract(policy.older.quantity, policy.older.unit);

    return this._folders
      .filter((folder: BackupFolder) => {
        return folder.isBefore(date);
      });
  }
}
