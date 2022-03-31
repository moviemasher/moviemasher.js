import fs from 'fs'
import path from 'path'
import { Host, DefaultHostOptions } from '@moviemasher/server-express'

const resolved = path.resolve(__dirname, './server-config.json')
const json = fs.readFileSync(resolved).toString()
const options = JSON.parse(json)
const host = new Host(DefaultHostOptions(options))
host.start()
