import Inject from '../ioc/Inject';
import FileUtils from '../utils/FileUtils';
import RetentionPolicyConfiguration, { RawRetentionPolicyConfiguration } from './RetentionPolicyConfiguration';

export default class RsyncConfiguration {
  private _src: string;
  private _dest: string;

  private readonly _args?: string;
  private readonly _excludes: string[] = [];
  private readonly _hardlinks?: string;

  private readonly _mode: RsyncMode = RsyncMode.SYNC;

  private readonly _createDest: boolean = false;

  private readonly _archivesDirName: string;
  private readonly _archivesArgs?: string;
  private readonly _archivesExcludes: string[] = [];

  private readonly _policies: RetentionPolicyConfiguration[] = [];

  @Inject('rsyncBin')
  private _bin!: string;

  @Inject('defaultArchivesDirName')
  private _defaultArchivesDirName!: string;

  @Inject()
  private path: any;

  @Inject()
  private fileUtils!: FileUtils;

  constructor(
    src: string,
    dest: string,
    config?: RawRsyncConfiguration
  ) {
    this._src = src;
    this._dest = dest;

    this._archivesDirName = this._defaultArchivesDirName;

    if (config) {
      if (config.mode) {
        this._mode = RsyncMode[config.mode.toUpperCase() as keyof typeof RsyncMode];
      }

      if (config.args) {
        this._args = config.args;
      }

      if (config.excludes) {
        this._excludes = config.excludes;
      }

      if (config.hardlinks) {
        this._hardlinks = config.hardlinks.basePath;
      }

      if (config.createDest !== undefined) {
        this._createDest = config.createDest;
      }

      if (config.archivesDirName !== undefined) {
        this._archivesDirName = config.archivesDirName;
      }

      if (config.archivesArgs) {
        this._archivesArgs = config.archivesArgs;
      }

      if (config.archivesExcludes !== undefined) {
        this._archivesExcludes = config.archivesExcludes;
      }

      if (config.policies !== undefined) {
        config.policies.forEach(rawPolicy => {
          this._policies.push(new RetentionPolicyConfiguration(rawPolicy));
        });
      }
    }
  }

  get bin(): string {
    return this._bin;
  }

  get src(): string {
    return this._src;
  }

  get dest(): string {
    return this._dest;
  }

  get hardLinks(): string | undefined {
    return this._hardlinks;
  }

  get args(): string | undefined {
    return this._args;
  }

  get excludes(): string[] | undefined {
    return this._excludes;
  }

  get mode(): RsyncMode {
    return this._mode;
  }

  get policies(): RetentionPolicyConfiguration[] {
    return this._policies;
  }

  get isCreateDest(): boolean {
    return this._createDest;
  }

  hasPolicies(): boolean {
    return this._policies.length > 0;
  }

  get archivesDirName(): string {
    return this._archivesDirName;
  }

  get archivesArgs(): string | undefined {
    return this._archivesArgs;
  }

  get archivesExcludes(): string[] | undefined {
    return this._archivesExcludes;
  }

  resolve(): RsyncConfiguration {
    this._src = this.fileUtils.resolve(this._src);
    this._dest = this.fileUtils.resolve(this._dest);
    return this;
  }

  toJson(): any {
    const json: any = {
      src: this._src,
      dest: this._dest,
      mode: this._mode,
      bin: this._bin,
      args: this._args,
      archivesDirName: this._archivesDirName,
      archivesArgs: this._archivesArgs,
      archivesExcludes: this.archivesExcludes,
      createDest: this._createDest,
      excludes: this._excludes
    };

    if (this._hardlinks) {
      json.hardlinks = this._hardlinks;
    }

    if (this._policies.length > 0) {
      json.policies = this._policies.map(policy => policy.toJson());
    }

    return json;
  }
}

export enum RsyncMode {
  BACKUP = 'backup',
  SYNC = 'sync'
}

export type RawRsyncConfiguration = {
  mode?: string,
  args?: string,
  excludes?: string[],
  hardlinks?: {
    basePath: string
  },
  createDest?: boolean,
  archivesDirName?: string,
  archivesArgs?: string,
  archivesExcludes?: string[],
  policies?: RawRetentionPolicyConfiguration[]
};
