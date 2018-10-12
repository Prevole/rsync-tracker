import 'mocha';
import TrackerConfiguration from '../../src/config/TrackerConfiguration';

import { expect, sinon } from '../expect';

import Configuration from '../../src/config/Configuration';

describe('Configuration', () => {
  describe('hasTracker', () => {
    it('should check if a tracker is present', () => {
      const config = new Configuration();

      expect(config.hasTracker('any')).to.be.false;

      const tracker = sinon.createStubInstance(TrackerConfiguration);
      sinon.stub(tracker, 'name').get(() => 'aTracker');

      config.addTracker(tracker);

      expect(config.hasTracker('aTracker')).to.be.true;
    });
  });

  describe('trackers and addTracker', () => {
    it('should be possible to retrieve the list of trackers', () => {
      const tracker1 = sinon.createStubInstance(TrackerConfiguration);
      const tracker2 = sinon.createStubInstance(TrackerConfiguration);

      const config = new Configuration();

      config.addTracker(tracker1);
      config.addTracker(tracker2);

      expect(config.trackers).to.deep.equal([
        tracker1,
        tracker2
      ]);
    });
  });

  describe('toJson', () => {
    it('should serialize the list of trackers', () => {
      const tracker: any = sinon.createStubInstance(TrackerConfiguration);
      tracker.toJson.returns({ name: 'test' });

      const config = new Configuration();
      config.addTracker(tracker);

      expect(config.toJson()).to.deep.equal([{ name: 'test' }]);
      expect(tracker.toJson).to.have.been.calledOnce;
    });
  });
});
