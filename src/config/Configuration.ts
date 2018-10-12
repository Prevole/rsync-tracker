import TrackerConfiguration from './TrackerConfiguration';

export default class Configuration {
  private _trackers: TrackerConfiguration[] = [];

  get trackers(): TrackerConfiguration[] {
    return this._trackers;
  }

  hasTracker(name: string): boolean {
    return this._trackers
      .find((tracker: TrackerConfiguration) => tracker.name === name) !== undefined;
  }

  addTracker(tracker: TrackerConfiguration) {
    this._trackers.push(tracker);
  }

  toJson(): any {
    return this._trackers.map((current) => current.toJson());
  }
}
