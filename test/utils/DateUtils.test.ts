import 'mocha';

import { expect } from '../expect';

import DateUtils from '../../src/utils/DateUtils';

describe('DateUtils', () => {
  describe('now', () => {
    it('should return a Date object representing the date of today', () => {
      const dateUtils = new DateUtils();

      const referenceDate = new Date();

      const now = dateUtils.now();

      expect(now).to.be.instanceof(Date);
      expect(now.getFullYear()).to.equal(referenceDate.getFullYear());
      expect(now.getMonth()).to.equal(referenceDate.getMonth());
      expect(now.getDate()).to.equal(referenceDate.getDate());
      expect(now.getHours()).to.equal(referenceDate.getHours());
    });
  });
});
