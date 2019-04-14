import 'mocha';
import BackupState from '../../src/backup/BackupState';

import { expect, register } from '../expect';

import RsyncConfiguration, { RsyncMode } from '../../src/config/RsyncConfiguration';
import RsyncTask from '../../src/task/RsyncTask';

describe('RsyncTask', () => {
  describe('command', () => {
    const config = new RsyncConfiguration(
      'src',
      'dest/{dest}',
      {
        mode: RsyncMode.BACKUP,
        args: '-a',
        excludes: [
          'a',
          'b',
          'c'
        ],
        hardlinks: {
          basePath: 'hard/'
        },
        createDest: true
      }
    );

    beforeEach(() => {
      register('rsyncBin', '/usr/bin/rsync');
    });

    it('should return the rsync command when no backup state is provided', () => {
      const task = new RsyncTask('test', config);

      expect((task as any).command()).to.equal(
        '/usr/bin/rsync -a --exclude=a --exclude=b --exclude=c src dest/{dest}');
    });

    it('should return the rsync command', () => {
      const backupState = new BackupState('dummy', 'somewhere');

      const task = new RsyncTask('test', config, backupState);

      expect((task as any).command()).to.equal(
        '/usr/bin/rsync -a --exclude=a --exclude=b --exclude=c src dest/somewhere');
    });

    it('should return the rsync command and previous backup is present', () => {
      const backupState = new BackupState('dummy', 'next', 'previous');

      const task = new RsyncTask('test', config, backupState);

      expect((task as any).command()).to.equal(
        '/usr/bin/rsync --link-dest=hard/previous -a --exclude=a --exclude=b --exclude=c src dest/next');
    });
  });
});
