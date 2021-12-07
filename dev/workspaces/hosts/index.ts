import express from 'express'
import cors from 'cors'
import path from 'path'

import { isPopulatedObject } from '@moviemasher/moviemasher.js'

import { CmsServerArgs, HlsServerArgs, HostsServerArgs, Server } from './src/declaration'
import { WebrtcIngestor, WebrtcIngestorArgs } from './src/WebrtcIngestor/WebrtcIngestor'
import { Command } from './src/Command/Command'
import { RtmpIngestor, RtmpIngestorArgs } from './src/RtmpIngestor/RtmpIngestor'

import { StreamServer, StreamServerArgs } from './src/StreamServer/StreamServer'
import { RenderServer, RenderServerArgs } from './src/RenderServer/RenderServer'
import { HostsServer } from './src/HostsServer/HostsServer'
import { HlsServer } from './src/HlsServer/HlsServer'
import { CmsServer } from './src/CmsServer/CmsServer'

import config from "./config.json"

const { index, servers, port } = config

const indexDir = path.dirname(index)
const indexFile = path.basename(index)

const hosts: HostsServerArgs = servers.hosts || {}
const stream: StreamServerArgs = servers.stream || {}
const render: RenderServerArgs = servers.render || {}
const webrtc: WebrtcIngestorArgs = servers.webrtc || {}
const rtmp: RtmpIngestorArgs = servers.rtmp || {}
const hls: HlsServerArgs = servers.hls || {}
const cms: CmsServerArgs = servers.cms || {}

const app = express()
if (isPopulatedObject(config.cors)) app.use(cors(config.cors))

app.use(express.json())
app.use('/', express.static(indexDir, { index: indexFile }))
app.use('/webcam/', express.static('../webrtc-client/dist', { index: 'index.html' }))

const activeServers: Server[] = []

if (isPopulatedObject(webrtc)) {
  if (!isPopulatedObject(webrtc.outputOptions)) webrtc.outputOptions = Command.outputHls()
  activeServers.push(new WebrtcIngestor(webrtc))
}

if (isPopulatedObject(rtmp)) {
  if (!isPopulatedObject(rtmp.outputOptions)) rtmp.outputOptions = Command.outputHls()
  activeServers.push(new RtmpIngestor(rtmp))
}

if (isPopulatedObject(stream)) {
  if (!isPopulatedObject(stream.outputOptions)) stream.outputOptions = Command.outputHls()
  activeServers.push(new StreamServer(stream))
}
if (isPopulatedObject(render)) activeServers.push(new RenderServer(render))
if (isPopulatedObject(hls)) activeServers.push(new HlsServer(hls))
if (isPopulatedObject(cms)) activeServers.push(new CmsServer(cms))

if (isPopulatedObject(hosts)) activeServers.push(new HostsServer(servers, activeServers))

activeServers.forEach(server => { server.start(app) })

const server = app.listen(Number(port), () => { console.log(`Listening on port ${port}`) })
server.once('close', () => { activeServers.forEach(server => server.stop()) })
