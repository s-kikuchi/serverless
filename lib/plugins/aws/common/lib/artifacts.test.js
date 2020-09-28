'use strict';

const expect = require('chai').expect;
const path = require('path');
const fse = require('fs-extra');
const AWSCommon = require('../index');
const Serverless = require('../../../../../lib/Serverless');
const { getTmpDirPath } = require('../../../../../test/utils/fs');

describe('#moveArtifactsToPackage()', () => {
  let serverless;
  let awsCommon;
  const moveBasePath = path.join(getTmpDirPath(), 'move');
  const moveServerlessPath = path.join(moveBasePath, '.serverless');

  beforeEach(() => {
    serverless = new Serverless();
    awsCommon = new AWSCommon(serverless, {});

    serverless.config.servicePath = moveBasePath;
    if (!serverless.utils.dirExistsSync(moveServerlessPath)) {
      serverless.utils.writeFileDir(moveServerlessPath);
    }
  });

  afterEach(() => {
    if (serverless.utils.dirExistsSync(moveBasePath)) {
      fse.removeSync(moveBasePath);
    }
  });

  it('should resolve if servicePath is not present', () => {
    delete serverless.config.servicePath;
    return awsCommon.moveArtifactsToPackage();
  });

  it('should resolve if no package is set', () => awsCommon.moveArtifactsToPackage());

  it('should use package option as target', () => {
    const testFileSource = path.join(moveServerlessPath, 'moveTestFile.tmp');
    const targetPath = path.join(moveBasePath, 'target');

    awsCommon.options.package = targetPath;
    serverless.utils.writeFileSync(testFileSource, '!!!MOVE TEST FILE!!!');
    return awsCommon.moveArtifactsToPackage().then(() => {
      const testFileTarget = path.join(targetPath, 'moveTestFile.tmp');

      expect(serverless.utils.dirExistsSync(targetPath)).to.be.equal(true);
      expect(serverless.utils.fileExistsSync(testFileTarget)).to.be.equal(true);
    });
  });

  it('should use service package path as target', () => {
    const testFileSource = path.join(moveServerlessPath, 'moveTestFile.tmp');
    const targetPath = path.join(moveBasePath, 'target');

    serverless.service.package.path = targetPath;
    serverless.utils.writeFileSync(testFileSource, '!!!MOVE TEST FILE!!!');
    return awsCommon.moveArtifactsToPackage().then(() => {
      const testFileTarget = path.join(targetPath, 'moveTestFile.tmp');

      expect(serverless.utils.dirExistsSync(targetPath)).to.be.equal(true);
      expect(serverless.utils.fileExistsSync(testFileTarget)).to.be.equal(true);
    });
  });

  it('should not fail with non existing temp dir', () => {
    const targetPath = path.join(moveBasePath, 'target');

    if (serverless.utils.dirExistsSync(moveServerlessPath)) {
      fse.removeSync(moveServerlessPath);
    }

    awsCommon.options.package = targetPath;
    return awsCommon.moveArtifactsToPackage().then(() => {
      expect(serverless.utils.dirExistsSync(targetPath)).to.be.equal(false);
    });
  });

  it('should not fail with existing package dir', () => {
    const testFileSource = path.join(moveServerlessPath, 'moveTestFile.tmp');
    const targetPath = path.join(moveBasePath, 'target');
    const testFileTarget = path.join(targetPath, 'moveTestFile.tmp');

    if (!serverless.utils.dirExistsSync(targetPath)) {
      serverless.utils.writeFileDir(targetPath);
      serverless.utils.writeFileSync(testFileTarget, '!!!MOVE TEST FILE!!!');
    }

    serverless.service.package.path = targetPath;
    serverless.utils.writeFileSync(testFileSource, '!!!MOVE TEST FILE!!!');
    return awsCommon.moveArtifactsToPackage().then(() => {
      expect(serverless.utils.dirExistsSync(targetPath)).to.be.equal(true);
      expect(serverless.utils.fileExistsSync(testFileTarget)).to.be.equal(true);
    });
  });
});
