import { RetentionGroupBy } from '../config/RetentionPolicyConfiguration';

export default class RetentionPolicyParserUtils {
  parse(expression: string): RetentionPolicyOlder {
    const parts = expression.split(' ');
    const quantity = parseInt(parts[0], 10);
    const unitString = parts[1].replace(/s$/, '').toUpperCase();
    const unit = RetentionGroupBy[unitString as keyof typeof RetentionGroupBy];

    return {
      unit: unit,
      quantity: quantity
    };
  }
}

export type RetentionPolicyOlder = {
  unit: RetentionGroupBy,
  quantity: number
};
