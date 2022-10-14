/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs'
import path from 'path'

import { audioDefinition } from "../../packages/moviemasher.js/src/Media/Audio/AudioFactory"
import { contentDefinition } from "../../packages/moviemasher.js/src/Content/ContentFactory"
import { containerDefinition } from "../../packages/moviemasher.js/src/Container/ContainerFactory"
import { effectDefinition } from "../../packages/moviemasher.js/src/Media/Effect/EffectFactory"
import { filterDefinition } from "../../packages/moviemasher.js/src/Filter/FilterFactory"
import { fontDefinition, fontDefault } from "../../packages/moviemasher.js/src/Media/Font/FontFactory"
import { imageDefinition } from "../../packages/moviemasher.js/src/Media/Image/ImageFactory"
import { clipDefinition } from "../../packages/moviemasher.js/src/Edited/Mash/Track/Clip/ClipFactory"
import { videoDefinition } from "../../packages/moviemasher.js/src/Media/Video/VideoFactory"
import { videoSequenceDefinition } from "../../packages/moviemasher.js/src/Media/VideoSequence/VideoSequenceFactory"

import { Defined } from "../../packages/moviemasher.js/src/Base/Defined"
import { DefinitionType } from "../../packages/moviemasher.js/src/Setup/Enums"

export default [
  audioDefinition,
  contentDefinition,
  effectDefinition,
  filterDefinition,
  fontDefinition,
  containerDefinition,
  clipDefinition,
  imageDefinition,
  videoDefinition,
  videoSequenceDefinition,
]

// if (fs.existsSync(TestRenderOutput)) {
//   fs.rmSync(TestRenderOutput, { recursive: true, force: true })
// }

// if (fs.existsSync(TestRenderCache)) {
//   fs.rmSync(TestRenderCache, { recursive: true, force: true })
// }

// const { toMatchImageSnapshot } = require('jest-image-snapshot')

// expect.extend({ toMatchImageSnapshot })

jest.setTimeout(10 * 1000)

require('jest-fetch-mock').enableMocks()

fetchMock.mockResponse(req => {
  const promise = new Promise((resolve, reject) => {
    const localPath = path.resolve(__dirname, '..', req.url)
    fs.readFile(localPath, 'ascii', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return promise
})
beforeAll(() => {})

beforeEach(() => {
  Defined.undefineAll()
  Defined.define({
    id: 'image-square', type: DefinitionType.Image, 
    source: '../shared/image/globe.jpg',  sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    id: 'image-landscape', type: DefinitionType.Image, 
    source: '../shared/image/cable.jpg', sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    type: "videosequence",
    label: "Video Sequence", id: "video-sequence",
    url: 'video/frames/',
    source: 'video/source.mp4',
    audio: 'video/audio.mp3',
    duration: 3, fps: 30, sourceSize: { width: 640, height: 480 }
  })
  Defined.define({
    type: "video",
    label: "Video", id: "video-rgb",
    url: 'video.mp4',
    source: 'video.mp4',
    duration: 3, fps: 10, sourceSize: { width: 640, height: 480 }
    
  })
  fontDefault.url = fontDefault.source
})

