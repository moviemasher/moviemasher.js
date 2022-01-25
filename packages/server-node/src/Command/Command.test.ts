import {
  ClipObject, idGenerate, MashFactory, outputMp4, RenderType, SegmentArgs, TrackType
} from "@moviemasher/moviemasher.js"
import { expectRender } from "../../../../dev/test/Utilities/expectRender"
import { segmentToCommandArgs } from "../Utilities/Segment"

describe("Command", () => {
  test("run", async () => {
      const output = outputMp4()
      const trackType = TrackType.Video
      const clips: ClipObject[] = [{definitionId: 'com.moviemasher.theme.color'}]
      const mash = MashFactory.instance({tracks: [{trackType, clips}]})
      // console.log(JSON.stringify(mash))
      const timeRange = mash.timeRange
      const args: SegmentArgs = {
        type: RenderType.File, size: { width: output.width!, height: output.height! },
        videoRate: output.videoRate!, timeRange
      }
    const segments = mash.segments(args)
    const [segment] = segments
      // segments.forEach(segment => {
        const id = idGenerate()
        const destination = `./temporary/${id}.mp4`
        const commandArgs = segmentToCommandArgs(segment, output, destination)
        // console.log(commandArgs)

        await expectRender(id, commandArgs)
      // })
    })
})
