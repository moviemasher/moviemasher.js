module.exports = {
  "$schema": "https://typedoc.org/schema.json",
  "entryPoints": [
    "packages/runtime/*/src/index.ts",
    "packages/lib/*/src/index.ts",
  ],
  "out": "./temporary/build-docs/json",
  "json": "./temporary/build-docs/project.json",
  "name": "@moviemasher",
  "includeVersion": false,
  "disableSources": true,
  "gitRevision": "master",
  "excludePrivate": true,
  "excludeProtected": false,
  "excludeExternals": true,
  "excludeInternal": true,
  "githubPages": false,
  "categorizeByGroup": false,
  "plugin": ["typedoc-plugin-merge-modules"],
}
