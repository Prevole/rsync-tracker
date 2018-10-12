import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import NameUtils from '../utils/NameUtils';
import Configuration from './Configuration';
import ConfigurationError from './ConfigurationError';
import TrackerConfiguration from './TrackerConfiguration';
import { RawTrackerConfiguration } from './TrackerConfiguration';

export default class ConfigurationLoader {
  @Inject()
  private baseDir!: string;

  @Inject()
  private fs: any;

  @Inject()
  private path: any;

  @Inject()
  private yaml: any;

  @Inject()
  private logger!: Logger;

  @Inject()
  private nameUtils!: NameUtils;

  public load(): Configuration {
    this.logger.info('start loading configuration');

    const config = new Configuration();

    this.fs.readdirSync(this.baseDir)
      .filter((file: string) => file.endsWith('.yml'))
      .forEach((file: string) => {
        const configFilePath = this.path.join(this.baseDir, file);

        this.logger.info(`Load configuration file: ${configFilePath}`);

        const rawDefinitions = this.yaml.safeLoad(this.fs.readFileSync(configFilePath, 'utf8'));

        rawDefinitions.definitions.forEach((rawConfiguration: RawTrackerConfiguration) => {
          const name = this.nameUtils.name(configFilePath, rawConfiguration.name);

          if (!config.hasTracker(name)) {
            config.addTracker(new TrackerConfiguration(name, rawConfiguration).resolve());
          } else {
            throw new ConfigurationError(`${name} tracker configuration already defined`);
          }
        });
      });

    return config;
  }
}
