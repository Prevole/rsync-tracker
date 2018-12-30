import 'mocha';

import { expect, register, sinon } from '../expect';

import Logger from '../../src/logging/Logger';
import { TaskPriority } from '../../src/queue/QueueTask';
import CommandTask from '../../src/task/CommandTask';

class TestTask extends CommandTask {
  constructor() {
    super(TaskPriority.NORMAL);
  }

  protected command(): string {
    return 'dummy';
  }
}

describe('CommandTask', () => {
  describe('run', () => {
    let loggerStub: Logger;
    let childProcessStub: any;

    beforeEach(() => {
      loggerStub = sinon.createStubInstance(Logger);
      childProcessStub = sinon.stub({ execSync() {} });

      childProcessStub.execSync.returns(new ArrayBuffer(0));

      register('logger', loggerStub);
      register('childProcess', childProcessStub);
    });

    it('should run the command', () => {
      const result = new TestTask().run();

      expect(result).to.be.true;
      expect(loggerStub.info).to.have.been.calledWith('Run command: dummy');
      expect(childProcessStub.execSync).to.have.been.calledWith('dummy');
    });

    it('should run the command with an error', () => {
      const err = new Error('Error');
      childProcessStub.execSync.throws(err);

      const result = new TestTask().run();

      expect(result).to.be.false;
      expect(loggerStub.info).to.have.been.calledWith('Run command: dummy');
      expect(loggerStub.error).to.have.been.calledWith(err);
      expect(childProcessStub.execSync).to.have.been.calledWith('dummy');
    });
  });
});
