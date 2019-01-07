import Inject from '../ioc/Inject';
import TrackerConfiguration from '../config/TrackerConfiguration';
import DateUtils from '../utils/DateUtils';
import DigestUtils from '../utils/DigestUtils';
import PathUtils from '../utils/PathUtils';
import BackupState from './BackupState';

export default class BackupStateBuilder {
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

  build(config: TrackerConfiguration): BackupState {
    const nextPath = this.pathUtils.pathFromDate(this.dateUtils.now());
    const previousPath = this.previousBackupPath(config.name);
    const unconflictedNextPath = this.pathUtils.avoidConflict(previousPath, nextPath);

    return new BackupState(config.name, unconflictedNextPath, previousPath);
  }

  update(state: BackupState) {
    const lastFile = this.pathToLastFile(this.digestDir(state.name));
    this.fs.writeFileSync(lastFile, state.next, 'utf8');
  }

  private previousBackupPath(name: string): string | undefined {
    const digestDir = this.digestDir(name);

    if (!this.fs.existsSync(digestDir)) {
      this.fs.mkdirSync(digestDir);
      this.fs.writeFileSync(`${digestDir}/name`, name, 'utf8');
    } else {
      const previous = this.pathToLastFile(digestDir);

      if (this.fs.existsSync(previous)) {
        return this.fs.readFileSync(previous, 'utf8').replace(/^\s+|\s+$/g, '');
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
