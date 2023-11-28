import type { DocCategory, DocCombined, DocFolder, DocMarkdown, DocFile, TypedocDirectories, TypedocDirectory, DocExport, Kind, DocModule, DocHtml, Doc, Folder, Page } from './Types.js'

import { isObject, isPopulatedString } from '@moviemasher/runtime-shared'
import { isPopulatedArray } from '@moviemasher/lib-shared/utility/guards.js'

export const DIR_ROOT = '/app'
export const DIR_TEMPORARY = `${DIR_ROOT}/temporary/build-docs`
export const DIR_SOURCE = `${DIR_ROOT}/images/build-docs/src`
export const EXTENSION_MARKDOWN = '.md'
export const EXTENSION_HTML = '.html'

export const HASH = '#'

export const DIRECTORIES: TypedocDirectories = [
  'Classes',
  'Functions',
  'Interfaces',
  'Types',
  'Variables',
]


export const isFolder = (value: any): value is Folder => {
  return isObject(value) && 'pages' in value && isPopulatedArray(value.pages)
}

export const isPage = (value: any): value is Page => !isFolder(value)


export const isDoc = (value: any): value is Doc => {
  return isDocMarkdown(value) || isDocHtml(value)
}

export const isTypedocDirectory = (value: any): value is TypedocDirectory => {
  return isPopulatedString(value) && DIRECTORIES.includes(value as TypedocDirectory)
}

export const isDocMarkdown = (value: any): value is DocMarkdown => {
  return isObject(value) && 'markdownPaths' in value && isPopulatedArray(value.markdownPaths)
}

export const isDocHtml = (value: any): value is DocHtml => {
  return isObject(value) && 'htmlPaths' in value && isPopulatedArray(value.htmlPaths)
}

export const isDocExport = (value: any): value is DocExport => {
  return isObject(value) && 'exportId' in value && isPopulatedString(value.exportId)
}

export const isDocModule = (value: any): value is DocModule => {
  return isObject(value) && 'libOrRuntime' in value && 'clientServerOrShared' in value
}

export const isDocCategory = (value: any): value is DocCategory => {
  return isObject(value) && 'categoryId' in value && isPopulatedString(value.categoryId)
}

export const isDocCombined = (value: any): value is DocCombined => {
  return isObject(value) && 'directory' in value && isTypedocDirectory(value.directory)
}

export const isDocFile = (value: any): value is DocFile => {
  return isDocCategory(value) 
    || isDocCombined(value) 
    || isDocExport(value)
    || isDocModule(value)
    || isDoc(value)
}

export const isDocFolder = (value: any): value is DocFolder => {
  return isObject(value) && 'docFiles' in value && Array.isArray(value.docFiles)
}

const CODE_BY_KIND: Record<Kind, number> = {
  Accessor: 0x40000,
  CallSignature: 0x1000,
  Class: 0x80,
  Constructor: 0x200,
  ConstructorSignature: 0x4000,
  Enum: 0x8,
  EnumMember: 0x10,
  Function: 0x40,
  GetSignature: 0x80000,
  IndexSignature: 0x2000,
  Interface: 0x100,
  Method: 0x800,
  Module: 0x2,
  Namespace: 0x4,
  Parameter: 0x8000,
  Project: 0x1,
  Property: 0x400,
  Reference: 0x400000,
  SetSignature: 0x100000,
  TypeAlias: 0x200000,
  TypeLiteral: 0x10000,
  TypeParameter: 0x20000,
  Variable: 0x20,
} as const

export const declarationKind = (kind: number): string => {
  const entries = Object.entries(CODE_BY_KIND)
  const entry = entries.find(([, value]) => value === kind)
  if (!entry) return ''

  const [name] = entry
  return name
}
