import fs from 'fs'
import {
  Host, HostDefault, HostDefaultOptions
} from '@moviemasher/server-express'

const json = fs.readFileSync('configuration.json').toString()
const options: HostDefaultOptions = JSON.parse(json)
const host = new Host(HostDefault(options))
host.start()
