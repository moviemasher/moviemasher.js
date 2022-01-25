import { ServerOptions } from "../declarations"

const urlServerOptions = (): ServerOptions => {
  const url = new URL(document.baseURI)
  const { protocol, host, pathname, port } = url
  const serverOptions: ServerOptions = { protocol, host, prefix: pathname }
  if (port) serverOptions.port = Number(port)
  return serverOptions
}

const urlAbsolute = (url: string): string => (new URL(url, document.baseURI)).href

const urlForServerOptions = (serverOptions?: ServerOptions, suffix? : string):string => {
  const bits: string[] = []
  if (serverOptions) {
    const { host, port, protocol, prefix } = serverOptions
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

/**
 * @category Utility
 */
const Url = {
  absolute: urlAbsolute,
  forServerOptions: urlForServerOptions,
  serverOptions: urlServerOptions
}

export { Url, urlAbsolute, urlForServerOptions, urlServerOptions }
