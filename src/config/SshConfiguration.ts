import Inject from '../ioc/Inject';
import FileUtils from '../utils/FileUtils';

export default class SshConfiguration {
  private _dest: string;
  private _args: string;

  @Inject('sshBin')
  private _bin!: string;

  @Inject()
  private path: any;

  @Inject()
  private fileUtils!: FileUtils;

  constructor(config: RawSshConfiguration) {
    this._dest = config.dest;
    this._args = config.args;
  }

  get dest(): string {
    return this._dest;
  }

  get bin(): string {
    return this._bin;
  }

  get args(): string {
    return this._args;
  }

  toJson(): any {
    return {
      bin: this._bin,
      dest: this._dest,
      args: this._args
    };
  }
}

export type RawSshConfiguration = {
  dest: string,
  args: string
};
