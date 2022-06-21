import Express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'


import { PuppeteerPort, PuppeteerBind } from './Setup/Constants'


const rootDir = './workspaces/tester/dist'

const resolved = path.resolve(rootDir)
const exists = fs.existsSync(resolved)
if (!exists) {
  const message = `No such file or directory: ${resolved}`
  console.log(message)
  throw new Error(message)
}

const app = Express()
app.use(Express.json())
app.use(cors({ origin: "*" }))
app.use(Express.static(resolved))
app.listen(PuppeteerPort, PuppeteerBind, () => {
  console.log("serving", `${resolved}/*`, "on port", PuppeteerPort)
})
