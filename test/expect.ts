import Registry from '../src/ioc/Registry';
import * as chai from 'chai';
import * as sin from 'sinon';
import * as sinonChai from 'sinon-chai';

export const expect = chai.expect;
export const sinon = sin;

chai.use(sinonChai);

export const register = Registry.register;

beforeEach(() => {
  Registry.clear();
});
