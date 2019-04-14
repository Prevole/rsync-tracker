import Taskable from '../Taskable';
import ArchiveFolder from './ArchiveFolder';
import BackupFolder from './BackupFolder';

export default interface RetentionPolicyTaskBuilder {
  createArchivesDirectory(archiveDirName: string): Taskable;

  createMoveBackupFolderToArchive(backupFolder: BackupFolder, archiveFolderName: string): Taskable;

  createSyncBackupToArchiveFolder(backupFolder: BackupFolder, archiveFolder: ArchiveFolder): Taskable;

  createDeleteBackupFolder(backupFolder: BackupFolder): Taskable;
}
