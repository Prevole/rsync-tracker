import Configuration from './Configuration';
export default class ConfigurationLoader {
    private baseDir;
    private fs;
    private path;
    private yaml;
    private logger;
    private nameUtils;
    load(): Configuration;
}
