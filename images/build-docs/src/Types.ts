import type { Numbers, StringRecord, Strings } from '@moviemasher/shared-lib/types.js'

export type LibOrRuntime = 'express' | 'lib' | 'react'
export type ClientServerOrShared = 'client' | 'server' | 'shared'

export const LIB_OR_RUNTIMES: Array<LibOrRuntime> = ['express', 'react', 'lib']
export const CLIENT_SERVER_OR_SHAREDS: Array<ClientServerOrShared> = ['client', 'server', 'shared']

export const isLibOrRuntime = (value: any): value is LibOrRuntime => {
  return LIB_OR_RUNTIMES.includes(value as LibOrRuntime)
}

export const isClientServerOrShared = (value: any): value is ClientServerOrShared => {
  return CLIENT_SERVER_OR_SHAREDS.includes(value as ClientServerOrShared)
}

export type TypedocDirectory = 'Types' | 'Variables' | 'Classes' | 'Functions' | 'Interfaces'

export type TypedocDirectories = Array<TypedocDirectory>


export interface Folder {
  title: string
  pages: Pages
}

export interface Page {
  title?: string
  url?: string
  templatePath?: string
}

export interface Pages extends Array<Page>{}

export interface DocMarkdown extends Page {
  title: string
  url: string
  markdownPaths: string[]
}

export interface DocHtml extends Page {
  title: string
  url: string
  htmlPaths: string[]
  javascriptPaths?: string[]
  cssPaths?: string[]

}
export type Doc = DocHtml | DocMarkdown


export interface DocsPage extends Page {

}

export interface Anchor {
  anchor: string
  title: string
}

export interface Anchors extends Array<Anchor>{}

export type DocFile = Doc | DocCategory | DocCombined | DocExport | DocModule
export type DocFileOrFolder = DocFile | DocFolder

export type DocOrFolder = Doc | DocFolder
export interface DocsAndFolders extends Array<DocOrFolder>{}

export interface DocFilesAndFolders extends Array<DocFileOrFolder>{}

export interface DocModule extends DocsPage {
  libOrRuntime: LibOrRuntime
  clientServerOrShared: ClientServerOrShared
}


export interface DocFolder {
  title?: string
  docFiles: DocFiles
  excludeFromNav?: boolean
}

export interface DocExport extends DocsPage {
  exportId: string
  url?: string
}

export interface DocCategory extends DocsPage {
  categoryId: string
  title?: string
}

export interface DocCombined extends DocsPage {
  directory: TypedocDirectory
}

export interface DocFiles extends Array<DocFile>{}

export interface BuilderConfiguration {
  inputRoot: string
  outputRoot: string
}

export interface SiteConfiguration extends BuilderConfiguration {
  docsAndFolders: DocsAndFolders
}

export interface DocumentationConfiguration extends BuilderConfiguration {
  combineDirectories?: TypedocDirectories
  docFilesAndFolders: DocFilesAndFolders
  inputModuleMdDirectory: string
  inputCategoryHtmlPath: string
  inputCategoryMdDirectory: string
  inputCombinedHtmlPath: string
  inputCombinedMdDirectory: string
  inputModulesMdDirectory: string
  inputCssPaths: string[]
  inputFileHtmlPath: string
  inputFolderHtmlPath: string
  inputPageHtmlPath: string
  inputSectionHtmlPath: string
  inputTypedocMdDirectory: string
  outputCategoryPath: string
  outputCombinedPath: string
  outputModulePath: string 
  outputExportPath: string
  outputOtherPath: string
  sortKinds: Strings
  typedocJsonPath: string
  outputCssPath: string
}

export interface RawDeclaration {
  id: number
  name: string
  kind: number
  children: RawDeclarations
  categories?: RawCategories
}

export interface RawDeclarations extends Array<RawDeclaration> {}

export interface RawCategory {
  title: string
  children: Numbers
}

export interface RawCategories extends Array<RawCategory> {}

export interface RawProject extends RawDeclaration {}


export type ExportId = string
export type CategoryId = string

export interface CategoryIds extends Array<CategoryId> {}

export interface ExportIds extends Array<ExportId> {}

export interface ExportsByCategory extends Record<CategoryId, ExportIds> {}

export interface ExportsByCombined extends Record<TypedocDirectory, ExportIds> {}
//   [index in TypedocDirectory]?: ExportIds
// }

export type Kind = 'Accessor' | 'CallSignature' | 'Class' | 'Constructor' | 'ConstructorSignature' | 'Enum' | 'EnumMember' | 'Function' | 'GetSignature' | 'IndexSignature' | 'Interface' | 'Method' | 'Module' | 'Namespace' | 'Parameter' | 'Project' | 'Property' | 'Reference' | 'SetSignature' | 'TypeAlias' | 'TypeLiteral' | 'TypeParameter' | 'Variable'

export interface ExportRecord extends Record<ExportId, string> {}

export interface Rendered extends StringRecord {}

export interface Rendereds extends Array<Rendered>{}

