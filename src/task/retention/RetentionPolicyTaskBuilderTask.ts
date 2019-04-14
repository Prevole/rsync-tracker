import TrackerConfiguration from '../../config/TrackerConfiguration';
import { TaskPriority } from '../../queue/QueueTask';
import Task from '../Task';
import Taskable from '../Taskable';
import TaskEngineState from '../TaskEngineState';
import ArchiveFolderCollection from './ArchiveFolderCollection';
import BackupFolder from './BackupFolder';
import BackupFolderCollection from './BackupFolderCollection';
import RetentionPoliciesClassifier from './RetentionPoliciesClassifier';
import RetentionPolicyTaskBuilder from './RetentionPolicyTaskBuilder';

export default class RetentionPolicyTaskBuilderTask extends Task {
  private readonly config: TrackerConfiguration;
  private readonly listDirTaskName: string;
  private readonly now: Date;
  private readonly builder: RetentionPolicyTaskBuilder;

  constructor(name: string, config: TrackerConfiguration, listDirTaskName: string, now: Date, builder: RetentionPolicyTaskBuilder) {
    super(name, TaskPriority.NORMAL);
    this.config = config;
    this.listDirTaskName = listDirTaskName;
    this.now = now;
    this.builder = builder;
  }

  run(state: TaskEngineState): boolean {
    const dirListing: string = state.get(this.listDirTaskName);
    const archiveDirName = this.config.rsyncConfig.archivesDirName;

    if (!dirListing.match(archiveDirName)) {
      state.scheduleTask(this.forceTaskPriority(this.builder.createArchivesDirectory(archiveDirName)));
    }

    const classifier = new RetentionPoliciesClassifier(this.config.rsyncConfig.policies, this.now);

    const archiveFolderCollection = new ArchiveFolderCollection(dirListing, this.config.rsyncConfig.archivesDirName);

    const backupRetentionPolicy = classifier.mostConstrainingPolicy;
    const backupFolderCollection = new BackupFolderCollection(dirListing, this.now);
    const backupFoldersToArchive = backupFolderCollection.find(backupRetentionPolicy);

    backupFoldersToArchive.forEach((folder: BackupFolder) => {
      const archiveFolder = archiveFolderCollection.findFromBackupFolderAndPolicy(folder, backupRetentionPolicy);

      if (typeof archiveFolder === 'string') {
        state.scheduleTask(this.forceTaskPriority(this.builder.createMoveBackupFolderToArchive(folder, archiveFolder)));
      } else {
        state.scheduleTask(this.forceTaskPriority(this.builder.createSyncBackupToArchiveFolder(folder, archiveFolder)));
        state.scheduleTask(this.forceTaskPriority(this.builder.createDeleteBackupFolder(folder)));
      }
    });

    return false;
  }

  private forceTaskPriority(task: Taskable): Taskable {
    task.priority = TaskPriority.HIGH;
    return task;
  }
}
