import 'mocha';

import { expect, register, sinon } from '../expect';

import FileUtils from '../../src/utils/FileUtils';

describe('FileUtils', () => {
  describe('resolve', () => {
    it('should return the resolved path for ~', () => {
      register('os', {
        homedir() { return 'home/dir'; }
      });

      const fileUtils = new FileUtils();

      const resolved = fileUtils.resolve('~/this/is/a/file/name');

      expect(resolved).to.equal('home/dir/this/is/a/file/name');
    });

    it('should not resolve ~ when not present', () => {
      const osStub: any = sinon.stub({
        homedir() {}
      });

      register('os', osStub);

      const fileUtils = new FileUtils();

      const resolved = fileUtils.resolve('this/is/a/file/name');

      expect(resolved).to.equal('this/is/a/file/name');
      expect(osStub.homedir).to.not.have.been.called;
    });
  });
});
