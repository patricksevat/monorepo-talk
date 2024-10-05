import type { Project, Node } from 'ts-morph';

export { applyPrivateAndProtectedClassMemberOverrideVisitor } from './private-protected-class-members.js';
export { createConstAliasesFromTypes } from './create-const-assignments-from-types.js';

// This gives back a list of all the ABSOLUTE file paths of source files in the project
// any import is also resolved and included as long as it matches the filter
// e.g. we do include `node_modules/{npmScope}` and `/dist/libs`, but not `node_modules/react`
//
// `node_modules/{npmScope}`: the npmScope here is the scope under which the libs are published.
// TODO: not all packages are published under a scope. 
export function getAllRelevantFilesInProject(project: Project): string[] {
  const allFilesInProject = project
    .getProgram()
    .compilerObject.getSourceFiles()
    .map((sf) => sf.fileName)
    // We are only interested in our own files
    .filter(
      (file) =>
        file.includes(`node_modules/${process.env['NPM_SCOPE'] || '@patricksevat'}`) ||
        file.includes('/dist/libs')
    );

  return allFilesInProject;
}

export function allRelevantFilesNodeVisitor(
  project: Project,
  allRelevantFiles: string[],
  visitorFns: ((node: Node) => void)[]
) {
  for (const file of allRelevantFiles) {
    const sourceFile = project.getSourceFile(file);
    // NOTE: forEachDescendant only visits nodes within the sourceFile itself.
    // if the source file contains imports, those are not visited
    sourceFile?.forEachDescendant((node) => {
      for (const visitorFn of visitorFns) {
        visitorFn(node);
      }
    });
  }
}
