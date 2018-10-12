import 'mocha';

import { expect } from '../expect';

import ClojureTask from '../../src/task/ClojureTask';

describe('ClojureTask', () => {
  describe('canRunIfPreviousTaskFailed', () => {
    it('should not run if previous task fail by default', () => {
      expect(new ClojureTask(() => {}).canRunIfPreviousTaskFailed()).to.be.false;
    });

    it('should run if flag is set to true', () => {
      const task = new ClojureTask(() => {}).runIfPreviousTaskFail(true);
      expect(task.canRunIfPreviousTaskFailed()).to.be.true;
    });
  });

  describe('command', () => {
    it('should return the command', (done) => {
      new ClojureTask(() => {
        done();
      }).run();
    });
  });
});
