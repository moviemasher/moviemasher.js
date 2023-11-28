import type { DataServerArgs, DecodeServerArgs, EncodeServerArgs, ServerAuthentication, TranscodeServerArgs, UploadServerArgs, WebServerArgs } from '../Server/Server.js'
import type { HostOptions } from './Host.js'

import { ENV } from '@moviemasher/lib-server'
import { AUDIO, IMAGE, NUMBER, VIDEO } from '@moviemasher/runtime-shared'

const OpenAuthentication: ServerAuthentication = { type: 'basic' }

export interface HostOptionsDefault {
  port?: number
  host?: string
  auth?: ServerAuthentication
  publicDirectory?: string
  version?: string
}

export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const {
    publicDirectory: dirOrUndefined,
    port: portOrUndefined, auth, host: hostOrUndefined, version: versionOrUndefined,
  } = args
  const host = hostOrUndefined || ENV.get('MOVIEMASHER_HOST')
  
  const version = versionOrUndefined || ENV.get('MOVIEMASHER_VERSION')
  const publicDirectory = dirOrUndefined || ENV.get('MOVIEMASHER_EXAMPLE_ROOT')
  const port = portOrUndefined || ENV.get('MOVIEMASHER_EXAMPLE_PORT', NUMBER)
  const authentication = auth || OpenAuthentication
  const data: DataServerArgs = { authentication }
  const upload: UploadServerArgs = {
    uploadLimits: {
      video: 100,
      audio: 50,
      image: 5,
    },
    extensions: {
      [AUDIO]: [
        'aiff',
        'mp3',
      ],
      [IMAGE]: [
        'jpeg',
        'jpg',
        'png',
        'svg',
      ],
      [VIDEO]: [
        'mov',
        'mp4',
        'mpeg',
        'mpg',
      ],
    },
    authentication
  }
  const encode: EncodeServerArgs = { authentication }
  const decode: DecodeServerArgs = { authentication }
  const transcode: TranscodeServerArgs = { authentication }
  const web: WebServerArgs = {
    sources: { 
      '/': `${publicDirectory}/index.html`,
      '/docs/': `${publicDirectory}/docs/index.html`,
      '/@lit': './node_modules/@lit',
      '/lit': './node_modules/lit',
      '/lit-html': './node_modules/lit-html',
      '/lit-element': './node_modules/lit-element',
      '/@lit-labs': './node_modules/@lit-labs',
    }, authentication
  }
  const options: HostOptions = {
    port, host, version,
    corsOptions: { origin: '*' },
    data, upload, encode, web, decode, transcode
  }
  return options
}
