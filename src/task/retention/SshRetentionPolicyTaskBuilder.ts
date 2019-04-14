import { TaskPriority } from '../../queue/QueueTask';
import AbstractRetentionPolicyTaskBuilder from './AbstractRetentionPolicyTaskBuilder';
import ArchiveFolder from './ArchiveFolder';
import BackupFolder from './BackupFolder';
import SshTask from '../SshTask';
import Taskable from '../Taskable';

export default class SshRetentionPolicyTaskBuilder extends AbstractRetentionPolicyTaskBuilder {
  createArchivesDirectory(archiveDirName: string): Taskable {
    const dest = `${this.config.sshConfig.dest.replace('{dest}', '')}/${archiveDirName}`;
    return new SshTask('createRemoteArchiveDirectory', this.config.sshConfig, `mkdir -p ${dest}`);
  }

  createMoveBackupFolderToArchive(backupFolder: BackupFolder, archiveFolderName: string): Taskable {
    const archiveFolder = `${this.archivePath}/${archiveFolderName}`;

    const task = new SshTask(
      `remoteMoveBackupToArchive[${backupFolder.path}, ${archiveFolder}]`,
      this.config.sshConfig,
      `mv ${backupFolder.path} ${archiveFolder}`
    );

    return task;
  }

  createSyncBackupToArchiveFolder(backupFolder: BackupFolder, archiveFolder: ArchiveFolder): Taskable {
    const task = new SshTask(
      `remoteSyncBackupToArchive[${backupFolder.path}, ${archiveFolder.path}]`,
      this.config.sshConfig,
      `rsync ${backupFolder.path} ${archiveFolder.path}`
    );

    return task;
  }

  createDeleteBackupFolder(backupFolder: BackupFolder): Taskable {
    const task = new SshTask(
      `remoteDeleteBackupFolder[${backupFolder.path}]`,
      this.config.sshConfig,
      `rm -rf ${backupFolder.path}`
    );

    task.runIfPreviousTaskFail(false);

    return task;
  }

  protected get archivePath(): string {
    return `${this.config.sshConfig.dest.replace('{dest}', '')}/${this.archiveDirName}`;
  }
}
