import Inject from '../../ioc/Inject';

export default class BackupFolder {
  static PATTERN = /(.*\/)?(\d{4})\/(\d{2})\/(\d{2})\/(\d{2})(-(\d+))?/;

  private readonly _date: Date;
  private readonly _precedence: number;
  private readonly _pathPrefix: string;
  private readonly _path: string;

  @Inject()
  private dayjs!: any;

  constructor(path: string) {
    this._path = path;

    const dateParts = BackupFolder.PATTERN.exec(path);

    if (dateParts !== null) {
      if (dateParts[1] !== undefined) {
        this._pathPrefix = dateParts[1];
      } else {
        this._pathPrefix = '';
      }

      this._date = new Date(
        parseInt(dateParts[2], 10),
        parseInt(dateParts[3], 10) - 1,
        parseInt(dateParts[4], 10),
        parseInt(dateParts[5], 10)
      );

      if (dateParts[7] !== undefined) {
        this._precedence = parseInt(dateParts[7], 10);
      } else {
        this._precedence = 0;
      }
    } else {
      throw new Error(`Path ${path} does not match pattern ${BackupFolder.PATTERN}`);
    }
  }

  get date(): Date {
    return this._date;
  }

  get path(): string {
    return this._path;
  }

  compare(right: BackupFolder): number {
    if (this.dayjs(this._date).isBefore(this.dayjs(right._date))) {
      return -1;
    } else if (this.dayjs(this._date).isAfter(this.dayjs(right._date))) {
      return 1;
    } else {
      return this._precedence < right._precedence ? -1 : 1;
    }
  }

  isBefore(date: Date): boolean {
    return this.dayjs(this._date).isBefore(date);
  }
}
