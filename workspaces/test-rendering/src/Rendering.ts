import fs from 'fs'
import path from 'path'
import {
  SizePreview,
  idGenerate,
  assertPopulatedArray, assertPopulatedString, assertTrue, isObject, isPopulatedString, RenderingCommandOutput, EmptyMethod, Duration
} from '@moviemasher/moviemasher.js'
import { commandProcess, ExtensionLoadedInfo, probingInfoPromise, RenderingArgs, renderingOutputFile, RenderingProcessArgs, RenderingProcessInput, renderingProcessInstance } from '@moviemasher/server-express'
import {
  GenerateDefinitionObjects, GenerateOptions, GenerateMashTest,
  generateTest,
  generateIds,
  GenerateTestIds
} from "./Generate"


import { TestRenderCache, TestRenderOutput, TestFilePrefix } from "./TestRenderOutput"


export const renderingTestIdsPromise = (ids: GenerateTestIds, suffix: string, output: RenderingCommandOutput): Promise<void> => {
  const id = `all-${suffix}`
  const fileName = renderingOutputFile(0, output)

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
      // console.log("renderingTestIdsPromise probingInfoPromise", destination, infoPath)
      return probingInfoPromise(destination, infoPath).then(EmptyMethod)
    })
  })
}

const renderingPromise = (renderingArgs: RenderingProcessArgs): Promise<void> => {
  // const { outputs } = renderingArgs
  // console.log("renderingPromise", renderingArgs)
  const renderingProcess = renderingProcessInstance(renderingArgs)
  // console.log("renderingPromise calling runPromise")
  const runPromise = renderingProcess.runPromise()
  const checkPromise = runPromise.then(runResult => {
    const { results } = runResult
    results.forEach(result => {
      const { destination, error } = result
      assertTrue(!error, 'no render error')
      if (isPopulatedString(destination)) {
        const fileExists = renderingFileExists(destination)
        assertTrue(fileExists, destination)
      }
    })
  })
  return checkPromise.catch(result => {
    const error = isObject(result) ? result.error : result
    const errorMessage = isPopulatedString(error) ? error : String(result)
    if (errorMessage) console.trace("errorMessage", errorMessage)
    assertTrue(!errorMessage, 'no caught error')
  })
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
export const renderingProcessInput = (id: string): RenderingProcessInput => {
  return {
    cacheDirectory: TestRenderCache,
    outputDirectory: `${TestRenderOutput}/${id}`,
    filePrefix: TestFilePrefix,
    defaultDirectory: 'shared',
    validDirectories: [path.resolve(TestRenderOutput)],
  }
}
export const renderingProcessArgs = (id?: string): RenderingProcessArgs => {
  const options: RenderingArgs = {
    mash: {}, outputs: [], definitions: [], upload: false
  }
  const definedId = id || idGenerate()
  const testArgs = renderingProcessInput(definedId)

  const args: RenderingProcessArgs = {
    ...testArgs, ...options, id: definedId
  }
  return args
}
export const renderingMashTestPromise = (mashTest: GenerateMashTest, upload: boolean, ...outputs: RenderingCommandOutput[]): Promise<void> => {
  const [id, mashObject] = mashTest
  const { tracks } = mashObject
  assertPopulatedArray(tracks)
  const { clips } = tracks[0]
  assertPopulatedArray(clips)


  const options: RenderingArgs = {
    mash: mashObject, definitions: GenerateDefinitionObjects,
    outputs, upload
  }
  const input = renderingProcessInput(id)
  const processArgs: RenderingProcessArgs = {
    ...input, id, ...options
  }
  return renderingPromise(processArgs)
}
 export const renderingTestPromise = (suffix: string, options: GenerateOptions, output: RenderingCommandOutput): Promise<void> => {
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

export const renderingTestIdPromise = (id: string, videoOutput: RenderingCommandOutput, labels = false, duration = Duration.Unknown): Promise<void> => {
  assertPopulatedString(id)

  const mashTest = generateTest(id, SizePreview, duration, labels)
  return renderingMashTestPromise(mashTest, false, videoOutput)
}
