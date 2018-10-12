import 'mocha';

import * as crypto from 'crypto';

import { expect, register } from '../expect';

import DigestUtils from '../../src/utils/DigestUtils';

describe('DigestUtils', () => {
  let digestUtils: DigestUtils;

  beforeEach(() => {
    digestUtils = new DigestUtils('sha1', 'hex');
  });

  describe('digest', () => {
    it('should transform a string to sha1', () => {
      register('crypto', crypto);

      expect(digestUtils.digest('test')).to.equal('a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
    });
  });
});
