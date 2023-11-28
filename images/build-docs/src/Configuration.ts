import { DIR_ROOT, DIR_SOURCE, DIR_TEMPORARY } from './Constants.js'
import { DocumentationConfiguration } from './Types.js'

export const CONFIGURATION: DocumentationConfiguration = {
  inputCombinedMdDirectory: `md/combined`,
  inputCategoryMdDirectory: `md/category`,
  inputModuleMdDirectory: `md/module`,
  combineDirectories: ['Types', 'Variables', 'Functions'],
  inputCategoryHtmlPath: `html/category.html`,
  inputCombinedHtmlPath: `html/combined.html`,
  inputModulesMdDirectory: `modules`,
  inputCssPaths: ['css/page.css', 'css/documentation.css'],
  inputFileHtmlPath: `html/file.html`,
  inputFolderHtmlPath: `html/folder.html`,
  inputPageHtmlPath: `html/page.html`,
  inputRoot: DIR_SOURCE,
  inputSectionHtmlPath: `html/section.html`,
  inputTypedocMdDirectory: `${DIR_TEMPORARY}/md`,
  outputCategoryPath: 'categories',
  outputCombinedPath: 'combined',
  outputCssPath: 'media/css/documentation.css',
  outputExportPath: 'exports',
  outputModulePath: 'modules',
  outputOtherPath: '',
  outputRoot: `${DIR_ROOT}/docs`,
  typedocJsonPath: `${DIR_TEMPORARY}/project.json`,
  sortKinds: [
    'Project',
    'Module',
    'Namespace',
    'Enum',
    'EnumMember',
    'Variable',
    'Function',
    'Class',
    'Interface',
    'Constructor',
    'Accessor',
    'Property',
    'Method',
    'CallSignature',
    'IndexSignature',
    'ConstructorSignature',
    'Parameter',
    'TypeLiteral',
    'TypeParameter',
    'GetSignature',
    'SetSignature',
    'TypeAlias',
    'Reference',
  ],
  docFilesAndFolders: [
    //  {
    //   title: 'Test', url: 'index.html', markdownPaths: ['test.md']
    // },
    {
      title: 'README', url: 'index.html', markdownPaths: ['/app/README.md']
    },
    {
      title: 'Demo', url: 'demo/index.html', htmlPaths: ['html/demo.html'],
      templatePath: 'html/page-demo.html',
    },
    {
      title: 'Guides', 
      docFiles: [
        { 
          title: 'End User', url: 'EndUser.html', 
          markdownPaths: ['md/guides/end-user.md']
        },
        { 
          title: 'Client Developer', url: 'ClientDeveloper.html', 
          markdownPaths: ['md/guides/client-developer.md']
        },
        { 
          title: 'Server Developer', url: 'ServerDeveloper.html', 
          markdownPaths: ['md/guides/server-developer.md']
        },
        { 
          title: 'Contributer', url: 'Contributer.html', 
          markdownPaths: ['md/guides/contributor.md']
        },
      ]
    },
    {
      title: 'Overview', 
      docFiles: [
        { 
          title: 'Architecture', url: 'Architecture.html', 
          markdownPaths: ['md/overview/architecture.md']
        },
        { 
          title: 'Styling', url: 'Styling.html', 
          markdownPaths: ['md/overview/styling.md']
        },
        { 
          title: 'Rendering', url: 'Rendering.html', 
          markdownPaths: ['md/overview/rendering.md']
        },
      ]
    },
    {
      title: 'Other', 
      docFiles: [
        { categoryId: 'Component', title: 'Web Components' },
        { categoryId: 'ClientEvents', title: 'Client Events' },
        { categoryId: 'ServerEvents', title: 'Server Events' },
      ]
    },
    {
      title: 'Combined', 
      docFiles: [
        { directory: 'Types' },
        { directory: 'Variables' },
        { directory: 'Functions' },
        
      ]
    },
    {
      title: '@moviemasher', 
      docFiles: [
        { libOrRuntime: 'lib', clientServerOrShared: 'client' },
        { libOrRuntime: 'lib', clientServerOrShared: 'server' },
        { libOrRuntime: 'lib', clientServerOrShared: 'shared' },
        { libOrRuntime: 'runtime', clientServerOrShared: 'client' },
        { libOrRuntime: 'runtime', clientServerOrShared: 'server' },
        { libOrRuntime: 'runtime', clientServerOrShared: 'shared' },
      ]
    },
  ]
}