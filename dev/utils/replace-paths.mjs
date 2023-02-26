import fs from 'fs'
import path from 'path'

const [_, scriptPath, inRelativePath, outRelativePath] = process.argv
const script = path.basename(scriptPath, path.extname(scriptPath))
console.log(script, inRelativePath, '→', outRelativePath)

const inPath = path.resolve(inRelativePath)
const outPath = path.resolve(outRelativePath)
const inHtml = fs.readFileSync(inPath).toString()

const replacements = [
  ['supabase.js', 'https://unpkg.com/@supabase/supabase-js/dist/umd/supabase.js'],
  ['https://unpkg.com/react@17.0.2/umd/react.development.js', 'https://unpkg.com/react@17.0.2/umd/react.production.min.js'],
  ['https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js', 'https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js'],
  ['https://unpkg.com/react@18/umd/react.development.js', 'https://unpkg.com/react@18/umd/react.production.min.js'],
  ['https://unpkg.com/react-dom@18/umd/react-dom.development.js', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'],
  ['react.development.js', 'https://unpkg.com/react@18/umd/react.production.min.js'],
  ['react-dom.development.js', 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js'],
  ['moviemasher.js', 'https://unpkg.com/@moviemasher/moviemasher.js@5.1.2/umd/moviemasher.js'],
  ['theme-default.js', 'https://unpkg.com/@moviemasher/theme-default@5.1.2/umd/theme-default.js'],
  ['client-react.js', 'https://unpkg.com/@moviemasher/client-react@5.1.2/umd/client-react.js'],
  ['client-core.js', 'https://unpkg.com/@moviemasher/client-core@5.1.2/umd/client-core.js'],
  ['moviemasher.css', 'https://unpkg.com/@moviemasher/theme-default@5.1.2/moviemasher.css']
]
const outHtml = replacements.reduce((html, args) => html.replaceAll(...args), inHtml)

fs.writeFileSync(outPath, outHtml)
