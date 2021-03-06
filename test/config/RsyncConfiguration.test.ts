import 'mocha';
import FileUtils from '../../src/utils/FileUtils';

import { expect, register, sinon } from '../expect';

import RsyncConfiguration, { RsyncMode } from '../../src/config/RsyncConfiguration';

describe('RsyncConfiguration', () => {
  describe('constructor', () => {
    it('should prepare a default configuration when only source and destination are provided', () => {
      const config = new RsyncConfiguration('source', 'destination');

      expect(config.src).to.equal('source');
      expect(config.dest).to.equal('destination');
      expect(config.hardLinks).to.be.undefined;
      expect(config.args).to.be.undefined;
      expect(config.excludes).to.be.deep.equal([]);
      expect(config.mode).to.equal(RsyncMode.SYNC);
      expect(config.isCreateDest).to.be.false;
    });

    it('should prepare a default configuration when config object is empty', () => {
      const config = new RsyncConfiguration('source', 'destination', {});

      expect(config.src).to.equal('source');
      expect(config.dest).to.equal('destination');
      expect(config.hardLinks).to.be.undefined;
      expect(config.args).to.be.undefined;
      expect(config.excludes).to.be.deep.equal([]);
      expect(config.mode).to.equal(RsyncMode.SYNC);
      expect(config.isCreateDest).to.be.false;
    });

    it('should set the different configuration values', () => {
      const config = new RsyncConfiguration(
        'source',
        'destination',
        {
          mode: 'backup',
          args: '-d -b -a',
          excludes: [
            'a',
            'b',
            'c'
          ],
          hardlinks: {
            basePath: 'path'
          },
          createDest: true
        }
      );

      expect(config.src).to.equal('source');
      expect(config.dest).to.equal('destination');
      expect(config.hardLinks).to.equal('path');
      expect(config.args).to.equal('-d -b -a');
      expect(config.excludes).to.be.deep.equal([ 'a', 'b', 'c' ]);
      expect(config.mode).to.equal(RsyncMode.BACKUP);
      expect(config.isCreateDest).to.be.true;
    });
  });

  describe('bin', () => {
    it('should be possible to retrieve the rsync bin', () => {
      register('rsyncBin', '/rsync/bin');
      const config = new RsyncConfiguration('source', 'destination');
      expect(config.bin).to.equal('/rsync/bin');
    });
  });

  describe('resolve', () => {
    let pathStub: any;
    let osStub: any;

    beforeEach(() => {
      pathStub = sinon.stub({ resolve() {} });
      osStub = sinon.stub({ homedir() {} });

      pathStub.resolve.callsFake((path: string) => path.replace(/\/$/, ''));
      osStub.homedir.callsFake(() => 'home/dir');

      register('os', osStub);
      register('path', pathStub);
      register('fileUtils', new FileUtils());
    });

    it('should resolves source and destination path', () => {
      let config = new RsyncConfiguration('~/source', 'destination').resolve();

      expect(config.src).to.equal('home/dir/source');
      expect(config.dest).to.equal('destination');

      config = new RsyncConfiguration('/test/source/', '~/destination/{dest}').resolve();

      expect(config.src).to.equal('/test/source/');
      expect(config.dest).to.equal('home/dir/destination/{dest}');
    });
  });

  describe('toJson', () => {
    it('should return json object', () => {
      register('rsyncBin', '/bin');

      const config = new RsyncConfiguration('source', 'destination');

      const json = config.toJson();

      expect(json).to.deep.equal({
        src: 'source',
        dest: 'destination',
        mode: 'sync',
        bin: '/bin',
        args: undefined,
        createDest: false,
        excludes: []
      });
    });

    it('should return json object with hardlinks configured', () => {
      register('rsyncBin', '/bin');

      const config = new RsyncConfiguration(
        'source',
        'destination',
        {
          hardlinks: {
            basePath: 'hard/link/path'
          }
        }
      );

      const json = config.toJson();

      expect(json).to.deep.equal({
        src: 'source',
        dest: 'destination',
        mode: 'sync',
        bin: '/bin',
        args: undefined,
        createDest: false,
        excludes: [],
        hardlinks: 'hard/link/path'
      });
    });
  });
});
