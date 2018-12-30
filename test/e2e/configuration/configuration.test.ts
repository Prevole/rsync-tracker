/* tslint expr: true*/
import 'mocha';

import { expect } from '../../expect';

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import ConfigurationLoader from '../../../src/config/ConfigurationLoader';
import FileUtils from '../../../src/utils/FileUtils';
import NameUtils from '../../../src/utils/NameUtils';
import Configuration from '../../../src/config/Configuration';
import Registry from '../../../src/ioc/Registry';

describe('configuration', () => {
  it('should load the configuration', () => {
    const baseDir = path.join(__dirname, 'samples');
    const nameUtils = new NameUtils();

    Registry.register('rsyncBin', '/usr/local/bin/rsync');
    Registry.register('sshBin', '/usr/bin/ssh');
    Registry.register('fs', fs);
    Registry.register('path', path);
    Registry.register('yaml', yaml);
    Registry.register('os', { homedir: () => '/home' });
    Registry.register('fileUtils', new FileUtils());
    Registry.register('nameUtils', nameUtils);
    Registry.register('logger', { info: (str: string) => console.log(str) });
    Registry.register('baseDir', baseDir);

    const configuration: Configuration = new ConfigurationLoader().load();

    expect(configuration.toJson()).to.deep.equal([
      {
        name: nameUtils.name(path.join(baseDir, 'config-1.yml'), 'User Fonts 2'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Library/Fonts',
          dest: '/home/repos/private/applications-preferences/Apple',
          mode: 'sync',
          createDest: false,
          args: '-r',
          excludes: []
        },
        ssh: undefined
      }, {
        name: nameUtils.name(path.join(baseDir, 'config-1.yml'),'Mail signatures'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Library/Mail/V2/MailData/Signatures',
          dest: '/home/repos/private/applications-preferences/Apple/Mail',
          mode: 'sync',
          createDest: false,
          args: '-r --delete',
          excludes: [
            'AccountsMap.plist',
            'SignaturesByAccount.plist'
          ]
        },
        ssh: undefined
      }, {
        name: nameUtils.name(path.join(baseDir, 'config-1.yml'),'Backup'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Documents/personal',
          dest: 'user@host::some/path/{dest}',
          mode: 'backup',
          createDest: false,
          args: '-avh --delete -e \'ssh -p 1234\'',
          excludes: [
            '.DS_Store'
          ],
          hardlinks: '../../../../'
        },
        ssh: {
          bin: '/usr/bin/ssh',
          args: 'user@host -p1235',
          dest: '/some/path/{dest}'
        }
      }, {
        name: nameUtils.name(path.join(baseDir, 'config-2.yml'), 'User Fonts'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Library/Fonts',
          dest: '/home/repos/private/applications-preferences/Apple',
          mode: 'sync',
          createDest: false,
          args: '-r',
          excludes: []
        },
        ssh: undefined
      }, {
        name: nameUtils.name(path.join(baseDir, 'config-2.yml'),'iTerm 2 Preferences'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Library/Preferences/com.googlecode.iterm2.plist',
          dest: '/home/repos/private/applications-preferences/iTerm/com.googlecode.iterm2.plist',
          mode: 'sync',
          createDest: false,
          args: undefined,
          excludes: []
        },
        ssh: undefined
      }, {
        name: nameUtils.name(path.join(baseDir, 'config-2.yml'),'Backup'),
        rsync: {
          bin: '/usr/local/bin/rsync',
          src: '/home/Documents/personal/',
          dest: 'user@host::some/path/{dest}',
          mode: 'backup',
          createDest: false,
          args: '-avh --delete -e \'ssh -p 1234\'',
          excludes: [
            '.DS_Store'
          ],
          hardlinks: '../../../../'
        },
        ssh: {
          bin: '/usr/bin/ssh',
          args: 'user@host -p1235',
          dest: '/some/path/{dest}'
        }
      }
    ]);
  });
});
