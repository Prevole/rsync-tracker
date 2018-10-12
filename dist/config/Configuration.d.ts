import TrackerConfiguration from './TrackerConfiguration';
export default class Configuration {
    private _configurations;
    private fs;
    private path;
    private yaml;
    private logger;
    load(configFile: string): void;
    readonly configurations: TrackerConfiguration[];
    toJson(): any;
}
