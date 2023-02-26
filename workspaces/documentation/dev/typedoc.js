module.exports = {
  "entryPointStrategy": "packages",
  "pluginPages": {
    "source": ".",
    "output": "guides",
		"pages": [ 
			{ 
        "moduleRoot": true, "title": "core", 
        "children": [
          { "title": "Read Me!", "source": "README.md" },
          { "title": "Contributor", "source": "dev/tsdoc/contributor.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "server-core", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "server-express", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "client-core", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "client-react", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "theme-default", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
			{ 
        "moduleRoot": true, "title": "protocol-supabase", 
        "children": [
          { "title": "Read Me!", "source": "README.md" }
        ] 
      },
    ]
	},

  "entryPoints": [
    "packages/moviemasher.js",
    "packages/server-core",
    "packages/client-core",
    "packages/protocol-supabase",
    "packages/theme-default",
    "packages/server-express",
    "packages/client-react"
  ],
  "cleanOutputDir": false,
  "out": "docs",
  "name": "@moviemasher",
  "categorizeByGroup": true,
  "customCss": [
    "workspaces/documentation/src/css/styles.css"
  ],
  "categoryOrder": ["Media", "Plugin", "*"],
  "includeVersion": false,
  "disableSources": false,
  "gitRevision": "master",
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "excludeInternal": true,
  "githubPages": false,
  "categorizeByGroup": true,
  "readme": "README.md",
  "hideGenerator": true,
  "kindSortOrder": [
    "Reference",
    "Project",
    "Module",
    "Namespace",
    "Interface",
    "Class",
    "Enum",
    "EnumMember",
    "TypeAlias",
    "Constructor",
    "Property",
    "Function",
    "Variable",
    "Accessor",
    "Method",
    "ObjectLiteral",
    "Parameter",
    "TypeParameter",
    "TypeLiteral",
    "CallSignature",
    "ConstructorSignature",
    "IndexSignature",
    "GetSignature",
    "SetSignature",
  ],
  "visibilityFilters": {
    "protected": false,
    "private": false,
    "inherited": true,
    "external": false,
    "@alpha": false,
    "@beta": false
  },
  "sort": ["kind", "visibility"],
  "plugin": [
    "typedoc-plugin-resolve-crossmodule-references", 
    "@knodes/typedoc-plugin-pages"
  ],
  "markedOptions": {
    "mangle": false
  },
  "navigationLinks": {
    "Navigation Link": "http://example.com"
  },
  "sidebarLinks": {
    "Demo": "http://example.com"
  }
}
