import fs from 'fs'
import path from 'path'

import { LoadType, OutputFormat, OutputType } from '@moviemasher/moviemasher.js/src/Setup/Enums'
import { EmptyMethod, ExtJpeg } from '@moviemasher/moviemasher.js/src/Setup/Constants'
import { Default } from '@moviemasher/moviemasher.js/src/Setup/Default'
import { DimensionsPreview } from '@moviemasher/moviemasher.js/src/Utility/Size'
import { idGenerate } from '@moviemasher/moviemasher.js/src/Utility/Id'
import { assertPopulatedArray, assertPopulatedString } from '@moviemasher/moviemasher.js/src/Utility/Is'
import { CommandOutputs, RenderingCommandOutput } from '@moviemasher/moviemasher.js/src/Output/Output'
import { outputDefaultPopulate, outputDefaultVideo } from '@moviemasher/moviemasher.js/src/Output/OutputDefault'
import { RenderingInput } from '@moviemasher/moviemasher.js/src/Api/Rendering'

import { ExtensionLoadedInfo } from '../../packages/server-express/src/Setup/Constants'
import { renderingInputFromRaw } from '../../packages/server-express/src/Utilities/Rendering'
import { expandFile } from '../../packages/server-express/src/Utilities/Expand'
import { RenderingArgs, RenderingProcessArgs } from "../../packages/server-express/src/Server/RenderingServer/RenderingProcess/RenderingProcess"
import { commandProcess } from '../../packages/server-express/src/Command/CommandFactory'
import { renderingProcessInstance } from "../../packages/server-express/src/Server/RenderingServer/RenderingProcess/RenderingProcessFactory"
import { probingInfoPromise } from '../../packages/server-express/src/Command/Probing'


import { TestRenderingsDir } from './Setup/Constants'
import { expectOutputFile, expectRender } from "./Utilities/ExpectRender"
import { expectArrayLength } from './Utilities/Expect'
import { renderingProcessInput } from "./Utilities/renderingProcessInput"
import { 
  GenerateDefinitionObjects, GenerateOptions, 
  GenerateTestsDefault, 
  GenerateContentTest, 
  GenerateContainerTest, 
  GenerateMashTest, 
  generateTest, 
  generateIds, 
  GenerateTestIds,
  GenerateDelimiter,
  GenerateIdDelimiter
} from "./Utilities/Generate"

const renderingProcessArgs = (id?: string): RenderingProcessArgs => {
  const options: RenderingArgs = {
    mash: {}, outputs: [], definitions: []
  }
  const definedId = id || idGenerate()
  const testArgs = renderingProcessInput(definedId)
  
  const args: RenderingProcessArgs = {
    ...testArgs, ...options, id: definedId
  }
  return args
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
        const definedId = id || idGenerate()
        const renderingArgs = { ...args, ...renderingProcessInput(definedId), id: definedId }
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
   

    const options: RenderingArgs = {
      mash, definitions: GenerateDefinitionObjects, 
      outputs: [output],
    }
    const input = renderingProcessInput(id)
    const processArgs: RenderingProcessArgs = {
      ...input, id, ...options
      
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
    const outputId = idGenerate()
    const baseArgs: RenderingProcessArgs = {
      ...renderingProcessInput(outputId), id: outputId,
      outputs: [output], mash: {}, definitions: [], 
    }
    const sources: string[] = ids.map(id => {
      const args = { ...baseArgs, ...renderingProcessInput(id), id }
      const process = renderingProcessInstance(args)
      const [source] = process.destinations
      const resolved = path.resolve(source)
      expect(fs.existsSync(resolved)).toBeTruthy()

      return resolved
    })

    const args = { ...baseArgs, ...renderingProcessInput(id), id }
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