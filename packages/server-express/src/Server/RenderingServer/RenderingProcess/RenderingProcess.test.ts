import fs from 'fs'
import path from 'path'

import { RenderingProcessArgs } from "./RenderingProcess"
import { renderingProcessInstance } from "./RenderingProcessFactory"
import { expectOutputFile, expectRender, outputFileExists } from "../../../../../../dev/test/Utilities/ExpectRender"
import { renderingProcessTestArgs } from "../../../../../../dev/test/Utilities/renderingProcessArgs"
import { 
  GenerateDefinitionObjects, GenerateOptions, 
  GenerateTestsDefault, 
  GenerateContentTest, 
  GenerateContainerTest, 
  GenerateOptionsDefault, 
  GenerateMashTest, 
  generateTest, 
  generateIds, 
  GenerateArg,
  GenerateTestIds,
  GenerateDelimiter,
  generateTests,
  GenerateIdDelimiter
} from "../../../../../../dev/test/Utilities/Generate"
import { TestRenderingsDir } from '../../../../../../dev/test/Setup/Constants'
import { renderingInputFromRaw } from '../../../Utilities/Rendering'
import { expandFile } from '../../../Utilities/Expand'
import { CommandOutputs, RenderingCommandOutput } from '../../../../../../packages/moviemasher.js/src/Output/Output'
import { DefinitionType, LoadType, OutputFormat, OutputType } from '../../../../../../packages/moviemasher.js/src/Setup/Enums'
import { EmptyMethod, ExtJpeg } from '../../../../../../packages/moviemasher.js/src/Setup/Constants'
import { outputDefaultPopulate, outputDefaultVideo } from '../../../../../../packages/moviemasher.js/src/Output/OutputDefault'
import { RenderingInput } from '../../../../../../packages/moviemasher.js/src/Api/Rendering'
import { DimensionsPreview } from '../../../../../../packages/moviemasher.js/src/Utility/Size'
import { colorRed } from '../../../../../../packages/moviemasher.js/src/Utility/Color'
import { VisibleClipObject } from '../../../../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClip'
import { visibleClipDefault } from '../../../../../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory'
import { MashObject } from '../../../../../../packages/moviemasher.js/src/Edited/Mash/Mash'
import { Default } from '../../../../../../packages/moviemasher.js/src/Setup/Default'
import { VideoDefinitionObject } from '../../../../../../packages/moviemasher.js/src/Media/Video/Video'
import { assertPopulatedArray, assertPopulatedString, isPopulatedString } from '../../../../../../packages/moviemasher.js/src/Utility/Is'
import { commandProcess } from '../../../Command/CommandFactory'
import { expectArrayLength } from '../../../../../../dev/test/Utilities/Expect'
import { probingInfoPromise } from '../../../Command/Probing'
import { ExtensionLoadedInfo } from '../../../Setup/Constants'


function renderingProcessArgs(id?: string): RenderingProcessArgs {
  return {
    ...renderingProcessTestArgs(id), mash: {}, outputs: [], definitions: []
  }
}

describe.skip("RenderingProcess", () => {
  const imageUrl = '../shared/image/globe.jpg'
  const videoUrl = '../shared/video/rgb.mp4'

  const baseOutput: RenderingCommandOutput = {
    outputType: OutputType.Image,
    format: OutputFormat.Png,
    extension: ExtJpeg,
  }
  describe("with JSON mashes", () => {
    describe("runPromise renders", () => {
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
  })
  describe("with generated mashes", () => {
    describe("runPromise renders", () => {
      test("audio from trimmed video", async () => {
        const output = outputDefaultPopulate({ outputType: OutputType.Audio })
        // console.log("output", output)
        const outputs: CommandOutputs = [output]
        const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, { trim: 10 })
        // console.log("clip", renderingInput.mash.tracks![0].clips![0])

        const processArgs: RenderingProcessArgs = {
          ...renderingProcessArgs('audio-from-trimmed-video'), outputs, ...renderingInput,
        }
        // console.log("processArgs", processArgs)

        const renderingProcess = renderingProcessInstance(processArgs)
        const result = await renderingProcess.runPromise()

        await expectOutputFile(result.results[0].destination)
      })

      test("image from image with cover", async () => {
        const output = outputDefaultPopulate({ ...baseOutput })
        const outputs: CommandOutputs = [output]
        const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
        const processArgs: RenderingProcessArgs = {
          ...renderingProcessArgs('image-from-image-square-with-cover'), outputs, ...renderingInput,
        }
        // console.log(processArgs)
        const renderingProcess = renderingProcessInstance(processArgs)
        const result = await renderingProcess.runPromise()
        await expectOutputFile(result.results[0].destination)
      })

      test("video from image", async () => {
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

      test("image from trimmed video with cover", async () => {
        const output = outputDefaultPopulate({ ...baseOutput })
        const outputs: CommandOutputs = [output]
        const clip = { id: 'video', trim: 10 }
        const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, clip)
        const processArgs: RenderingProcessArgs = {
          ...renderingProcessArgs('image-from-trimmed-video'), outputs, ...renderingInput,
        }
        // console.log("processArgs", processArgs)
        const renderingProcess = renderingProcessInstance(processArgs)
        const result = await renderingProcess.runPromise()

        await expectOutputFile(result.results[0].destination)
      })

      test("video from video with cover", async () => {
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

      test("image sequence from video with cover", async () => {
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

      test("image from image", async () => {
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
})

describe("Rendering", () => {



  const expectMashTestRender = (mashTest: GenerateMashTest): Promise<void> => {
    const [id, mash] = mashTest
    const { tracks } = mash
    assertPopulatedArray(tracks)
    const { clips } = tracks[0]
    assertPopulatedArray(clips)
    const processArgs: RenderingProcessArgs = {
      ...renderingProcessTestArgs(id),
      mash, definitions: GenerateDefinitionObjects, 
      outputs: [output],
    }
    const process = renderingProcessInstance(processArgs)
    const [source] = process.destinations
    const destination = path.resolve(source)

    if (process.rendered(destination, duration)) {
      // console.log("expectMashTestRender rendered", destination)
      return Promise.resolve()
    }
  
    // console.log("expectMashTestRender rendering", destination, duration)
    return expectRender(processArgs)
  }

  const expectTestRender = (suffix: string, options: GenerateOptions): Promise<void> => {
    let promise = Promise.resolve()
    const ids = generateIds(options)
    ids.forEach(id => {
      promise = promise.then(() => { return expectTestIdRender(id) })
    })
    promise = promise.then(() => { return expectCombine(ids, suffix) })
    return promise
  }

  const expectTestIdRender = (id: string): Promise<void> => {
    assertPopulatedString(id)

    const mashTest = generateTest(id, DimensionsPreview, frames)
    return expectMashTestRender(mashTest)
  }

  const output = outputDefaultVideo({ ...DimensionsPreview, mute: true }) 
  const frames = 5
  const duration = frames / Default.mash.quantize


  const expectCombine = (ids: GenerateTestIds, suffix: string, durationSeconds = 0): Promise<void> => {
    const seconds = durationSeconds || duration * ids.length

    expectArrayLength(ids)
    const id = `all-${suffix}`
    const baseArgs: RenderingProcessArgs = {
      ...renderingProcessTestArgs(),
      mash: {}, definitions: [], outputs: [output],
    }
    const sources: string[] = ids.map(id => {
      const args = { ...baseArgs, ...renderingProcessTestArgs(id) }
      const process = renderingProcessInstance(args)
      const [source] = process.destinations
      const resolved = path.resolve(source)
      expect(fs.existsSync(resolved)).toBeTruthy()

      return resolved
    })

    const args = { ...baseArgs, ...renderingProcessTestArgs(id) }
    const process = renderingProcessInstance(args)
    const [source] = process.destinations
    const destination = path.resolve(source)
    if (process.rendered(destination, seconds)) return Promise.resolve()

    console.log("expectCombine", sources.length, destination)
    return fs.promises.mkdir(path.dirname(destination), { recursive: true }).then(() => {
      return new Promise<void>((resolve, reject) => {
        const command = commandProcess()
        command.on('error', (...args: any[]) => {
          reject({ error: args.join(",") }) 
        })
        command.on('end', () => { resolve() })
        try {
          sources.forEach(source => command.mergeAdd(source))
          command.mergeToFile(destination)
        }
        catch (error) { reject({ error }) }
        
      }).then(() => {
        const dirName = path.dirname(destination)
        const extName = path.extname(destination)
        const baseName = path.basename(destination, extName)
        const infoPath = path.join(dirName, `${baseName}.${ExtensionLoadedInfo}`)
        return probingInfoPromise(destination, infoPath).then(EmptyMethod)
      })
    })
  }

  describe("content in containers", () => {
    const contentTests = GenerateTestsDefault.content as GenerateContentTest[]
    const containerTests = GenerateTestsDefault.container as GenerateContainerTest[]
    const tests:[string, GenerateOptions][] = []
    contentTests.forEach(contentTest => {
      containerTests.forEach(containerTest => {
        const content = contentTest[0]
        const container = containerTest[0]
        const delimiter = [GenerateIdDelimiter, GenerateIdDelimiter].join(GenerateDelimiter)
        const label = [content, container].join(delimiter)// ...GenerateOptionsDefault, , contentSize: '', contentPoint: '', containerPoint: '' 
        tests.push([label, { container, content }])
      })
    })
  
    test.each(tests)("%s", async (name, options) => {
      await expectTestRender(name, options)
    })

    test("combined", async () => { 
      const ids = tests.map(test => `all-${test[0]}`) as GenerateTestIds
      const allIds = generateIds()
      await expectCombine(ids, 'combined', allIds.length * duration) 
    })
  })

  describe.only("specific", () => {
    const ids = [
      "P_TL_F_in_T_C_TL-BR_Q-F_100-0",
      // "BL-RE_TL_F_in_T_C_TL-BR_Q-F_50",
      // "P_TL_F_in_S_C_TL-BR_F-H_50",
      // "P_TL_F_in_S_U_TL-BR_Q-F_50",
      // "BL-RE_in_R_C_TL_Q-F_100",
      // "BL-RE_in_S_C_TL_Q-F_100",
      // "BL-RE_in_K_C_TL_Q-F_100",
      "BL-RE_in_T_C_TL_Q-F_100",
      // "P_TL_F_in_K_C_TL-BR_H_50"
    ] as GenerateTestIds

    test.each(ids)("%s", async (id) => { await expectTestIdRender(id) })

    test("all", async () => { await expectCombine(ids, 'specific') })
  })
})


  // describe("default", () => {
  //   const ids = generateIds(GenerateOptionsDefault)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  // })
  

  // describe("container-size-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     containerSize: generateArgsTween(GenerateArg.ContainerSize) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  //   test("all", async () => { await expectCombine(ids, 'container-size-tween') })
  // })

  // describe("content-size-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     contentSize: generateArgsTween(GenerateArg.ContentSize) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  //   test("all", async () => { await expectCombine(ids, 'content-size-tween') })
  // })
  
  // describe("content-point-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     contentPoint: generateArgsTween(GenerateArg.ContentPoint) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  //   test("all", async () => { await expectCombine(ids, 'content-point-tween') })
  // })
  
  // describe("container-point-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     containerPoint: generateArgsTween(GenerateArg.ContainerPoint) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  //   test("all", async () => { await expectCombine(ids, 'container-point-tween') })
  // })
  
  // describe("container-opacity-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     opacity: generateArgsTween(GenerateArg.Opacity) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await expectTestIdRender(id)
  //   })
  //   test("all", async () => { await expectCombine(ids, 'container-opacity-tween') })
  // })
  
  
  // describe("text", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "T", content: '', containerSize: ''//, opacity: ''
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => { await expectTestIdRender(id) })
  // })

  // describe("puppy-in-kitten", () => {
  //   const generateOptions: GenerateOptions = { //
  //     // ...GenerateOptionsDefault, 
  //     content: "P",  container: "K", 
      
  //     // containerSize: '', 
  //     // opacity: ''
  //   }
  //   const ids = generateIds(generateOptions)//.slice(0, 2)
  //   test.each(ids)("%s", async (id) => { await expectTestIdRender(id) })

  //   test("all", async () => { await expectCombine(ids, 'puppy-in-kitten') })
  // })