import fs from 'fs'
import {
  RenderingCommandOutput, OutputType, LoadType, RenderingInput, OutputFormat,
  ExtPng, CommandOutputs, outputDefaultPopulate
} from "@moviemasher/moviemasher.js"

import { RenderingProcessArgs } from "./RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcessFactory"
import { expectOutputFile } from "../../../../../../dev/test/Utilities/expectOutputFile"
import { renderingProcessTestArgs
} from "../../../../../../dev/test/Utilities/renderingProcessArgs"
import { TestRenderingsDir } from '../../../../../../dev/test/Setup/Constants'
import { renderingInputFromRaw } from '../../../Utilities/Rendering'
import { expandFile } from '../../../Utilities/Expand'

export function renderingProcessArgs(id?: string): RenderingProcessArgs {
  return {
    ...renderingProcessTestArgs(id), mash: {}, outputs: []
  }
}

describe("RenderingProcess", () => {
  const imageUrl = '../shared/image/globe.jpg'
  const videoUrl = '../shared/video.mp4'

  const baseOutput: RenderingCommandOutput = {
    outputType: OutputType.Image,
    format: OutputFormat.Png,
    extension: ExtPng,
  }
  describe("renders", () => {
    const renderingFiles = fs.readdirSync(TestRenderingsDir).filter(p => p.endsWith('.json'))
    test.each(renderingFiles)('%s', async (fileName) => {
      const json = expandFile(`${TestRenderingsDir}/${fileName}`)
      const args = JSON.parse(json) as RenderingProcessArgs
      const { id, outputs } = args
      const renderingArgs = { ...args, ...renderingProcessTestArgs(id) }
      const renderingProcess = renderingProcessInstance(renderingArgs)
      const runPromise = renderingProcess.runPromise()
      const checkPromise = runPromise.then(runResult => {
        const { results } = runResult
        const promises = outputs.map((output, index) => {
          const result = results[index]
          expect(result).toBeDefined()
          const { destination, error } = result
          expect(error).toBeFalsy()
          expect(destination).toBeDefined()

          return expectOutputFile(destination)
        })
        return Promise.all(promises)
      })
      await checkPromise
    })
  })
  describe.skip("render", () => {
    test("renders audio from trimmed video", async () => {
      const output = outputDefaultPopulate({ outputType: OutputType.Audio })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, { trim: 10 })
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('audio-from-trimmed-video'), outputs, ...renderingInput,
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      const result = await renderingProcess.runPromise()

      await expectOutputFile(result.results[0].destination)
    })
  })

  describe.skip("runPromise", () => {
    test("renders image from image with cover", async () => {
      const output = outputDefaultPopulate({ ...baseOutput, cover: true })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('image-from-image-square-with-cover'), outputs, ...renderingInput,
      }
      console.log(processArgs)
      const renderingProcess = renderingProcessInstance(processArgs)
      const result = await renderingProcess.runPromise()
      await expectOutputFile(result.results[0].destination)
    })

    test("renders video from image", async () => {
      const output = outputDefaultPopulate({ outputType: OutputType.Video, cover: false })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('video-from-image-square'), outputs, ...renderingInput,
      }
      const process = renderingProcessInstance(processArgs)
      const result = await process.runPromise()
      await expectOutputFile(result.results[0].destination)
    })

    test("renders image from trimmed video", async () => {
      const output = outputDefaultPopulate({ ...baseOutput })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, { trim: 10 })
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('image-from-trimmed-video'), outputs, ...renderingInput,
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      const result = await renderingProcess.runPromise()

      await expectOutputFile(result.results[0].destination)
    })

    test("renders video from video with cover", async () => {
      const output = outputDefaultPopulate({ outputType: OutputType.Video, cover: true })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl)
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('video-from-video-with-cover'), outputs, ...renderingInput,
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      const result = await renderingProcess.runPromise()
      const { results } = result
      expect(results.length).toBeGreaterThan(0)
      const [first] = results
      expect(first.error).toBeUndefined()
      await expectOutputFile(first.destination)
    })

    test("renders image sequence from video with cover", async () => {
      const output = outputDefaultPopulate({ ...baseOutput, outputType: OutputType.ImageSequence, cover: true })
      // console.log('output', output)
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl)
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('image-sequence-from-video-with-cover'), outputs, ...renderingInput,
      }
      const renderingProcess = renderingProcessInstance(processArgs)
      const result = await renderingProcess.runPromise()
      await expectOutputFile(result.results[0].destination)
    })

    // BUG: test renders as transparent image instead of properly cropped
    test.skip("renders image from image", async () => {
      // expect('image output does not currently support negative values for overlay.y').toBeFalsy()

      const output = outputDefaultPopulate({ ...baseOutput, cover: false })
      const outputs: CommandOutputs = [output]
      const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
      const processArgs: RenderingProcessArgs = {
        ...renderingProcessArgs('image-from-image-square'), outputs, ...renderingInput,
      }
      const process = renderingProcessInstance(processArgs)
      const result = await process.runPromise()
      await expectOutputFile(result.results[0].destination)
    })
  })
})
