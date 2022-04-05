import path from 'path'
import { Host, DefaultHostOptions, expandToJson } from '@moviemasher/server-express'

const configuration = process.argv[2] || path.resolve(__dirname, './server-config.json')
const options = expandToJson(configuration)
const host = new Host(DefaultHostOptions(options))
host.start()
