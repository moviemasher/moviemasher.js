
import glob from 'glob'
import path from 'path'
import fs from 'fs'

import markdownMagic from 'markdown-magic'
const inputPath = './develop/documentation/readme/README.md'

const outputPath = './'
const markdownOptions = {
  outputDir: outputPath,
  matchWord: 'MAGIC',
  transforms: {
    TRIMCODE: (content, options, config) => {
      const { src, stripComments, jsx, stripImports, stripExports } = options
      if (!src) return false

      const syntax = options.syntax || path.extname(src).slice(1)
      let code = fs.readFileSync(src).toString()

      if (stripComments) {
        code = code.replace(/((["'])(?:\\[\s\S]|.)*?\2|\/(?![*\/])(?:\\.|\[(?:\\.|.)\]|.)*?\/)|\/\/.*?$|\/\*[\s\S]*?\*\//gm, '$1')
      }

      if (stripImports) {
        code = code.replace(/^import.*$/gm, '')
        console.log("stripImports", code)
      }
      if (stripExports) {
        code = code.replace(/^export.*$/gm, '')
        console.log("stripExports", code)
      }


      if (jsx) {
        let tag = `<${jsx}`
        let inTag = false
        const lines = code.split("\n")
        const filtered = lines.filter(line => {
          if (!(line && tag)) return false

          if (line.includes(tag)) {
            if (inTag) {
              tag = ''
              return true
            }
            inTag = true
            tag = `</${jsx}`
          }
          return inTag
        })

        console.log("filtered", filtered.length)
        const last = filtered[filtered.length - 1]
        const index = last.indexOf('<')
        const mapped = filtered.map(line => line.slice(index))
        code = mapped.join("\n")
      }
      // trim leading and trailing spaces/line breaks in code and keeps the indentation of the first non-empty line
      code = code.replace(/^(?:[\t ]*(?:\r?\n|\r))+|\s+$/g, '')

      let header = ''
      if (options.header) {
        header = `\n${options.header}`
      }
      const backticks = '```'
      return `\n${backticks}${syntax}${header}\n${code}\n${backticks}`
    },
    COLORSVG: (_content, options, config) => {
      const defaults = { src: './**/*.svg', replacements: '' }
      const settings = Object.assign({}, defaults, options)
      const basePath = path.resolve(path.dirname(config.originalPath))
      const pattern = path.join(basePath, settings.src)
      const paths = glob.sync(pattern, { ignore: '**/node_modules/**' })
      const svgs = paths.map(filePath => {
        const buffer = fs.readFileSync(filePath)
        return settings.replacements.split(',').reduce((svg, replacement) =>
          svg.replaceAll(replacement, 'currentColor'), buffer.toString()
        )
      })
      return svgs.join('\n')
    },
  },
}
markdownMagic(inputPath, markdownOptions)
