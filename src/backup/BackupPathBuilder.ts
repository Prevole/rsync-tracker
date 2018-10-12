import Inject from '../ioc/Inject';
import TrackerConfiguration from '../config/TrackerConfiguration';
import DateUtils from '../utils/DateUtils';
import DigestUtils from '../utils/DigestUtils';
import PathUtils from '../utils/PathUtils';

export default class BackupPathBuilder {
  @Inject()
  private backupDir!: string;

  @Inject()
  private dateUtils!: DateUtils;

  @Inject()
  private pathUtils!: PathUtils;

  @Inject()
  private digestUtils!: DigestUtils;

  @Inject()
  private fs: any;

  nextBackupPath(config: TrackerConfiguration): string {
    const nextPath = this.pathUtils.pathFromDate(this.dateUtils.now());
    const previousPath = this.previousBackupPath(config.name);

    return this.pathUtils.avoidConflict(previousPath, nextPath);
  }

  updateLatestBackupPath(config: TrackerConfiguration, usedPath: string) {
    const lastFile = this.pathToLastFile(this.digestDir(config.name));
    this.fs.writeFileSync(lastFile, usedPath);
  }

  private previousBackupPath(name: string): string | undefined {
    const digestDir = this.digestDir(name);

    if (!this.fs.existsSync(digestDir)) {
      this.fs.mkdirSync(digestDir);
      this.fs.writeFileSync(`${digestDir}/name`, name);
    } else {
      const previous = this.pathToLastFile(digestDir);

      if (this.fs.existsSync(previous)) {
        return this.fs.readFileSync(previous).replace(/^\s+|\s+$/g, '');
      }
    }

    return undefined;
  }

  private digestDir(name: string): string {
    return `${this.backupDir}/${this.digestUtils.digest(name)}`;
  }

  private pathToLastFile(baseDir: string) {
    return `${baseDir}/last`;
  }
}
