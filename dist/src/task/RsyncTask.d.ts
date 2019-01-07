import BackupState from '../backup/BackupState';
import RsyncConfiguration from '../config/RsyncConfiguration';
import CommandTask from './CommandTask';
export default class RsyncTask extends CommandTask {
    private readonly _rsyncConfig;
    private readonly _backupState?;
    constructor(rsyncConfig: RsyncConfiguration, backupState?: BackupState);
    protected command(): string;
}
