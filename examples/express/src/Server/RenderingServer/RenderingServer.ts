import type { Size } from '@moviemasher/runtime-shared'
import type { Server, ServerArgs } from '../Server.js'
import type { OutputOptionsRecord } from './RenderingServerClass.js'

export interface RenderingServerArgs extends ServerArgs {
  cacheDirectory: string
  outputDirectory: string
  temporaryDirectory: string
  previewSize?: Size
  outputSize?: Size
  iconSize?: Size
  outputOptions: OutputOptionsRecord
}

export interface RenderingServer extends Server {}
