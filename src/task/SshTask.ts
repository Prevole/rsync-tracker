import SshConfiguration from '../config/SshConfiguration';
import { TaskPriority } from '../queue/QueueTask';
import CommandTask from './CommandTask';

export default class SshTask extends CommandTask {
  private readonly _sshConfig: SshConfiguration;
  private readonly _command: string;

  constructor(name: string, sshConfig: SshConfiguration, command: string) {
    super(name, TaskPriority.NORMAL);
    this._sshConfig = sshConfig;
    this._command = command;
  }

  protected command(): string {
    return `${this._sshConfig.bin} ${this._sshConfig.args} ${this._command}`;
  }
}
