import 'mocha';
import SshConfiguration from '../../src/config/SshConfiguration';

import { expect, register } from '../expect';

import SshTask from '../../src/task/SshTask';

describe('SshTask', () => {
  describe('command', () => {
    it('should return the ssh command', () => {
      register('sshBin', '/usr/bin/ssh');

      const config = new SshConfiguration({
        dest: 'somewhere',
        args: '-p 1234'
      });

      const task = new SshTask('test', config, 'ls /');

      expect((task as any).command()).to.equal('/usr/bin/ssh -p 1234 ls /');
    });
  });
});
