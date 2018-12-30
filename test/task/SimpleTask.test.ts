import 'mocha';

import { expect } from '../expect';

import SimpleTask from '../../src/task/SimpleTask';

describe('SimpleTask', () => {
  describe('command', () => {
    it('should return the command', () => {
      const task = new SimpleTask('ls /var');
      expect((task as any).command()).to.equal('ls /var');
    });
  });
});
