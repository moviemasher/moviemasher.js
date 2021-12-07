/* eslint-disable @typescript-eslint/no-var-requires */

import { LoaderFactory } from "../../src/Loading/LoaderFactory"
import { DefinitionTypes, LoadType } from "../../src/Setup/Enums"
import { FontLoaderTest } from "./FontLoaderTest"
import { ImageLoaderTest } from "./ImageLoaderTest"
import { Definitions } from "../../src/Definitions/Definitions"
import { Factory } from "../../src/Definitions/Factory/Factory"
import { AudioFactoryImplementation } from "../../src/Mash/Audio"
import { EffectFactoryImplementation } from "../../src/Mash/Effect"
import { FilterFactoryImplementation } from "../../src/Mash/Filter"
import { FontFactoryImplementation } from "../../src/Mash/Font/FontFactory"
import { ImageFactoryImplementation } from "../../src/Mash/Image/ImageFactory"
import { MergerFactoryImplementation } from "../../src/Mash/Merger/MergerFactory"
import { ScalerFactoryImplementation } from "../../src/Mash/Scaler/ScalerFactory"
import { ThemeFactoryImplementation } from "../../src/Mash/Theme/ThemeFactory"
import { TransitionFactoryImplementation } from "../../src/Mash/Transition/TransitionFactory"
import { VideoFactoryImplementation } from "../../src/Mash/Video/VideoFactory"
import { VideoStreamFactoryImplementation } from "../../src/Mash/VideoStream/VideoStreamFactory"
import { VideoSequenceFactoryImplementation } from "../../src/Mash/VideoSequence/VideoSequenceFactory"
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

const fs = require('fs')
const path = require('path')
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
    id: 'com.moviemasher.font.default', source: 'assets/raw/BlackoutTwoAM.ttf'
  })
})

LoaderFactory.install(LoadType.Font, FontLoaderTest)
LoaderFactory.install(LoadType.Image, ImageLoaderTest)
