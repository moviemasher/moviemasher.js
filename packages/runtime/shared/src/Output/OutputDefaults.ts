import { AUDIO, IMAGE, VIDEO } from '../AssetTypeConstants.js'
import { TranscodingType } from '../ImportType.js'
import { FONT } from '../ImportTypeConstants.js'
import { SEQUENCE, WAVEFORM } from '../TranscodingConstants.js'
import { OutputOptions } from './Output.js'

export const OUTPUT_DEFAULTS: Record<TranscodingType, OutputOptions> = {
  [AUDIO]:  {
    options: {},
    audioBitrate: 160,
    audioCodec: 'libmp3lame',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'mp3',
  }, 
  [FONT]: {
    options: {},
    extension: 'woff2',
  },
  [SEQUENCE]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'jpg',
  },
  [WAVEFORM]: {
    options: {},
    width: 320,
    height: 240,
    forecolor: '#000000',
    backcolor: '#00000000',
    audioBitrate: 160,
    audioCodec: 'aac',
    audioChannels: 2,
    audioRate: 44100,
    extension: 'png',
  },
  [IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'jpg',
  },
  [VIDEO]: {
    options: {
      g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920,
    height: 1080,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    g: 0,
    format: 'mp4',
  },
}

export const ALPHA_OUTPUT_DETAULTS = {
  [IMAGE]: {
    options: {},
    width: 320,
    height: 240,
    extension: 'png',
    format: 'image2',
    offset: 0
  },
  [SEQUENCE]: {
    options: {},
    format: 'image2',
    width: 320,
    height: 240,
    videoRate: 10,
    extension: 'png',
  },
  [VIDEO]: {
    options: {
      g: 60,
      level: 41,
      movflags: 'faststart'
    },
    width: 1920,
    height: 1080,
    videoRate: 30,
    videoBitrate: 2000,
    audioBitrate: 160,
    audioCodec: 'aac',
    videoCodec: 'libx264',
    audioChannels: 2,
    audioRate: 44100,
    g: 0,
    format: 'mp4',
    extension: 'mp4',
  },
}
