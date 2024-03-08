import type { DataServerArgs, DecodeServerArgs, EncodeServerArgs, HostOptionsDefault, ServerAuthentication, TranscodeServerArgs, UploadServerArgs, WebServerArgs } from '../types.js'
import type { HostOptions } from '../types.js'

import {$Version, $ExamplePort, $ExampleHost, ENV, $ExampleRoot, $OutputRoot, $SharedAssets } from '@moviemasher/server-lib/utility/env.js'
import { $AUDIO, $FONT, $IMAGE, $NUMBER, $VIDEO, SLASH } from '@moviemasher/shared-lib/runtime.js'
import path from 'path'

const OpenAuthentication: ServerAuthentication = { type: 'basic' }

export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const { auth } = args
  const authentication = auth || OpenAuthentication
  const data: DataServerArgs = { authentication }
  const upload: UploadServerArgs = {
    uploadLimits: {
      [$AUDIO]: 50,
      [$FONT]: 5,
      [$IMAGE]: 5,
      [$VIDEO]: 100,
    },
    extensions: {
      [$AUDIO]: [
        'aiff',
        'mp3',
        'wav',
      ],
      [$FONT]: [
        'otf',
        'ttf',
        'woff',
      ],
      [$IMAGE]: [
        'jpeg',
        'jpg',
        'png',
        'svg',
      ],
      [$VIDEO]: [
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
      '/': [ENV.get($ExampleRoot), 'index.html'].join(SLASH),
      '/assets/': ENV.get($OutputRoot),
      '/json/': path.dirname(ENV.get($SharedAssets)), 
      '/@moviemasher/': './node_modules/@moviemasher',
      '/@lit/': './node_modules/@lit',
      '/lit': './node_modules/lit',
      '/lit-html': './node_modules/lit-html',
      '/lit-element': './node_modules/lit-element',
      '/@lit-labs': './node_modules/@lit-labs',
    }, authentication
  }
  const options: HostOptions = {
    port: ENV.get($ExamplePort, $NUMBER), 
    host: ENV.get($ExampleHost), 
    version: ENV.get($Version),
    corsOptions: { origin: '*' },
    data, upload, encode, web, decode, transcode
  }
  return options
}
