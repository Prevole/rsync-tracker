import dayjs from 'dayjs';

import 'mocha';

import { expect } from '../../expect';

import Registry from '../../../src/ioc/Registry';
import ArchiveFolder from '../../../src/task/retention/ArchiveFolder';

describe('ArchiveFolder', () => {
  describe('constructor', () => {
    it('should create a valid archive folder', () => {
      let archiveFolder: any = new ArchiveFolder('A/B/C/D/E/F/2018/12/13');

      expect(archiveFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(archiveFolder._date.getFullYear()).to.equal(2018);
      expect(archiveFolder._date.getMonth()).to.equal(11);
      expect(archiveFolder._date.getDate()).to.equal(13);

      archiveFolder = new ArchiveFolder('A/B/C/D/E/F/2018/02/03');

      expect(archiveFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(archiveFolder._date.getFullYear()).to.equal(2018);
      expect(archiveFolder._date.getMonth()).to.equal(1);
      expect(archiveFolder._date.getDate()).to.equal(3);
    });

    it('should create a valid archive folder when no day', () => {
      let archiveFolder: any = new ArchiveFolder('A/B/C/D/E/F/2018/02');

      expect(archiveFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(archiveFolder._date.getFullYear()).to.equal(2018);
      expect(archiveFolder._date.getMonth()).to.equal(1);
      expect(archiveFolder._date.getDate()).to.equal(1);

      archiveFolder = new ArchiveFolder('A/B/C/D/E/F/2018/12');

      expect(archiveFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(archiveFolder._date.getFullYear()).to.equal(2018);
      expect(archiveFolder._date.getMonth()).to.equal(11);
      expect(archiveFolder._date.getDate()).to.equal(1);
    });

    it('should create a valid archive folder when no month', () => {
      const archiveFolder: any = new ArchiveFolder('A/B/C/D/E/F/2018');

      expect(archiveFolder._pathPrefix).to.equal('A/B/C/D/E/F/');
      expect(archiveFolder._date.getFullYear()).to.equal(2018);
      expect(archiveFolder._date.getMonth()).to.equal(0);
      expect(archiveFolder._date.getDate()).to.equal(1);
    });

    it('should not create aa archive folder when no path prefix', () => {
      expect(() => new ArchiveFolder('2018/12/13'))
        .to.throw('Path 2018/12/13 does not match pattern');
    });

    it('should raise an error when no valid archive folder found', () => {
      expect(() => new ArchiveFolder('A/B/C/D/E/F'))
        .to.throw('Path A/B/C/D/E/F does not match pattern ');
    });
  });

  describe('compare', () => {
    beforeEach(() => {
      Registry.clear();
      Registry.register('dayjs', dayjs);
    });

    it('should be possible to compare two backup folders', () => {
      let left = new ArchiveFolder('A/2018/12/11');
      let right = new ArchiveFolder('A/2019/12/11');

      expect(left.compare(right)).to.equal(-1);
      expect(right.compare(left)).to.equal(1);

      left = new ArchiveFolder('A/2018/02/05');
      right = new ArchiveFolder('A/2019/02/05');

      expect(left.compare(right)).to.equal(-1);
      expect(right.compare(left)).to.equal(1);
    });
  });

  describe('is', () => {
    it('should match same folder path (year, month, day)', () => {
      let folder = new ArchiveFolder('A/B/C/D/2018/12/11');
      expect(folder.is('2018/12/11')).to.be.true;
      expect(folder.is('2018/12')).to.be.false;

      folder = new ArchiveFolder('A/B/C/D/2018/02/09');
      expect(folder.is('2018/02/09')).to.be.true;
      expect(folder.is('2018/02')).to.be.false;
    });

    it('should match same folder path (year, month)', () => {
      let folder = new ArchiveFolder('A/B/C/D/2018/12');
      expect(folder.is('2018/12')).to.be.true;
      expect(folder.is('2018/12/21')).to.be.false;

      folder = new ArchiveFolder('A/B/C/D/2018/04');
      expect(folder.is('2018/04')).to.be.true;
      expect(folder.is('2018/04/03')).to.be.false;
    });

    it('should match same folder path (year)', () => {
      const folder = new ArchiveFolder('A/B/C/D/2018');
      expect(folder.is('2018')).to.be.true;
      expect(folder.is('2018/12')).to.be.false;
    });
  });
});
