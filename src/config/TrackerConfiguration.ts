import RsyncConfiguration, { RawRsyncConfiguration } from './RsyncConfiguration';
import SshConfiguration, { RawSshConfiguration } from './SshConfiguration';

export default class TrackerConfiguration {
  private readonly _name: string;

  private readonly _rsyncConfig: RsyncConfiguration;
  private readonly _sshConfig: SshConfiguration | null;

  constructor(name: string, config: RawTrackerConfiguration) {
    this._name = name;

    this._rsyncConfig = new RsyncConfiguration(config.src, config.dest, config.rsync);

    if (config.ssh) {
      this._sshConfig = new SshConfiguration(config.ssh);
    } else {
      this._sshConfig = null;
    }
  }

  get name(): string {
    return this._name;
  }

  get sshConfig(): SshConfiguration {
    return this._sshConfig!;
  }

  get rsyncConfig(): RsyncConfiguration {
    return this._rsyncConfig;
  }

  resolve(): TrackerConfiguration {
    this._rsyncConfig.resolve();
    return this;
  }

  shouldCreateDest(): boolean {
    return this._rsyncConfig.isCreateDest;
  }

  isSsh(): boolean {
    return this._sshConfig !== null;
  }

  toJson(): any {
    return {
      name: this._name,
      rsync: this._rsyncConfig.toJson(),
      ssh: this._sshConfig ? this._sshConfig.toJson() : undefined
    };
  }
}

export type RawTrackerConfiguration = {
  name: string,
  src: string,
  dest: string,
  rsync?: RawRsyncConfiguration,
  ssh?: RawSshConfiguration
};
