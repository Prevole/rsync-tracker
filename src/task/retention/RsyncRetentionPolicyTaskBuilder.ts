import ArchiveRsyncTask from '../ArchiveRsyncTask';
import SimpleTask from '../SimpleTask';
import Taskable from '../Taskable';
import AbstractRetentionPolicyTaskBuilder from './AbstractRetentionPolicyTaskBuilder';
import ArchiveFolder from './ArchiveFolder';
import BackupFolder from './BackupFolder';

export default class RetentionPolicyTaskBuilderTaskBuilder extends AbstractRetentionPolicyTaskBuilder {
  createArchivesDirectory(archiveDirName: string): Taskable {
    return new SimpleTask('createLocalArchiveDirectory', `mkdir -p ${this.archivePath}`);
  }

  createMoveBackupFolderToArchive(backupFolder: BackupFolder, archiveFolderName: string): Taskable {
    const archiveFolder = `${this.archivePath}/${archiveFolderName}`;

    const task = new SimpleTask(
      `localMoveBackupToArchive[${backupFolder.path}, ${archiveFolder}]`,
      `mv ${backupFolder.path} ${archiveFolder}`
    );

    return task;
  }

  createSyncBackupToArchiveFolder(backupFolder: BackupFolder, archiveFolder: ArchiveFolder): Taskable {
    const task = new ArchiveRsyncTask(
      `localSyncBackupToArchive[${backupFolder.path}, ${archiveFolder.path}]`,
      this.config.rsyncConfig,
      backupFolder.path,
      archiveFolder.path
    );

    return task;
  }

  createDeleteBackupFolder(backupFolder: BackupFolder): Taskable {
    const task = new SimpleTask(
      `localDeleteBackupFolder[${backupFolder.path}]`,
      `rm -rf ${backupFolder.path}`
    );

    task.runIfPreviousTaskFail(false);

    return task;
  }
}
