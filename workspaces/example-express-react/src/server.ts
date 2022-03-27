import fs from 'fs'
import path from 'path'
import { Host, HostDefault, HostDefaultOptions } from '@moviemasher/server-express'

const resolved = path.resolve(__dirname, './server-config.json')
const json = fs.readFileSync(resolved).toString()
const options: HostDefaultOptions = JSON.parse(json)
const host = new Host(HostDefault(options))
host.start()
