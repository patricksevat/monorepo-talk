/* eslint-disable unicorn/no-process-exit */
import { join } from 'node:path';
import { execSync, execFileSync } from 'node:child_process';
import glob from 'glob';

const repoRoot = join(import.meta.dirname, '../../../');

const globPattern = `${repoRoot}libs/**/*/package.json`;

const libPackageJsonPaths = glob.sync(globPattern, { absolute: true });

// Essentially this generates an install string like:
// npm i @patricksevat-alias/logger-demo@npm:@patricksevat/logger-demo@1.0.0-pre.01 --no-save
// but for all the libs in the repo
const getInstallAllLibsString = (libPaths, gitRef) =>
  libPaths
    .map((libPath) => {
      try {
        const libPkgJsonRelativePath = libPath.replace(repoRoot, '');
        const packageJsonAtRef = execFileSync(
          'git',
          ['show', `${gitRef}:${libPkgJsonRelativePath}`],
          {
            encoding: 'utf8',
          }
        );
        const basePackageJson = JSON.parse(packageJsonAtRef);
        const aliasName = basePackageJson.name.replace(
          '@patricksevat',
          '@patricksevat-alias'
        );
        return `${aliasName}@npm:${basePackageJson.name}@${basePackageJson.version}`;
      } catch (error) {
        console.log(
          `Could not determine previous package.json for ${libPath}.\nIf this is not a new library, please contact Web Platform team`,
          { cause: error }
        );
        console.log(error.toString(), { cause: error });
        return '';
      }
    })
    .join(' ');

try {
  const gitRef = process.env.NX_BASE || 'origin/main';

  console.log('Using git ref:', { gitRef });

  const installAllLibsString = getInstallAllLibsString(
    libPackageJsonPaths,
    gitRef
  );

  console.log(`npm i ${installAllLibsString} --no-save`);

  execSync(`npm i ${installAllLibsString} --no-save`, {
    cwd: repoRoot,
    stdio: 'inherit',
  });
} catch (error) {
  console.log('Failed to install aliased libs', { cause: error });
  process.exit(1);
}
