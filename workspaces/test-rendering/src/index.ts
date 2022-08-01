import fs from 'fs'
import path from 'path'



import { 
  EmptyMethod,
  Default,
DimensionsPreview,
idGenerate,
assertTrue, outputDefaultVideo,
outputDefaultImage, Duration, assertArray, outputDefaultAudio, outputDefaultImageSequence
 } from '@moviemasher/moviemasher.js'

import { ExtensionLoadedInfo,
  RenderingProcessArgs, commandProcess,
  renderingProcessInstance,
  probingInfoPromise } from '@moviemasher/server-express'


import { 
  GenerateTestsDefault, 
  GenerateContentTest, 
  GenerateContainerTest, 
  GenerateMashTest, 
  generateTest, 
  generateIds, 
  GenerateTestIds,
  GenerateDelimiter,
  GenerateIdDelimiter,
  GenerateOptionsDefault,
  generateTests
} from "./Generate"
import { renderingProcessInput, renderingMashTestPromise } from './Rendering'






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

const imageOutput = outputDefaultImage({ ...DimensionsPreview }) 
const audioOutput = outputDefaultAudio({ optional: true }) 
const sequenceOutput = outputDefaultImageSequence() 
const videoOutput = outputDefaultVideo({ ...DimensionsPreview, mute: true }) 


const testUploadVideo = async (test: GenerateMashTest) => {
  const outputs = [imageOutput, audioOutput, sequenceOutput] // 
  await renderingMashTestPromise(test, true, ...outputs)  
}
const [testId] = generateIds({ ...GenerateOptionsDefault, content: "V" })
const test = generateTest(testId, DimensionsPreview, Duration.Unknown)

testUploadVideo(test)


// tests.forEach(async test => {
//   const [name, options] = test
//   await renderingTestPromise(name, options, videoOutput)
// })
// describe("Rendering", () => {


//   describe("content in containers", () => {
    
//     test.each(tests)("%s", async (name, options) => {
//       await renderingTestPromise(name, options, videoOutput)
//     })

//     test("combined", async () => { 
//       const ids = tests.map(test => `all-${test[0]}`) as GenerateTestIds
//       const allIds = generateIds()
//       await renderingTestIdsPromise(ids, 'combined', allIds.length * duration) 
//     })
//   })

//   describe.only("specific", () => {
//     const ids = [
//       "P_TL_F_in_T_C_TL-BR_Q-F_100-0",
//       // "BL-RE_TL_F_in_T_C_TL-BR_Q-F_50",
//       // "P_TL_F_in_S_C_TL-BR_F-H_50",
//       // "P_TL_F_in_S_U_TL-BR_Q-F_50",
//       // "BL-RE_in_R_C_TL_Q-F_100",
//       // "BL-RE_in_S_C_TL_Q-F_100",
//       // "BL-RE_in_K_C_TL_Q-F_100",
//       "BL-RE_in_T_C_TL_Q-F_100",
//       // "P_TL_F_in_K_C_TL-BR_H_50"
//     ] as GenerateTestIds

//     test.each(ids)("%s", async (id) => { await renderingTestIdPromise(id, videoOutput) })

//     test("all", async () => { await renderingTestIdsPromise(ids, 'specific') })
//   })
// })


  // describe("default", () => {
  //   const ids = generateIds(GenerateOptionsDefault)
  //   test.each(ids)("%s", async (id) => {
  //     await renderingTestIdPromise(id, videoOutput)
  //   })
  // })
  

  // describe("container-size-tween", () => {
  //   const generateOptions: GenerateOptions = { 
  //     ...GenerateOptionsDefault, container: "", content: '', 
  //     containerSize: generateArgsTween(GenerateArg.ContainerSize) 
  //   }
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
//         const definedId = id || idGenerate()
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
