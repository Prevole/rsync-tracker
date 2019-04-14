import RetentionPolicyConfiguration from '../../config/RetentionPolicyConfiguration';
import Inject from '../../ioc/Inject';

export default class RetentionPoliciesClassifier {
  private readonly _now: Date;

  private readonly _policies: RetentionPolicyConfiguration[];

  @Inject()
  private dayjs!: any;

  constructor(policies: RetentionPolicyConfiguration[], now: Date) {
    if (policies.length === 0) {
      throw new Error('The policies must contain at least one constraint');
    }

    this._now = now;

    this._policies = [...policies].sort(
      (left: RetentionPolicyConfiguration, right: RetentionPolicyConfiguration) => {
        const leftDate = this.dayjs(this._now).subtract(left.older.quantity, left.older.unit);
        const rightDate = this.dayjs(this._now).subtract(right.older.quantity, right.older.unit);
        return leftDate.isBefore(rightDate);
      }
    );
  }

  get mostConstrainingPolicy(): RetentionPolicyConfiguration {
    return this._policies[0];
  }

  get morePermissivePolicies(): RetentionPolicyConfiguration[] {
    return this._policies.slice(1);
  }
}
