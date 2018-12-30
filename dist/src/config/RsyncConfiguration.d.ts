export default class RsyncConfiguration {
    private _src;
    private _dest;
    private readonly _args?;
    private readonly _excludes;
    private readonly _hardlinks?;
    private readonly _mode;
    private readonly _createDest;
    private _bin;
    private path;
    private fileUtils;
    constructor(src: string, dest: string, config?: RawRsyncConfiguration);
    readonly bin: string;
    readonly src: string;
    readonly dest: string;
    readonly hardLinks: string | undefined;
    readonly args: string | undefined;
    readonly excludes: string[] | undefined;
    readonly mode: RsyncMode;
    readonly isCreateDest: boolean;
    resolve(): RsyncConfiguration;
    toJson(): any;
}
export declare enum RsyncMode {
    BACKUP = "backup",
    SYNC = "sync"
}
export declare type RawRsyncConfiguration = {
    mode?: string;
    args?: string;
    excludes?: string[];
    hardlinks?: {
        basePath: string;
    };
    createDest?: boolean;
};
