import BinariesConfiguration from './BinariesConfiguration';
export default class TrackerConfiguration {
    private _name;
    private _rsync;
    private _ssh;
    constructor(binaries: BinariesConfiguration, config: RawTrackerConfiguration);
    init(): TrackerConfiguration;
    toJson(): any;
}
export declare type RawTrackerConfiguration = {
    name: string;
    src: string;
    dest: string;
    rsync?: {
        args?: string;
        excludes?: string[];
        hardlinks?: {
            basePath: string;
        };
    };
    ssh?: {
        dest: string;
        args: string;
    };
};
