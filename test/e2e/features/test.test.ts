/* tslint:disable:no-multi-spaces */
/* tslint expr: true*/
import 'mocha';

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import * as rmdir from 'rimraf';
import * as dotenv from 'dotenv';

import { expect } from '../../expect';

import RsyncTracker from '../../../src/RsyncTracker';
import Registry from '../../../src/ioc/Registry';

describe('RsyncTracker', function() {
  const firstBackupDirName  = '30f6e7fbf3eb5d3a80e8b1359863aa84cdb288d6';
  const secondBackupDirName = '6996a4f7542d396d5bf6e32e9cf32977690a303a';
  const thirdBackupDirName  = 'abe99c6af7b3b6c55bf4bf75b253a1cf7a1017c0';

  const firstFirstFileSum   = '4e1243bd22c66e76c2ba9eddc1f91394e57f9f83'; // first/a/test.txt
  const firstSecondFileSum  = '3e7c9b1bbc908867af8acb8a7245d0cde44a7d87'; // first/b/test.txt

  const secondFirstFileSum  = '2dee785862afc3a72c29d7397f5650e885f7263f'; // second/a/b/c/d/e/f/test-1.txt
  const secondSecondFileSum = '7c2e2a2827062d0ad79965b98bbb94a4c4ffcff2'; // second/a/b/c/d/e/f/test-2.txt

  const thirdFirstFileSum   = '7c2e2a2827062d0ad79965b98bbb94a4c4ffcff2'; // third/a/test.txt
  const thirdSecondFileSum  = 'fa1ea636f9ef6255228ca043eb282b5b208d8411'; // third/a/b/test.txt

  const baseDir = path.resolve('./test/e2e/features');
  const outputDir = `${baseDir}/output`;
  const envFile = `${baseDir}/.env`;
  const backupDir = `${outputDir}/bck`;
  const logsDir = `${outputDir}/logs`;

  const firstDir = `${outputDir}/first`;
  const secondDir = `${outputDir}/second`;
  const thirdDir = `${outputDir}/third`;

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

  function registryCleanup() {
    Registry.clear('baseDir');
    Registry.clear('backupDir');
    Registry.clear('logDir');
    Registry.clear('consoleLogs');
    Registry.clear('rsyncBin');
    Registry.clear('sshBin');
  }

  function readAndSha1(file: string) {
    return crypto
      .createHash('sha1')
      .update(fs.readFileSync(file, 'utf8'))
      .digest('hex');
  }

  beforeEach(function() {
    rmdir.sync(outputDir);

    if (fs.existsSync(envFile)) {
      fs.unlinkSync(envFile);
    }

    Registry.clear();

    fs.mkdirSync(outputDir);
    fs.mkdirSync(backupDir);
    fs.mkdirSync(logsDir);

    fs.writeFileSync(envFile, envFileContent);

    dotenv.config({ path: envFile });

    Registry.register('os', os);
    Registry.register('dateUtils', dateUtils);
  });

  afterEach(function() {
    // if (this.currentTest.state === 'passed') {
    //   rmdir.sync(outputDir);
    // }

    fs.unlinkSync(envFile);
  });

  it('should do something', function() {
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

      expect(fs.existsSync(thirdDir)).to.be.true;

      const thirdFirstFile = `${thirdDir}/a/test.txt`;
      expect(fs.existsSync(thirdFirstFile)).to.be.true;
      expect(readAndSha1(thirdFirstFile)).to.eq(thirdFirstFileSum);

      const thirdSecondFile = `${thirdDir}/a/b/test.txt`;
      expect(fs.existsSync(thirdSecondFile)).to.be.true;
      expect(readAndSha1(thirdSecondFile)).to.eq(thirdSecondFileSum);
    }

    dateUtils.now = () => {
      return new Date(2018, 11, 31, 23, 0, 0);
    };

    RsyncTracker.main();

    expect(fs.readFileSync(`${backupDir}/${firstBackupDirName}/name`, 'utf8'))
      .to.be.eq(`${baseDir}/config/config-1.yml::First`);

    expect(fs.readFileSync(`${backupDir}/${secondBackupDirName}/name`, 'utf8'))
      .to.be.eq(`${baseDir}/config/config-1.yml::Second`);
    expect(fs.readFileSync(`${backupDir}/${secondBackupDirName}/last`, 'utf8')).to.be.eq('2018/12/31/23');

    expect(fs.readFileSync(`${backupDir}/${thirdBackupDirName}/name`, 'utf8'))
      .to.be.eq(`${baseDir}/config/config-2.yml::Third`);

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
