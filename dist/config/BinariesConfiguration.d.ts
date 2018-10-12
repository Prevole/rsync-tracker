export default class BinariesConfiguration {
    private readonly _rsync;
    private readonly _ssh;
    constructor(config: {
        rsync?: string;
        ssh?: string;
    });
    readonly rsync: string;
    readonly ssh: string;
}
