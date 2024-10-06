/* eslint-disable no-console */
/* eslint-disable unicorn/no-process-exit */
import { parseArgs } from 'node:util';
import * as url from 'node:url';
import path from 'node:path';
import { generateExportDeclarations } from './generate-export-declarations.js';
import { createProject } from './create-project.js';
import type { Project } from 'ts-morph';

import {
  applyPrivateAndProtectedClassMemberOverrideVisitor,
  allRelevantFilesNodeVisitor,
  createConstAliasesFromTypes,
  getAllRelevantFilesInProject,
} from './required-modifications/index.js';

if (import.meta.url.startsWith('file:')) {
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) {
    /** Section: CLI args */
    const { baseVersionEntry, newVersionEntry } = parseAndValidateCliArgs();

    /** Section: Project set up & entry files */
    const project = createProject({
      newVersionEntry,
      baseVersionEntry,
    });

    addSourceFilesToProject(project, newVersionEntry, baseVersionEntry);

    /** Section: get metadata for all exported items from entry files */
    const { exportsFromBaseVersion, exportsFromNewVersion } =
      await getAllExportsFromIndexFiles(
        project,
        baseVersionEntry,
        newVersionEntry
      );

    /** Section: required modifications to make deep comparison work */
    const relevantProjectFiles = getAllRelevantFilesInProject(project);

    allRelevantFilesNodeVisitor(project, relevantProjectFiles, [
      applyPrivateAndProtectedClassMemberOverrideVisitor,
    ]);

    createConstAliasesFromTypes({
      exportsFromBaseVersion,
      exportsFromNewVersion,
    });

    /** Section: the comparison script */
    project.createSourceFile(
      'compare-values.ts',
      `
          type A = Pick<
            typeof import('${newVersionEntry}'),
            keyof typeof import('${baseVersionEntry}')
          >;
          type B = typeof import('${baseVersionEntry}');

          const G: B = {} as A;
          `
    );

    /** Section: getting the comparison results and handling output */
    const diagnostics = project.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
      console.log(project.formatDiagnosticsWithColorAndContext(diagnostics));
    }

    process.exit(diagnostics.length > 0 ? 1 : 0);
  }
}

function parseAndValidateCliArgs() {
  const { baseVersionEntry, newVersionEntry } = parseArgs({
    options: {
      baseVersionEntry: {
        type: 'string',
      },
      newVersionEntry: {
        type: 'string',
      },
    },
  }).values;

  if (!baseVersionEntry || !newVersionEntry) {
    throw new Error('Please provide --baseVersionEntry and --newVersionEntry');
  }

  return { baseVersionEntry, newVersionEntry };
}

function addSourceFilesToProject(
  project: Project,
  newVersionEntry: string,
  baseVersionEntry: string
) {
  project.addSourceFileAtPath(newVersionEntry);
  project.addSourceFileAtPath(baseVersionEntry);

  if(process.env['GLOBAL_TYPES_FILE']) {
    // Sometimes needed to provide globals like `window` and `process.env` for the typescript compiler
    project.addSourceFileAtPath(process.env['GLOBAL_TYPES_FILE']);
  }
}

async function getAllExportsFromIndexFiles(
  project: Project,
  baseVersionEntry: string,
  newVersionEntry: string
) {
  const exportsFromBaseVersion = await generateExportDeclarations({
    entryFilePath: baseVersionEntry,
    project,
  });
  const exportsFromNewVersion = await generateExportDeclarations({
    entryFilePath: newVersionEntry,
    project,
  });

  return { exportsFromBaseVersion, exportsFromNewVersion };
}
