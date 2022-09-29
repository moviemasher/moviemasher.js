import Express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'


import { PuppeteerPort, PuppeteerBind } from './Setup/Constants'


const rootDir = './workspaces/tester/dist'

const resolvedDir = path.resolve(rootDir)
const exists = fs.existsSync(resolvedDir)
if (!exists) {
  const message = `No such file or directory: ${resolvedDir}`
  console.log(message)
  throw new Error(message)
}

const app = Express()
app.use(Express.json())
app.use(cors({ origin: "*" }))
app.use(Express.static(resolvedDir))
app.listen(PuppeteerPort, PuppeteerBind, () => {
  console.log("serving", `${resolvedDir}/*`, "on port", PuppeteerPort)
})
