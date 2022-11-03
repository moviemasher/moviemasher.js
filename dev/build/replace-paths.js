const path = require('path')
const fs = require('fs')

const [_, scriptPath, inRelativePath, outRelativePath] = process.argv
const script = path.basename(scriptPath, path.extname(scriptPath))
console.log(script, inRelativePath, '→', outRelativePath)

const inPath = path.resolve(inRelativePath)
const outPath = path.resolve(outRelativePath)
const inHtml = fs.readFileSync(inPath).toString()

const replacements = [
  ['react.development.js', 'https://unpkg.com/react@18/umd/react.production.min.js'],
  ['react-dom.development.js', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'],
  ['moviemasher.js', 'https://unpkg.com/@moviemasher/moviemasher.js@5.1.2/umd/moviemasher.js'],
  ['theme-default.js', 'https://unpkg.com/@moviemasher/theme-default@5.1.2/umd/theme-default.js'],
  ['client-react.js', 'https://unpkg.com/@moviemasher/client-react@5.1.2/umd/client-react.js'],
  ['moviemasher.css', 'https://unpkg.com/@moviemasher/theme-default@5.1.2/moviemasher.css']
]
const outHtml = replacements.reduce((html, args) => html.replaceAll(...args), inHtml)

fs.writeFileSync(outPath, outHtml)
