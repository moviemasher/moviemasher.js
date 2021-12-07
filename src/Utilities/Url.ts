import { RemoteServer } from "../declarations"

const urlRemoteServer = (): RemoteServer => {
  const url = new URL(document.baseURI)
  const { protocol, host, pathname, port } = url
  return {
    protocol, host, prefix: pathname, port
  }
}

const urlAbsolute = (url: string): string => (new URL(url, document.baseURI)).href
const urlForRemoteServer = (remoteServer?: RemoteServer, suffix? : string):string => {
  const bits: string[] = []
  if (remoteServer) {
    const { host, port, protocol, prefix } = remoteServer
    if (host) {
      bits.push(protocol || 'http')
      bits.push('://')
      bits.push(host)
      if (port) {
        bits.push(':')
        bits.push(String(port))
      }
    }
    if (prefix) bits.push(prefix)
  }
  if (suffix) bits.push(suffix)
  return urlAbsolute(bits.join(''))
}
const Url = {
  absolute: urlAbsolute,
  forRemoteServer: urlForRemoteServer,
  remoteServer: urlRemoteServer
}

export { Url, urlAbsolute, urlForRemoteServer, urlRemoteServer }
