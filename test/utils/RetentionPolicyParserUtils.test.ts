import 'mocha';
import { expect } from '../expect';

import { RetentionGroupBy } from '../../src/config/RetentionPolicyConfiguration';
import RetentionPolicyParserUtils from '../../src/utils/RetentionPolicyParserUtils';

describe('RetentionPolicyParserUtils', () => {
  describe('parse', () => {
    it('should parse a retention expression', () => {
      const expr = '3 years';
      const parsed = new RetentionPolicyParserUtils().parse(expr);
      expect(parsed).to.deep.equal({
        unit: RetentionGroupBy.YEAR,
        quantity: 3
      });
    });
  });
});
