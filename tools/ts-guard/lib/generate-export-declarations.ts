import type { ts, TypeNode } from 'ts-morph';
import { Node } from 'ts-morph';
import type { ExportDeclarationEntry } from './types.js';
import {
  type ExportDeclarationMap,
  type GenerateExportDeclarationOpts,
} from './types.js';

// This function gives a list of available exports based on an entry file (e.g. src/index.d.ts)
// We also add some metadata, most importantly about the type of the export
export async function generateExportDeclarations({
  entryFilePath,
  project,
}: GenerateExportDeclarationOpts): Promise<ExportDeclarationMap> {
  const entrySourceFile = project.getSourceFile(entryFilePath);

  if (!entrySourceFile) {
    throw new Error(`Could not find source file at ${entryFilePath}`);
  }

  const declarationMap: ExportDeclarationMap = {};

  const exportedDeclarations = entrySourceFile.getExportedDeclarations();

  for await (const [name, declaration] of exportedDeclarations) {
    const originalSourceFile = declaration[0].getSourceFile();

    const type = getTypeMeta(declaration[0]);

    declarationMap[name] = {
      identifier: name,
      sourceFile: originalSourceFile,
      kind: declaration[0].getKindName() as keyof typeof ts.SyntaxKind,
      type,
    };
  }

  return declarationMap;
}

// Following the logic here for Nodes that are types (uninstantiated)
// https://github.com/microsoft/TypeScript/blob/63dd17baef183972adab05216c4f5095e8d5a207/src/compiler/binder.ts#L357
// TODO: this might be incomplete!
function getTypeMeta(declaration: Node): ExportDeclarationEntry['type'] {
  if (
    Node.isTypeAliasDeclaration(declaration) ||
    Node.isInterfaceDeclaration(declaration)
  ) {
    // To properly compare types with generics e.g. `type Foo<SomeGeneric extends SomethingElse> = boolean`
    // We need to save (parts of) the type parameters
    const typeParameters = declaration.getTypeParameters();
    const typeParamsStr = typeParameters
      .reduce((agg, param) => {
        const defaultNode = param.getDefault();
        let paramString = param.getName();
        const constraintNode = param.getConstraint();

        // example of constraint:
        // `type Foo<SomeGeneric extends OtherType>`
        // `OtherType` is the constraint
        if (constraintNode) {
          paramString = getTypeConstraint(constraintNode);
        }

        // example of default:
        // `type Foo<SomeGeneric = boolean>`
        // `boolean` is the default
        if (defaultNode) {
          paramString = defaultNode.getText();
        }
        return [...agg, paramString];
      }, [] as string[])
      .join(', ');

    return {
      isType: true,
      typeParamsStr: typeParamsStr ? `<${typeParamsStr}>` : '',
    };
  }

  // only const enums are types (and thus dropped by the compiler)
  // regular enums are compiled to JS and are not types
  if (Node.isEnumDeclaration(declaration) && declaration.isConstEnum()) {
    return {
      isType: true,
      typeParamsStr: '',
    };
  }

  // Not a type
  return {
    isType: false,
    typeParamsStr: '',
  };
}

// NOTE: We only want the constraint, not the name
// WRONG: `SomeGeneric extends OtherType['foo']`, GOOD: `OtherType['foo']`
function getTypeConstraint(constraintNode: TypeNode) {
  // example of indexed access type:
  // `Generic<T extends MyObjectType["myIndex"]>`
  if (Node.isIndexedAccessTypeNode(constraintNode)) {
    return constraintNode.getText();
  }

  // example of type reference:
  // `Generic<T extends MyObjectType>`
  // This is different from `Generic<T extends MyObjectType["myIndex"]>` because the latter is an indexed access type
  // eslint-disable-next-line unicorn/prefer-ternary
  if (Node.isTypeReference(constraintNode)) {
    return constraintNode.getText();
  } else {
    /**
     * Some examples:
     * Expression: <TKey extends string> (string is the constraint of type Expression)
     * TypeLiteralNode: <TKey extends { [key: string]: any }> (the object is the constraint of type TypeLiteralNode)
     * UnionTypeNode: <TKey extends string | number> (string | number is the constraint of type UnionTypeNode)
     * IntersectionTypeNode: <TKey extends string & number> (string & number is the constraint of type IntersectionTypeNode)
     */
    return constraintNode.getText();
  }
}
