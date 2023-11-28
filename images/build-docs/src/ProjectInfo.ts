import type { DataOrError, Strings } from '@moviemasher/runtime-shared'

import { fileReadJsonPromise } from '@moviemasher/lib-server'
import { DOT, isDefiniteError } from '@moviemasher/runtime-shared'
import fs from 'fs'
import path from 'path'
import { DIRECTORIES, EXTENSION_MARKDOWN, declarationKind } from './Constants.js'
import { CategoryId, CategoryIds, DocumentationConfiguration, ExportId, ExportIds, ExportRecord, ExportsByCategory, ExportsByCombined, RawDeclaration, RawProject, TypedocDirectory } from './Types.js'

const CATEGORY_OTHER = 'Other'

const nameFromFile = (file: string): string => {  
  return path.basename(file, EXTENSION_MARKDOWN).split(DOT)[1]
}

export class ProjectInfo {
  categoryForExportId(exportId: ExportId): string | undefined {
    const declaration = this.declarationFromName(exportId)
    if (!declaration) return 

    const { id } = declaration
    const { categories = [] } = this.rawProject
    for (const category of categories) {
      const { title } = category
      if (title !== CATEGORY_OTHER) {
        const { children } = category
        if (children.includes(id)) return title
      }
    }
  }

  private _categoryIds?: CategoryIds
  get categoryIds(): CategoryIds { 
    if (this._categoryIds) return this._categoryIds

    const { categories = [] } = this.rawProject
    const defined = categories.flatMap(category => {
      const { title } = category
      return title === CATEGORY_OTHER ? [] : [title]
    })
    return this._categoryIds = defined
  }

  private _configuration?: DocumentationConfiguration
  private get configuration() { return this._configuration! }

  async configure(configuration: DocumentationConfiguration): Promise<DataOrError<string>> { 
    this._configuration = configuration
    const { typedocJsonPath } = configuration
    const infoOrError = await fileReadJsonPromise<RawProject>(typedocJsonPath)
    if (isDefiniteError(infoOrError)) return infoOrError

    this._rawProject = infoOrError.data
    this._filesByExportId = Object.fromEntries(DIRECTORIES.flatMap(directory => {
      const fileNames = this.filesInDirectory(directory)
      return fileNames.map(file => {
        const name = nameFromFile(file) 
        return [name, path.join(directory, file)]
      })
    }))
    return { data: 'ok' }
  }
  
  declarationFromName(name: string): RawDeclaration | undefined {
    const { children } = this.rawProject
    return children.find(declaration => declaration.name === name)
  }

  declarationFromId(id: number): RawDeclaration | undefined {
    const { children } = this.rawProject
    return children.find(declaration => declaration.id === id)
  }


  sortDeclarations = (a: RawDeclaration, b: RawDeclaration) => {
    const { configuration } = this
    const { sortKinds } = configuration
    const aIndex = sortKinds.indexOf(declarationKind(a.kind))
    const bIndex = sortKinds.indexOf(declarationKind(b.kind))
    return aIndex - bIndex
  }

  private _exportsByCategory: ExportsByCategory | undefined
  get exportsByCategory(): ExportsByCategory {
    const { _exportsByCategory } = this
    if (_exportsByCategory) return _exportsByCategory

    const { rawProject } = this

    const { categories = [] } = rawProject
    const byCategory: ExportsByCategory = {}
    for (const category of categories) {
      const { title, children } = category
      if (title !== CATEGORY_OTHER) {
        const declarations = children.map(id => {
          const declaration = this.declarationFromId(id)
          if (!declaration) throw new Error(`no declaration for ${id} in ${title}`)

          return declaration
        })
        declarations.sort(this.sortDeclarations.bind(this))
        byCategory[title] = declarations.map(declaration => declaration.name)
      }
    }
    return this._exportsByCategory = byCategory
  }

  private _exportsByCombined?: ExportsByCombined
  get exportsByCombined(): ExportsByCombined {
    const { _exportsByCombined } = this
    if (_exportsByCombined) return _exportsByCombined

    const { combineDirectories = [] } = this.configuration
    const byCombined: ExportsByCategory = Object.fromEntries(combineDirectories.map(directory => {
      const names = this.filesInDirectory(directory).map(nameFromFile)
      const declarations = names.map(name => {
        const declaration = this.declarationFromName(name)
        if (!declaration) throw new Error(`no declaration for ${name} in ${directory}`)
        return declaration
      })
      declarations.sort(this.sortDeclarations.bind(this))
      return [directory, declarations.map(declaration => declaration.name)]
    }))
    return this._exportsByCombined = byCombined
  }

  private _exportIds?: ExportIds
  get exportIds(): ExportIds {
    return this._exportIds ||= Object.keys(this.filesByExportId)
  }

  private _filesByExportId?: ExportRecord 
  get filesByExportId(): ExportRecord { return this._filesByExportId! }

  private filesInDirectory(directory: TypedocDirectory): Strings {
    const { configuration } = this
    const { inputTypedocMdDirectory } = configuration

    const dir = path.join(inputTypedocMdDirectory, directory.toLowerCase())
    if (!fs.existsSync(dir)) return []
    
    const fileNames = fs.readdirSync(dir)
    return fileNames.filter(file => path.extname(file) === EXTENSION_MARKDOWN)
  }

  isCategoryId(value: string) {
    return this.categoryIds.includes(value)
  }

  isExportId(value: string) {
    return this.exportIds.includes(value)
  }

  isCombinedExportId(value: string) {
    const { exportsByCategory } = this
    const exports = Object.values(exportsByCategory).flat()
    return exports.includes(value)
  }

  private _rawProject?: RawProject
  private get rawProject(): RawProject { return this._rawProject! }
}

