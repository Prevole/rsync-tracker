import dayjs, { UnitType } from 'dayjs';

import 'mocha';

import Registry from '../../../src/ioc/Registry';
import RetentionPolicyConfiguration, { RetentionGroupBy } from '../../../src/config/RetentionPolicyConfiguration';
import RetentionPoliciesClassifier from '../../../src/task/retention/RetentionPoliciesClassifier';
import RetentionPolicyParserUtils from '../../../src/utils/RetentionPolicyParserUtils';

import { expect } from '../../expect';

describe('RetentionPoliciesClassifier', () => {
  const now = new Date(2019, 0, 14, 23);

  let policies: RetentionPolicyConfiguration[];

  beforeEach(() => {
    Registry.clear();
    Registry.register('dayjs', dayjs);
    Registry.register('retentionPolicyParserUtils', new RetentionPolicyParserUtils());

    policies = [];

    policies.push(new RetentionPolicyConfiguration({
      groupBy: 'day',
      older: '10 days'
    }));

    policies.push(new RetentionPolicyConfiguration({
      groupBy: 'year',
      older: '1 year'
    }));

    policies.push(new RetentionPolicyConfiguration({
      groupBy: 'month',
      older: '3 months'
    }));
  });

  describe('constructor', () => {
    it('should create a valid backup folder', () => {
      const classifier = new RetentionPoliciesClassifier(policies, now);

      expect((classifier as any)._policies.map((config: RetentionPolicyConfiguration) => config.toJson()))
        .to.deep.equal([{
          groupBy: RetentionGroupBy.DAY,
          older: {
            unit: RetentionGroupBy.DAY,
            quantity: 10
          }
        }, {
          groupBy: RetentionGroupBy.MONTH,
          older: {
            unit: RetentionGroupBy.MONTH,
            quantity: 3
          }
        }, {
          groupBy: RetentionGroupBy.YEAR,
          older: {
            unit: RetentionGroupBy.YEAR,
            quantity: 1
          }
        }]);
    });

    it('should raise an error when no policies are provided', () => {
      expect(() => new RetentionPoliciesClassifier([], new Date()))
        .to.throw('The policies must contain at least one constraint');
    });
  });

  describe('mostConstrainingPolicy', () => {
    it('should be possible to get the most constraining policy', () => {
      const classifier = new RetentionPoliciesClassifier(policies, now);
      expect(classifier.mostConstrainingPolicy.toJson()).to.deep.equal({
        groupBy: RetentionGroupBy.DAY,
        older: {
          unit: RetentionGroupBy.DAY,
          quantity: 10
        }
      });
    });
  });

  describe('morePermissivePolicies', () => {
    it('should be possible to get the more permissive policies when they exist', () => {
      const classifier = new RetentionPoliciesClassifier(policies, now);
      expect(classifier.morePermissivePolicies.map((config: RetentionPolicyConfiguration) => config.toJson()))
        .to.deep.equal([{
          groupBy: RetentionGroupBy.MONTH,
          older: {
            unit: RetentionGroupBy.MONTH,
            quantity: 3
          }
        }, {
          groupBy: RetentionGroupBy.YEAR,
          older: {
            unit: RetentionGroupBy.YEAR,
            quantity: 1
          }
        }]);
    });
  });
});
