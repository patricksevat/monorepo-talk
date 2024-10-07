# L'Orceal

A demo app that shows various strategies for handling dependency version management

## Slides

https://docs.google.com/presentation/d/1JZ6oVizhvkb4wI3JdJHK2Jh9DpDgMP8ZsrtE-W4-xKI/edit?usp=sharing

## `.d.ts`comparison tool

Can be found under [./tools/ts-guard](./tools/ts-guard/README.md).

Instructions how to run the comparison script are there as well

## Commands

### Local development

Start the host app and pick which remotes to run in HMR mode:

With 2 remotes in devServer mode:

`nx serve shell --devRemotes=discover,checkout`

Without dev remotes (will be built and served statically):

`nx serve shell`

### Independent deployments from local machine

To emulate independent deployments from the local machine, follow these steps:

1. `nx deploy shell`
   a. This command will build the remote apps, the shell, copy files
2. `nx serve-production shell`
   a. This command starts `http-server` on http://localhost:3000
   b. Note that this server disables browser caching and proxies subpages back to the main index.html
3. Make changes to a remote app
4. `nx deploy {{remote-app-name}}`
5. reload the page

### Build & deploy to Zephyr

The Zephyr plugin allows us to build and deploy in one go.

To build all apps: `nx build shell --configuration "production-zephyr" --verbose`

To build a specific remote: `nx build {{remote-app-name}} --configuration "production-zephyr" --verbose`
