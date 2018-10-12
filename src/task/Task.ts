import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Taskable from './Taskable';

export default abstract class Task implements Taskable {
  private _runIfPreviousTaskFail: boolean = false;

  @Inject()
  private childProcess: any;

  @Inject()
  private logger!: Logger;

  runIfPreviousTaskFail(canRun: boolean): Task {
    this._runIfPreviousTaskFail = canRun;
    return this;
  }

  canRunIfPreviousTaskFailed(): boolean {
    return this._runIfPreviousTaskFail;
  }

  run(): void {
    const command = this.command();

    this.logger.info(`Run command: ${command}`);

    try {
      const result = this.childProcess.execSync(command);
      this.logger.info(result);
    } catch (err) {
      this.logger.error(err);
    }
  }

  protected abstract command(): string;
}
