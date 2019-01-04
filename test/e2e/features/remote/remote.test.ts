/* tslint:disable:no-multi-spaces */
/* tslint expr: true*/
import 'mocha';

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as rmdir from 'rimraf';
import * as dotenv from 'dotenv';
import * as originalOs from 'os';
import Docker, { Container, ContainerInfo } from 'dockerode';

import { expect } from '../../../expect';

import RsyncTracker from '../../../../src/RsyncTracker';
import Registry from '../../../../src/ioc/Registry';

describe('RsyncTracker - Remote', function() {
  const firstBackupDirName  = '016573e6f5da25582f9a3f466f0bf1e458c710f3';
  const secondBackupDirName = '2fc5777a10b4894b12f1561249fb2897039a72fd';

  const firstFirstFileSum   = '4e1243bd22c66e76c2ba9eddc1f91394e57f9f83'; // first/a/test.txt
  const firstSecondFileSum  = '3e7c9b1bbc908867af8acb8a7245d0cde44a7d87'; // first/b/test.txt

  const secondFirstFileSum  = '2dee785862afc3a72c29d7397f5650e885f7263f'; // second/a/b/c/d/e/f/test-1.txt
  const secondSecondFileSum = '7c2e2a2827062d0ad79965b98bbb94a4c4ffcff2'; // second/a/b/c/d/e/f/test-2.txt

  const baseDir = path.resolve('./test/e2e/features/remote');
  const outputDir = `${baseDir}/output`;
  const backupDir = `${outputDir}/bck`;
  const logsDir = `${outputDir}/logs`;
  const sshDir = `${baseDir}/ssh`;

  const envFile = `${baseDir}/.env`;
  const authorizedKeysFile = `${sshDir}/authorized_keys`;

  const firstDir = `${outputDir}/first`;
  const secondDir = `${outputDir}/second`;

  const envFileContent = `RT_BCK_DIR=${backupDir}
RT_BASE_DIR=${baseDir}/config
RT_LOGS_DIR=${logsDir}
RT_LOGS_TO_CONSOLE=true`;

  const os = {
    homedir: () => {
      return baseDir;
    }
  };

  const dateUtils = {
    now: () => {}
  };

  const docker = new Docker();
  let container: Container;

  function registryCleanup() {
    Registry.clear('baseDir');
    Registry.clear('backupDir');
    Registry.clear('logDir');
    Registry.clear('consoleLogs');
    Registry.clear('rsyncBin');
    Registry.clear('sshBin');
  }

  function fileCleanUp() {
    rmdir.sync(outputDir);

    if (fs.existsSync(envFile)) {
      fs.unlinkSync(envFile);
    }

    if (fs.existsSync(authorizedKeysFile)) {
      fs.unlinkSync(authorizedKeysFile);
    }
  }

  function readAndSha1(file: string) {
    return crypto
      .createHash('sha1')
      .update(fs.readFileSync(file, 'utf8'))
      .digest('hex');
  }

  beforeEach(function(done) {
    this.timeout(60000);

    docker
      .pull('panubo/sshd', {})
      .then(function() {
        done();
      });
  });

  beforeEach(function(done) {
    this.timeout(5000);

    fileCleanUp();

    Registry.clear();

    fs.mkdirSync(outputDir);
    fs.mkdirSync(backupDir);
    fs.mkdirSync(logsDir);

    const pubKey = fs.readFileSync(`${originalOs.homedir()}/.ssh/id_rsa.pub`, 'utf8');
    fs.writeFileSync(`${sshDir}/authorized_keys`, pubKey, 'utf8');

    fs.writeFileSync(envFile, envFileContent);

    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    for (let k in envConfig) {
      process.env[k] = envConfig[k];
    }

    Registry.register('os', os);
    Registry.register('dateUtils', dateUtils);

    function startCreateAndStartContainer() {
      function sleep(ms: number) {
        return new Promise(function(resolve) {
          setTimeout(resolve, ms);
        });
      }

      return docker
        .createContainer({
          name: 'rsync_tracker_sshd',
          Image: 'panubo/sshd',
          Env: [
            `SSH_USERS=tester:${originalOs.userInfo().uid}:1001`
          ],
          HostConfig: {
            Binds: [
              `${authorizedKeysFile}:/etc/authorized_keys/tester`,
              `${sshDir}/host_keys:/etc/ssh/keys`,
              `${outputDir}:/output`
            ],
            PortBindings: {
              '22/tcp': [{
                HostPort: '11022'
              }]
            }
          }
        })
        .then(function(container: Container) {
          return container.start();
        })
        .then(async function(cont: Container) {
          container = cont;
          await sleep(2000);
          done();
        });
    }

    docker.
      listContainers({ filters: { name: [ 'rsync_tracker_sshd' ] } })
      .then(function(containers: ContainerInfo[]) {
        if (containers.length > 0) {
          return docker
            .getContainer(containers[0].Id)
            .remove({ force: true }, startCreateAndStartContainer);
        } else {
          return startCreateAndStartContainer();
        }
      });
  });

  afterEach(function(done) {
    const self = this;

    if (self.currentTest.state === 'passed') {
      container
        .remove({ force: true })
        .then(function() {
          fileCleanUp();
          done();
        });
    } else {
      done();
    }
  });

  it('should manage rsync remotely', function() {
    this.timeout(40000);

    function check(secondDirRound: string, secondBackupPrefix: string) {
      expect(fs.existsSync(firstDir)).to.be.true;

      const firstFirstFile = `${firstDir}/a/test.txt`;
      expect(fs.existsSync(firstFirstFile)).to.be.true;
      expect(readAndSha1(firstFirstFile)).to.eq(firstFirstFileSum);

      const firstSecondFile = `${firstDir}/b/test.txt`;
      expect(fs.existsSync(firstSecondFile)).to.be.true;
      expect(readAndSha1(firstSecondFile)).to.eq(firstSecondFileSum);

      expect(fs.existsSync(secondDir)).to.be.true;

      const secondFirstFile = `${secondDir}/${secondBackupPrefix}/${secondDirRound}/a/b/c/d/e/f/test-1.txt`;
      expect(fs.existsSync(secondFirstFile)).to.be.true;
      expect(readAndSha1(secondFirstFile)).to.eq(secondFirstFileSum);

      const secondSecondFile = `${secondDir}/${secondBackupPrefix}/${secondDirRound}/a/b/c/d/e/f/test-2.txt`;
      expect(fs.existsSync(secondSecondFile)).to.be.true;
      expect(readAndSha1(secondSecondFile)).to.eq(secondSecondFileSum);
    }

    dateUtils.now = () => {
      return new Date(2018, 11, 31, 23, 0, 0);
    };

    RsyncTracker.main();

    expect(fs.readFileSync(`${backupDir}/${firstBackupDirName}/name`, 'utf8'))
      .to.be.eq(`${baseDir}/config/config.yml::First`);

    expect(fs.readFileSync(`${backupDir}/${secondBackupDirName}/name`, 'utf8'))
      .to.be.eq(`${baseDir}/config/config.yml::Second`);
    expect(fs.readFileSync(`${backupDir}/${secondBackupDirName}/last`, 'utf8')).to.be.eq('2018/12/31/23');

    check('23', '2018/12/31');

    for (let i = 1; i <= 5; i++) {
      registryCleanup();
      RsyncTracker.main();

      check(`23-${i}`, '2018/12/31');
    }

    dateUtils.now = () => {
      return new Date(2019, 0, 1, 0, 0, 0);
    };

    registryCleanup();
    RsyncTracker.main();

    check('00', '2019/01/01');
  });
});
