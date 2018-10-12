import Inject from '../ioc/Inject';

export default class FileUtils {
  @Inject()
  private os: any;

  resolve(path: string) {
    if (path.startsWith('~')) {
      return `${this.os.homedir()}${path.replace('~', '')}`;
    } else {
      return path;
    }
  }
}
