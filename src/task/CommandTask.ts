import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Task from './Task';

export default abstract class CommandTask extends Task {
  @Inject()
  private childProcess: any;

  @Inject()
  private logger!: Logger;

  run(): boolean {
    const command = this.command();

    this.logger.info(`Run command: ${command}`);

    try {
      const result: Buffer = this.childProcess.execSync(command, 'utf8');
      if (result.length === 0) {
        this.logger.info('The command produced no result content');
      } else {
        this.logger.info(result.toString());
      }
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  protected abstract command(): string;
}
