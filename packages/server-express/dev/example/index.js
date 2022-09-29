const MovieMasherServer = require("@moviemasher/server-express")

const { Host, HostDefaultOptions } = MovieMasherServer
const options = HostDefaultOptions({ port: 8570 })
const host = new Host(options)
host.start()
