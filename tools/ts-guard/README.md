# TS-guard

This tool allows us to detect breaking changes in two versions of a TypeScript lib by comparing the `*.d.ts` files.

## What is supported

Hopefully everything! But do send a message if you encounter any false positives.

### Values

```typescript
export declare const MyConst = 'abc';
export declare const MyFunction: () => void;
export declare const MyFunctionWithParams: (someStr: string) => void;
```

etc.

### Types

```typescript
export declare type MyStringType = string;
export declare type MyStringType = SomeOtherType['SomeProperty'];
export declare type MyGenericType<T> = { someProp: T };
export declare interface IMyInterface { a: string, b: number }
```

## How to use

In it's simplest form, the compare command takes two `.d.ts` files and compares them:

`nx compare @patricksevat/ts-guard -- --baseVersionEntry="<ABSOLUTE_PATH_TO_ENTRY_D_TS>" --newVersionEntry="<ABSOLUTE_PATH_TO_OTHER_ENTRY_D_TS>"`

For example:

`nx compare @patricksevat/ts-guard -- --baseVersionEntry="/Users/patricksevat/projects/postman/postman-next/node_modules/test-vscode-utils/src/index.d.ts" --newVersionEntry="/Users/patricksevat/projects/postman/postman-next/dist/libs/vscode-utils/src/index.d.ts"`

A more practical example would be following these steps:

1. Install the latest versions of all libs using `nx install-aliased-libs @patricksevat/ts-guard` under an **alias**
  a. right now the npm scope and aliased npm-scope are hardcoded in `tools/ts-guard/scripts/install-aliased-libs.js`
2. Make changes to a lib (in this example, the lib is called `logger`) and ensure a new `.d.ts` file is created: `nx build-lib logger`
3. Run the compare command: nx compare @patricksevat/ts-guard -- --baseVersionEntry="/Users/patricksevat/projects/monorepo-world-talk-clean/node_modules/@patricksevat-alias/logger-demo/src/index.d.ts" --newVersionEntry="/Users/patricksevat/projects/monorepo-world-talk-clean/dist/libs/logger/src/index.d.ts"

## Returns

If the exit code is 0, then there are no breaking changes. If the exit code is 1 then there are breaking changes detected.

### Adding global .d.ts

GLOBAL_TYPES_FILE="/Users/patricksevat/projects/foo/global.d.ts" nx compare version-check