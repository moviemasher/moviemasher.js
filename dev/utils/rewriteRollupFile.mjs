import fs from 'fs'
import path from 'path'


export const rewriteRollupFile = (args) => {
  const { 
    srcDir = 'src', 
    destDir = 'dev', 
    name = 'rollup.config.mjs',
    replacements = [],
   } = args

  const src = path.resolve(srcDir, name)
  const dest = path.resolve(destDir, name)
  const rollupText = fs.readFileSync(src, 'utf8')
  const replaced = replacements.reduce((text, { search, replace }) => {
    return text.replace(search, replace)
  }, rollupText)
  fs.writeFileSync(dest, replaced)
  console.log(dest.slice(dest.split('').findIndex((c, i) => src[i] !== c)))
}
