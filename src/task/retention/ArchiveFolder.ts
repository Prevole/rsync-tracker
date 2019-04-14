import Inject from '../../ioc/Inject';

export default class ArchiveFolder {
  static PATTERN = /(.*\/)(\d{4})(?:\/(\d{2}))?(?:\/(\d{2}))?/;

  private readonly _date: Date;
  private readonly _pathPrefix: string;
  private readonly _path: string;

  @Inject()
  private dayjs!: any;

  constructor(path: string) {
    this._path = path;

    const dateParts = ArchiveFolder.PATTERN.exec(path);

    if (dateParts !== null) {
      this._pathPrefix = dateParts[1];

      this._date = new Date(
        parseInt(dateParts[2], 10),
        dateParts[3] !== undefined ? parseInt(dateParts[3], 10) - 1 : 0,
        dateParts[4] !== undefined ? parseInt(dateParts[4], 10) : 1
      );
    } else {
      throw new Error(`Path ${path} does not match pattern ${ArchiveFolder.PATTERN}`);
    }
  }

  get path(): string {
    return this._path;
  }

  compare(right: ArchiveFolder): number {
    if (this.dayjs(this._date).isBefore(this.dayjs(right._date))) {
      return -1;
    } else {
      return 1;
    }
  }

  is(path: string): boolean {
    return this._path.replace(this._pathPrefix, '') === path;
  }
}
