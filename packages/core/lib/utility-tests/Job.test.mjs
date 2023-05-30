
import { describe, test } from 'node:test'
import assert from 'assert'
import path from 'path'
import { Environment, environment } from '@moviemasher/server-core'

import { 
  mashMedia, AssetCollection, ProbeType,
  assertVisibleAsset, urlBaseInitialize, 
} from "@moviemasher/lib-core"

import { RenderingOutputClass, outputDefaultPopulate } from '@moviemasher/server-core'
import { renderingProcessInput } from '../../../../images/tester/Utilities/Rendering.mjs'
import { expectArrayLength } from "../../../../images/tester/Utilities/Expect.mjs"

describe("Job", () => {
  urlBaseInitialize('file://' + path.resolve(environment(Environment.API_DIR_FILE_PREFIX), 'user'))

  test("renderingDescriptionPromise", async () => {
    const id = 'video-from-multiple'
    const output = outputDefaultPopulate({ outputType: EncodeType.Video })
    const globeDefinitionObject = {
      id: 'image-id-globe', type: ImageType, source: '../shared/image/globe.jpg',
      decodings: [{ type: ProbeType, data: { width: 320, height: 320 } }]
    }
    const cableDefinitionObject = {
      id: 'image-id-cable', type: ImageType, source: '../shared/image/cable.jpg',
      decodings: [{ type: ProbeType, data: { width: 320, height: 240 } }]
    }
    const definitionObjects = [globeDefinitionObject, cableDefinitionObject]
    const mashObject = {
      media: definitionObjects,
      tracks: [
        {
          clips: [
            { contentId: globeDefinitionObject.id, frames: 30 },
            { contentId: cableDefinitionObject.id, frames: 40 },
          ]
        }
      ]
    }
    
    const media = new AssetCollection()
    media.define(...definitionObjects)
    const mashMediaObject = {
      request: { response: mashObject}
    }
    const mash = mashMedia(mashMediaObject)
    const { quantize } = mash
    const videoTrack = mash.tracks[0]
    const clips = videoTrack.clips 
    const testArgs = renderingProcessInput(id)

    const videoOutputArgs = {
      ...testArgs, mash, commandOutput: output,
    }
    const outputVideo = new RenderingOutputClass(videoOutputArgs)
    const renderingDescription = await outputVideo.renderingDescriptionPromise()
    const { commandOutput, visibleCommandDescriptions } = renderingDescription

    const { outputType } = commandOutput
    assert.equal(outputType, TypeVideo)
    assert(visibleCommandDescriptions instanceof Array)
    assert.equal(visibleCommandDescriptions?.length, 2)
    visibleCommandDescriptions?.forEach((description, index) => {
      const clip = clips[index]

      const { duration, inputs } = description

      const timeRange = clip.timeRange
      // console.log(clip.frames, duration, timeRange.lengthSeconds)
      assert.equal(duration, timeRange.lengthSeconds)
      // console.log(inputs)
      assert(inputs)
      expectArrayLength(inputs, 1)
      
      const [input] = inputs
      const { source } = input

      const { content } = clip
      const { definition } = content
      assertVisibleAsset(definition)
      assert(source.startsWith('http'))
    })
  })
})
