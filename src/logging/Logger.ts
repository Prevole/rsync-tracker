import Inject from '../ioc/Inject';

export default class Logger {
  @Inject('winston')
  private logger: any;

  info(message: string) {
    this.logger.info(message);
  }

  error(error: any) {
    this.logger.error(error);
  }
}
