import RsyncConfiguration, { RawRsyncConfiguration } from './RsyncConfiguration';
import SshConfiguration, { RawSshConfiguration } from './SshConfiguration';
export default class TrackerConfiguration {
    private readonly _name;
    private readonly _rsyncConfig;
    private readonly _sshConfig;
    constructor(name: string, config: RawTrackerConfiguration);
    readonly name: string;
    readonly sshConfig: SshConfiguration;
    readonly rsyncConfig: RsyncConfiguration;
    resolve(): TrackerConfiguration;
    shouldCreateDest(): boolean;
    isSsh(): boolean;
    toJson(): any;
}
export declare type RawTrackerConfiguration = {
    name: string;
    src: string;
    dest: string;
    rsync?: RawRsyncConfiguration;
    ssh?: RawSshConfiguration;
};
