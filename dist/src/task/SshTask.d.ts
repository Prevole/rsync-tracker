import SshConfiguration from '../config/SshConfiguration';
import CommandTask from './CommandTask';
export default class SshTask extends CommandTask {
    private readonly _sshConfig;
    private readonly _command;
    constructor(sshConfig: SshConfiguration, command: string);
    protected command(): string;
}
