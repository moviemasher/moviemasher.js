import {
  RenderingCommandOutput, OutputType, RawType, RenderingInput, OutputFormat,
  ExtPng, CommandOutputs, idGenerate
} from "@moviemasher/moviemasher.js"
import { RenderingProcessArgs } from "./RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcessFactory"
import { expectImageFile } from "../../../../../../dev/test/Utilities/expectImageFile"
import { expectVideoFile } from "../../../../../../dev/test/Utilities/expectVideoFile"
import { renderingInputFromRaw } from "../../../Utilities/RenderingInput"

describe("renderingProcessInstance", () => {
  const imageUrl = 'globe.jpg'
  const videoUrl = 'video.mp4'
  const baseJobOptions: RenderingProcessArgs = {
    cacheDirectory: 'temporary/test/cache',
    renderingDirectory: 'temporary/test/render',
    fileDirectory: 'dev/test/assets',
    id: idGenerate(), definitions: [], mash: {}, outputs: []

  }
  const baseOutput: RenderingCommandOutput = {
    outputType: OutputType.Image,
    format: OutputFormat.Png,
    extension: ExtPng,
  }
  describe("instance", () => {
    test("renders image from image with cover", async () => {
      const output = { ...baseOutput, cover: true }
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(RawType.Image, imageUrl)
      const jobOptions: RenderingProcessArgs = {
        ...baseJobOptions, outputs, ...renderingInput,
      }
      const job = renderingProcessInstance(jobOptions)
      const result = await job.runPromise()
      await expectImageFile(result.results[0].destination)
    })

    test("renders image from image without cover", async () => {
      const output = { ...baseOutput, cover: false }
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(RawType.Image, imageUrl)
      const jobOptions: RenderingProcessArgs = {
        ...baseJobOptions, outputs, ...renderingInput,
      }
      const process = renderingProcessInstance(jobOptions)
      const result = await process.runPromise()
      await expectImageFile(result.results[0].destination)
    })

    test("renders image from video with cover", async () => {
      const output = { ...baseOutput, cover: true }
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(RawType.Video, videoUrl)
      const jobOptions: RenderingProcessArgs = {
        ...baseJobOptions, outputs, ...renderingInput,
      }
      const job = renderingProcessInstance(jobOptions)
      const result = await job.runPromise()

      await expectImageFile(result.results[0].destination)
    })

    test("renders video from video with cover", async () => {
      const output = { outputType: OutputType.Video, cover: true }
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(RawType.Video, videoUrl)
      const jobOptions: RenderingProcessArgs = {
        ...baseJobOptions, outputs, ...renderingInput,
      }
      const job = renderingProcessInstance(jobOptions)
      const result = await job.runPromise()
      const { results } = result
      expect(results.length).toBeGreaterThan(0)
      const [first] = results
      expect(first.error).toBeUndefined()
      await expectVideoFile(first.destination)
    })

    test("renders video sequence from video with cover", async () => {
      const output = { ...baseOutput, outputType: OutputType.VideoSequence, cover: true}
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(RawType.Video, videoUrl)
      const jobOptions: RenderingProcessArgs = {
        ...baseJobOptions, outputs, ...renderingInput,
      }
      const job = renderingProcessInstance(jobOptions)
      const result = await job.runPromise()
      await expectImageFile(result.results[0].destination)
    })
  })
})
