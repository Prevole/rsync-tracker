import TrackerConfiguration from '../config/TrackerConfiguration';
import BackupState from './BackupState';
export default class BackupStateBuilder {
    private backupDir;
    private dateUtils;
    private pathUtils;
    private digestUtils;
    private fs;
    build(config: TrackerConfiguration): BackupState;
    update(state: BackupState): void;
    private previousBackupPath;
    private digestDir;
    private pathToLastFile;
}
