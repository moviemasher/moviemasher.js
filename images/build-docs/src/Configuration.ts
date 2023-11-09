import { DIR_ROOT, DIR_SOURCE, DIR_TEMPORARY } from './Constants.js'
import { ConfigurationRecord } from './Types.js'

export const CONFIGURATION: ConfigurationRecord = {
  combineDirectories: ['Types', 'Variables', 'Functions'],
  inputCategoryHtmlPath: `html/category.html`,
  inputCategoryMdDirectory: `md/category`,
  inputCombinedHtmlPath: `html/combined.html`,
  inputCombinedMdDirectory: `md/combined`,
  inputCssPath: `documentation.css`,
  inputFileHtmlPath: `html/file.html`,
  inputFolderHtmlPath: `html/folder.html`,
  inputOtherMdDirectory: 'md',
  inputPageHtmlPath: `html/page.html`,
  inputRoot: DIR_SOURCE,
  inputSectionHtmlPath: `html/section.html`,
  inputTypedocMdDirectory: `${DIR_TEMPORARY}/md`,
  outputCategoryPath: 'categories',
  outputCombinedPath: 'combined',
  outputExportPath: 'exports',
  outputOtherPath: 'guides',
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
    'Property',
    'Method',
    'CallSignature',
    'IndexSignature',
    'ConstructorSignature',
    'Parameter',
    'TypeLiteral',
    'TypeParameter',
    'Accessor',
    'GetSignature',
    'SetSignature',
    'TypeAlias',
    'Reference',
  ],
  files: [
    //  {
    //   title: 'Test', url: 'index.html', markdownPath: 'test.md'
    // },
    // {
    //   title: 'README', url: 'index.html', markdownPath: '/app/README.md'
    // },
    {
      title: 'Guides', 
      files: [
        { 
          title: 'End User', url: 'EndUser.html', 
          markdownPath: '/app/dev/documentation/guides/end-user.md' 
        },
        { 
          title: 'Client Developer', url: 'ClientDeveloper.html', 
          markdownPath: '/app/dev/documentation/guides/client-developer.md' 
        },
        { 
          title: 'Server Developer', url: 'ServerDeveloper.html', 
          markdownPath: '/app/dev/documentation/guides/server-developer.md' 
        },
        { 
          title: 'Contributer', url: 'Contributer.html', 
          markdownPath: '/app/dev/documentation/guides/contributor.md' 
        },
      ]
    },
    {
      title: 'Overview', 
      files: [
        { 
          title: 'Architecture', url: 'Architecture.html', 
          markdownPath: '/app/dev/documentation/overview/architecture.md' 
        },
        { 
          title: 'Styling', url: 'Styling.html', 
          markdownPath: '/app/dev/documentation/overview/styling.md' 
        },
        { 
          title: 'Rendering', url: 'Rendering.html', 
          markdownPath: '/app/dev/documentation/overview/rendering.md' 
        },
      ]
    },
    // {
    //   title: 'Core', 
    //   files: [
    //     { categoryId: 'Timings' },
    //     { exportId: 'ClientMashAsset' },
    //     { directory: 'Types' },
    //     { directory: 'Variables' },
    //     { directory: 'Functions' },
    //   ]
    // },
  ]
}