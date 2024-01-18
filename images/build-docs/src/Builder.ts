import type { DataOrError, StringRecord, Strings, StringsRecord } from '@moviemasher/shared-lib/types.js'
import type { MarkedOptions } from 'marked'
import type { Theme } from "shiki"
import type { Anchor, ClientServerOrShared, DocumentationConfiguration, DocCategory, DocCombined, DocExport, DocFile, DocFileOrFolder, DocFiles, DocFilesAndFolders, DocFolder, DocHtml, DocMarkdown, DocModule, ExportId, ExportIds, ExportRecord, LibOrRuntime, Rendered, Rendereds, TypedocDirectory } from './Types.js'

import { fileReadPromise, fileWritePromise, urlIsHttp } from '@moviemasher/server-lib'
import { assertArray, assertPopulatedString } from '@moviemasher/shared-lib'
import { DASH, DOT, ERROR, SLASH, arrayUnique, errorThrow, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { marked } from 'marked'
import path from 'path'
import { BUNDLED_LANGUAGES, BUNDLED_THEMES, getHighlighter } from "shiki"
import { EXTENSION_HTML, EXTENSION_MARKDOWN, HASH, isDoc, isDocCategory, isDocCombined, isDocExport, isDocFile, isDocFolder, isDocHtml, isDocMarkdown, isDocModule, isTypedocDirectory } from './Constants.js'
import { DoubleHighlighter } from './DoubleHighlighter.js'
import { ProjectInfo } from './ProjectInfo.js'
import { isClientServerOrShared, isLibOrRuntime } from './Types.js'

// console.log('BUNDLED_THEMES', BUNDLED_THEMES)
const CLASS = 'CLASS'
const CSS = 'CSS'
const ID = 'ID'
const LINKS = 'LINKS'
const NAV_LEFT = 'NAV-LEFT'
const NAV_RIGHT = 'NAV-RIGHT'
const OPEN = 'OPEN'
const SECTION = 'SECTION'
const SECTIONS = 'SECTIONS'
const TITLE = 'TITLE'
const URL = 'URL'
const PREFIX_SECTION = '## '
const STYLE = 'STYLE'

const SELECTED = 'selected'
// import markdownMagic from 'markdown-magic'
// const markdownPath = path.join(__dirname, 'README.md')
// const magicConfig: Configuration = {}
// markdownMagic(markdownPath, magicConfig)


const stripTags = (text: string): string => text.replace(/<[^>]*>?/gm, '')

const skillPhrases = ['Returns', 'Overrides', 'Inherited from']

const cleanMarkdown = (text: string): string => {
  const lines = text.split('\n')
  let skipping: string | undefined = ''
  const cleaned: Strings = [] 
  for (const line of lines) {
    if (skipping) {
      skipping = ''
      continue
    }
    if (line.startsWith('#### ')) {
      skipping = skillPhrases.find(phrase => line.endsWith(phrase))
      if (skipping) {
        cleaned.push('', skipping)
        continue
      }
    }
    const noLessThan = line.replaceAll('&lt;', '<')
    const noGreaterThan = noLessThan.replaceAll('&gt;', '>')
    // const noAmpersand = noGreaterThan.replaceAll('&amp;', '&')
    cleaned.push(noGreaterThan)
  }
  return cleaned.join('\n')
}

const REGEX_DOUBLE_BRACKETS = /\[\[(.*?)\]\]/g

export class Builder {
  private absoluteForCategory(category: string, exportId?: ExportId): string {
    const { configuration } = this
    const { outputRoot, outputCategoryPath } = configuration
    const components = [category, EXTENSION_HTML]
    if (exportId) components.push(HASH, exportId)
    const fileName = components.join('')
    const urlPath = path.resolve(outputRoot, outputCategoryPath, fileName)
    // console.log('absoluteForCategory', { urlPath, outputRoot, outputCategoryPath, category })
    return urlPath
  }

  private absoluteForCombined(directory: TypedocDirectory, exportId?: ExportId): string {
    const { configuration } = this
    const { outputRoot, outputCombinedPath } = configuration
    const components = [directory, EXTENSION_HTML]
    if (exportId) components.push(HASH, exportId)
    const fileName = components.join('')
    const urlPath = path.resolve(outputRoot, outputCombinedPath, fileName)
    // console.log('absoluteForCombined', { urlPath, outputRoot, outputCombinedPath, directory })
    return urlPath
  }

  private absoluteForDocFile(docFile: DocFile): string {
    if (isDoc(docFile)) return this.absoluteForDoc(docFile.url)
    if (isDocCombined(docFile)) return this.absoluteForCombined(docFile.directory)
    if (isDocCategory(docFile)) return this.absoluteForCategory(docFile.categoryId)
    if (isDocExport(docFile)) return this.absoluteForExport(docFile.exportId)
    if (isDocModule(docFile)) return this.absoluteForModule(docFile.libOrRuntime, docFile.clientServerOrShared)
    return ''
  }

  private absoluteForExport(exportId: ExportId): string {
    const { configuration, exportRecord: renderedExportIds } = this
    const { [exportId]: rendered } = renderedExportIds
    if (rendered) return rendered

    const { outputRoot, outputExportPath } = configuration
    const fileName = [exportId, EXTENSION_HTML].join('')
    const urlPath = path.resolve(outputRoot, outputExportPath, fileName)
    // console.log('absoluteForExport', { urlPath, outputRoot, outputExportPath, exportId })
    return urlPath
  }

  private absoluteForDoc(url: string): string {
    const { configuration } = this
    const { outputRoot, outputOtherPath } = configuration
    const urlPath = path.resolve(outputRoot, outputOtherPath, url)
    return urlPath
  }
  
  private absoluteForModule(libOrRuntime: LibOrRuntime, clientServerOrShared: ClientServerOrShared): string {
    const { configuration } = this
    const { outputRoot, outputOtherPath } = configuration
    const basename = [clientServerOrShared, libOrRuntime].join(DASH)
    const fileName = [basename, EXTENSION_HTML].join('')
    const urlPath = path.resolve(outputRoot, outputOtherPath, fileName)
    // console.log('absoluteForModule', { urlPath, outputRoot, outputModulePath, clientServerOrShared, libOrRuntime })
    return urlPath
  }

  private _configuration?: DocumentationConfiguration
  private get configuration() { return this._configuration! }

  private get configuredDocFiles(): DocFiles {
    const { docFilesAndFolders } = this.configuration
    return docFilesAndFolders.flatMap(file => isDocFile(file) ? [file] : file.docFiles)
  }

  private _docFilesAndFolders?: DocFilesAndFolders
  protected get docFilesAndFolders(): DocFilesAndFolders {
    return this._docFilesAndFolders ||= this.docFilesAndFoldersInitialize
  }
  protected get docFilesAndFoldersInitialize(): DocFilesAndFolders { 
    const { docFilesAndFolders } = this.configuration
    const { projectInfo, exportRecord: renderedExportIds } = this
    const done = Object.keys(renderedExportIds)
    const { exportIds } = projectInfo
    const remaining = exportIds.filter(id => !done.includes(id))
    
    const docFiles = remaining.map(exportId => {
      return { exportId }
    })
    const docFolder: DocFolder = { docFiles, excludeFromNav: true }

    return [...docFilesAndFolders, docFolder]
  }

  private docTitle(docFile: DocFile | Anchor): string {
    if (isDocCombined(docFile)) return docFile.directory
    if (isDocCategory(docFile)) return docFile.title || docFile.categoryId
    if (isDocExport(docFile)) return docFile.exportId
    if (isDocModule(docFile)) return [docFile.clientServerOrShared, docFile.libOrRuntime].join(DASH)

    return docFile.title
  }

  private markdownSections(mdText: string, title: string = ''): StringRecord[] {
    const lines = mdText.split('\n')
    // console.log('markdownSections', mdText.length, lines.length)
    const [firstLine] = lines
    if (!firstLine.startsWith(PREFIX_SECTION)) {
      lines.unshift(`${PREFIX_SECTION}${title}`)
    }
    const sections: StringRecord[] = []

    let inSection: StringRecord | undefined 
    const sectionLines: Strings = []
    lines.forEach(line => {
      if (line.startsWith(PREFIX_SECTION)) {
        if (inSection) {
          sections.push({...inSection, [SECTION]: this.parseMarkdown(sectionLines.join('\n'))})
          sectionLines.length = 0
        }
        inSection = { [ID]: line.slice(PREFIX_SECTION.length) }
      } else sectionLines.push(line)
    })
    if (inSection) sections.push({ ...inSection, [SECTION]: this.parseMarkdown(sectionLines.join('\n'))})
    return sections
  }

  private mdParseCode(text: string, language?: string): string | false {    
    // return `<pre>${language} ${text.length}</pre>`
    // console.log('code', text.length, language)
    const lang = (language || "typescript").toLowerCase()
    if (!this.isSupportedLanguage(lang)) return text

    const highlighted = this.highlight(text, lang)
    
    return `<pre><code>${highlighted}</code></pre>`
  }

  private mdParseCodespan(text: string): string | false {
    const url = this.url(text)
    if (!url) return false
   
    return `<code><a href='${url}'>${text}</a></code>`
  }

  private findDocModule = (title: string, filesAndFolders: DocFilesAndFolders): DocModule | undefined => {
    for (const file of filesAndFolders) {
      if (isDocFolder(file)) {
        const found = this.findDocModule(title, file.docFiles)
        if (found) return found
      }
      if (isDocModule(file) && this.docTitle(file) === title) return file
    }
  }

  private url(text: string): string | false {
    const { projectInfo } = this
    const doc = this.configuredDocFiles.find(file => this.docTitle(file) === text)
    if (doc) return this.relativeForDocFile(doc)

    if (projectInfo.isCategoryId(text)) {
      return this.relativeForCategory(text)
    } 
    if (projectInfo.isExportId(text)) {
      return this.relativeForExport(text)
    } 
    return false
  }


  private mdParseLink(href: string, title: string | null | undefined, text: string): string | false {
    if (urlIsHttp(href)) return false

    if (text.includes('<a href=')) return text

    // eg. href = 'runtime_shared_src.Instance.md#targetid'
    // eg. href = 'lib_client_src.md'
  
    let name = text
    let url = this.url(name)

    if (!url) {
      const [fullName, anchor = ''] = href.split(HASH)
      const basename = path.basename(fullName)
      const components = basename.split(DOT)
      const extension = components.pop() || ''
  
      if (EXTENSION_HTML.endsWith(extension)) {
        const { docFilesAndFolders } = this.configuration
        const docModule = this.findDocModule(basename, docFilesAndFolders)
        if (!docModule) return false

        const { clientServerOrShared, libOrRuntime } = docModule
        url = this.relativeForModule(libOrRuntime, clientServerOrShared)
      
      } else {
        if (!EXTENSION_MARKDOWN.endsWith(extension)) {
          // console.log('mdParseLink NOT md or html', { href, text })
          return false
        }
        const { projectInfo } = this
        const { length } = components
        const [prefix, exportId] = components

    
        switch (length) {
          case 1: {
            // console.log('mdParseLink md', { href, text })
            const [clientServerOrShared, libOrRuntime, src] = prefix.split('_')
            if (
              src === 'src' 
              && isLibOrRuntime(libOrRuntime)
              && isClientServerOrShared(clientServerOrShared)
            ) {
              url = this.relativeForModule(libOrRuntime, clientServerOrShared)
              if (name.endsWith('/src')) {
                name = [clientServerOrShared, libOrRuntime].join(DASH)
              }
            } else {
              // console.log('mdParseLink NOT SRC', { href, text })
            }
            break
          }
          case 2: {
            if (projectInfo.isExportId(exportId)) {
              const anchorComponents: Strings = []
              if (anchor) anchorComponents.push(exportId, anchor)
              url = this.relativeForExport(exportId, anchorComponents.join(DOT))
            } else {
              // console.log('mdParseLink NOT EXPORT', { href, text })
              return false
            } 
            break
          }
        }
      }
    }

    if (!url) return false
   
    return `<a href="${url}">${name}</a>`
  }

  private mdParseText(text: string): string | false {
    const replaced = text.replaceAll(REGEX_DOUBLE_BRACKETS, (_match, name) => {
      const url = this.relativeForName(name)
      if (!url) return name

      return `<a href="${url}">${name}</a>`
    })
    return replaced
  }

  private mdParseHeading(text: string, level: number, raw: string): string | false {
    if (level === 3) {
      const { renderingExportId } = this
      if (renderingExportId) {
        if (text !== raw) console.log('heading', { text, level, raw })
        this.anchorsByExportId[renderingExportId] ||= []
        this.anchorsByExportId[renderingExportId].push(text)
        return `<h${level}><a id="${renderingExportId}.${text}">${text}</a></h${level}>`
      } 
    }
    return false
  }

  private anchorsByExportId: StringsRecord = {}

  private mdParserInitialized = false
  private get mdParser() {
    if (!this.mdParserInitialized) {
      this.mdParserInitialized = true
      marked.use({
        renderer: {
          heading: this.mdParseHeading.bind(this),
          text: this.mdParseText.bind(this),
          code: this.mdParseCode.bind(this),
          link: this.mdParseLink.bind(this),
          codespan: this.mdParseCodespan.bind(this),
         
        }
      })
    } 
    return marked
  }

  private parseTemplate = (template: string, record: StringRecord = {}): string => {
    return Object.entries(record).reduce((acc, entry) => {
      const [key, value] = entry
      const pattern = `{${key}}`
      return acc.replaceAll(pattern, value)
    }, template)
  }

  private parseMarkdown(input: string): string {
    const mdText = cleanMarkdown(input)
    const options: MarkedOptions = {
      breaks: false,
      gfm: true,
      pedantic: false,
      silent: false,
    }
    return this.mdParser.parse(mdText, options)
  }

  private async parsedFile(inputFile: string): Promise<DataOrError<string>> {
    const inputOrError = await fileReadPromise(inputFile) 
    if (isDefiniteError(inputOrError)) throw inputOrError

    const html = this.parseMarkdown(inputOrError.data)
    return { data: html }
  }

  private _projectInfo?: ProjectInfo
  get projectInfo() { return this._projectInfo ||= new ProjectInfo()  }

  private relativeFromRenderingFile(toPath: string, anchor = ''): string {
    const { renderingFile, configuration } = this
    const { outputRoot } = configuration
    const fromPath = renderingFile ? this.absoluteForDocFile(renderingFile) : outputRoot
    if (fromPath === toPath) return `${HASH}${anchor}`

    const relativeDir = path.relative(path.dirname(fromPath), path.dirname(toPath))
    const relative = path.join(relativeDir, path.basename(toPath))
    const components: Strings = [relative]
    if (anchor) components.push(anchor)
    return components.join(HASH)
  }

  private relativeForCategory(category: string, exportId?: ExportId): string {
    return this.relativeFromRenderingFile(this.absoluteForCategory(category, exportId))
  }

  private relativeForCombined(directory: TypedocDirectory, exportId?: ExportId): string {
    return this.relativeFromRenderingFile(this.absoluteForCombined(directory, exportId))
  }

  private relativeForCss(): string {
    const { configuration } = this
    const { outputRoot, outputCssPath } = configuration
    const outputPath = path.resolve(outputRoot, outputCssPath)
    return this.relativeFromRenderingFile(outputPath)
  }

  private relativeForDocFile(docFile: DocFile | Anchor): string {
    if (isDoc(docFile)) return this.relativeForDoc(docFile.url)
    if (isDocCombined(docFile)) return this.relativeForCombined(docFile.directory)
    if (isDocCategory(docFile)) return this.relativeForCategory(docFile.categoryId)
    if (isDocExport(docFile)) return this.relativeForExport(docFile.exportId)
    if (isDocModule(docFile)) return this.relativeForModule(docFile.libOrRuntime, docFile.clientServerOrShared)
    return `#${docFile.anchor}`
  }
  
  private relativeForExport(exportId: ExportId, anchor = ''): string {
    return this.relativeFromRenderingFile(this.absoluteForExport(exportId), anchor)
  }

  private relativeForDoc(url: string): string {
    return this.relativeFromRenderingFile(this.absoluteForDoc(url))
  }

  private relativeForModule(libOrRuntime: LibOrRuntime, clientServerOrShared: ClientServerOrShared): string {
    return this.relativeFromRenderingFile(this.absoluteForModule(libOrRuntime, clientServerOrShared))
  }
  
  private relativeForName(name: string): string {
    const { projectInfo } = this
    if (projectInfo.isCategoryId(name)) return this.relativeForCategory(name)

    if (isTypedocDirectory(name)) return this.relativeForCombined(name)

    const category = projectInfo.categoryForExportId(name)
    if (category) return this.relativeForCategory(category, name)

    if (projectInfo.isExportId(name)) return this.relativeForExport(name)

    const markdownFiles = this.configuredDocFiles.filter(isDoc)
    const markdownFile = markdownFiles.find(file => file.title === name)
    if (markdownFile) return this.relativeForDoc(markdownFile.url)

    return ''
  }

  private renderCss = async (): Promise<DataOrError<Rendered>> => {
    const { configuration } = this
    const { inputCssPaths, outputRoot, outputCssPath } = configuration

    const outputPath = path.resolve(outputRoot, outputCssPath)

    const readOrError = await this.textFromFiles(inputCssPaths)
    if (isDefiniteError(readOrError)) return readOrError

    const { data: text } = readOrError
    const cssText = [text, this.getStyles()].join('\n')

    const wroteOrError = await fileWritePromise(outputPath, cssText)
    if (isDefiniteError(wroteOrError)) return wroteOrError

    return { data: { path: outputPath } }
  }

  private renderDocCategory = async (docPage: DocCategory): Promise<DataOrError<Rendered>> => {
    const { categoryId, title } = docPage
    const { projectInfo, configuration } = this
    const { 
      inputRoot, inputCategoryMdDirectory, outputRoot, outputCategoryPath,
      inputCategoryHtmlPath
    } = configuration

    const categoryTemplate = await this.templateRead(inputCategoryHtmlPath)
    const { exportsByCategory } = projectInfo
   
    const htmlFilename = [categoryId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCategoryPath, htmlFilename)
    const { [categoryId]: exportIds = [] } = exportsByCategory
    exportIds.sort()
    const contentOrError = await this.renderExportIds(exportIds)
    if (isDefiniteError(contentOrError)) return contentOrError

    const mdPath = path.resolve(inputRoot, inputCategoryMdDirectory, [categoryId, EXTENSION_MARKDOWN].join(''))
    const introOrError = await this.parsedFile(mdPath)
    if (isDefiniteError(introOrError)) return introOrError

    const categoryRecord: StringRecord = {
      [ID]: title || categoryId, 
      [SECTIONS]: contentOrError.data, 
      [SECTION]: introOrError.data,
    }
    const sectionsHtml = this.parseTemplate(categoryTemplate, categoryRecord)
    exportIds.unshift(categoryId)
    return this.renderPage(htmlPath, sectionsHtml, exportIds)
  }

  private renderDocCombined = async (docPage: DocCombined): Promise<DataOrError<Rendered>> => {
    const { directory } = docPage
    const { projectInfo, configuration } = this
     const { 
      inputCategoryHtmlPath,
      inputRoot, inputCombinedMdDirectory, outputRoot, outputCombinedPath
    } = configuration
    
    const categoryTemplate = await this.templateRead(inputCategoryHtmlPath)
   
    const htmlFilename = [directory, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCombinedPath, htmlFilename)
    const { exportsByCombined } = projectInfo
    const { [directory]: exportIds } = exportsByCombined

    exportIds.sort()
    const contentOrError = await this.renderExportIds(exportIds)
    if (isDefiniteError(contentOrError)) return contentOrError

    const mdFilename = [directory, EXTENSION_MARKDOWN].join('')
    const mdPath = path.resolve(inputRoot, inputCombinedMdDirectory, mdFilename)
    const introOrError = await this.parsedFile(mdPath)
    if (isDefiniteError(introOrError)) return introOrError

    const categoryRecord: StringRecord = {
      [ID]: directory, 
      [SECTIONS]: contentOrError.data, 
      [SECTION]: introOrError.data,
    }
    const sectionsHtml = this.parseTemplate(categoryTemplate, categoryRecord)
   
    exportIds.unshift(directory)
    return this.renderPage(htmlPath, sectionsHtml, exportIds)
  }

  private renderDocExport = async (docPage: DocExport): Promise<DataOrError<Rendered>> => {
    const { exportId } = docPage
    const { configuration } = this
    const { outputRoot, outputExportPath } = configuration
    this.anchorsByExportId[exportId] ||= []
    const htmlOrError = await this.renderExportIds([exportId])
    if (isDefiniteError(htmlOrError)) return htmlOrError

    const htmlFilename = [exportId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputExportPath, htmlFilename)
    const exportIds = [...this.anchorsByExportId[exportId]]
   
    const record: StringRecord = {
      [exportId]: exportId,
      ...Object.fromEntries(exportIds.map(id => [id, `${exportId}.${id}`]))
    }
    
    return this.renderPage(htmlPath, htmlOrError.data, record)
  }

  // private renderDocExports = async (): Promise<DataOrError<Rendereds>> => {
  //   const { projectInfo, exportRecord: renderedExportIds } = this
  //   const done = Object.keys(renderedExportIds)
  //   const { exportIds } = projectInfo
  //   const remaining = exportIds.filter(id => !done.includes(id))
    
  //   const rendereds: Rendereds = []
  //   for (const exportId of remaining) {
  //     const renderedOrError = await this.renderDocFileOrFolder({ exportId })
  //     if (isDefiniteError(renderedOrError)) return renderedOrError

  //     rendereds.push(...renderedOrError.data)
  //   }
  //   return { data: rendereds }
  // }
  
  private renderDocFileOrFolder = async (docFile: DocFileOrFolder): Promise<DataOrError<Rendereds>> => {
    const rendereds: Rendereds = []
    if (isDocFolder(docFile)) {
      const { docFiles } = docFile
      if (docFiles?.length) {
        const renderedsOrError = await this.renderDocFilesAndFolders(docFiles)
        if (isDefiniteError(renderedsOrError)) return renderedsOrError

        rendereds.push(...renderedsOrError.data)
      }
    } else {
      this.renderingFile = docFile
      // console.log('renderDocFileOrFolder', docFile)
      if (isDocMarkdown(docFile)) {
        const renderedOrError = await this.renderDocMarkdown(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      } else if (isDocCategory(docFile)) {
        const renderedOrError = await this.renderDocCategory(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      } else if (isDocCombined(docFile)) {
        const renderedOrError = await this.renderDocCombined(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      } else if (isDocExport(docFile)) {
        const renderedOrError = await this.renderDocExport(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      } else if (isDocModule(docFile)) {
        const renderedOrError = await this.renderDocModule(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      } else if (isDocHtml(docFile)) {
        const renderedOrError = await this.renderDocHtml(docFile)
        if (isDefiniteError(renderedOrError)) return renderedOrError

        rendereds.push(renderedOrError.data)
      }
      delete this.renderingFile 
    } 
    return { data: rendereds }
  }

  private renderDocFilesAndFolders = async (docFilesAndFolders: DocFilesAndFolders): Promise<DataOrError<Rendereds>> => {
    const rendereds: Rendereds = []
    for (const file of docFilesAndFolders) {
      const renderedOrError = await this.renderDocFileOrFolder(file)
      if (isDefiniteError(renderedOrError)) return renderedOrError

      rendereds.push(...renderedOrError.data)
    }
    return { data: rendereds }
  }

  private renderMarkdown = (mdText: string, template: string, title: string = ''): StringRecord => {
    const records = this.markdownSections(mdText, title)
    return Object.fromEntries(records.map(record => {
      return [record[ID], this.parseTemplate(template, record)]
    }))
  }

  private textFromFiles = async (fragments: string[]): Promise<DataOrError<string>> => {
    const { configuration } = this
    const { inputRoot } = configuration
    const paths = fragments.map(file => path.resolve(inputRoot, file))
    const texts: Strings = []
    for (const path of paths) {
      const readOrError = await fileReadPromise(path)
      if (isDefiniteError(readOrError)) return readOrError

      texts.push(readOrError.data)
    }
    return { data: texts.join('\n') }
  }

  private renderPageSections = async (record: StringRecord, outputPath: string): Promise<DataOrError<Rendered>> => {
    const sections = Object.values(record)
    const ids = Object.keys(record)
    return this.renderPage(outputPath, sections.join('\n'), ids)
  }

  private renderDocHtml = async (docPage: DocHtml): Promise<DataOrError<Rendered>> => {
    const { htmlPaths, url, templatePath: pageTemplate } = docPage
    // console.log('renderDocHtml', url)
    const { configuration } = this
    const { outputRoot, outputOtherPath } = configuration
    const mdOrError = await this.textFromFiles(htmlPaths)
    if (isDefiniteError(mdOrError)) return mdOrError

    const { data: text } = mdOrError
    const outputPath = path.resolve(outputRoot, outputOtherPath, url)
    return this.renderPage(outputPath, text)
  }

  private renderDocMarkdown = async (docPage: DocMarkdown): Promise<DataOrError<Rendered>> => {
    const { configuration } = this
    const { outputRoot, outputOtherPath, inputSectionHtmlPath } = configuration
    const { markdownPaths, url, title } = docPage
    // console.log('renderDocMarkdown', url)
    const template = await this.templateRead(inputSectionHtmlPath)

    const mdOrError = await this.textFromFiles(markdownPaths)
    if (isDefiniteError(mdOrError)) return mdOrError

    const { data: mdText } = mdOrError
    const record = this.renderMarkdown(mdText, template, title)
    const outputPath = path.resolve(outputRoot, outputOtherPath, url)
    return this.renderPageSections(record, outputPath)
  }

  private renderDocModule = async (docPage: DocModule): Promise<DataOrError<Rendered>> => {
    const { clientServerOrShared, libOrRuntime } = docPage
    // console.log('renderDocModule', clientServerOrShared, libOrRuntime)
    const { configuration } = this
    const { 
      inputModuleMdDirectory, inputRoot, outputRoot, outputOtherPath, 
      inputTypedocMdDirectory, inputModulesMdDirectory, inputSectionHtmlPath
    } = configuration
    const sectionTemplate = await this.templateRead(inputSectionHtmlPath)

    const underscoreBasename = [clientServerOrShared, libOrRuntime, 'src'].join('_')
    const dashBasename = [clientServerOrShared, libOrRuntime].join(DASH)
    const moduleMdFilename = [underscoreBasename, EXTENSION_MARKDOWN].join('')
    const moduleMdPath = path.resolve(inputTypedocMdDirectory, inputModulesMdDirectory, moduleMdFilename)
    const htmlFilename = [dashBasename, EXTENSION_HTML].join('')

    const moduleMdOrError = await fileReadPromise(moduleMdPath)
    if (isDefiniteError(moduleMdOrError)) return moduleMdOrError

    const { data: moduleMdText } = moduleMdOrError

    const snippetMdFilename = [dashBasename, EXTENSION_MARKDOWN].join('')
    const snippetMdPath = path.resolve(inputRoot, inputModuleMdDirectory, snippetMdFilename)
   

   const snippetMdOrError = await fileReadPromise(snippetMdPath)
    if (isDefiniteError(snippetMdOrError)) return snippetMdOrError

    const { data: snippetText } = snippetMdOrError

    const [_, ...lines] = moduleMdText.split('\n')
    lines.unshift(snippetText)
    const mdText = lines.join('\n')

    const record = this.renderMarkdown(mdText, sectionTemplate)

    const outputPath = path.resolve(outputRoot, outputOtherPath, htmlFilename)
    return this.renderPageSections(record, outputPath)
  }

  private renderNavigationLeft = async (): Promise<string> => {
    const { docFilesAndFolders } = this.configuration
    const htmls: Strings = []
    for (const file of docFilesAndFolders) {
      if (isDocFile(file)) htmls.push(await this.renderNavigationFile(file))
      else htmls.push(await this.renderNavigationFolder(file))
    }
    return htmls.join('\n')
  }

  private renderNavigationRight = async (ids: Strings | StringRecord): Promise<string> => {
    const object = Array.isArray(ids) ? Object.fromEntries(ids.map(id => [id, id])) : ids
    const htmls: Strings = []
    for (const [title, anchor] of Object.entries(object)) {
      htmls.push(await this.renderNavigationFile({anchor, title}))
    }
    return htmls.join('\n')
  }

  private renderNavigationFile = async (renderFile: DocFile | Anchor): Promise<string> => {
    const title = this.docTitle(renderFile)
    const url = this.relativeForDocFile(renderFile)

    const { configuration } = this
    const { 
      inputFileHtmlPath
    } = configuration
    const fileTemplate = await this.templateRead(inputFileHtmlPath)
    const selected = isDocFile(renderFile) && this.docFileSelected(renderFile)
    const fileRecord: StringRecord = {
      [TITLE]: title, [URL]: url, 
      [CLASS]: selected ? SELECTED : ''
    }
    return this.parseTemplate(fileTemplate, fileRecord)
  }

  private docFileSelected(docFile: DocFile): boolean {
    const { renderingFile } = this
    if (!renderingFile) return false

    if (docFile === renderingFile) return true

    if (!(isDocExport(renderingFile) && isDocModule(docFile))) return false

    const { clientServerOrShared, libOrRuntime } = docFile
    const exportId = renderingFile.exportId 
    const exportPath =  this.projectInfo.filesByExportId[exportId] 
    return exportPath.includes([clientServerOrShared, libOrRuntime].join('_'))
  }

  private renderNavigationFolder = async (renderFolder: DocFolder): Promise<string> => {
    const { title = '', docFiles, excludeFromNav } = renderFolder
    if (excludeFromNav) return ''
    

    const { configuration } = this
    const { inputFolderHtmlPath } = configuration
    const template = await this.templateRead(inputFolderHtmlPath)
   
    const htmls: Strings = []
    for (const file of docFiles) {
      const html = await this.renderNavigationFile(file)
      htmls.push(html)
    }
    const selected = docFiles.some(file => this.docFileSelected(file))

    const folderRecord: StringRecord = {
      [TITLE]: title, [LINKS]: htmls.join('\n'), 
      [OPEN]: selected ? 'open' : '',
      [CLASS]: selected ? SELECTED : ''
    }
    return this.parseTemplate(template, folderRecord)
  }

  private renderingExportId = ''
  
  private async renderExportIds(exportIds: ExportIds): Promise<DataOrError<string>> {
    const { projectInfo, configuration } = this
    const { inputTypedocMdDirectory, inputSectionHtmlPath } = configuration

    const  templateSection = await this.templateRead(inputSectionHtmlPath)
    const { filesByExportId } = projectInfo
    
    const htmls: Strings = []
    for (const exportId of exportIds) {
      const file = filesByExportId[exportId]
      if (!file) return namedError(ERROR.Unknown, `${exportId} no file`)
      
      this.renderingExportId = exportId

      const markdownPath = path.join(inputTypedocMdDirectory, file)

      const htmlOrError = await this.parsedFile(markdownPath)
      this.renderingExportId = ''

      if (isDefiniteError(htmlOrError)) return htmlOrError

      const sectionRecord: StringRecord = {
        [ID]: exportId, [SECTION]: htmlOrError.data
      }
      htmls.push(this.parseTemplate(templateSection, sectionRecord))
    }
    return { data: htmls.join('\n') }
  }

  private async renderPage(absolutePath: string, sections: string, ids: Strings | StringRecord = []): Promise<DataOrError<Rendered>> {
    const { renderingFile, configuration } = this
    if (!renderingFile) return namedError(ERROR.Unknown, 'no renderingFile')

    const { inputPageHtmlPath } = configuration
    const { templatePath } = renderingFile
    const template = templatePath || inputPageHtmlPath
    const pageTemplate = await this.templateRead(template)

    assertPopulatedString(absolutePath, 'absolutePath')
    const record: StringRecord = {
      [NAV_LEFT]: await this.renderNavigationLeft(),
      [NAV_RIGHT]: await this.renderNavigationRight(ids),
      [CSS]: this.relativeForCss(),
      [SECTIONS]: sections,
    }
    const parsed = this.parseTemplate(pageTemplate, record)
    const wroteOrError = await fileWritePromise(absolutePath, parsed)
    if (isDefiniteError(wroteOrError)) return wroteOrError

    return { data: { path: absolutePath } }
  }

  private exportRecord: ExportRecord = {}

  private renderingFile?: DocFile

  private initUrlsDocFileOrFolder(docFileOrFolder: DocFileOrFolder) {
    if (isDoc(docFileOrFolder) || isDocModule(docFileOrFolder)) return

    if (isDocFolder(docFileOrFolder)) {
      const { docFiles } = docFileOrFolder
      if (docFiles?.length) this.initUrls(docFiles)
    } else {
      this.renderingFile = docFileOrFolder
      if (isDocCategory(docFileOrFolder)) this.initUrlsDocCategory(docFileOrFolder)
      else if (isDocCombined(docFileOrFolder)) this.initUrlsDocCombined(docFileOrFolder)
      else if (isDocExport(docFileOrFolder)) this.itemUrlsDocExport(docFileOrFolder)
      delete this.renderingFile 
    } 
  }

  private initUrls(docFilesAndFolders: DocFilesAndFolders) {
    docFilesAndFolders.forEach(file => this.initUrlsDocFileOrFolder(file))
  }

  private initUrlsDocCategory(docPage: DocCategory) {
    const { categoryId } = docPage
    const { projectInfo, configuration, exportRecord: renderedExportIds } = this
    const { exportsByCategory } = projectInfo
    const { outputRoot, outputCategoryPath } = configuration
    const htmlFilename = [categoryId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCategoryPath, htmlFilename)
    const { [categoryId]: exportIds = [] } = exportsByCategory
    exportIds.forEach(exportId => {
      renderedExportIds[exportId] = [htmlPath, exportId].join(HASH)
    })
  }

  private initUrlsDocCombined(docPage: DocCombined) {
    const { directory } = docPage
    const { projectInfo, configuration, exportRecord: renderedExportIds } = this
    const { exportsByCombined } = projectInfo
    const { outputRoot, outputCombinedPath } = configuration
    const htmlFilename = [directory, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCombinedPath, htmlFilename)
    const { [directory]: exportIds = [] } = exportsByCombined
    exportIds.forEach(exportId => {
      renderedExportIds[exportId] = [htmlPath, exportId].join(HASH)
    })
  }

  private itemUrlsDocExport(docPage: DocExport) {
    const { exportId } = docPage
    const { configuration, exportRecord: renderedExportIds } = this
    const { outputRoot, outputExportPath } = configuration
    const htmlFilename = [exportId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputExportPath, htmlFilename)
    renderedExportIds[exportId] = htmlPath
  }

  async run(record: DocumentationConfiguration): Promise<DataOrError<Rendereds>> {
    this._configuration = record
    const { configuration } = this

    await this.loadHighlighter('github-light', 'github-dark')

    const { 
      inputCategoryHtmlPath, inputSectionHtmlPath, 
      inputPageHtmlPath,
      inputFileHtmlPath, inputFolderHtmlPath, docFilesAndFolders
    } = configuration
    const templates = [
      inputCategoryHtmlPath, inputSectionHtmlPath, inputPageHtmlPath, 
      inputFileHtmlPath, inputFolderHtmlPath
    ]
    for (const templatePath of templates) {
      const templateOrError = await this.templateRead(templatePath)
      if (isDefiniteError(templateOrError)) return templateOrError
    }

    const { projectInfo } = this
    const infoOrError = await projectInfo.configure(configuration)
    if (isDefiniteError(infoOrError)) return infoOrError

    this.initUrls(docFilesAndFolders)
    const rendereds: Rendereds = []
    const filesOrError = await this.renderDocFilesAndFolders(this.docFilesAndFolders)
    if (isDefiniteError(filesOrError)) return filesOrError

    rendereds.push(...filesOrError.data)
    const cssOrError = await this.renderCss()
    if (isDefiniteError(cssOrError)) return cssOrError

    rendereds.push(cssOrError.data)

    // const exportsOrError = await this.renderDocExports()
    // if (isDefiniteError(exportsOrError)) return exportsOrError

    // rendereds.push(...exportsOrError.data)

    return { data: rendereds }
  }

  private async templateRead(templatePath: string): Promise<string> {
    if (this.templates[templatePath]) return this.templates[templatePath] 

    const { configuration } = this
    const { inputRoot } = configuration
    const resolvedPath = path.resolve(inputRoot, templatePath)
    const pageTemplateOrError = await fileReadPromise(resolvedPath)
    if (isDefiniteError(pageTemplateOrError)) errorThrow(pageTemplateOrError) 
  
    return this.templates[templatePath] = pageTemplateOrError.data
  }

  private templates: StringRecord = {}

 
  _aliases?: Map<string, string>
  get aliases() { 
    const { _aliases } = this
    if (_aliases) return _aliases

    const aliases = new Map<string, string>()
    for (const lang of BUNDLED_LANGUAGES) {
      for (const alias of lang.aliases || []) {
          aliases.set(alias, lang.id)
      }
    }
    return this._aliases = aliases
  }
  
  private _highlighter?: DoubleHighlighter 
  private get highlighter() { return this._highlighter! }

  private async loadHighlighter(lightTheme: Theme, darkTheme: Theme) {
    const { _highlighter } = this
    if (_highlighter) return
    const hl = await getHighlighter({ themes: [lightTheme, darkTheme] })
    this._highlighter = new DoubleHighlighter(hl, lightTheme, darkTheme)
  }

  isSupportedLanguage(lang: string) {
      return this.getSupportedLanguages().includes(lang)
  }

  getSupportedLanguages(): string[] {
    const { aliases } = this
    const supportedLanguages = arrayUnique([
      "text", 
      ...aliases.keys(), 
      ...BUNDLED_LANGUAGES.map((lang) => lang.id)
    ]).sort()
    return supportedLanguages
  }

  highlight(code: string, lang: string): string {
    const { aliases, highlighter } = this
    if (!this.isSupportedLanguage(lang)) return code
    

    if (lang === "text") return code
    
    const language = aliases.get(lang) ?? lang
    // console.log('highlight', code.length, { lang, language })
    return highlighter.highlight(code, language)
  }

  getStyles(): string {
      return this.highlighter.getStyles()
  }

}