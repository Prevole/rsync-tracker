import dayjs from 'dayjs';

import 'mocha';

import { expect } from '../../expect';

import ArchiveFolder from '../../../src/task/retention/ArchiveFolder';
import ArchiveFolderCollection from '../../../src/task/retention/ArchiveFolderCollection';
import BackupFolder from '../../../src/task/retention/BackupFolder';
import RetentionPolicyConfiguration from '../../../src/config/RetentionPolicyConfiguration';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';
import Registry from '../../../src/ioc/Registry';

describe('ArchiveFolderCollection', () => {
  describe('constructor', () => {
    it('should create a valid backup folder collection', () => {
      const rawFolders = '/A/B/C/archives/2016/12/12\n' +
        '/A/B/C/2018/12/12/@ear\n' +
        '/A/B/C/2018/12/12/23\n' +
        '/A/B/C/archives/2018/11\n' +
        '/A/B/C/archives/2018/04/08\n' +
        '/A/B/C/archives/2017';

      const archiveFolderCollection: any = new ArchiveFolderCollection(rawFolders, 'archives');

      expect(archiveFolderCollection._folders).to.deep.equal([
        new ArchiveFolder('/A/B/C/archives/2016/12/12'),
        new ArchiveFolder('/A/B/C/archives/2018/11'),
        new ArchiveFolder('/A/B/C/archives/2018/04/08'),
        new ArchiveFolder('/A/B/C/archives/2017')
      ]);
    });
  });

  describe('findFromBackupAndPolicy', () => {
    beforeEach(() => {
      Registry.clear();
      Registry.register('dayjs', dayjs);
      Registry.register('retentionPolicyParserUtils', new RetentionPolicyParserUtils());
    });

    it('should be possible to retrieve the archive folder', () => {
      const rawFolders = '/A/B/C/archives/2016/12/12\n' +
        '/A/B/C/archives/2018/05/07\n' +
        '/A/B/C/archives/2018/12/12\n' +
        '/A/B/C/archives/2018/11\n' +
        '/A/B/C/archives/2017';

      const archiveFolderCollection = new ArchiveFolderCollection(rawFolders, 'archives');

      expect(archiveFolderCollection.findFromBackupFolderAndPolicy(
        new BackupFolder('A/B/C/D/E/2018/12/12/23-1'),
        new RetentionPolicyConfiguration({
          groupBy: 'day',
          older: '10 days'
        })
      )).to.deep.equal(new ArchiveFolder('/A/B/C/archives/2018/12/12'));

      expect(archiveFolderCollection.findFromBackupFolderAndPolicy(
        new BackupFolder('A/B/C/D/E/2018/05/07/15'),
        new RetentionPolicyConfiguration({
          groupBy: 'day',
          older: '10 days'
        })
      )).to.deep.equal(new ArchiveFolder('/A/B/C/archives/2018/05/07'));

      expect(archiveFolderCollection.findFromBackupFolderAndPolicy(
        new BackupFolder('A/B/C/D/E/2019/01/03/11'),
        new RetentionPolicyConfiguration({
          groupBy: 'day',
          older: '10 days'
        })
      )).to.equal('2019/01/03');
    });
  });
});
