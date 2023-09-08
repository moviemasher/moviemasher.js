import express from 'express'
import fs from 'fs'
import path from 'path'

import { replaceText } from './replace.mjs'

const cdnPrefix = '/cdn/'
const replaceUrls = (text) => {
  const replacements = [
    {
      replace: cdnPrefix, search: /https:\/\/unpkg.com\/@moviemasher\//g
    }
  ]
  return replaceText({ src: text, replacements })
}

const app = express()
const rootDir = process.env.MOVIEMASHER_DIR_ROOT
const indexPath = process.env.MOVIEMASHER_EXAMPLE_INDEX || `${rootDir}/packages/lib/client/div/example/index.html`

const packageDirs = lib => {
  if (!lib.includes('-')) return ['core', 'lib']
  const [dir, type] = lib.split('-')
  if (type === 'core') return [type, dir]
  return [dir, type]
}
app.get(`${cdnPrefix}*`, function (req, res) {
  const { url } = req

  const urlPath = url.replace(cdnPrefix, '')
  const components = urlPath.split('/')
  const firstDir = components.shift()

  const [dir, type] = packageDirs(firstDir)
 
  const filePath = path.resolve(rootDir, `packages/${dir}/${type}/${components.join('/')}`)
  if (!fs.existsSync(filePath)) res.send({ filePath })
  const text = fs.readFileSync(filePath, 'utf8')

  console.log(url)
  console.log(filePath)
  res.type('.js')
  res.send(replaceUrls(text))
})



app.get('/', function (_, res) {
  const text = fs.readFileSync(indexPath, 'utf8')
  const index = replaceUrls(text)
  res.send(index)
})


app.use(express.json())

const port = process.env.MOVIEMASHER_EXAMPLE_PORT || 8573
const host = '0.0.0.0' 
app.listen(port, host, () => { console.log(`Listening on ${host}:${port}`) })
