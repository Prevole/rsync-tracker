import 'mocha';

import * as fs from 'fs';

import { expect, register, sinon } from '../expect';

import BackupPathBuilder from '../../src/backup/BackupPathBuilder';
import TrackerConfiguration from '../../src/config/TrackerConfiguration';

import DateUtils from '../../src/utils/DateUtils';
import DigestUtils from '../../src/utils/DigestUtils';
import PathUtils from '../../src/utils/PathUtils';

describe('BackupPathBuilder', () => {
  const trackerConfig = new TrackerConfiguration('config', {
    name: 'raw',
    src: 'src',
    dest: 'dest'
  });

  let fsStub: any = {
    existsSync: () => {},
    mkdirSync: () => {},
    writeFileSync: () => {},
    readFileSync: () => {}
  };

  let digestUtilsStub: any;

  describe('nextBackupPath', () => {
    let dateUtilsStub: any;
    let pathUtilsStub: any;

    beforeEach(() => {
      sinon.restore(fsStub);

      dateUtilsStub = sinon.createStubInstance(DateUtils);
      pathUtilsStub = sinon.createStubInstance(PathUtils);
      digestUtilsStub = sinon.createStubInstance(DigestUtils);
      fsStub = sinon.stub(fsStub);

      register('backupDir', 'bck');
      register('dateUtils', dateUtilsStub);
      register('pathUtils', pathUtilsStub);
      register('digestUtils', digestUtilsStub);
      register('fs', fsStub);
    });

    it('should return the next path as there is no previous backup', () => {
      pathUtilsStub.pathFromDate.returns('2018/11/25/03');
      pathUtilsStub.avoidConflict.callsFake((previous: string, next: string) => next);

      fsStub.existsSync.onFirstCall().returns(true);

      const builder = new BackupPathBuilder();

      const nextPath = builder.nextBackupPath(trackerConfig);

      expect(nextPath).to.equal('2018/11/25/03');
      expect(dateUtilsStub.now).to.have.been.calledOnce;
      expect(pathUtilsStub.pathFromDate).to.have.been.calledOnce;
      expect(pathUtilsStub.avoidConflict).to.have.been.calledWith(undefined, '2018/11/25/03');
    });

    it('should return the next path as there is no previous backup but backup meta data is present', () => {
      pathUtilsStub.pathFromDate.returns('2018/11/25/03');
      pathUtilsStub.avoidConflict.callsFake((previous: string, next: string) => next);

      digestUtilsStub.digest.returns('abcd');

      fsStub.existsSync.onFirstCall().returns(false);

      const builder = new BackupPathBuilder();

      const nextPath = builder.nextBackupPath(trackerConfig);

      expect(nextPath).to.equal('2018/11/25/03');
      expect(dateUtilsStub.now).to.have.been.calledOnce;
      expect(pathUtilsStub.pathFromDate).to.have.been.calledOnce;
      expect(pathUtilsStub.avoidConflict).to.have.been.calledWith(undefined, '2018/11/25/03');
      expect(fsStub.mkdirSync).to.have.been.calledWith('bck/abcd');
      expect(fsStub.writeFileSync).to.have.been.calledWith('bck/abcd/name', 'config');
    });

    it('should return the next path as there is no previous backup but backup meta data is present with previous backed recorded', () => {
      pathUtilsStub.pathFromDate.returns('2018/11/25/03');
      pathUtilsStub.avoidConflict.callsFake((previous: string, next: string) => next);

      digestUtilsStub.digest.returns('abcd');

      fsStub.existsSync.onFirstCall().returns(true);
      fsStub.existsSync.onSecondCall().returns(true);
      fsStub.readFileSync.returns('   2018/11/25/02   ');

      const builder = new BackupPathBuilder();

      const nextPath = builder.nextBackupPath(trackerConfig);

      expect(nextPath).to.equal('2018/11/25/03');
      expect(dateUtilsStub.now).to.have.been.calledOnce;
      expect(pathUtilsStub.pathFromDate).to.have.been.calledOnce;
      expect(pathUtilsStub.avoidConflict).to.have.been.calledWith('2018/11/25/02', '2018/11/25/03');
    });
  });

  describe('updateLatestBackupPath', () => {
    beforeEach(() => {
      sinon.restore(fsStub);

      digestUtilsStub = sinon.createStubInstance(DigestUtils);
      fsStub = sinon.stub(fsStub);

      register('backupDir', 'bck');
      register('digestUtils', digestUtilsStub);
      register('fs', fsStub);
    });

    it('update the file with given path', () => {
      digestUtilsStub.digest.returns('abcd');

      const builder = new BackupPathBuilder();

      builder.updateLatestBackupPath(trackerConfig, '2018/11/25/02');

      expect(fsStub.writeFileSync).to.have.been.calledWith('bck/abcd/last', '2018/11/25/02');
    });
  });
});
