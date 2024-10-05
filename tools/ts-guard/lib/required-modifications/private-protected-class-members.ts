import type { ClassDeclaration } from 'ts-morph';
import { Node } from 'ts-morph';

export function applyPrivateAndProtectedClassMemberOverrideVisitor(node: Node) {
  if (Node.isClassDeclaration(node)) {
    removePrivateAndProtectedMembersFromClass(node);
  }
}

/**
 * This prevents errors like:
 Type 'typeof import("./new-class").MyClass' does not satisfy the constraint 'typeof import("./base-class").MyClass'.
  Types have separate declarations of a private property 'somethingPrivate'
 *
 * And similarly for protected methods:
 Type 'typeof import("./new-class").MyClass' does not satisfy the constraint 'typeof import("./base-class").MyClass'.
  Property 'somethingProtected' is protected but type 'MyClass' is not a class derived from 'MyClass'
 *
 * Lastly, it removes private members using JS private fields syntax:
 * `class A { #value = 1; }` => `declare class A { #private; }`
 */
function removePrivateAndProtectedMembersFromClass(node: ClassDeclaration) {
  const members = node.getMembers();
  const membersToRemove = [];
  for (const member of members) {
    // This removes private members using JS private fields syntax
    // my-class.ts: `class MyClass { #value = 1; }`
    // my-class.d.ts: `declare class MyClass { #private }`;
    // after this modification: `declare class MyClass {}`;
    if (member.getText() === '#private;') {
      membersToRemove.push(member);
    }

    // This removes private class declarations and protected KEYWORDS
    // class MyClass { protected somethingProtected = 1; } => class MyClass { somethingProtected = 1; }
    // class MyClass { private somethingPrivate = 1; } => class MyClass { }
    if (Node.isModifierable(member)) {
      const modifiers = member.getModifiers();
      for (const modifier of modifiers) {
        const modifierText = modifier.getText();
        if (modifierText === 'private') {
          membersToRemove.push(member);
        }
        if (modifierText === 'protected') {
          // @ts-expect-error it's there, trust me
          member.removeModifier(modifierText);
        }
      }
    }
  }

  // Remove private fields: `declare class A { #private; }` => `declare class A {}`
  for (const member of membersToRemove) {
    member.remove();
  }
}
