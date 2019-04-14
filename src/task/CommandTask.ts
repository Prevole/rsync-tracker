import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Task from './Task';
import TaskEngineState from './TaskEngineState';

export default abstract class CommandTask extends Task {
  @Inject()
  private childProcess: any;

  @Inject()
  private logger!: Logger;

  run(state: TaskEngineState): boolean {
    const command = this.command();

    this.logger.info(`Run command: ${command}`);

    try {
      const result: Buffer = this.childProcess.execSync(command, 'utf8');
      if (result.length === 0) {
        this.logger.info('The command produced no result content');
      } else {
        const resultStr = result.toString();
        state.store(this.name(), resultStr);
        this.logger.info(resultStr);
      }
      return true;
    } catch (err) {
      this.logger.error(err);
      return false;
    }
  }

  protected abstract command(): string;
}
