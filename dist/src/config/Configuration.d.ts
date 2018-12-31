import TrackerConfiguration from './TrackerConfiguration';
export default class Configuration {
    private _trackers;
    readonly trackers: TrackerConfiguration[];
    hasTracker(name: string): boolean;
    addTracker(tracker: TrackerConfiguration): void;
    toJson(): any;
}
