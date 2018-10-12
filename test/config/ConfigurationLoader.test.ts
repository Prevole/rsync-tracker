import 'mocha';

import { expect, register, sinon } from '../expect';

import Logger from '../../src/logging/Logger';
import FileUtils from '../../src/utils/FileUtils';
import NameUtils from '../../src/utils/NameUtils';
import ConfigurationLoader from '../../src/config/ConfigurationLoader';

describe('ConfigurationLoader', () => {
  describe('load', () => {
    let fsStub: any;
    let pathStub: any;
    let loggerStub: Logger;
    let yamlStub: any;
    let osStub: any;

    beforeEach(() => {
      fsStub = sinon.stub({
        readdirSync() {},
        readFileSync() {}
      });
      pathStub = sinon.stub({
        join() {},
        resolve() {}
      });
      loggerStub = sinon.createStubInstance(Logger);
      yamlStub = sinon.stub({ safeLoad() {} });
      osStub = sinon.stub({ homedir() {} });

      register('baseDir', 'home');
      register('fs', fsStub);
      register('path', pathStub);
      register('logger', loggerStub);
      register('yaml', yamlStub);
      register('os', osStub);
      register('nameUtils', new NameUtils());
      register('fileUtils', new FileUtils());
    });

    it('should load multiple configuration files', () => {
      fsStub.readdirSync.callsFake((dir: string) => {
        return [
          'file.yml',
          'secondFile.yml',
          'thirdFile.txt'
        ];
      });

      fsStub.readFileSync.callsFake((file: string) => {
        return ({
          'file.yml': {
            name: 'file',
            src: 'src',
            dest: 'dest'
          },
          'secondFile.yml': {
            name: 'secondFile',
            src: 'src',
            dest: 'dest'
          }
        } as any)[file];
      });

      pathStub.join.callsFake((...path: string[]) => path[1]);

      yamlStub.safeLoad.callsFake((content: any) => {
        return {
          definitions: [ content ]
        };
      });

      const loader = new ConfigurationLoader();

      const config = loader.load();

      expect(config.trackers).to.have.lengthOf(2);
    });

    it('should raise an error when config is duplicated', () => {
      fsStub.readdirSync.callsFake((dir: string) => {
        return [
          'file.yml',
          'secondFile.yml',
          'thirdFile.txt'
        ];
      });

      fsStub.readFileSync.callsFake((file: string) => {
        return ({
          'file.yml': [{
            name: 'file',
            src: 'src',
            dest: 'dest'
          }, {
            name: 'file',
            src: 'src',
            dest: 'dest'
          }]
        } as any)[file];
      });

      pathStub.join.callsFake((...path: string[]) => path[1]);

      yamlStub.safeLoad.callsFake((content: any) => {
        return {
          definitions: content
        };
      });

      const loader = new ConfigurationLoader();

      expect(() => {
        loader.load();
      }).to.throw('file tracker configuration already defined');
    });
  });
});
