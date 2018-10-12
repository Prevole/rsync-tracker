import Inject from '../ioc/Inject';

export default class DigestUtils {
  private readonly algo: string;
  private readonly outputStyle: string;

  @Inject()
  private crypto: any;

  constructor(algo: string, outputStyle: string) {
    this.algo = algo;
    this.outputStyle = outputStyle;
  }

  digest(str: string): string {
    return this.crypto
      .createHash(this.algo)
      .update(str)
      .digest(this.outputStyle);
  }
}
