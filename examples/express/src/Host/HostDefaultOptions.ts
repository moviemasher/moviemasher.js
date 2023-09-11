import type { Size, VideoOutputOptions, } from '@moviemasher/runtime-shared'
import type { DataServerArgs } from '../Server/DataServer/DataServer.js'
import type { FileServerArgs } from '../Server/FileServer/FileServer.js'
import type { RenderingServerArgs } from '../Server/RenderingServer/RenderingServer.js'
import type { OutputOptionsRecord } from '../Server/RenderingServer/RenderingServerClass.js'
import type { ServerAuthentication } from '../Server/Server.js'
import type { WebServerArgs } from '../Server/WebServer/WebServer.js'
import type { HostOptions } from './Host.js'

import { ENVIRONMENT } from '@moviemasher/lib-server'
import { AUDIO, IMAGE, NUMBER, VIDEO } from '@moviemasher/runtime-shared'
import path from 'path'

const OpenAuthentication: ServerAuthentication = { type: 'basic' }

export interface HostOptionsDefault {
  previewSize?: Size
  outputSize?: Size
  port?: number
  host?: string
  outputRate?: number
  auth?: ServerAuthentication
  temporaryDirectory?: string
  mediaDirectory?: string
  dataDirectory?: string
  dataMigrationsDirectory?: string
  renderingCacheDirectory?: string
  privateDirectory?: string
  publicDirectory?: string
  version?: string
  outputOptions?: OutputOptionsRecord
}

export const HostDefaultOptions = (args: HostOptionsDefault = {}): HostOptions => {
  const {
    publicDirectory = './examples/express/public',
    temporaryDirectory = './temporary', 
    mediaDirectory,
    renderingCacheDirectory, 
    previewSize, outputSize, outputRate, port, auth, 
    host, version, outputOptions = {},
  } = args
  const definedHost = host || '0.0.0.0'
  const cacheDirectory = renderingCacheDirectory || `${temporaryDirectory}/cache`
  const uploadDir = mediaDirectory || `${publicDirectory}/assets`
  if (!uploadDir.startsWith(publicDirectory)) throw 'mediaDirectory must be public'

  const commandOutput: VideoOutputOptions = {}
  const basePort = port || ENVIRONMENT.get('MOVIEMASHER_EXAMPLE_PORT', NUMBER)
  if (outputSize) {
    const { width, height } = outputSize
    commandOutput.width = width
    commandOutput.height = height
  }
  if (outputRate) commandOutput.videoRate = outputRate


  const uploadsRelative = path.relative(publicDirectory, uploadDir)

  const authentication = auth || OpenAuthentication
  // if (authentication.type === 'basic') {
  //   // support grabbing shared password from command or text file
  //   authentication.password = await expandFileOrScript(authentication.password)
  // }

  const data: DataServerArgs = {
    authentication
  }

  const file: FileServerArgs = {
    uploadLimits: {
      video: 100,
      audio: 50,
      image: 5,
    },
    uploadsPrefix: uploadDir,
    uploadsRelative,
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

  const rendering: RenderingServerArgs = {
    temporaryDirectory, outputDirectory: uploadDir,
    cacheDirectory, authentication, outputOptions, previewSize, outputSize
  }

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
    port: basePort, host: definedHost, version,
    corsOptions: { origin: '*' },
    data, file, rendering, web
  }

  return options
}
