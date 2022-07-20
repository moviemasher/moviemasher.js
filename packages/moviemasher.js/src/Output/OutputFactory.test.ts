import { VideoOutputArgs } from "./Output"
import { OutputFactory } from "./OutputFactory"
import { renderingProcessTestArgs } from "../../../../dev/test/Utilities/renderingProcessArgs"
import { outputDefaultPopulate } from "./OutputDefault"
import { DefinitionType, OutputType, TrackType } from "../Setup/Enums"
import { mashInstance } from "../Edited/Mash/MashFactory"
import { MashArgs, MashObject } from "../Edited/Mash/Mash"
import { JestPreloader } from "../../../../dev/test/Utilities/JestPreloader"
import { VisibleClip } from "../Media/VisibleClip/VisibleClip"
import { Defined } from "../Base/Defined"
import { visibleClipDefault } from "../Media/VisibleClip/VisibleClipFactory"
import { assertUpdatableSizeDefinition } from "../Mixin/UpdatableSize/UpdatableSize"

describe("OutputFactory", () => {
  describe("video", () => {
    test("renderingDescriptionPromise", async () => {
      const id = 'video-from-multiple'
      const output = outputDefaultPopulate({ outputType: OutputType.Video, cover: false })
      const globeDefinitionObject = {
        id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
      }
      const cableDefinitionObject = {
        id: 'cable', type: DefinitionType.Image, source: '../shared/image/cable.jpg'
      }
      const definitionObjects = [globeDefinitionObject, cableDefinitionObject]
      const mashObject: MashObject = {
        tracks: [
          {
            clips: [
              { definitionId: visibleClipDefault.id, contentId: globeDefinitionObject.id, frames: 30 },
              { definitionId: visibleClipDefault.id, contentId: cableDefinitionObject.id, frames: 40 },
            ]
          }
        ]
      }

      Defined.define(...definitionObjects)
      const mashArgs: MashArgs = { ...mashObject, preloader: new JestPreloader() }
      const mash = mashInstance(mashArgs)
      const { quantize } = mash
      const videoTrack = mash.trackOfTypeAtIndex(TrackType.Video)
      const clips = videoTrack.clips as VisibleClip[]
      const testArgs = renderingProcessTestArgs(id)

      const videoOutputArgs: VideoOutputArgs = {
        ...testArgs, mash, commandOutput: output,
      }
      const outputVideo = OutputFactory.video(videoOutputArgs)
      const renderingDescription = await outputVideo.renderingDescriptionPromise()
      const { commandOutput, visibleCommandDescriptions } = renderingDescription

      const { outputType } = commandOutput
      expect(outputType).toEqual(OutputType.Video)
      expect(visibleCommandDescriptions).toBeInstanceOf(Array)
      expect(visibleCommandDescriptions?.length).toBe(2)
      visibleCommandDescriptions?.forEach((description, index) => {
        const clip = clips[index]

        const { duration, inputs } = description

        const timeRange = clip.timeRange(quantize)
        // console.log(clip.frames, duration, timeRange.lengthSeconds)
        expect(duration).toBe(timeRange.lengthSeconds)
        // console.log(inputs)

        expect(inputs?.length).toBe(1)
        const [input] = inputs!
        const { source } = input

        const { content } = clip
        const { definition } = content
        assertUpdatableSizeDefinition(definition)
        expect(source).toBe(definition.source)
      })
    })
  })
})
