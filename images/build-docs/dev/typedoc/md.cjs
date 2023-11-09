module.exports = {
  "$schema": "https://typedoc.org/schema.json",
  "cleanOutputDir": true,
  "entryPoints": [
    "packages/runtime/*/src/index.ts",
    "packages/lib/*/src/index.ts",
  ],
  "out": "./temporary/build-docs/md",
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
  "hideGenerator": true,

  "plugin": [
    // "typedoc-plugin-merge-modules",
    "typedoc-plugin-markdown",
    "typedoc-plugin-mdn-links",
    "typedoc-plugin-coverage",
  ],
  "allReflectionsHaveOwnDocument": true,
  "hideMembersSymbol": false,
  "hideBreadcrumbs": true,
  "hideInPageTOC": true,
  "preserveAnchorCasing": true,
  "namedAnchors": false,
  // "publicPath": "https://moviemasher.github.io/moviemasher-core/",

}
