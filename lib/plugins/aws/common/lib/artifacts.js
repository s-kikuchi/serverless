'use strict';

const BbPromise = require('bluebird');
const path = require('path');
const fse = require('fs-extra');

module.exports = {
  moveArtifactsToPackage() {
    const packagePath =
      this.options.package ||
      this.serverless.service.package.path ||
      path.join(this.serverless.config.servicePath || '.', '.serverless');

    // Only move the artifacts if it was requested by the user
    if (this.serverless.config.servicePath && !packagePath.endsWith('.serverless')) {
      const serverlessTmpDirPath = path.join(this.serverless.config.servicePath, '.serverless');

      if (this.serverless.utils.dirExistsSync(serverlessTmpDirPath)) {
        if (this.serverless.utils.dirExistsSync(packagePath)) {
          fse.removeSync(packagePath);
        }
        this.serverless.utils.writeFileDir(packagePath);
        this.serverless.utils.copyDirContentsSync(serverlessTmpDirPath, packagePath);
        fse.removeSync(serverlessTmpDirPath);
      }
    }

    return BbPromise.resolve();
  },

  moveArtifactsToTemp() {
    const packagePath =
      this.options.package ||
      this.serverless.service.package.path ||
      path.join(this.serverless.config.servicePath || '.', '.serverless');
    // eslint-disable-next-line no-console
    console.error(packagePath);

    // Only move the artifacts if it was requested by the user
    /*
    if (this.serverless.config.servicePath && !packagePath.endsWith('.serverless')) {
      // TODO: ここでserverlessTmpDirPathを -p 指定したディレクトリにする
      const serverlessTmpDirPath = path.join(this.serverless.config.servicePath, '.serverless');

      // 下でやっている内容の整理
      // 1. packagePathで指定されたディレクトリが存在している場合
      // - packagePath内に .serverless が存在しているか確認
      // - -> していたら ファイル内削除
      // - -> していなかったら ディレクトリ作成 and packagePathからのコピー
      // 2. packagePathで指定されたディレクトリが存在していなかった場合
      // - 何もしない
      if (this.serverless.utils.dirExistsSync(packagePath)) {
        if (this.serverless.utils.dirExistsSync(serverlessTmpDirPath)) {
          fse.removeSync(serverlessTmpDirPath);
        }
        this.serverless.utils.writeFileDir(serverlessTmpDirPath);
        this.serverless.utils.copyDirContentsSync(packagePath, serverlessTmpDirPath);
      }
    }
    */

    return BbPromise.resolve();
  },
};
