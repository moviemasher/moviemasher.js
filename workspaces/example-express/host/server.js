const MovieMasherServer = require("@moviemasher/server-express")

const { Host } = MovieMasherServer
const options = { 
  port: 8572, host: '0.0.0.0', 
  api: { authentication: { type: 'basic' } } 
}
const host = new Host(options)
host.start()
