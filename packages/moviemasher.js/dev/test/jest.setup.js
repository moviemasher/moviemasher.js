/* eslint-disable @typescript-eslint/no-var-requires */

import { LoaderFactoryClasses } from "../../src/Loader/LoaderFactory"
import { DefinitionTypes } from "../../src/Setup/Enums"
import { FontLoaderTest } from "./FontLoaderTest"
import { ImageLoaderTest } from "./ImageLoaderTest"
import { Definitions } from "../../src/Definitions/Definitions"
import { Factory } from "../../src/Definitions/Factory/Factory"
import { AudioFactoryImplementation } from "../../src/Media/Audio"
import { EffectFactoryImplementation } from "../../src/Media/Effect"
import { FilterFactoryImplementation } from "../../src/Media/Filter"
import { FontFactoryImplementation } from "../../src/Media/Font/FontFactory"
import { ImageFactoryImplementation } from "../../src/Media/Image/ImageFactory"
import { MergerFactoryImplementation } from "../../src/Media/Merger/MergerFactory"
import { ScalerFactoryImplementation } from "../../src/Media/Scaler/ScalerFactory"
import { ThemeFactoryImplementation } from "../../src/Media/Theme/ThemeFactory"
import { TransitionFactoryImplementation } from "../../src/Media/Transition/TransitionFactory"
import { VideoFactoryImplementation } from "../../src/Media/Video/VideoFactory"
import { VideoStreamFactoryImplementation } from "../../src/Media/VideoStream/VideoStreamFactory"
import { VideoSequenceFactoryImplementation } from "../../src/Media/VideoSequence/VideoSequenceFactory"
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
import fs from 'fs'
import path from 'path'

const { toMatchImageSnapshot } = require('jest-image-snapshot')
require('jest-fetch-mock').enableMocks()

expect.extend({ toMatchImageSnapshot })

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
  Factory.font.define({
    id: 'com.moviemasher.font.default', source: 'BlackoutTwoAM.ttf'
  })
})

LoaderFactoryClasses.font = FontLoaderTest
LoaderFactoryClasses.image = ImageLoaderTest
