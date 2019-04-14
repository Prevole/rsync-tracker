import 'mocha';
import FileUtils from '../../src/utils/FileUtils';

import { expect, register, sinon } from '../expect';

import TrackerConfiguration from '../../src/config/TrackerConfiguration';

describe('TrackerConfiguration', () => {
  describe('constructor', () => {
    it('should prepare the configuration', () => {
      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: 'source',
          dest: 'destination'
        }
      );

      expect(config.name).to.equal('configName');
      expect(config.sshConfig).to.be.null;
      expect(config.rsyncConfig.src).to.equal('source');
    });

    it('should prepare a configuration with ssh part', () => {
      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: 'source',
          dest: 'destination',
          ssh: {
            dest: 'remote',
            args: '-p 1234'
          }
        }
      );

      expect(config.name).to.equal('configName');
      expect(config.sshConfig.dest).to.equal('remote');
      expect(config.rsyncConfig.src).to.equal('source');
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

    it('should resolve in cascade', () => {
      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: '~/source',
          dest: '~/destination',
          ssh: {
            dest: 'remote',
            args: '-p 1234'
          }
        }
      ).resolve();

      expect(config.rsyncConfig.dest).to.equal('home/dir/destination');
      expect(config.sshConfig.dest).to.equal('remote');
    });
  });

  describe('shouldCreateDest', () => {
    it('should get the is createDest', () => {
      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: '~/source',
          dest: '~/destination',
          rsync: {
            createDest: true
          }
        }
      );

      expect(config.shouldCreateDest()).to.be.true;
    });
  });

  describe('isSsh', () => {
    it('should be ssh when configuration is present', () => {
      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: '~/source',
          dest: '~/destination',
          ssh: {
            dest: 'remote',
            args: '-p 1234'
          }
        }
      );

      expect(config.isSsh()).to.be.true;
    });
  });

  describe('toJson', () => {
    it('should serialize', () => {
      register('rsyncBin', 'bin/rsync');
      register('sshBin', 'bin/ssh');

      const config = new TrackerConfiguration(
        'configName',
        {
          name: 'configName',
          src: '~/source',
          dest: '~/destination',
          ssh: {
            dest: 'remote',
            args: '-p 1234'
          }
        }
      );

      expect(config.toJson()).to.deep.equal({
        name: 'configName',
        rsync: {
          archivesArgs: undefined,
          archivesDirName: undefined,
          archivesExcludes: [],
          args: undefined,
          bin: 'bin/rsync',
          createDest: false,
          dest: '~/destination',
          excludes: [],
          mode: 'sync',
          src: '~/source'
        },
        ssh: {
          args: '-p 1234',
          bin: 'bin/ssh',
          dest: 'remote'
        }
      });
    });
  });
});
