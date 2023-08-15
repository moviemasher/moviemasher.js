import fs from 'fs'
import path from 'path'
import {

  assertPopulatedArray, assertPopulatedString, assertTrue, 
  idGenerateString, DurationUnknown, RenderingOptions, OutputOptions, sizeScale, 
  
} from '@moviemasher/lib-shared'


import {
  ffmpegCommand, ExtensionLoadedInfo, Probe, 
  renderingOutputFile, RenderingProcessArgs, ServerEncodeOptions, 
  renderingProcessInstance, 
  Command
} from '@moviemasher/lib-server'

import {
  GenerateAssetObjects, GenerateOptions, GenerateMashTest,
  generateTest,
  generateIds,
  GenerateTestIds
} from "./Generate"


import { TestRenderCache, TestRenderOutput, TestFilePrefix, TestTemporary } from "./TestRenderOutput"
import { isPopulatedString, SIZE_OUTPUT, 
  isDefiniteError, errorThrow, SourceMash, TypeVideo } from '@moviemasher/runtime-shared'

const SizePreview = sizeScale(SIZE_OUTPUT, 0.25, 0.25)


export const renderingTestIdsPromise = (ids: GenerateTestIds, suffix: string, output: OutputOptions): Promise<void> => {
  const id = `all-${suffix}`
  const fileName = renderingOutputFile(output, TypeVideo, id)

  const sources: string[] = ids.map(id => {
    const resolved = path.resolve(path.join(TestRenderOutput, id, fileName))
    assertTrue(fs.existsSync(resolved), resolved)

    return resolved
  })
  


  const destination = path.resolve(path.join(TestRenderOutput, id, fileName))

  // console.log("renderingTestIdsPromise", sources.length, destination)

  if (!sources.length) return Promise.resolve()
  
  return fs.promises.mkdir(path.dirname(destination), { recursive: true }).then(() => {
    return new Promise<void>((resolve, reject) => {
      const command = ffmpegCommand() as Command
      command.on('error', (...args: any[]) => {
        reject({ error: args.join(",") }) 
      })
      command.on('end', () => { resolve() })
      try {
        sources.forEach(source => command.mergeAdd(source))
        command.mergeToFile(destination, TestTemporary)
      }
      catch (error) { reject({ error }) }
      
    }).then(() => {
      const dirName = path.dirname(destination)
      const extName = path.extname(destination)
      const baseName = path.basename(destination, extName)
      const infoPath = path.join(dirName, `${baseName}.${ExtensionLoadedInfo}`)
      return Probe.promise(TestTemporary, destination, infoPath).then(() => {})
    })
  })
}

const renderingPromise = (renderingArgs: RenderingProcessArgs): Promise<void> => {
  // const { outputs } = renderingArgs
  // console.log("renderingPromise", renderingArgs)
  const renderingProcess = renderingProcessInstance(renderingArgs)
  // console.log("renderingPromise calling runPromise")
  const runPromise = renderingProcess.runPromise()
  const checkPromise = runPromise.then(orError => {
    if (isDefiniteError(orError)) errorThrow(orError) 
    const { data: destination } = orError

    if (isPopulatedString(destination)) {
      const fileExists = renderingFileExists(destination)
      assertTrue(fileExists, destination)
    }
  })
  return checkPromise
  // .catch(result => {
  //   const error = isObject(result) ? result.error : result
  //   const errorMessage = isPopulatedString(error) ? error : String(result)
  //   if (errorMessage) console.trace("errorMessage", errorMessage)
  //   assertTrue(!errorMessage, 'no caught error')
  // })
}

const renderingFilePath = (path: string): string => {
  const regExp = /%0([0-9])d/
  const matches = path.match(regExp)
  if (matches) {
    return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1')
  }
  return path
}

const renderingFileExists = (filePath: string): boolean => {
  const checkPath = renderingFilePath(filePath)
  const fileExists = fs.existsSync(checkPath)
  return fileExists
}

export const renderingProcessInput = (id: string): ServerEncodeOptions => {
  return {
    cacheDirectory: TestRenderCache,
    outputDirectory: `${TestRenderOutput}/${id}`,
    temporaryDirectory: TestTemporary,
    filePrefix: TestFilePrefix,
    defaultDirectory: 'shared',
    validDirectories: [path.resolve(TestRenderOutput)],
  }
}

export const renderingProcessArgs = (id?: string): RenderingProcessArgs => {

  const definedId = id || idGenerateString()
  const options: RenderingOptions = {
    mash: { 
      id: definedId, type: TypeVideo, source: SourceMash, 
    }, 
    outputOptions: {}, 
    encodingType: TypeVideo

  }
  const testArgs = renderingProcessInput(definedId)

  const args: RenderingProcessArgs = {
    ...testArgs, ...options, id: definedId, 
    temporaryDirectory: TestTemporary,
  }
  return args
}

export const renderingMashTestPromise = (mashTest: GenerateMashTest, outputOptions: OutputOptions): Promise<void> => {
  const [id, mashObject] = mashTest
  const { tracks } = mashObject
  // assertPopulatedArray(tracks)
  const { clips } = tracks![0]
  assertPopulatedArray(clips)

  const options: RenderingOptions = {
    mash: {...mashObject, media: GenerateAssetObjects},
    encodingType: TypeVideo,
    outputOptions
  }
  const input = renderingProcessInput(id)
  const processArgs: RenderingProcessArgs = {
    // temporaryDirectory: TestTemporary,
    ...input, id, ...options
  }
  return renderingPromise(processArgs)
}

export const renderingTestPromise = (suffix: string, options: GenerateOptions, output: OutputOptions): Promise<void> => {
  let promise = Promise.resolve()
  const ids = generateIds(options)
  ids.forEach(id => {
    promise = promise.then(() => { return renderingTestIdPromise(id, output) })
  })
  promise = promise.then(() => { 
    return renderingTestIdsPromise(ids, suffix, output) 
  })
  return promise
}

export const renderingTestIdPromise = (id: string, videoOutput: OutputOptions, labels = false, duration = DurationUnknown): Promise<void> => {
  assertPopulatedString(id)

  const mashTest = generateTest(id, SizePreview, duration, labels)
  return renderingMashTestPromise(mashTest, videoOutput)
}
