# Build Docs

## Compile Code

The code in `src` is compiled into `dist` by running from monorepo root:

```bash
npm run build-packages lib-server
```

## Compile Docuentation

The HTML code in `docs` is compiled by running from monorepo root:

```bash
npm run build-docs
``````

This runs in a moviemasher/build-docs Docker container which only mounts the 
package.json and dist directories from each package - see 
the ./dev/docker-compose.yml file. The ./dev/tsconfig.json file is also mounted
at the monorepo root.