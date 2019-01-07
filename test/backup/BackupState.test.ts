import 'mocha';

import BackupState from '../../src/backup/BackupState';

import { expect } from '../expect';

describe('BackupState', () => {
  describe('constructor', () => {
    it('should create an instance with all fields', () => {
      const state = new BackupState('name', 'next', 'previous');

      expect(state.name).to.equal('name');
      expect(state.next).to.equal('next');
      expect(state.previous).to.be.equal('previous');
    });
  });

  describe('previous', () => {
    it('should not have previous', () => {
      const state = new BackupState('name', 'next');
      expect(state.hasPrevious()).to.be.false;
      expect(state.previous).to.be.undefined;
    });

    it('should have previous', () => {
      const state = new BackupState('name', 'next', 'previous');
      expect(state.hasPrevious()).to.be.true;
      expect(state.previous).to.be.equal('previous');
    });
  });
});
