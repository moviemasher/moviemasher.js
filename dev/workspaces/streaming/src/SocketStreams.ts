import net, { Socket } from 'net'
import fs from 'fs'
import path from 'path'
import { Stream, Writable } from 'stream'

type SocketCallback = (_: Socket) => void

const SocketStreamsDir = "./temp/Sockets"

class UnixStream {
  constructor(stream: Stream, id: string, onSocket: SocketCallback, type = 'stream') {
    // console.log("UnixStream", id, type)
    this.id = id
    this.type = type
    try { // to delete previous file
      fs.mkdirSync(this.socketDir, { recursive:true })
      fs.statSync(this.socketDir)
      fs.statSync(this.socketPath)
      fs.unlinkSync(this.socketPath)
    } catch (err) {}
    const server = net.createServer(onSocket)
    stream.on('finish', () => {
      // console.log(this.constructor.name, "finish")
      server.close()
    })
    stream.on('error', (error) => {
      console.error(this.constructor.name, "error", error)
      server.close()
    })
    // console.log("socketPath", this.socketPath)
    server.listen(this.socketPath)
  }

  id: string

  get socketDir(): string {
    return path.resolve(SocketStreamsDir, this.type)//)
  }

  get socketPath(): string {
    return `${this.socketDir}/${this.id}.sock`
  }

  type: string

  get url():string{ return  `unix:${this.socketPath}` }
}

const StreamInput = (stream: Stream, id: string, type = 'input'): UnixStream => {
  // console.log("StreamInput", id, type)
  return new UnixStream(stream, id, (socket:Socket) => { stream.pipe(socket) }, type)
}

const StreamOutput = (stream:Writable, id: string, type = 'output'):UnixStream => {
  // console.log("StreamOutput", id, type)
  return new UnixStream(stream, id, (socket:Socket) => { socket.pipe(stream) }, type)
}

export { StreamInput, StreamOutput }
