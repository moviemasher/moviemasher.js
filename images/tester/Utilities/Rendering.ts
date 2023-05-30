import fs from 'fs'
import path from 'path'
import {
  assertPopulatedArray, assertPopulatedString, assertTrue, isObject, 
  SizePreview, isPopulatedString, EmptyFunction, DurationUnknown, 
  idGenerateString, CommaChar, TypeVideo, isDefiniteError
} from '@moviemasher/lib-core'

import {
  ffmpegCommand, ExtensionLoadedInfo, Probe, 
  renderingOutputFile, 
  renderingProcessInstance, 
  RenderingOutputArgs,
  RenderingProcessArgs
} from '@moviemasher/server-core'

import {
  GenerateDefinitionObjects, 
  generateTest,
  generateIds
} from "./Generate.mjs"


import { 
  TestRenderCache, TestRenderOutput, TestFilePrefix, TestTemporary 
} from "../Setup/TestRenderOutput.mjs"


export const renderingTestIdsPromise = (ids, suffix, output) => {
  const id = `all-${suffix}`
  const fileName = renderingOutputFile(output, TypeVideo)

  const sources = ids.map(id => {
    const resolved = path.resolve(path.join(TestRenderOutput, id, fileName))
    assertTrue(fs.existsSync(resolved), resolved)

    return resolved
  })
  


  const destination = path.resolve(path.join(TestRenderOutput, id, fileName))

  // console.log("renderingTestIdsPromise", sources.length, destination)

  if (!sources.length) return Promise.resolve()
  
  return fs.promises.mkdir(path.dirname(destination), { recursive: true }).then(() => {
    return new Promise((resolve, reject) => {
      const command = ffmpegCommand()
      command.on('error', (...args) => {
        reject({ error: args.join(CommaChar) }) 
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
      return Probe.promise(TestTemporary, destination, infoPath).then(EmptyFunction)
    })
  })
}

const renderingPromise = (renderingArgs: RenderingProcessArgs) => {
  // const { outputs } = renderingArgs
  // console.log("renderingPromise", renderingArgs)
  const renderingProcess = renderingProcessInstance(renderingArgs)
  console.log("renderingPromise calling runPromise")
  const runPromise = renderingProcess.runPromise()
  const checkPromise = runPromise.then(runResult => {
    if (isDefiniteError(runResult)) {
      const { error } = runResult
      assertTrue(!error, 'no render error')
    
    } else {
      const { data } = runResult
      if (isPopulatedString(data)) {
        const fileExists = renderingFileExists(data)
        assertTrue(fileExists, data)
      }
    }
  })

  return checkPromise.catch(result => {
    if (isDefiniteError(result)) {
      const { error } = result
      const errorMessage = isPopulatedString(error) ? error : String(result)
      // if (errorMessage) console.trace("errorMessage", errorMessage)
      assertTrue(!errorMessage, 'no caught error')
    }
  })
}
const renderingFilePath = (path) => {
  const regExp = /%0([0-9])d/
  const matches = path.match(regExp)
  if (matches) {
    return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1')
  }
  return path
}
const renderingFileExists = (filePath) => {
  const checkPath = renderingFilePath(filePath)
  const fileExists = fs.existsSync(checkPath)
  return fileExists
}

export const renderingJobPromise = (job, filePrefix, defaultDirectory) => {
  const { id, mash } = job

  const { tracks } = mash
  assertPopulatedArray(tracks)
  const { clips } = tracks[0]
  assertPopulatedArray(clips)

  const input = renderingProcessInput(id, filePrefix, defaultDirectory)
  const processArgs: RenderingProcessArgs = {
    temporaryDirectory: TestTemporary,
    ...input, ...job
  }
  return renderingPromise(processArgs)
}

// export const renderingProcessArgs = id => {

//   const options = {
//     mash: {}, outputs: [], definitions: [], upload: false
//   }
//   const definedId = id || idGenerateString()
//   const testArgs = renderingProcessInput(definedId, TestFilePrefix, 'shared')

//   const args = {
//     ...testArgs, ...options, id: definedId, 
//     temporaryDirectory: TestTemporary,
//   }
//   return args
// }

export const renderingProcessInput = (id, filePrefix, defaultDirectory) => {
  filePrefix ||= TestFilePrefix
  defaultDirectory ||= 'shared'
  return {
    cacheDirectory: TestRenderCache,
    filePrefix,
    defaultDirectory,
    outputDirectory: `${TestRenderOutput}/${id}`,
    validDirectories: [path.resolve(TestRenderOutput)],
  }
}
const renderingMashTestPromise = (mashTest, ...outputs) => {
  const [id, mashObject] = mashTest



  const { tracks } = mashObject.request.response
  assertPopulatedArray(tracks)
  const { clips } = tracks[0]
  assertPopulatedArray(clips)


  const options = {
    mash: mashObject, definitions: GenerateDefinitionObjects,
    outputs
  }
  const input = renderingProcessInput(id)
  const processArgs: RenderingProcessArgs = {
    temporaryDirectory: TestTemporary,
    ...input, id, ...options
  }
  return renderingPromise(processArgs)
}
// : GenerateOptions
 export const renderingTestPromise = (suffix, options, output) => {
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

export const renderingTestIdPromise = (id, videoOutput, doLabels = false, duration = DurationUnknown) => {
  assertPopulatedString(id)

  const mashTest = generateTest(id, SizePreview, duration, doLabels)
  console.log('mashTest', mashTest)
  return renderingMashTestPromise(mashTest, videoOutput)
}
