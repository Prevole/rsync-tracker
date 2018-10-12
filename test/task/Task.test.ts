import 'mocha';
import Logger from '../../src/logging/Logger';

import { expect, register, sinon } from '../expect';

import Task from '../../src/task/Task';

class TestTask extends Task {
  protected command(): string {
    return 'dummy';
  }
}

describe('Task', () => {
  describe('runIfPreviousTaskFail', () => {
    it('should not run if previous task fail by default', () => {
      expect(new TestTask().canRunIfPreviousTaskFailed()).to.be.false;
    });

    it('should run if flag is set to true', () => {
      const task = new TestTask().runIfPreviousTaskFail(true);
      expect(task.canRunIfPreviousTaskFailed()).to.be.true;
    });
  });

  describe('run', () => {
    let loggerStub: Logger;
    let childProcessStub: any;

    beforeEach(() => {
      loggerStub = sinon.createStubInstance(Logger);
      childProcessStub = sinon.stub({ execSync() {} });

      register('logger', loggerStub);
      register('childProcess', childProcessStub);
    });

    it('should run the command', () => {
      new TestTask().run();

      expect(loggerStub.info).to.have.been.calledWith('Run command: dummy');
      expect(childProcessStub.execSync).to.have.been.calledWith('dummy');
    });

    it('should run the command with an error', () => {
      const err = new Error('Error');
      childProcessStub.execSync.throws(err);

      new TestTask().run();

      expect(loggerStub.info).to.have.been.calledWith('Run command: dummy');
      expect(loggerStub.error).to.have.been.calledWith(err);
      expect(childProcessStub.execSync).to.have.been.calledWith('dummy');
    });
  });
});
