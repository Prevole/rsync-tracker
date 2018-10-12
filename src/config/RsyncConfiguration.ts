import Inject from '../ioc/Inject';
import FileUtils from '../utils/FileUtils';

export default class RsyncConfiguration {
  private _src: string;
  private _dest: string;

  private readonly _args?: string;
  private readonly _excludes: string[] = [];
  private readonly _hardlinks?: string;

  private readonly _mode: RsyncMode = RsyncMode.SYNC;

  private readonly _createDest: boolean = false;

  @Inject('rsyncBin')
  private _bin!: string;

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

  get isCreateDest(): boolean {
    return this._createDest;
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
      createDest: this._createDest,
      excludes: this._excludes
    };

    if (this._hardlinks) {
      json.hardlinks = this._hardlinks;
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
  createDest?: boolean
};
