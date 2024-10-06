import { Project, ts } from 'ts-morph';
import path from 'node:path';
import type { CreateProjectOpts } from './types.js';

export function createProject({
  newVersionEntry,
  baseVersionEntry,
}: CreateProjectOpts) {
  const baseDir = baseVersionEntry.replace('src/index.d.ts', '');
  const newDir = newVersionEntry.replace('src/index.d.ts', '');

  const project = new Project({
    tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
    resolutionHost: (moduleResolutionHost, getCompilerOptions) => {
      return {
        // If we are in the base version's src/index.ts, we want to resolve all imports under the npm scope
        // to the downloaded versions of the libraries (which are stored in libs/node_modules)

        // On the contrary, if we are in the new version's src/index.ts, we want to resolve all imports under the namespace to the
        // dist folder.

        // The reason why we do this:
        // Let's say we are comparing between `libA@1.1.0` (newer version) and `libA@1.0.0` (base version)
        // Now both these versions depend on `libZ`, we want to resolve to the correct version of `libZ`.
        // `libA@1.1.0` depends on `libZ@2.0.0`, whereas `libA@1.0.0` depends on `libZ@1.0.0`
        resolveModuleNames: (moduleNames, containingFile) => {
          const compilerOptions = getCompilerOptions();
          const resolvedModules: ts.ResolvedModule[] = [];

          for (const moduleName of moduleNames) {
            let resolvedModule: ts.ResolvedModule | undefined;

            // TODO: it would be better to work with a list or read from package.json
                  // however, that package.json might need to be recursive
            // Redirect all imports from @postman/app-* to either the base or new directory
            if (moduleName.includes('@postman/')) {
              const isBase = containingFile.includes(baseDir);
              const requestedLibName = moduleName.replace('@postman/app-', '');
              const requestedLibLocation = isBase
                ? path.join(
                    baseDir,
                    '..',
                    `app-${requestedLibName}/src/index.d.ts`
                  )
                : path.join(newDir, '..', `${requestedLibName}/src/index.d.ts`);

              const relativePath = path.relative(
                path.dirname(containingFile),
                requestedLibLocation
              );
              const { resolvedModule: postmanResolvedModule } =
                ts.resolveModuleName(
                  relativePath,
                  containingFile,
                  compilerOptions,
                  moduleResolutionHost
                );
              resolvedModule = postmanResolvedModule;
            } else {
              // Note: if you run into issues with resolving Node's internal (node:path, etc)
              // Make sure tsConfig.json has "moduleResolution": "NodeNext"
              const { resolvedModule: regularResolvedModule } =
                ts.resolveModuleName(
                  moduleName,
                  containingFile,
                  compilerOptions,
                  moduleResolutionHost
                );
              resolvedModule = regularResolvedModule;
            }

            // @ts-expect-error If we can't resolve the module, we push undefined, as per the typescript API
            resolvedModules.push(resolvedModule);
          }

          return resolvedModules;
        },
      };
    },
  });

  return project;
}
