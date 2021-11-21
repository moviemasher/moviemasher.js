import express from 'express'
import cors from 'cors'

import { WebcamIngestor } from './src/WebcamIngestor/WebcamIngestor'
import { Command } from './src/Command/Command'
import { Server } from './src/declaration'
import { HlsServer } from './src/HlsServer/HlsServer'
import { RtmpIngestor } from './src/RtmpIngestor/RtmpIngestor'

const port = Number(process.argv[2]) || 8570
const origin = process.argv[3] || '*'

const app = express()
app.use(cors({ origin }))
app.use(express.json())

app.get('/', (_req, res) => { res.send(`hello`) })

const servers: Server[] = []

const webcamIngestorArgs = {
  endpointPrefix: 'webrtc',
  outputOptions: Command.outputHls(),
  outputPrefix: './temp/webrtc',
}
servers.push(new WebcamIngestor(webcamIngestorArgs))

const rtmpIngestorArgs = {
  endpointPrefix: 'rtmp',
  outputOptions: Command.outputHls(),
  outputPrefix: './temp',
}
servers.push(new RtmpIngestor(rtmpIngestorArgs))

const hlsServerArgs = {
  endpointPrefix: 'hls',
  inputPrefix: './temp',
}
servers.push(new HlsServer(hlsServerArgs))

servers.forEach(server => { server.start(app) })

const server = app.listen(Number(port), () => { console.log(`Listening on port ${port} for ${origin}`) })
server.once('close', () => {
  servers.forEach(server => server.stop())
})
