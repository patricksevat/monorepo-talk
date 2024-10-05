import type { Project, SourceFile, Structure } from 'ts-morph';
import { type ts } from 'ts-morph';

export type TFilePath = string;

export type GenerateExportDeclarationOpts = {
  entryFilePath: TFilePath;
  project: Project;
};

export type CreateProjectOpts = {
  newVersionEntry: TFilePath;
  baseVersionEntry: TFilePath;
};

export type ExportDeclarationEntry = {
  identifier: string;
  kind: keyof typeof ts.SyntaxKind;
  sourceFile: SourceFile;
  type: {
    isType: boolean;
    typeParamsStr: string;
  };
  typeStructure?: Structure;
};

export type ExportDeclarationMap = Record<string, ExportDeclarationEntry>;

export type CompatibleTypesCheckerOptions = {
  baseType: ExportDeclarationEntry;
  newType: ExportDeclarationEntry;
};

export type DetermineBreakingChangesOptions = {
  exportsFromBaseVersion: ExportDeclarationMap;
  exportsFromNewVersion: ExportDeclarationMap;
  newVersionEntry: TFilePath;
  baseVersionEntry: TFilePath;
  libName: string;
  project: Project;
};

export type UnionOverride = {
  relativePathRegex: RegExp;
  unionTypeOverrides: Record<string, string>;
};
