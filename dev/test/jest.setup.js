/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'

import { DefinitionTypes } from "../../packages/moviemasher.js/src/Setup/Enums"
import { Definitions } from "../../packages/moviemasher.js/src/Definitions/Definitions"
import { Factory } from "../../packages/moviemasher.js/src/Definitions/Factory/Factory"
import { AudioFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Audio"
import { EffectFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Effect"
import { FilterFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Filter"
import { FontFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Font/FontFactory"
import { ImageFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Image/ImageFactory"
import { MergerFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Merger/MergerFactory"
import { ScalerFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Scaler/ScalerFactory"
import { ThemeFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Theme/ThemeFactory"
import { TransitionFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Transition/TransitionFactory"
import { VideoFactoryImplementation } from "../../packages/moviemasher.js/src/Media/Video/VideoFactory"
import { VideoStreamFactoryImplementation } from "../../packages/moviemasher.js/src/Media/VideoStream/VideoStreamFactory"
import { VideoSequenceFactoryImplementation } from "../../packages/moviemasher.js/src/Media/VideoSequence/VideoSequenceFactory"

import { TestRenderOutput } from "./Setup/Constants"
export default [
  AudioFactoryImplementation,
  EffectFactoryImplementation,
  FilterFactoryImplementation,
  FontFactoryImplementation,
  ImageFactoryImplementation,
  MergerFactoryImplementation,
  ScalerFactoryImplementation,
  ThemeFactoryImplementation,
  TransitionFactoryImplementation,
  VideoFactoryImplementation,
  VideoStreamFactoryImplementation,
  VideoSequenceFactoryImplementation,
]

if (fs.existsSync(TestRenderOutput)) {
  fs.rmSync(TestRenderOutput, { recursive: true, force: true })
}
const { toMatchImageSnapshot } = require('jest-image-snapshot')

require('jest-fetch-mock').enableMocks()

expect.extend({ toMatchImageSnapshot })


jest.setTimeout(30 * 1000)
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

beforeEach(() => {
  Definitions.clear()
  DefinitionTypes.forEach(type => { Factory[type].initialize() })

  // woff2 doesn't seem to be supported by canvas's registerFont, so just allow ttf
  Factory.font.install({
    id: 'com.moviemasher.font.default', source: '../shared/font/lobster/lobster.ttf'
  })
})
