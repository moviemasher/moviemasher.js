import type { DataOrError, StringRecord, Strings } from '@moviemasher/runtime-shared'
import type { MarkedOptions } from 'marked'
import type { DocFile, ConfigurationRecord, DocCategory, DocFileOrFolder, DocFilesAndFolders, DocFolder, DocMarkdown, Rendered, Rendereds, TypedocDirectory, ExportId, ExportIds, DocFiles, DocCombined, DocExport } from './Types.js'
import type { Highlighter, Theme } from "shiki"

import { DoubleHighlighter } from './DoubleHighlighter.js'
import { fileReadPromise, fileWritePromise, urlIsHttp } from '@moviemasher/lib-server'
import { ERROR, isDefiniteError, namedError } from '@moviemasher/runtime-shared'
import { marked } from 'marked'
import { EXTENSION_HTML, EXTENSION_MARKDOWN, HASH, isDocCategory, isDocCombined, isDocExport, isDocFile, isDocFolder, isDocMarkdown, isTypedocDirectory } from './Constants.js'
import path from 'path'

import { getHighlighter, BUNDLED_LANGUAGES, BUNDLED_THEMES } from "shiki"

console.log('BUNDLED_THEMES', BUNDLED_THEMES)
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
// import markdownMagic from 'markdown-magic'
// const markdownPath = path.join(__dirname, 'README.md')
// const magicConfig: Configuration = {}
// markdownMagic(markdownPath, magicConfig)

import { ProjectInfo } from './ProjectInfo.js'
import { arrayUnique, assertArray, assertPopulatedString } from '@moviemasher/lib-shared'

const stripTags = (text: string): string => text.replace(/<[^>]*>?/gm, '')


const REGEX_DOUBLE_BRACKETS = /\[\[(.*?)\]\]/g

export class Render {
  private absoluteForCategory(category: string, exportId?: ExportId): string {
    const { configuration } = this
    const { outputRoot, outputCategoryPath } = configuration
    const components = [category, EXTENSION_HTML]
    if (exportId) components.push(HASH, exportId)
    const fileName = components.join('')
    const urlPath = path.resolve(outputRoot, outputCategoryPath, fileName)
    // console.log('absoluteForCategory', { urlPath, outputRoot, outputCategoryPath, category })
    return urlPath.toLowerCase()
  }

  private absoluteForCombined(directory: TypedocDirectory, exportId?: ExportId): string {
    const { configuration } = this
    const { outputRoot, outputCombinedPath } = configuration
    const components = [directory, EXTENSION_HTML]
    if (exportId) components.push(HASH, exportId)
    const fileName = components.join('')
    const urlPath = path.resolve(outputRoot, outputCombinedPath, fileName)
    // console.log('absoluteForCombined', { urlPath, outputRoot, outputCombinedPath, directory })
    return urlPath.toLowerCase()
  }

  private absoluteForDocFile(docFile: DocFile): string {
    if (isDocMarkdown(docFile)) return this.absoluteForMarkdown(docFile.url)
    if (isDocCombined(docFile)) return this.absoluteForCombined(docFile.directory)
    if (isDocCategory(docFile)) return this.absoluteForCategory(docFile.categoryId)
    if (isDocExport(docFile)) return this.absoluteForExport(docFile.exportId)
    return ''
  }

  private absoluteForExport(exportId: ExportId): string {
    const { configuration } = this
    const { outputRoot, outputExportPath } = configuration
    const fileName = [exportId, EXTENSION_HTML].join('')
    const urlPath = path.resolve(outputRoot, outputExportPath, fileName)
    // console.log('absoluteForExport', { urlPath, outputRoot, outputExportPath, exportId })
    return urlPath.toLowerCase()
  }

  private absoluteForMarkdown(url: string): string {
    const { configuration } = this
    const { outputRoot, outputOtherPath } = configuration
    const urlPath = path.resolve(outputRoot, outputOtherPath, url)
    // console.log('absoluteForMarkdown', { urlPath, outputRoot, outputOtherPath, url })
    return urlPath.toLowerCase()
  }
  
  private _configuration?: ConfigurationRecord
  private get configuration() { return this._configuration! }

  private get docFiles(): DocFiles {
    const { files } = this.configuration
    return files.flatMap(file => isDocFile(file) ? [file] : file.files)
  }

  private docTitle(docFile: DocFile): string {
    if (isDocCombined(docFile)) return docFile.directory

    if (isDocCategory(docFile)) return docFile.categoryId

    if (isDocMarkdown(docFile)) return docFile.title 

    return docFile.exportId
  }

  private mdParseCode(text: string, language?: string): string | false {    
    // return `<pre>${language} ${text.length}</pre>`
    // console.log('code', text.length, language)
    const lang = (language || "typescript").toLowerCase()
    if (!this.isSupportedLanguage(lang)) return text

    const highlighted = this.highlight(text, lang)
    
    return highlighted
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
    // console.log('heading', { text, level, raw })
    return false
  }

  private mdParserInitialized = false
  private get mdParser() {
    if (!this.mdParserInitialized) {
      this.mdParserInitialized = true
      marked.use({
        renderer: {
          heading: this.mdParseHeading.bind(this),
          // text: this.mdParseText.bind(this),
          code: this.mdParseCode.bind(this),

          // codespan(...args: any): string | false {
          //   // console.log('codespan', ...args)
          //   return false

          // },
          link(href: string, title: string | null | undefined, text: string) {

            if (urlIsHttp(href)) return false

            // const name = stripTags(text)
            // const navigation = navigationRecord()
            // const url = navigation[name]

            // console.log('link', { href, title, text })
            return false
          }
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
    const options: MarkedOptions = {
      breaks: false,
      gfm: true,
      pedantic: false,
      silent: false,
    }
    return this.mdParser.parse(input, options)
  }

  private async parsedFile(inputFile: string): Promise<DataOrError<string>> {
    const inputOrError = await fileReadPromise(inputFile) 
    if (isDefiniteError(inputOrError)) throw inputOrError

    const html = this.parseMarkdown(inputOrError.data)
    return { data: html }
  }

  private _projectInfo?: ProjectInfo
  get projectInfo() { return this._projectInfo ||= new ProjectInfo()  }

  private relativeFromRenderingFile(toPath: string): string {
    const { renderingFile, configuration } = this
    const { outputRoot } = configuration
    const fromPath = renderingFile ? this.absoluteForDocFile(renderingFile) : outputRoot
    if (fromPath === toPath) return HASH
    
    const relativeDir = path.relative(path.dirname(fromPath), path.dirname(toPath))
    const relative = path.join(relativeDir, path.basename(toPath))
    // console.log('urlFromRenderingFile', { fromPath, toPath, relative })
    return relative
  }

  private relativeForCategory(category: string, exportId?: ExportId): string {
    return this.relativeFromRenderingFile(this.absoluteForCategory(category, exportId))
  }

  private relativeForCombined(directory: TypedocDirectory, exportId?: ExportId): string {
    return this.relativeFromRenderingFile(this.absoluteForCombined(directory, exportId))
  }

  private relativeForCss(): string {
    const { configuration } = this
    const { inputRoot, inputCssPath } = configuration
    const urlPath = path.resolve(inputRoot, inputCssPath)
    return this.relativeFromRenderingFile(urlPath)
  }

  private relativeForDocFile(docFile: DocFile): string {
    if (isDocMarkdown(docFile)) return this.relativeForMarkdown(docFile.url)
    if (isDocCombined(docFile)) return this.relativeForCombined(docFile.directory)
    if (isDocCategory(docFile)) return this.relativeForCategory(docFile.categoryId)
    if (isDocExport(docFile)) return this.relativeForExport(docFile.exportId)
    return ''
  }
  
  private relativeForExport(exportId: ExportId): string {
    return this.relativeFromRenderingFile(this.absoluteForExport(exportId))
  }

  private relativeForMarkdown(url: string): string {
    return this.relativeFromRenderingFile(this.absoluteForMarkdown(url))
  }

  private relativeForName(name: string): string {
    const { projectInfo } = this
    if (projectInfo.isCategoryId(name)) return this.relativeForCategory(name)

    if (isTypedocDirectory(name)) return this.relativeForCombined(name)

    const category = projectInfo.categoryForExportId(name)
    if (category) return this.relativeForCategory(category, name)

    if (projectInfo.isExportId(name)) return this.relativeForExport(name)

    const markdownFiles = this.docFiles.filter(isDocMarkdown)
    const markdownFile = markdownFiles.find(file => file.title === name)
    if (markdownFile) return this.relativeForMarkdown(markdownFile.url)

    return ''
  }

  private renderDocCategory = async (docPage: DocCategory): Promise<DataOrError<Rendered>> => {
    const { categoryId } = docPage
    const { projectInfo, templates, configuration } = this
    const { category: categoryTemplate } = templates
    const { exportsByCategory } = projectInfo
    const { [categoryId]: exportIds } = exportsByCategory
    const { 
      inputRoot, inputCategoryMdDirectory, outputRoot, outputCategoryPath
    } = configuration
    const htmlOrError = await this.renderExportIds(exportIds)
    if (isDefiniteError(htmlOrError)) return htmlOrError

    const mdFilename = [categoryId, EXTENSION_MARKDOWN].join('')
    const mdPath = path.resolve(inputRoot, inputCategoryMdDirectory, mdFilename)
    const mdTextOrError = await this.parsedFile(mdPath)
    if (isDefiniteError(mdTextOrError)) return mdTextOrError

    const categoryRecord: StringRecord = {
      [ID]: categoryId, 
      [SECTIONS]: htmlOrError.data, 
      [SECTION]: mdTextOrError.data,
    }
    const sectionsHtml = this.parseTemplate(categoryTemplate, categoryRecord)
    const htmlFilename = [categoryId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCategoryPath, htmlFilename)
    return this.renderPage(htmlPath, sectionsHtml)
  }

  private renderDocCombined = async (docPage: DocCombined): Promise<DataOrError<Rendered>> => {
    const { directory } = docPage
    const { projectInfo, templates, configuration } = this
    const { category: categoryTemplate } = templates
    const { exportsByCombined } = projectInfo
    const { [directory]: exportIds } = exportsByCombined
    assertArray(exportIds, 'exportIds')
    const { 
      inputRoot, inputCombinedMdDirectory, outputRoot, outputCombinedPath
    } = configuration
    const htmlOrError = await this.renderExportIds(exportIds)
    if (isDefiniteError(htmlOrError)) return htmlOrError

    const mdFilename = [directory, EXTENSION_MARKDOWN].join('')
    const mdPath = path.resolve(inputRoot, inputCombinedMdDirectory, mdFilename)
    const mdTextOrError = await this.parsedFile(mdPath)
    if (isDefiniteError(mdTextOrError)) return mdTextOrError

    const categoryRecord: StringRecord = {
      [ID]: directory, 
      [SECTIONS]: htmlOrError.data, 
      [SECTION]: mdTextOrError.data,
    }
    const sectionsHtml = this.parseTemplate(categoryTemplate, categoryRecord)
    const htmlFilename = [directory, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputCombinedPath, htmlFilename)
    return this.renderPage(htmlPath, sectionsHtml)
  }

  private renderDocExport = async (docPage: DocExport): Promise<DataOrError<Rendered>> => {
    const { exportId } = docPage
    const { configuration } = this
    const { outputRoot, outputExportPath } = configuration
    const htmlOrError = await this.renderExportIds([exportId])
    if (isDefiniteError(htmlOrError)) return htmlOrError

    const htmlFilename = [exportId, EXTENSION_HTML].join('')
    const htmlPath = path.resolve(outputRoot, outputExportPath, htmlFilename)
    return this.renderPage(htmlPath, htmlOrError.data)
  }

  private renderDocExports = async (): Promise<DataOrError<Rendereds>> => {
    const { projectInfo, renderedExportIds } = this
    const { exportIds } = projectInfo
    const remaining = exportIds.filter(id => !renderedExportIds.includes(id))
    const rendereds: Rendereds = []
    for (const exportId of remaining) {
      const renderedOrError = await this.renderDocExport({ exportId })
      if (isDefiniteError(renderedOrError)) return renderedOrError

      rendereds.push(renderedOrError.data)
    }
    return { data: rendereds }
  }
  
  private markdownSections(mdText: string, title: string): StringRecord[] {
    const lines = mdText.split('\n')
    console.log('markdownSections', mdText.length, lines.length)
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


  private renderDocMarkdown = async (docPage: DocMarkdown): Promise<DataOrError<Rendered>> => {
    const { configuration, templates } = this
    const { 
      inputOtherMdDirectory, inputRoot, outputRoot, outputOtherPath 
    } = configuration
    const { markdownPath, url, title } = docPage
    const { section: sectionTemplate } = templates
    const inputPath = path.resolve(inputRoot, inputOtherMdDirectory, markdownPath)
    const mdOrError = await fileReadPromise(inputPath)
    if (isDefiniteError(mdOrError)) return mdOrError

    const records = this.markdownSections(mdOrError.data, title)
    console.log('renderDocMarkdown', records.length) 
    const sections = records.map(record => {
      return this.parseTemplate(sectionTemplate, record)
    })

    const outputPath = path.resolve(outputRoot, outputOtherPath, url)
    return this.renderPage(outputPath, sections.join('\n'))
  }

  private renderDocFileOrFolder = async (docFile: DocFileOrFolder): Promise<DataOrError<Rendereds>> => {
    const rendereds: Rendereds = []
    if (isDocFolder(docFile)) {
      const { files } = docFile
      if (files?.length) {
        const renderedsOrError = await this.renderDocFiles(files)
        if (isDefiniteError(renderedsOrError)) return renderedsOrError

        rendereds.push(...renderedsOrError.data)
      }
    } else {
      this.renderingFile = docFile
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
      }
      delete this.renderingFile 
    } 
    return { data: rendereds }
  }

  private renderDocFiles = async (docFiles: DocFilesAndFolders): Promise<DataOrError<Rendereds>> => {
    const rendereds: Rendereds = []
    for (const file of docFiles) {
      const renderedOrError = await this.renderDocFileOrFolder(file)
      if (isDefiniteError(renderedOrError)) return renderedOrError

      rendereds.push(...renderedOrError.data)
    }

    return { data: rendereds }
  }

  private renderNavigationLeft = (): string => {
    const { configuration } = this
    const { files } = configuration
    const htmls: Strings = files.map(file => {
      if (isDocFile(file)) return this.renderNavigationFile(file)

      return this.renderNavigationFolder(file)
    })
    return htmls.join('\n')

  }

  private renderNavigationRight = (): string => {

    return ''
  }

  private renderNavigationFile = (renderFile: DocFile): string => {
    const { renderingFile } = this

    const title = this.docTitle(renderFile)
    const url = this.relativeForDocFile(renderFile)
    
    const { templates } = this
    const { file: fileTemplate } = templates

    const selected = renderFile === renderingFile
    const fileRecord: StringRecord = {
      [TITLE]: title, [URL]: url, 
      [CLASS]: selected ? 'selected' : ''
    }
    return this.parseTemplate(fileTemplate, fileRecord)
  }

  private renderNavigationFolder = (renderFolder: DocFolder): string => {
    const { templates, renderingFile } = this
    const { folder: folderTemplate } = templates

    const { title, files } = renderFolder
    const htmls = files.map(file => this.renderNavigationFile(file))

    const selected = files.some(file => file === renderingFile)
    const folderRecord: StringRecord = {
      [TITLE]: title, [LINKS]: htmls.join('\n'), 
      [OPEN]: selected ? 'open' : '',
    }
    return this.parseTemplate(folderTemplate, folderRecord)
  }

  private async renderExportIds(exportIds: ExportIds): Promise<DataOrError<string>> {
    const { projectInfo, templates, configuration, renderedExportIds } = this
    const { inputTypedocMdDirectory } = configuration
    const { section: templateSection } = templates
    const { filesByExportId } = projectInfo
    renderedExportIds.push(...exportIds)

    const htmls: Strings = []
    for (const exportId of exportIds) {
      const file = filesByExportId[exportId]
      if (!file) {
        // console.log('renderCategory', { exportId }, filesByExportId)
        return namedError(ERROR.Unknown, `${exportId} no file`)
      }
      const htmlOrError = await this.parsedFile(path.join(inputTypedocMdDirectory, file))
      if (isDefiniteError(htmlOrError)) return htmlOrError

      const sectionRecord: StringRecord = {
        [ID]: exportId, [SECTION]: htmlOrError.data
      }
      htmls.push(this.parseTemplate(templateSection, sectionRecord))
    }
    return { data: htmls.join('\n') }
  }

  private async renderPage(absolutePath: string, sections: string): Promise<DataOrError<Rendered>> {
    assertPopulatedString(absolutePath, 'absolutePath')
    const record: StringRecord = {
      [NAV_LEFT]: this.renderNavigationLeft(),
      [NAV_RIGHT]: this.renderNavigationRight(),
      [CSS]: this.relativeForCss(),
      [SECTIONS]: sections,
      [STYLE]: this.getStyles(),
    }
    const reduced = this.parseTemplate(this.templates.page, record)
    const wroteOrError = await fileWritePromise(absolutePath, reduced)
    if (isDefiniteError(wroteOrError)) return wroteOrError

    return { data: { path: absolutePath } }
  }

  private renderedExportIds: ExportIds = []

  private renderingFile?: DocFile

  async run(record: ConfigurationRecord): Promise<DataOrError<Rendereds>> {
    this._configuration = record
    const { configuration } = this

    await this.loadHighlighter('github-light', 'github-dark')


    const { 
      inputCategoryHtmlPath, inputSectionHtmlPath, 
      inputPageHtmlPath,
      inputFileHtmlPath, inputFolderHtmlPath,
      files, inputRoot
    } = configuration
    const templates = [
      inputCategoryHtmlPath, inputSectionHtmlPath, inputPageHtmlPath, 
      inputFileHtmlPath, inputFolderHtmlPath
    ]
    for (const templatePath of templates) {
      const resolved = path.resolve(inputRoot, templatePath)
      const templateOrError = await this.templateRead(resolved)
      if (isDefiniteError(templateOrError)) return templateOrError
    }

    const { projectInfo } = this
    const infoOrError = await projectInfo.configure(configuration)
    if (isDefiniteError(infoOrError)) return infoOrError

    const rendereds: Rendereds = []
    const filesOrError = await this.renderDocFiles(files)
    if (isDefiniteError(filesOrError)) return filesOrError

    rendereds.push(...filesOrError.data)
    // const exportsOrError = await this.renderDocExports()
    // if (isDefiniteError(exportsOrError)) return exportsOrError

    // rendereds.push(...exportsOrError.data)
    return { data: rendereds }
  }

  private async templateRead(templatePath: string): Promise<DataOrError<string>> {
    const basename = path.basename(templatePath, EXTENSION_HTML)

    const pageTemplateOrError = await fileReadPromise(templatePath)
    if (isDefiniteError(pageTemplateOrError)) return pageTemplateOrError
    
    const { data: text } = pageTemplateOrError
    this.templates[basename] = text
    return { data: text }
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
    console.log('highlight', code.length, { lang, language })
    return highlighter.highlight(code, language)
  }

  getStyles(): string {
      return this.highlighter.getStyles()
  }

}