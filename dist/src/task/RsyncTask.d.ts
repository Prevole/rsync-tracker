import RsyncConfiguration from '../config/RsyncConfiguration';
import CommandTask from './CommandTask';
export default class RsyncTask extends CommandTask {
    private readonly _rsyncConfig;
    private readonly _backupPath;
    constructor(rsyncConfig: RsyncConfiguration, backupPath?: string);
    protected command(): string;
}
