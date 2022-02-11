import {
  ClipObject, idGenerate, MashFactory, outputDefaultMp4, GraphType,
  FilterGraphArgs, TrackType, VideoOutputArgs, AVType, PreloaderClass
} from "@moviemasher/moviemasher.js"
import { expectRender } from "../../../../dev/test/Utilities/expectRender"
import { filterGraphToCommandArgs } from "../Utilities/FilterGraph"

describe("Command", () => {
  test("run", async () => {
    const graphType = GraphType.Mash
    const output = outputDefaultMp4() as VideoOutputArgs
    const trackType = TrackType.Video
    const clips: ClipObject[] = [{definitionId: 'com.moviemasher.theme.color'}]
    const mash = MashFactory.instance({ tracks: [{ trackType, clips }] })
    mash.preloader = new PreloaderClass()
    // console.log(JSON.stringify(mash))
    const timeRange = mash.timeRange
    const args: FilterGraphArgs = {
      avType: AVType.Both,
      graphType, size: { width: output.width, height: output.height },
      videoRate: output.videoRate!, timeRange
    }
    const videoGraphs = mash.filterGraphs(args)
    const [videoGraph] = videoGraphs
    const id = idGenerate()
    const destination = `./temporary/${id}.mp4`
    const commandArgs = filterGraphToCommandArgs(videoGraph, output, destination, graphType)
    // console.log(commandArgs)

    await expectRender(id, commandArgs)
  })
})
