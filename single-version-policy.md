## Summary table (complete autonomy)

|                                                                            | Completely autonomous |
|----------------------------------------------------------------------------|-----------------------|
| **[Performance]** Duplicate code at runtime?                               | Very likely 🚨        |
| **[Stability]** Possibility of runtime breaking due to differing versions? | Yes 🚨🐞💣            |
| **[Autonomy]** Can I deploy independently after updating a version?        | Yes                   |
| **[Governance]**  Needs internal lib governance^2^                         | Yes                   |
| **[Governance]** Allows multiple versions of same dep?                     | Yes                   |
| **[DevEx]** Debugging older internal lib versions^3^                       | Possibly hard         |

## Summary table (single version policy)

|                                                                            | Single version policy                       |
|----------------------------------------------------------------------------|---------------------------------------------|
| **[Performance]** Duplicate code at runtime?                               | No                                          |
| **[Stability]** Possibility of runtime breaking due to differing versions? | No                                          |
| **[Autonomy]**  Can I deploy independently after updating a version?       | No, all consuming app/libs must be deployed |
| **[Governance]**  Needs internal lib governance^2^                         | N/A                                         |
| **[Governance]** Allows multiple versions of same dep?                     | No                                          |
| **[DevEx]** Debugging older internal lib versions^3^                       | N/A                                         |


## Summary table

|                                                                            | Completely autonomous            | Single version policy                       |
|----------------------------------------------------------------------------|----------------------------------|---------------------------------------------|
| **[Performance]** Duplicate code at runtime?                               | Very likely 🚨                   | No                                          |
| **[Stability]** Possibility of runtime breaking due to differing versions? | Yes 🚨🐞💣                       | No                                          |
| **[Autonomy]** Can I deploy independently after updating a version?        | Yes, except shared singletons^1^ | No, all consuming app/libs must be deployed |
| **[Governance]**  Needs internal lib governance^2^                         | Yes                              | N/A                                         |
| **[Governance]** Allows multiple versions of same dep?                     | Yes                              | No                                          |
| **[DevEx]** Debugging older internal lib versions^3^                       | Possibly hard                    | N/A                                         |

^1^ With the exception of singleton libraries like `react`

^2^ Let's say that you have `logger` as a lib, throughout time you'll end up with `logger@1.x.x`, `logger@2.x.x`, etc. At same point you'll likely want to align this again for runtime performance reasons

^3^ Expanding on the example in ^1^, let's say at `HEAD` we currently have `logger@2.0.0`. But `AppA` uses `logger@1.2.3` and we discover a bug there, we'll need a way to get the source code from `logger@1.2.3` and use it at `HEAD`

## Summary table (with hybrid)

|                                                                            | Completely autonomous            | Single *Major* version policy                   | Single version policy                       |
|----------------------------------------------------------------------------|----------------------------------|-------------------------------------------------|---------------------------------------------|
| **[Performance]** Duplicate code at runtime?                               | Very likely 🚨                   | Yes, only for differing major versions          | No                                          |
| **[Stability]** Possibility of runtime breaking due to differing versions? | Yes 🚨🐞💣                       | No, **but** singleton versions^2^ and semver^3^ | No                                          |
| **[Autonomy]** Can I deploy independently after updating a version?        | Yes, except shared singletons^1^ | Yes, except shared singletons^1^                | No, all consuming app/libs must be deployed |
| **[Governance]**  Needs internal lib governance^2^                         | Yes                              | Less^4^                                         | N/A                                         |
| **[Governance]** Allows multiple versions of same dep?                     | Yes                              | Yes, for differing major versions               | No                                          |
| **[DevEx]** Debugging older internal lib versions^3^                       | Possibly hard                    | Less hard                                       | N/A                                         |

^1^ Updates of singleton libraries like `react` must be co-ordinated and in one go
^2^ singleton libraries are not allowed to have multiple versions. Flagging dependencies as singleton is manual process
^3^ provided the dependencies adhere to Semantic Versioning!
^4^ A Platform team could be CODEOWNER of the root `package.json` and determine if a new major version is acceptable or not. An internal policy could set a maximum to `n` major versions per dependency



|                                               | Completely autonomous | Single *Major* version policy                             | Single version policy              |
|-----------------------------------------------|-----------------------|-----------------------------------------------------------|------------------------------------|
| root `package.json`                           | `devDependencies`     | `dependencies`* + `devDependencies` <br />With aliases^1^ | `dependencies` + `devDependencies` |
| app `package.json`s                           | `dependencies`        | N/A                                                       | N/A                                |
| lib `package.json`s                           | `peerDependencies`    | `peerDependencies`                                        | `peerDependencies`                 |
| Allows multiple versions of same dep in repo? | Yes                   | Yes, for differing major versions                         | No                                 |
| Consuming internal libs                       | Through npm^1^ <br /> | Via relative path or alias <br />With forks^2^            | relative path or alias             |
| `node_modules` disk size                      | Larger                | Smaller                                                   | Smallest                           |


^1^: different major versions can be added through aliases: `"lodash": "~1.2.3", "lodash@4": "npm:lodash@~4.0.0"`
^2^: If we have a new major version, we "fork" it by copying it: `libs/logger` -> `lib/logger_v2`

## Performance implications (with hybrid)

|                                                            | Completely autonomous | Single *Major* version policy               | Single version policy |
|------------------------------------------------------------|-----------------------|---------------------------------------------|-----------------------|
| Allow multiple versions of same dependency at runtime?     | Yes                   | Yes, for differing major versions           | No                    |
| Duplicate code at runtime?                                 | Very likely 🚨        | Yes, for differing major versions           | No                    |  
| Possibility of runtime breaking due to differing versions? | Yes 🚨🐞💣            | No, but singleton versions^1^ and semver^2^ | No                    |

^1^: singleton libraries are not allowed to have multiple versions. Flagging dependencies as singleton is **manual** process
^2^: provided the dependencies adhere to Semantic Versioning!

|                                         | Completely autonomous                                                           | Single *Major* version policy | Single version policy          |
|-----------------------------------------|---------------------------------------------------------------------------------|-------------------------------|--------------------------------|
| Affected apps when changing dep version | In app `package.json`: own app <br />In lib `package.json`: consuming apps/libs | All consuming apps/libs       | ⚠️ All consuming apps/libs     |
| Updating major version means:           | Updating own app                                                                | Updating own app              | Updating all consuming apps 👎 |

## Governance (with hybrid)

|                                          | Completely autonomous              | Single *Major* version policy | Single version policy        |
|------------------------------------------|------------------------------------|-------------------------------|------------------------------|
| Spot duplicate dependencies in PR        | Hard (multiple `package.json`s) 👎 | Easy (single `package.json`)  | Easy (single `package.json`) |
| Needs internal lib governance^1^         | Yes                                | Less^3^                       | N/A                          |
| Debugging older internal lib versions^2^ | Possibly hard                      | Easier                        | N/A                          |
| Clear policy                             | Yes                                | Mostly, yes                   | Yes                          |
| Requires custom tooling                  | No                                 | Yes, for guardrails           | No                           |

^1^ Let's say that you have `logger` as a lib, throughout time you'll end up with `logger@1.x.x`, `logger@2.x.x`, etc. At same point you'll likely want to align this again for runtime performance reasons

^2^ Expanding on the example in ^1^, let's say at `HEAD` we currently have `logger@2.0.0`. But `AppA` uses `logger@1.2.3` and we discover a bug there, we'll need a way to get the source code from `logger@1.2.3` and use it at `HEAD`

^3^ A Platform team could be CODEOWNER of the root `package.json` and determine if a new major version is acceptable or not. An internal policy could set a maximum to `n` major versions per dependency

