/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs'
import path from 'path'

import { FontDefinitions } from "../../packages/moviemasher.js/src/Media/Font/FontFactory"

import { TestRenderOutput } from "./Setup/Constants"

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

FontDefinitions['com.moviemasher.font.default'].url = FontDefinitions['com.moviemasher.font.default'].source
