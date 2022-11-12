import net, { Socket } from 'net'
import fs from 'fs'
import path from 'path'
import { Stream, Writable } from 'stream'

export interface SocketCallback { (_: Socket): void }

const SocketStreamsDir = "/tmp/ss"// "./temporary/streams/sockets"

export class StreamUnix {
  constructor(stream: Stream, id: string, onSocket: SocketCallback, type = 'stream') {
    // console.log("UnixStream", id, type)
    this.id = id
    this.type = type
    // const { url } = stream
    try { // to delete previous file
      fs.mkdirSync(this.socketDir, { recursive:true })
      fs.statSync(this.socketDir)
      fs.statSync(this.socketPath)
      fs.unlinkSync(this.socketPath)
    } catch (err) {
      // console.log(this.constructor.name, "ERROR", err)
    }
    // fs.writeFileSync(this.socketPath, "")
    const server = net.createServer(onSocket)
    this.server = server
    
    stream.on('finish', () => {
      // console.log(this.constructor.name, "finish")
      server.close()
    })
    stream.on('error', (error) => {
      console.error(this.constructor.name, "error", error)
      server.close()
    })
    console.log(this.constructor.name, "socketPath", this.socketPath)
    server.listen(this.socketPath)
  }

  server: net.Server

  id: string

  get socketDir(): string {
    return path.resolve(SocketStreamsDir, this.type)//)
  }

  get socketPath(): string {
    return `${this.socketDir}/${this.id}`
  }

  type: string

  get url():string{ return  `unix:${this.socketPath}` }
}

export const StreamInput = (stream: Stream, id: string, type = 'input'): StreamUnix => {
  // console.log("StreamInput", id, type)
  return new StreamUnix(stream, id, (socket:Socket) => { stream.pipe(socket) }, type)
}

export const StreamOutput = (stream:Writable, id: string, type = 'output'):StreamUnix => {
  // console.log("StreamOutput", id, type)
  return new StreamUnix(stream, id, (socket:Socket) => { socket.pipe(stream) }, type)
}
