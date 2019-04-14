import RetentionPolicyConfiguration from '../../config/RetentionPolicyConfiguration';
import Inject from '../../ioc/Inject';
import ArchiveFolder from './ArchiveFolder';
import BackupFolder from './BackupFolder';

export default class ArchiveFolderCollection {
  private static GROUPS = {
    day: [ 'year', 'month', 'date' ],
    month: [ 'year', 'month' ],
    year: [ 'year' ]
  };

  private readonly _folders: ArchiveFolder[];

  @Inject()
  private dayjs!: any;

  constructor(rawFolders: string, archivesFolderName: string) {
    const folders = rawFolders.split('\n');
    const pattern = new RegExp(`(.*\\/${archivesFolderName}\/)(\\d{4})(?:\\/(\\d{2}))?(?:\\/(\\d{2}))?`);

    this._folders = folders
      .filter((folder: string): boolean => folder.match(pattern) !== null)
      .map((folder: string) => new ArchiveFolder(folder));
  }

  findFromBackupFolderAndPolicy(folder: BackupFolder, policy: RetentionPolicyConfiguration): ArchiveFolder | string {
    const folderDate = folder.date;
    const groups = ArchiveFolderCollection.GROUPS[policy.groupBy];

    const archiveCorrespondingPath = groups
      .map((group: string) => {
        let datePart = this.dayjs(folderDate)[group]();

        if (group === 'month') {
          datePart += 1;
        }

        return datePart < 10 ? `0${datePart}` : datePart;
      })
      .join('/');

    const found = this._folders
      .find((folder) => folder.is(archiveCorrespondingPath));

    if (found !== undefined) {
      return found;
    } else {
      return archiveCorrespondingPath;
    }
  }
}
