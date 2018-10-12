import 'mocha';

import { expect } from '../expect';

import NameUtils from '../../src/utils/NameUtils';

describe('NameUtils', () => {
  describe('name', () => {
    it('should return name which is the concatenation of a file path and a free name', () => {
      const nameUtils = new NameUtils();

      const name = nameUtils.name('this/is/a/file/name', 'configName');

      expect(name).to.equal('this/is/a/file/name::configName');
    });
  });
});
