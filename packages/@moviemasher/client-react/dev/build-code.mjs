import path from 'path';
import fs from 'fs';

const DIST = path.resolve('../client-lib/dist')
const EXT = '.js';
const folders = [
  'browser', 'importer', 'inspector', 'player', 'timeline', 'component'
]

const DEST = path.resolve('./src/Components')

const paths = folders.flatMap(folder => {
  const files = fs.readdirSync(`${DIST}/${folder}`)
  const jsFiles = files.filter(file => path.extname(file) === EXT)
  return jsFiles.map(file => `${DIST}/${folder}/${file}`)

})
paths.unshift(`${DIST}/movie-masher.js`)

const exports = paths.map(filePath => {
  const name = path.basename(filePath, EXT) 
  const dir = path.dirname(filePath) 
  const isMovieMasher = dir === DIST
  const froms = ['@moviemasher', 'client-lib']
  if (!isMovieMasher) froms.push(path.basename(dir))
  froms.push(`${name}${EXT}`)
  const from = froms.join('/')
  const bits = name.split('-') // e.g. ['timeline', 'footer']
  const upBits = bits.map(bit => bit.charAt(0).toUpperCase() + bit.slice(1)) 
  const upName = upBits.join('') 
  const element = `${upName}Element`
  const tag = `${upName}Tag`
  const lines = []
  lines.push("import { createComponent } from '@lit/react'")
  lines.push(`import { ${element}, ${tag} } from '${from}'`)
  lines.push("import React from 'react'")
  lines.push('/** @category Components */')
  lines.push(`export const ${upName} = createComponent({ tagName: ${tag}, elementClass: ${element}, react: React })`)
  const code = lines.join('\n')
  const codePath = `${DEST}/${upName}.tsx`

  fs.writeFileSync(codePath, code)
  return upName
})
const lines = exports.map(name => `export { ${name} } from './${name}${EXT}'`)
const index = lines.join('\n')

const indexPath = path.resolve(`${DEST}/index.ts`)
fs.writeFileSync(indexPath, index)
