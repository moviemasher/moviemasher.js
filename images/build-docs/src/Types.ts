import type { Numbers, StringRecord, Strings } from '@moviemasher/runtime-shared'

export type TypedocDirectory = 'Types' | 'Variables' | 'Classes' | 'Functions' | 'Interfaces'

export type TypedocDirectories = Array<TypedocDirectory>

export type DocFile = DocMarkdown | DocCategory | DocCombined | DocExport
export type DocFileOrFolder = DocFile | DocFolder

export interface DocFilesAndFolders extends Array<DocFileOrFolder>{}

export interface DocFolder {
  title: string
  files: DocFiles
}

export interface DocExport {
  exportId: string
  url?: string
}

export interface DocMarkdown {
  title: string
  url: string
  markdownPath: string
}

export interface DocCategory {
  categoryId: string
}

export interface DocCombined {
  directory: TypedocDirectory
}


export interface DocFiles extends Array<DocFile>{}

export interface ConfigurationRecord {
  combineDirectories?: TypedocDirectories
  files: DocFilesAndFolders
  inputCategoryHtmlPath: string
  inputCategoryMdDirectory: string
  inputCombinedHtmlPath: string
  inputCombinedMdDirectory: string
  inputCssPath: string
  inputFileHtmlPath: string
  inputFolderHtmlPath: string
  inputOtherMdDirectory: string
  inputPageHtmlPath: string
  inputRoot: string
  inputSectionHtmlPath: string
  inputTypedocMdDirectory: string
  outputCategoryPath: string
  outputCombinedPath: string
  outputExportPath: string
  outputOtherPath: string
  outputRoot: string
  sortKinds: Strings
  typedocJsonPath: string
}

export interface RawDeclaration {
  id: number
  name: string
  kind: number
  children: RawDeclarations
  categories: RawCategories
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
export type CategoryIds = Array<CategoryId>

export type ExportIds = Array<ExportId>

export type ExportsByCategory = Record<CategoryId, ExportIds>

export type ExportsByCombined = {
  [index in TypedocDirectory]?: ExportIds
}

export type Kind = 'Accessor' | 'CallSignature' | 'Class' | 'Constructor' | 'ConstructorSignature' | 'Enum' | 'EnumMember' | 'Function' | 'GetSignature' | 'IndexSignature' | 'Interface' | 'Method' | 'Module' | 'Namespace' | 'Parameter' | 'Project' | 'Property' | 'Reference' | 'SetSignature' | 'TypeAlias' | 'TypeLiteral' | 'TypeParameter' | 'Variable'

export type DirectoriesByKind = {
  [index in Kind]?: TypedocDirectory
}

export type ExportRecord = Record<ExportId, string>


export interface Rendered extends StringRecord {}

export interface Rendereds extends Array<Rendered>{}

