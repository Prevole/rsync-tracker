import { TaskPriority } from '../queue/QueueTask';
import CommandTask from './CommandTask';

export default class SimpleTask extends CommandTask {
  private readonly _command: string;

  constructor(name: string, command: string) {
    super(name, TaskPriority.NORMAL);
    this._command = command;
  }

  protected command(): string {
    return this._command;
  }
}
