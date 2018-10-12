import 'mocha';

import { expect, register, sinon } from '../expect';

import Logger from '../../src/logging/Logger';

describe('Logger', () => {
  let loggerStub: any;

  beforeEach(() => {
    loggerStub = sinon.stub({
      info() {},
      error() {}
    });

    register('winston', loggerStub);
  });

  describe('info', () => {
    it('should log', () => {
      new Logger().info('message');
      expect(loggerStub.info).to.have.been.calledWith('message');
    });
  });

  describe('error', () => {
    it('should log', () => {
      new Logger().error('message');
      expect(loggerStub.error).to.have.been.calledWith('message');
    });
  });
});
