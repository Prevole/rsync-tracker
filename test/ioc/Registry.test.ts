/* tslint expr: true*/
import 'mocha';
import { expect } from '../expect';
import Registry from '../../src/ioc/Registry';

describe('Registry', () => {
  beforeEach(() => {
    Registry.clear();
  });

  it('should be possible to register a dependency', () => {
    Registry.register('test', 1);
    expect(Registry.get('test')).to.equal(1);
  });

  it('should not be possible to register a dependency twice', () => {
    Registry.register('test', 1);
    try {
      Registry.register('test', 1);
    } catch (err) {
      expect(err.message).to.equal('test is already registered');
    }
  });

  it('should be possible to register a dependency when not exist', () => {
    Registry.registerIfNotExist('test', 1);
    expect(Registry.get('test')).to.equal(1);

    Registry.registerIfNotExist('test', 2);
    expect(Registry.get('test')).to.equal(1);
  });

  it('should return undefined dependency when not registered', () => {
    expect(Registry.get('test')).to.be.undefined;
  });

  it('should not return a registered dependency when all dependencies are cleared', () => {
    Registry.register('test', 2);
    expect(Registry.get('test')).to.equal(2);
    Registry.clear();
    expect(Registry.get('test')).to.be.undefined;
  });

  it('should be possible to remove one dependency at a time', () => {
    Registry.register('test1', 1);
    Registry.register('test2', 2);

    expect(Registry.get('test1')).to.be.eq(1);
    expect(Registry.get('test2')).to.be.eq(2);

    Registry.clear('test1');

    expect(Registry.get('test1')).to.be.undefined;
    expect(Registry.get('test2')).to.be.eq(2);
  });
});
