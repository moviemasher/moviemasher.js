import type { DataServerArgs, DecodeServerArgs, EncodeServerArgs, ServerAuthentication, TranscodeServerArgs, UploadServerArgs, WebServerArgs } from '../Server/Server.js'
import type { HostOptions } from './Host.js'

import { ENV, ENV_KEY } from '@moviemasher/server-lib'
import { AUDIO, FONT, IMAGE, NUMBER, TEXT, VIDEO } from '@moviemasher/shared-lib/runtime.js'

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
  const host = hostOrUndefined || ENV.get(ENV_KEY.ExampleHost)
  
  const version = versionOrUndefined || ENV.get(ENV_KEY.Version)
  const publicDirectory = dirOrUndefined || ENV.get(ENV_KEY.ExampleRoot)
  const port = portOrUndefined || ENV.get(ENV_KEY.ExamplePort, NUMBER)
  const authentication = auth || OpenAuthentication
  const data: DataServerArgs = { authentication }
  const upload: UploadServerArgs = {
    uploadLimits: {
      [AUDIO]: 50,
      [FONT]: 5,
      [IMAGE]: 5,
      [VIDEO]: 100,
    },
    extensions: {
      [AUDIO]: [
        'aiff',
        'mp3',
        'wav',
      ],
      [FONT]: [
        'otf',
        'ttf',
        'woff',
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
      '/assets/': ENV.get(ENV_KEY.OutputRoot),
      '/docs/': `./docs/index.html`,
      '/json/': './packages/@moviemasher/client-lib/dist/json',
      '/@moviemasher/': './packages/@moviemasher',
      '/@lit/': './node_modules/@lit',
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
