import TrackerConfiguration from '../../config/TrackerConfiguration';
import Taskable from '../Taskable';
import ArchiveFolder from './ArchiveFolder';
import BackupFolder from './BackupFolder';
import RetentionPolicyTaskBuilder from './RetentionPolicyTaskBuilder';

export default abstract class AbstractRetentionPolicyTaskBuilder implements RetentionPolicyTaskBuilder {
  protected readonly config: TrackerConfiguration;

  constructor(config: TrackerConfiguration) {
    this.config = config;
  }

  protected get archiveDirName(): string {
    return this.config.rsyncConfig.archivesDirName;
  }

  protected get archivePath(): string {
    return `${this.config.rsyncConfig.dest.replace('{dest}', '')}/${this.archiveDirName}`;
  }

  abstract createArchivesDirectory(archiveDirName: string): Taskable;

  abstract createDeleteBackupFolder(backupFolder: BackupFolder): Taskable;

  abstract createMoveBackupFolderToArchive(backupFolder: BackupFolder, archiveFolderName: string): Taskable;

  abstract createSyncBackupToArchiveFolder(backupFolder: BackupFolder, archiveFolder: ArchiveFolder): Taskable;
}
