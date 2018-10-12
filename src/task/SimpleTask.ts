import Task from './Task';

export default class SimpleTask extends Task {
  private readonly _command: string;

  constructor(command: string) {
    super();
    this._command = command;
  }

  command(): string {
    return this._command;
  }
}
