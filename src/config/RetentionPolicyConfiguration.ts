import Inject from '../ioc/Inject';
import RetentionPolicyParserUtils, { RetentionPolicyOlder } from '../utils/RetentionPolicyParserUtils';

export default class RetentionPolicyConfiguration {
  private readonly _groupBy: RetentionGroupBy;
  private readonly _older: RetentionPolicyOlder;

  @Inject()
  private retentionPolicyParserUtils!: RetentionPolicyParserUtils;

  constructor(rawConfig: RawRetentionPolicyConfiguration) {
    this._groupBy = RetentionGroupBy[rawConfig.groupBy.toUpperCase() as keyof typeof RetentionGroupBy];
    this._older = this.retentionPolicyParserUtils.parse(rawConfig.older);
  }

  get groupBy(): RetentionGroupBy {
    return this._groupBy;
  }

  get older(): RetentionPolicyOlder {
    return this._older;
  }

  toJson(): any {
    return {
      groupBy: this._groupBy,
      older: this._older
    };
  }
}

export enum RetentionGroupBy {
  YEAR = 'year',
  MONTH = 'month',
  DAY = 'day'
}

export type RawRetentionPolicyConfiguration = {
  groupBy: string,
  older: string
};
