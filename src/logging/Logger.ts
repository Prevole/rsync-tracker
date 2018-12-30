import Inject from '../ioc/Inject';

export default class Logger {
  @Inject('loggers')
  private loggers!: any[];

  info(message: string) {
    this.loggers.forEach(logger => logger.info(message));
  }

  error(error: any) {
    this.loggers.forEach(logger => logger.error(error));
  }
}
