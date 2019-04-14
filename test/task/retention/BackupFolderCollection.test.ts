
import 'mocha';
import dayjs from 'dayjs';
import RetentionPolicyConfiguration from '../../../src/config/RetentionPolicyConfiguration';
import Registry from '../../../src/ioc/Registry';
import BackupFolder from '../../../src/task/retention/BackupFolder';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';

import { expect } from '../../expect';

import BackupFolderCollection from '../../../src/task/retention/BackupFolderCollection';

describe('BackupFolderCollection', () => {
  describe('constructor', () => {
    it('should create a valid backup folder collection', () => {
      const rawFolders = '/A/B/C/2016/12/12/23-1\n' +
        '/A/B/C/2018/12/12/@ear\n' +
        '/A/B/C/2018/12/12/23';

      const backupFolderCollection: any = new BackupFolderCollection(rawFolders, new Date());

      expect(backupFolderCollection._folders).to.deep.equal([
        new BackupFolder('/A/B/C/2016/12/12/23-1'),
        new BackupFolder('/A/B/C/2018/12/12/23')
      ]);
    });
  });

  describe('find', () => {
    beforeEach(() => {
      Registry.clear();
      Registry.register('dayjs', dayjs);
      Registry.register('retentionPolicyParserUtils', new RetentionPolicyParserUtils());
    });

    it('should be possible to find the folders older than a date', () => {
      const rawFolders = '/A/B/C/2016/12/12/23-1\n' +
        '/A/B/C/2016/12/12/23\n' +
        '/A/B/C/2017/12/12\n' +
        '/A/B/C/2018/12/12/23';

      const date = new Date(2018, 11, 31);

      const backupFolderCollection = new BackupFolderCollection(rawFolders, date);

      expect(backupFolderCollection.find(new RetentionPolicyConfiguration({
        groupBy: 'year',
        older: '1 year'
      }))).to.deep.equal([
        new BackupFolder('/A/B/C/2016/12/12/23-1'),
        new BackupFolder('/A/B/C/2016/12/12/23')
      ]);
    });
  });
});
