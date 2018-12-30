export default class SshConfiguration {
    private readonly _dest;
    private readonly _args;
    private _bin;
    private path;
    private fileUtils;
    constructor(config: RawSshConfiguration);
    readonly dest: string;
    readonly bin: string;
    readonly args: string;
    toJson(): any;
}
export declare type RawSshConfiguration = {
    dest: string;
    args: string;
};
