module.exports = {
  "$schema": "https://typedoc.org/schema.json",

  "entryPointStrategy": "packages",
  "entryPoints": [
    "packages/lib/*",
    "packages/runtime/*",
  ],
  "cleanOutputDir": false,
  "out": "docs",
  "name": "@moviemasher",
  // "categorizeByGroup": true,
  // "customCss": [
  //   "dev/docs/css/styles.css"
  // ],
  // "categoryOrder": ["Media", "Plugin", "*"],
  "includeVersion": false,
  "disableSources": true,
  "gitRevision": "master",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "excludeInternal": true,
  "githubPages": false,
  // "categorizeByGroup": false,
  "readme": "README.md",
  "hideGenerator": true,
  // "externalSymbolLinkMappings": {
  //   "lit-element": {
  //     "LitElement": "https://lit.dev",
  //   },
    
  // },
  // "kindSortOrder": [
  //   "Reference",
  //   "Project",
  //   "Module",
  //   "Namespace",
  //   "Interface",
  //   "Class",
  //   "Enum",
  //   "EnumMember",
  //   "TypeAlias",
  //   "Constructor",
  //   "Property",
  //   "Function",
  //   "Variable",
  //   "Accessor",
  //   "Method",
  //   "ObjectLiteral",
  //   "Parameter",
  //   "TypeParameter",
  //   "TypeLiteral",
  //   "CallSignature",
  //   "ConstructorSignature",
  //   "IndexSignature",
  //   "GetSignature",
  //   "SetSignature",
  // ],
  "visibilityFilters": {
    "protected": false,
    "private": false,
    "inherited": false,
    "external": false,
    "@alpha": false,
    "@beta": false
  },
  // "sort": ["kind", "visibility"],
  // "markedOptions": {
  //   "mangle": false
  // },
  // "navigationLinks": {
  //   "Navigation Link": "http://example.com"
  // },
  // "sidebarLinks": {
  //   "Demo": "http://example.com"
  // },
  // "requiredToBeDocumented": ["Function"],
  "plugin": [
    "typedoc-plugin-mdn-links",
    "typedoc-plugin-extras", 
    "typedoc-plugin-coverage",
  ],
  
  "favicon": "dev/img/favicon.ico",
  "footerTypedocVersion": true,
  "footerLastModified": true,
  "customDescription": "JavaScript video editor and encoder",

}
