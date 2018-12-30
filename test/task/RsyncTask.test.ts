import 'mocha';

import { expect, register } from '../expect';

import RsyncConfiguration, { RsyncMode } from '../../src/config/RsyncConfiguration';
import RsyncTask from '../../src/task/RsyncTask';

describe('RsyncTask', () => {
  describe('command', () => {
    it('should return the rsync command', () => {
      register('rsyncBin', '/usr/bin/rsync');

      const config = new RsyncConfiguration(
        'src',
        'dest',
        {
          mode: RsyncMode.BACKUP,
          args: '-a',
          excludes: [
            'a',
            'b',
            'c'
          ],
          hardlinks: {
            basePath: 'hard'
          },
          createDest: true
        }
      );

      const task = new RsyncTask(config, 'somewhere');

      expect((task as any).command()).to.equal(
        '/usr/bin/rsync --link-dest=hard -a --exclude=a --exclude=b --exclude=c src dest');
    });
  });
});
