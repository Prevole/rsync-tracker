import BinariesConfiguration from './BinariesConfiguration';
export default class RsyncConfiguration {
    private _bin;
    private _src;
    private _dest;
    private _args;
    private _excludes;
    private _hardlinks?;
    private _mode;
    private path;
    private untildifier;
    constructor(binaries: BinariesConfiguration, src: string, dest: string, config?: {
        mode?: string;
        args?: string;
        excludes?: string[];
        hardlinks?: {
            basePath: string;
        };
    });
    init(): void;
    build(): string;
    toJson(): any;
}
export declare enum RsyncMode {
    BACKUP = "backup",
    SYNC = "sync"
}
