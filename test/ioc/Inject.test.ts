import 'mocha';
import { expect, register } from '../expect';
import Inject, { InjectInstance } from '../../src/ioc/Inject';

describe('Inject', () => {
  class Test {
    @Inject()
    private test: any;

    getTest(): any {
      return this.test;
    }
  }

  class Test2 {
    @Inject('ref')
    private test: any;

    getTest(): any {
      return this.test;
    }
  }

  class Test3 {
    @InjectInstance('Test2')
    private test: any;

    getTest(): any {
      return this.test;
    }
  }

  class Test4 {
    @InjectInstance('Test2', 'refClass')
    private test: any;

    getTest(): any {
      return this.test;
    }
  }

  it('injecting a value to an object should be possible', () => {
    register('test', 12);
    const obj = new Test();
    expect(obj.getTest()).to.equal(12);
  });

  it('inject a value by specifying the reference of the value', () => {
    register('ref', 24);
    const obj = new Test2();
    expect(obj.getTest()).to.equal(24);
  });

  it('inject a new instance of a class', () => {
    register('ref', 36);
    register('test', {
      Test2: Test2
    });
    const obj = new Test3();
    expect(obj.getTest()).to.not.be.null;
    expect(obj.getTest().getTest()).to.equal(36);
  });

  it('inject a new instance of a class from a reference', () => {
    register('ref', 48);
    register('refClass', {
      Test2: Test2
    });
    const obj = new Test4();
    expect(obj.getTest()).to.not.be.null;
    expect(obj.getTest().getTest()).to.equal(48);
  });
});
