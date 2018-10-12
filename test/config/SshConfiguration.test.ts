import 'mocha';

import { expect, register, sinon } from '../expect';

import FileUtils from '../../src/utils/FileUtils';
import SshConfiguration from '../../src/config/SshConfiguration';

describe('SshConfiguration', () => {
  describe('constructor', () => {
    it('should prepare a default configuration', () => {
      register('sshBin', '/bin/ssh');

      const config = new SshConfiguration({
        dest: 'destination',
        args: '-p 1234'
      });

      expect(config.dest).to.equal('destination');
      expect(config.args).to.equal('-p 1234');
      expect(config.bin).to.equal('/bin/ssh');
    });
  });

  describe('toJson', () => {
    it('should return json object with hardlinks configured', () => {
      register('sshBin', '/bin');

      const config = new SshConfiguration({
        dest: 'destination',
        args: '-p 1234'
      });

      const json = config.toJson();

      expect(json).to.deep.equal({
        dest: 'destination',
        bin: '/bin',
        args: '-p 1234'
      });
    });
  });
});
