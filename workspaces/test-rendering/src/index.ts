import fs from 'fs'
import path from 'path'

import { 
  SizePreview, outputDefaultVideo,
  outputDefaultImage, outputDefaultAudio, outputDefaultImageSequence, isArray
 } from '@moviemasher/moviemasher.js'



import { 
  generateIds, 
  GenerateTestIds,
  GenerateOptions,
  generateArgsDynamic,
  GenerateArg,
  generateArgsStatic,
  GenerateArgs} from "./Generate"
import { renderingTestIdPromise, renderingTestIdsPromise } from './Rendering'
import { TestRenderOutput } from './TestRenderOutput'
import { ExtensionLoadedInfo } from '@moviemasher/server-express'


const args = process.argv.slice(2)

console.log("args", ...args)

// const contentTests = [GenerateTestsDefault.content.find(test => test[0] === "RGB")] as GenerateContentTest[]
// const containerTests = GenerateTestsDefault.container.slice(0, 1) as GenerateContainerTest[]
// const tests:[string, GenerateOptions][] = []
// contentTests.forEach(contentTest => {
//   containerTests.forEach(containerTest => {
//     const content = contentTest[0]
//     const container = containerTest[0]
//     const delimiter = [GenerateIdDelimiter, GenerateIdDelimiter].join(GenerateDelimiter)
//     const label = [content, container].join(delimiter)//, contentSize: '', contentPoint: '', containerPoint: '' 
//     tests.push([label, {  ...GenerateOptionsDefault, container, content }])
//   })
// })

const imageOutput = outputDefaultImage({ cover: true }) 
const audioOutput = outputDefaultAudio({ optional: true }) 
const sequenceOutput = outputDefaultImageSequence({ ...SizePreview, cover: true }) 
const videoOutput = outputDefaultVideo({ ...SizePreview, mute: true }) 


// const testUploadVideo = async (test: GenerateMashTest) => {
//   const outputs = [imageOutput, audioOutput, sequenceOutput] // 
//   await renderingMashTestPromise(test, true, ...outputs)  
// }
// const [testId] = generateIds({ ...GenerateOptionsDefault, content: "P" })
// const test = generateTest(testId, SizePreview, Duration.Unknown)
// testUploadVideo(test)

const renderSpecificIds = (ids: GenerateTestIds, force = false) => {
  let promise = Promise.resolve()
  const renderIds = force ? ids : ids.filter(id => { 
    const idPath = path.join(TestRenderOutput, id, `video.${ExtensionLoadedInfo}`)
    return !fs.existsSync(idPath)
  })
  console.log("renderSpecificIds", renderIds.length)
  renderIds.forEach(id => { 
    promise = promise.then(() => {
      console.log(id)
      return renderingTestIdPromise(id, videoOutput, true, 5)
    })  
  })
  return promise
}

const combineAllRendered = async () => {
  await renderingTestIdsPromise(generateIds(), 'all-combined', videoOutput) 
}

const renderAndCombine = async (name: string, options?: GenerateOptions | GenerateTestIds, force = false) => {
  const ids = isArray(options) ? options : generateIds(options)
  await renderSpecificIds(ids, force)
  await renderingTestIdsPromise(ids, name, videoOutput).catch(error => {
    console.error(error)
  })
}

const staticGenerateOptions: GenerateOptions = { 
  // ...GenerateOptionsDefault, 
  // container: "T", content: '', 
  containerPoint: generateArgsStatic(GenerateArg.ContainerPoint).pop(),
  containerSize: generateArgsStatic(GenerateArg.ContainerSize).pop(),
  contentSize: generateArgsStatic(GenerateArg.ContentSize).pop(),
  contentPoint: generateArgsStatic(GenerateArg.ContentPoint).pop(),
  opacity: generateArgsStatic(GenerateArg.Opacity).pop(),
}
const dynamicGenerateOptions: GenerateOptions = { 
  // ...GenerateOptionsDefault, 
  // container: "T", content: '', 
  containerPoint: generateArgsDynamic(GenerateArg.ContainerPoint).pop(),
  containerSize: generateArgsDynamic(GenerateArg.ContainerSize).pop(),
  contentSize: generateArgsDynamic(GenerateArg.ContentSize).pop(),
  contentPoint: generateArgsDynamic(GenerateArg.ContentPoint).pop(),
  opacity: generateArgsDynamic(GenerateArg.Opacity).pop(),
}

const specificIds = [
  "BL_in_S_C_M_H_100",
  "BL_in_T_C_M_Q-F_100",
  "BL-RE_in_K_C_TL_Q-F_100",
  "BL-RE_in_R_C_TL_Q-F_100",
  "BL-RE_in_S_C_TL_Q-F_100",
  "BL-RE_in_T_C_TL_Q-F_100",
  "BL-RE_in_T_U_M_F-H_100",
  "BL-RE_in_T_U_M_Q-F_100",
  "BL-RE_TL_F_in_T_C_TL-BR_Q-F_50",
  "P_BR-M_D-F_in_R_C_BR-M_F-H_100",
  "P_BR-M_F_in_R_U_M_H_50",
  "P_M_F_in_S_U_M_H_100",
  "P_TL_F_in_K_C_TL-BR_H_50",
  "P_TL_F_in_S_C_TL-BR_F-H_50",
  "P_TL_F_in_S_U_TL-BR_Q-F_50",
  "P_TL_F_in_T_C_TL-BR_Q-F_100-0",
  "P_TL_F_in_T_U_M_F_100",
  "P_TL_F_in_T_U_M_Q_100",
  "P_TL_F_in_T_U_M_Q-F_100",
  "RGB_TL_F_in_T_U_M_Q-F_100",
  "V_TL_F_in_S_U_M_Q-F_100",
  "V_TL_F_in_T_U_M_Q-F_100",
  "P_TL_F_in_R_C_TL-BR_F_100",
  "BL_in_K_C_M_H_100-0",
  "BL_in_K_C_M_H_100",
  "BL_in_K_C_M_H_50",
  "BL_in_K_C_TL_H_100-0",
  "BL_in_K_C_TL_H_100",
  "BL_in_K_C_TL_H_50",
  "BL_in_K_C_TL_Q_100-0",
  "BL_in_K_U_M_F-H_100",
  "BL_in_K_U_M_F-H_50",
  "BL_in_R_C_M_H_100",
] as GenerateTestIds

const cherryPick = async () => {
  const args = GenerateArgs.filter(arg => {
    switch (arg) {
      case GenerateArg.Container:
      case GenerateArg.Content:
      case GenerateArg.Constrain: return false
    }
    return true
  })
  let promise = Promise.resolve()
  args.forEach(arg => {
    promise = promise.then(() => {
      const generateOptions = {
        ...staticGenerateOptions, [arg]: dynamicGenerateOptions[arg]
      }
      return renderAndCombine(`static-${arg}-dynamic`, generateOptions)
    })
    promise = promise.then(() => {
      const generateOptions = {
        ...dynamicGenerateOptions, [arg]: staticGenerateOptions[arg]
      }
      return renderAndCombine(`dynamic-${arg}-static`, generateOptions)
    })
  })
  await promise
}


renderAndCombine('specific', specificIds, true)
// cherryPick()
// renderSpecificIds(generateIds())




  // describe("default", () => {
  //   const ids = generateIds(GenerateOptionsDefault)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  // })
  

  // describe("container-size-tween", () => {
  //   
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  //   test("all", async () => { await renderingTestIdsPromise(ids, 'container-size-tween') })
  // })

  // describe("content-size-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     contentSize: generateArgsTween(GenerateArg.ContentSize) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  //   test("all", async () => { await renderingTestIdsPromise(ids, 'content-size-tween') })
  // })
  
  // describe("content-point-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     contentPoint: generateArgsTween(GenerateArg.ContentPoint) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  //   test("all", async () => { await renderingTestIdsPromise(ids, 'content-point-tween') })
  // })
  
  // describe("container-point-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     containerPoint: generateArgsTween(GenerateArg.ContainerPoint) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  //   test("all", async () => { await renderingTestIdsPromise(ids, 'container-point-tween') })
  // })
  
  // describe("container-opacity-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     opacity: generateArgsTween(GenerateArg.Opacity) 
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  //   test("all", async () => { await renderingTestIdsPromise(ids, 'container-opacity-tween') })
  // })
  
  
  // describe("text", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "T", content: '', containerSize: ''//, opacity: ''
  //   }
  //   const ids = generateIds(generateOptions)
  //   test.each(ids)("%s", async (id) => { await renderingTestIdPromise(id, videoOutput) })
  // })

  // describe("puppy-in-kitten", () => {
  //   const generateOptions: GenerateOptions = { //
  //     // ...GenerateOptionsDefault, 
  //     content: "P",  container: "K", 
      
  //     // containerSize: '', 
  //     // opacity: ''
  //   }
  //   const ids = generateIds(generateOptions)//.slice(0, 2)
  //   test.each(ids)("%s", async (id) => { await renderingTestIdPromise(id, videoOutput) })

  //   test("all", async () => { await renderingTestIdsPromise(ids, 'puppy-in-kitten') })
  // })

// describe.skip("RenderingProcess", () => {
//   const imageUrl = '../shared/image/globe.jpg'
//   const videoUrl = '../shared/video/rgb.mp4'

//   const baseOutput: RenderingCommandOutput = {
//     outputType: OutputType.Image,
//     format: OutputFormat.Png,
//     extension: ExtJpeg,
//   }
//   describe("with JSON mashes", () => {
//     describe("runPromise renders", () => {
//       const renderingFiles = fs.readdirSync(TestRenderingsDir).filter(p => p.endsWith('.json'))
//       test.each(renderingFiles)('%s', async (fileName) => {
//         const json = expandFile(`${TestRenderingsDir}/${fileName}`)
//         const args = JSON.parse(json) as RenderingProcessArgs
//         const { id, outputs } = args
//         const definedId = id || idGenerateString()
//         const renderingArgs = { ...args, ...renderingProcessInput(definedId), id: definedId }
//         const renderingProcess = renderingProcessInstance(renderingArgs)
//         const runPromise = renderingProcess.runPromise()
//         const checkPromise = runPromise.then(runResult => {
//           const { results } = runResult
//           const promises = outputs.map((videoOutput, index) => {
//             const result = results[index]
//             expect(result).toBeDefined()
//             const { destination, error } = result
//             expect(error).toBeFalsy()
//             expect(destination).toBeDefined()

//             return expectOutputFile(destination)
//           })
//           return Promise.all(promises)
//         })
//         await checkPromise
//       })
//     })
//   })
//   describe("with generated mashes", () => {
//     describe("runPromise renders", () => {
//       test("audio from trimmed video", async () => {
//         const videoOutput = outputDefaultPopulate({ outputType: OutputType.Audio })
//         // console.log("videoOutput", videoOutput)
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, { trim: 10 })
//         // console.log("clip", renderingInput.mash.tracks![0].clips![0])

//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('audio-from-trimmed-video'), outputs, ...renderingInput,
//         }
//         // console.log("processArgs", processArgs)

//         const renderingProcess = renderingProcessInstance(processArgs)
//         const result = await renderingProcess.runPromise()

//         await expectOutputFile(result.results[0].destination)
//       })

//       test("image from image with cover", async () => {
//         const videoOutput = outputDefaultPopulate({ ...baseOutput })
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('image-from-image-square-with-cover'), outputs, ...renderingInput,
//         }
//         // console.log(processArgs)
//         const renderingProcess = renderingProcessInstance(processArgs)
//         const result = await renderingProcess.runPromise()
//         await expectOutputFile(result.results[0].destination)
//       })

//       test("video from image", async () => {
//         const videoOutput = outputDefaultPopulate({ outputType: OutputType.Video, cover: false })
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('video-from-image-square'), outputs, ...renderingInput,
//         }
//         const process = renderingProcessInstance(processArgs)
//         const result = await process.runPromise()
//         await expectOutputFile(result.results[0].destination)
//       })

//       test("image from trimmed video with cover", async () => {
//         const videoOutput = outputDefaultPopulate({ ...baseOutput })
//         const outputs: CommandOutputs = [videoOutput]
//         const clip = { id: 'video', trim: 10 }
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl, clip)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('image-from-trimmed-video'), outputs, ...renderingInput,
//         }
//         // console.log("processArgs", processArgs)
//         const renderingProcess = renderingProcessInstance(processArgs)
//         const result = await renderingProcess.runPromise()

//         await expectOutputFile(result.results[0].destination)
//       })

//       test("video from video with cover", async () => {
//         const videoOutput = outputDefaultPopulate({ outputType: OutputType.Video, cover: true })
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('video-from-video-with-cover'), outputs, ...renderingInput,
//         }
//         const renderingProcess = renderingProcessInstance(processArgs)
//         const result = await renderingProcess.runPromise()
//         const { results } = result
//         expect(results.length).toBeGreaterThan(0)
//         const [first] = results
//         expect(first.error).toBeUndefined()
//         await expectOutputFile(first.destination)
//       })

//       test("image sequence from video with cover", async () => {
//         const videoOutput = outputDefaultPopulate({ ...baseOutput, outputType: OutputType.ImageSequence, cover: true })
//         // console.log('videoOutput', videoOutput)
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Video, videoUrl)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('image-sequence-from-video-with-cover'), outputs, ...renderingInput,
//         }
//         const renderingProcess = renderingProcessInstance(processArgs)
//         const result = await renderingProcess.runPromise()
//         await expectOutputFile(result.results[0].destination)
//       })

//       test("image from image", async () => {
//         const videoOutput = outputDefaultPopulate({ ...baseOutput, cover: false })
//         const outputs: CommandOutputs = [videoOutput]
//         const renderingInput: RenderingInput = renderingInputFromRaw(LoadType.Image, imageUrl)
//         const processArgs: RenderingProcessArgs = {
//           ...renderingProcessArgs('image-from-image-square'), outputs, ...renderingInput,
//         }
//         const process = renderingProcessInstance(processArgs)
//         const result = await process.runPromise()
//         await expectOutputFile(result.results[0].destination)
//       })
//     })
//   })
// })
