import SshConfiguration from '../config/SshConfiguration';
import Task from './Task';

export default class SshTask extends Task {
  private readonly _sshConfig: SshConfiguration;
  private readonly _command: string;

  constructor(sshConfig: SshConfiguration, command: string) {
    super();
    this._sshConfig = sshConfig;
    this._command = command;
  }

  command(): string {
    return `${this._sshConfig.bin} ${this._sshConfig.args} ${this._command}`;
  }
}
