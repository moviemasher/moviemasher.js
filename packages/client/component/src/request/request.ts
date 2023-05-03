import type { 
  Strings, ClientAudio, ClientImage, ClientVideo, EndpointRequest, RequestInit, ClientFont 
} from '@moviemasher/lib-core'

const SlashChar = '/'
const ColonChar = ':'

const urlIsBlob = (url: string) => Boolean(url.startsWith('blob'))
const fontFamily = (url: string): string => url.replace(/[^a-z0-9]/gi, '_')
 
export const requestUrl = (request: EndpointRequest): string => {
  const { endpoint, response } = request
  if (!endpoint) {
    if (response) return URL.createObjectURL(response)
    return ''
  }
  if (typeof endpoint === 'string') return endpoint

  const { protocol, hostname, port, pathname, search  } = endpoint
  const pathBits: Strings = []
  if (pathname) pathBits.push(pathname)
  if (search) pathBits.push(search)
  if (!(protocol && hostname)) return pathBits.join('')

  const bits = [protocol]
  if (!urlIsBlob(protocol)) bits.push(SlashChar, SlashChar)
  bits.push(hostname)
  if (port) bits.push(`${ColonChar}${port}`)
  bits.push(...pathBits)
  return bits.join('')
}


let _context: AudioContext | undefined = undefined

const context = () => {
  if (_context) return _context 
  
  const Klass = AudioContext || window.webkitAudioContext
  return _context = new Klass()
}

const urlFromCss = (string: string): string => {
  const exp = /url\(([^)]+)\)(?!.*\1)/g
  const matches = string.matchAll(exp)
  const matchesArray = Array.from(matches)
  const { length: matchesLength } = matchesArray
  const lastMatches = matchesArray[matchesLength - 1]
  const { length: lastMatchesLength } = lastMatches
  const lastMatch = lastMatches[lastMatchesLength - 1]
  return lastMatch
}


const fecthBlobUrl = (url: string, init?: RequestInit) => (
  fetch(url, init)
    .then(response => response.blob())
    .then(blob => URL.createObjectURL(blob))
)

export const requestAudioPromise = (request: EndpointRequest) => {
  const url = requestUrl(request)
  if (!url) return Promise.reject(new Error('url'))

  console.debug('requestAudioPromise', url)

  const { init } = request
  const blobPromise = fetch(url, init).then(response => response.blob())
  const bufferPromise = blobPromise.then(blob => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => { resolve(reader.result as ArrayBuffer) }
      reader.onerror = reject
      reader.readAsArrayBuffer(blob)
    }) 
  })
  const promise = bufferPromise.then(buffer => {
    
    return new Promise<ClientAudio>((resolve, reject) => {
      context().decodeAudioData(
        buffer,
        audioData => resolve(audioData),
        error => reject(error)
      )
    })
  })
  return promise
}

export const requestFontPromise = (request: EndpointRequest) => {
  const url = requestUrl(request)
  if (!url) return Promise.reject(new Error('url'))

  const { init } = request

  const family = fontFamily(url)

  console.debug('requestFontPromise', url)
  const bufferPromise: Promise<ClientFont> = fetch(url, init).then(response => {
    const mimetype = response.headers.get('content-type') || ''
    // console.log('fontPromise.fetch', type)
    if (!mimetype || mimetype.startsWith('font')) {
      return response.arrayBuffer().then(buffer => {
        // console.log('fontPromise.bufferPromise', url)
        const face = new FontFace(family, buffer)
        return face.load()
      })
    }

    //  mimetype does not match load type - see if there is resolver
    if (!mimetype.startsWith('text/css')) return Promise.reject(new Error(`mimetype: ${mimetype}`))
    
    return response.text().then(cssText => {
      const url = urlFromCss(cssText)
      if (!url) return Promise.reject(new Error('css'))
    
      return requestFontPromise({ endpoint: url })
    })
  })

  return bufferPromise.then(face => {
    const { fonts } = globalThis.document
    fonts.add(face)
    return fonts.ready.then(() => face)
  })
}

export const requestImagePromise = (request: EndpointRequest) => {
  const url = requestUrl(request)
  if (!url) return Promise.reject(new Error('url'))

  console.debug('requestImagePromise', url)

  const { init } = request
 
  const promise = urlIsBlob(url) ? Promise.resolve(url) : fecthBlobUrl(url, init)

  return promise.then(url => (
    new Promise<ClientImage>((resolve, reject) => {
      const image = new Image()
      image.src = url
      image.onerror = reject
      image.onload = () => { resolve(image) }
    })
  ))
}

export const requestVideoPromise = (request: EndpointRequest) => {
  const url = requestUrl(request)
  if (!url) return Promise.reject(new Error('url'))

  console.debug('requestVideoPromise', url)

  return new Promise<ClientVideo>((resolve, reject) => {
    const video = globalThis.document.createElement('video')
    video.src = url
    video.oncanplay = () => {
      video.oncanplay = null
      video.onerror = null
      const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video
      const width = videoWidth || clientWidth
      const height = videoHeight || clientHeight
      if (!(width && height && duration)) {
        reject(`duration: ${duration} size: ${width}x${height}`)
      } else {
        video.width = width
        video.height = height
        resolve(video)
      }
    }
    video.onerror = reject
    video.autoplay = false
    video.load()
  })
}