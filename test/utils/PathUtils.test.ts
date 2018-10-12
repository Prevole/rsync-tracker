import 'mocha';
import { expect } from '../expect';

import PathUtils from '../../src/utils/PathUtils';

describe('PathUtils', () => {
  describe('pathFromDate', () => {
    it('should pad part elements with 0', () => {
      const date = new Date(2018, 3, 2, 1);
      expect(new PathUtils().pathFromDate(date)).to.equal('2018/04/02/01');
    });

    it('should not pad part elements with 0', () => {
      const date = new Date(2018, 10, 12, 11);
      expect(new PathUtils().pathFromDate(date)).to.equal('2018/11/12/11');
    });
  });

  describe('avoidConflict', () => {
    it('should return next when previous is undefined', () => {
      const next = '2018/11/25/03';
      expect(new PathUtils().avoidConflict(undefined, next)).to.equal('2018/11/25/03');
    });

    it('should return next when previous is defined but not conflicting', () => {
      const next = '2018/11/25/03';
      const previous = '2018/11/25/02';
      expect(new PathUtils().avoidConflict(previous, next)).to.equal('2018/11/25/03');
    });

    it('should return next with a suffix when previous and next are equals and previous has no suffix', () => {
      const next = '2018/11/25/03';
      const previous = '2018/11/25/03';
      expect(new PathUtils().avoidConflict(previous, next)).to.equal('2018/11/25/03-1');
    });

    it('should return next with a suffix when previous and next are equals and previous already have a suffix', () => {
      const next = '2018/11/25/03';
      const previous = '2018/11/25/03-1';
      expect(new PathUtils().avoidConflict(previous, next)).to.equal('2018/11/25/03-2');
    });
  });
});
