import 'mocha';

import { expect, register, sinon } from '../expect';

import Logger from '../../src/logging/Logger';

describe('Logger', () => {
  let loggerStubs: any[] = [];

  beforeEach(() => {
    for (let i = 0; i < 2; i++) {
      loggerStubs.push(sinon.stub({
        info() {},
        error() {}
      }));
    }

    register('loggers', loggerStubs);
  });

  describe('info', () => {
    it('should log', () => {
      new Logger().info('message');
      expect(loggerStubs[0].info).to.have.been.calledWith('message');
      expect(loggerStubs[1].info).to.have.been.calledWith('message');
    });
  });

  describe('error', () => {
    it('should log', () => {
      new Logger().error('error');
      expect(loggerStubs[0].error).to.have.been.calledWith('error');
      expect(loggerStubs[1].error).to.have.been.calledWith('error');
    });
  });
});
