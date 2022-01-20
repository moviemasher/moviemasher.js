import express from 'express'
import cors from 'cors'
import path from 'path'

import {
  Server, ContentServer, WebrtcServer, RtmpServer, EncodeServer,
  ApiServer, HlsServer, StorageServer
} from '@moviemasher/server-node'
import { outputHls, EditType } from '@moviemasher/moviemasher.js'

const port = 8570
const corsConfig = { "origin": "*" }
const index = "../example-client-react/dist/streamer.html"
const indexDir = path.dirname(index)
const indexFile = path.basename(index)

const api = { prefix: "/api" }
const encode = {
  prefix: "/encode",
  output: {
    [EditType.Mash]: outputHls(),
    [EditType.Stream]: outputHls()
  }
}
const webrtc = {
  prefix: "/webrtc",
  outputPrefix: "./temporary/streams/webrtc",
  outputOptions: outputHls()
}
const rtmp = {
  app: "rtmp",
  prefix: "/rtmp",
  outputPrefix: "./temporary/streams",
  outputOptions: outputHls(),
  inputOptions: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60
  },
  httpOptions: {
    port: 8579,
    mediaroot: "./temporary/streams/rtmp",
    allow_origin: "*"
  }
}
const hls = {
  prefix: "/hls",
  inputPrefix: "./temporary/streams"
}
const content = {
  prefix: "/content",
  uploadsUrlPrefix: "uploads",
  dbPath: "./temporary/content.db",
  dbMigrationsPrefix: "./dev/content/migrations",
  uploadLimits: {
    video: 100,
    audio: 50,
    image: 5
  },
  authentication: { type: "http" }
}
const storage = {
  uploadsPrefix: "./temporary/uploads"
}

const app = express()
app.use(cors(corsConfig))
app.use(express.json())
app.use('/', express.static(indexDir, { index: indexFile }))

const activeServers: Server[] = [
  new ContentServer(content),
  new HlsServer(hls),
  new RtmpServer(rtmp),
  new StorageServer(storage),
  new EncodeServer(encode),
  new WebrtcServer(webrtc),
]
const servers = {
  api,
  rtmp,
  storage,
  encode,
  content,
  webrtc,
  hls
}
activeServers.push(new ApiServer(servers, activeServers))

activeServers.forEach(server => { server.start(app) })

const server = app.listen(Number(port), () => { console.log(`Listening on port ${port}`) })
server.once('close', () => { activeServers.forEach(server => server.stop()) })
