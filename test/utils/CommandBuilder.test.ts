import 'mocha';

import { expect } from '../expect';

import CommandBuilder from '../../src/utils/CommandBuilder';

describe('CommandBuilder', () => {
  let commandBuilder: CommandBuilder;

  beforeEach(() => {
    commandBuilder = new CommandBuilder();
  });

  describe('push', () => {
    it('should push only when value is not undefined', () => {
      commandBuilder.push(undefined);
      expect((commandBuilder as any).parts).to.deep.equal([]);

      commandBuilder.push('test');
      expect((commandBuilder as any).parts).to.deep.equal([ 'test' ]);
    });
  });

  describe('pushPattern', () => {
    it('should push only when value is not undefined', () => {
      commandBuilder.pushPattern('pattern=%s', undefined);
      expect((commandBuilder as any).parts).to.deep.equal([]);

      commandBuilder.pushPattern('pattern=%s,%s', 'test');
      expect((commandBuilder as any).parts).to.deep.equal([ 'pattern=test,test' ]);
    });
  });

  describe('pushCollection', () => {
    it('should push only when values is not undefined', () => {
      commandBuilder.pushCollection(undefined);
      expect((commandBuilder as any).parts).to.deep.equal([]);

      commandBuilder.pushCollection([ 'test1', 'test2' ]);
      expect((commandBuilder as any).parts).to.deep.equal([ 'test1', 'test2' ]);
    });
  });

  describe('pushCollectionPattern', () => {
    it('should push only when values is not undefined', () => {
      commandBuilder.pushCollectionPattern('pattern=%s', undefined);
      expect((commandBuilder as any).parts).to.deep.equal([]);

      commandBuilder.pushCollectionPattern('pattern=%s,%s', [ 'test1', 'test2']);
      expect((commandBuilder as any).parts).to.deep.equal([
        'pattern=test1,test1',
        'pattern=test2,test2'
      ]);
    });
  });

  describe('build', () => {
    it('should prepare the final command based on each parts', () => {
      const command = commandBuilder
        .push('value1')
        .pushPattern('--arg=%s', 'value2')
        .pushCollection([ 'value3', 'value4' ])
        .pushCollectionPattern('--arg-n=%s', [ 'value5', 'value6' ])
        .build();

      expect(command).to.equal('value1 --arg=value2 value3 value4 --arg-n=value5 --arg-n=value6');
    });
  });
});
