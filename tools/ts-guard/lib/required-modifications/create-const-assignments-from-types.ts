import type { ExportDeclarationMap } from '../types.js';

/**
 * This function is the key to make comparison for types and interfaces work
 * The gist is that we create a const alias for each exported type
 * Then we can compare the types using these const aliases
 *
 * Example:
 * `type Foo = string;`
 * =>
 * ```
 * type Foo = string;
 * export declare const FooValue: Foo;
 * ```
 * */
export function createConstAliasesFromTypes({
  exportsFromBaseVersion,
  exportsFromNewVersion,
}: {
  exportsFromBaseVersion: ExportDeclarationMap;
  exportsFromNewVersion: ExportDeclarationMap;
}) {
  for (const [name, exportEntryFromNewVersion] of Object.entries(
    exportsFromNewVersion
  )) {
    const originalSourceFile = exportEntryFromNewVersion.sourceFile;
    const typeToValueStatement = `export declare function ${name}Value (typeArg: ${name}${exportEntryFromNewVersion.type.typeParamsStr}) {};`;
    originalSourceFile.addStatements(typeToValueStatement);
  }

  for (const [name, exportEntryFromBaseVersion] of Object.entries(
    exportsFromBaseVersion
  )) {
    const originalSourceFile = exportEntryFromBaseVersion.sourceFile;
    const typeToValueStatement = `export declare function ${name}Value (typeArg: ${name}${exportEntryFromBaseVersion.type.typeParamsStr}) {};`;
    originalSourceFile.addStatements(typeToValueStatement);
  }
}
