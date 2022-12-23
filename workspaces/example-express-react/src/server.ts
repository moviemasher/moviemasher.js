import path from 'path'
import { Host, HostDefaultOptions } from '@moviemasher/server-express'
import { expandToJson } from '@moviemasher/server-core'
const config = process.argv[2] || path.resolve(__dirname, './server-config.json')
const configuration = expandToJson(config)
const options = HostDefaultOptions(configuration)
const host = new Host(options)
host.start()
