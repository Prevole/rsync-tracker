export default class SshConfiguration {
    private _dest;
    private _args;
    private path;
    private untildifier;
    constructor(config: {
        dest: string;
        args: string;
    });
    init(): SshConfiguration;
    toJson(): any;
}
