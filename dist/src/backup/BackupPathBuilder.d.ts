import TrackerConfiguration from '../config/TrackerConfiguration';
export default class BackupPathBuilder {
    private backupDir;
    private dateUtils;
    private pathUtils;
    private digestUtils;
    private fs;
    nextBackupPath(config: TrackerConfiguration): string;
    updateLatestBackupPath(config: TrackerConfiguration, usedPath: string): void;
    previousBackupPath(name: string): string | undefined;
    private digestDir;
    private pathToLastFile;
}
