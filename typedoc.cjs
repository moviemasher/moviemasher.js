module.exports = {
  "entryPointStrategy": "packages",

  "entryPoints": [
    "packages/lib/*",
    "packages/runtime/*",
    // "packages/lib/server",
    // "packages/lib/client",
    // "plugin/protocol/supabase",
    // "packages/server/express",
    // "packages/lib/server"
  ],
  "cleanOutputDir": false,
  "out": "docs",
  "name": "@moviemasher",
  // "categorizeByGroup": true,
  "customCss": [
    "dev/documentation/css/styles.css"
  ],
  // "categoryOrder": ["Media", "Plugin", "*"],
  "includeVersion": false,
  // "disableSources": false,
  "gitRevision": "master",
  // "excludePrivate": true,
  // "excludeProtected": true,
  // "excludeExternals": true,
  // "excludeInternal": false,
  // "githubPages": false,
  // "categorizeByGroup": true,
  "readme": "README.md",
  "hideGenerator": true,
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
    "inherited": true,
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
    // "typedoc-plugin-resolve-crossmodule-references", 
    // "typedoc-plugin-external-resolver",
    // "@knodes/typedoc-plugin-pages",
    // "@knodes/typedoc-plugin-code-blocks",
    // "typedoc-plugin-expand-object-like-types",
    "typedoc-plugin-extras", 
    "typedoc-plugin-coverage",
    // "typedoc-plugin-merge-modules",
  ],
  // "pluginPages": {
  //   // "source": ".",
  //   "output": "guides",
	// 	"pages": [ 
	// 		{ 
  //       "moduleRoot": true, 
  //       "name": "lib-shared", 
  //       "source": "index.md",
  //       "childrenSourceDir": '.',
  //       // "children": [
  //       //   // { "name": "Read Me Shared", "source": "index.md" },
  //       //   { "name": "lib-shared", "moduleRoot": true, "source": "README.md" }
  //       // ] 
  //     },
	// 		// { 
  //     //   "moduleRoot": true, "title": "lib-server", 
  //     //   "children": [
  //     //     { "title": "Read Me!", "source": "README.md" }
  //     //   ] 
  //     // },
	// 		// { 
  //     //   "moduleRoot": true, "title": "server-express", 
  //     //   "children": [
  //     //     { "title": "Read Me!", "source": "README.md" }
  //     //   ] 
  //     // },
	// 		// { 
  //     //   "moduleRoot": true, "title": "lib-client", 
  //     //   "children": [
  //     //     { "title": "Read Me Client", "source": "./README.md" }
  //     //   ] 
  //     // },
	// 		// { 
  //     //   "moduleRoot": true, "title": "lib-server", 
  //     //   "children": [
  //     //     { "title": "Read Me Server", "source": "./README.md" }
  //     //   ] 
  //     // },
	// 		// { 
  //     //   "moduleRoot": true, "title": "protocol-supabase", 
  //     //   "children": [
  //     //     { "title": "Read Me!", "source": "README.md" }
  //     //   ] 
  //     // },
  //   ]
	// },
  // "pluginCodeBlocks": {
  //   "source": "src"
  // },
  "favicon": "dev/img/favicon.ico",
  "footerTypedocVersion": true,
  "footerLastModified": true,
  "customDescription": "JavaScript video editor and encoder",
  // "pluginExpandTypes": {
  //   "internalModule": "<internal>",
  // },
  
  // "externalDocumentation": {
  //   "@moviemasher/lib-shared": {
  //     "externalBaseURL": "https://moviemasher.com/docs"

  //   },
  //   "@supabase/supabase-js": {
  //       "dtsPath": "~/dist/module/index.d.ts",
  //       "externalBaseURL": "https://supabase.github.io/supabase-js/v2"
  //   }
  // }
}
