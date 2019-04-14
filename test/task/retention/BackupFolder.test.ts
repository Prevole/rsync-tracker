import dayjs from 'dayjs';

import 'mocha';

import { expect } from '../../expect';

import Registry from '../../../src/ioc/Registry';
import BackupFolder from '../../../src/task/retention/BackupFolder';

describe('BackupFolder', () => {
  describe('constructor', () => {
    it('should create a valid backup folder', () => {
      const backupFolder: any = new BackupFolder('A/B/C/D/E/F/2018/12/13/23-5');

      expect(backupFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(backupFolder._date.getFullYear()).to.equal(2018);
      expect(backupFolder._date.getMonth()).to.equal(11);
      expect(backupFolder._date.getDate()).to.equal(13);
      expect(backupFolder._date.getHours()).to.equal(23);
      expect(backupFolder._precedence).to.equal(5);
    });

    it('should create a valid backup folder when no path prefix', () => {
      const backupFolder: any = new BackupFolder('2018/12/13/23-5');

      expect(backupFolder._pathPrefix).to.equal('');
      expect(backupFolder._date.getFullYear()).to.equal(2018);
      expect(backupFolder._date.getMonth()).to.equal(11);
      expect(backupFolder._date.getDate()).to.equal(13);
      expect(backupFolder._date.getHours()).to.equal(23);
      expect(backupFolder._precedence).to.equal(5);
    });

    it('should create a valid backup folder when no precedence', () => {
      const backupFolder: any = new BackupFolder('/A/B/C/2018/12/13/23');

      expect(backupFolder._pathPrefix).to.equal('/A/B/C/');
      expect(backupFolder._date.getFullYear()).to.equal(2018);
      expect(backupFolder._date.getMonth()).to.equal(11);
      expect(backupFolder._date.getDate()).to.equal(13);
      expect(backupFolder._date.getHours()).to.equal(23);
      expect(backupFolder._precedence).to.equal(0);
    });

    it('should raise an error when no valid backup folder found', () => {
      expect(() => new BackupFolder('A/B/C/D/E/F')).to.throw('Path A/B/C/D/E/F does not match pattern ');
    });
  });

  describe('compare', () => {
    beforeEach(() => {
      Registry.clear();
      Registry.register('dayjs', dayjs);
    });

    it('should be possible to compare two backup folders', () => {
      const left = new BackupFolder('2018/12/11/10');
      const right = new BackupFolder('2019/12/11/10');

      expect(left.compare(right)).to.equal(-1);
      expect(right.compare(left)).to.equal(1);
    });

    it('should be possible to compare two backup folders when precedence is used', () => {
      const left = new BackupFolder('2018/12/11/10');
      const right = new BackupFolder('2018/12/11/10-1');

      expect(left.compare(right)).to.equal(-1);
      expect(right.compare(left)).to.equal(1);
    });
  });

  describe('isBefore', () => {
    beforeEach(() => {
      Registry.clear();
      Registry.register('dayjs', dayjs);
    });

    it('should be possible to compare a date with folder date', () => {
      const folder = new BackupFolder('2018/12/11/10');

      expect(folder.isBefore(new Date(2019, 0, 1))).to.be.true;
      expect(folder.isBefore(new Date(2018, 0, 1))).to.be.false;
    });
  });
});
