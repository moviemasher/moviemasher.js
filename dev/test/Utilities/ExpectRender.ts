import path from "path"
import fs from "fs"
import { commandProcess } from "../../../packages/server-express/src/Command/CommandFactory"
import { RenderingProcessArgs } from "../../../packages/server-express/src/Server/RenderingServer/RenderingProcess/RenderingProcess"
import { renderingProcessInstance } from "../../../packages/server-express/src/Server/RenderingServer/RenderingProcess/RenderingProcessFactory"
import { isObject, isPopulatedString } from "../../../packages/moviemasher.js/src/Utility/Is"

export const expectRender = (renderingArgs: RenderingProcessArgs): Promise<void> => {
  // const { outputs } = renderingArgs
  const renderingProcess = renderingProcessInstance(renderingArgs)
  const runPromise = renderingProcess.runPromise()
  const checkPromise = runPromise.then(runResult => {
    let promise = Promise.resolve()
    const { results } = runResult
    results.forEach(result => {
      expect(result).toBeDefined()
      const { destination, error } = result
      expect(error).toBeFalsy()
      expect(destination).toBeTruthy()
      promise = promise.then(() => { expectOutputFile(destination) }) 
    })
    return promise
  })
  return checkPromise.catch(result => {
    const error = isObject(result) ? result.error : result
    const errorMessage = isPopulatedString(error) ? error : String(result)
    // console.error('expectRender check CAUGHT', errorMessage)
    expect(errorMessage).toBeFalsy()
  })
}

const outputFilePath = (path: string): string => {
  const regExp = /%0([0-9])d/
  const matches = path.match(regExp)
  if (matches) {
    return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1')
  }
  return path
}

export const outputFileExists = (filePath: string): boolean => {
  const checkPath = outputFilePath(filePath)
  const fileExists = fs.existsSync(checkPath)
  return fileExists
}

export const expectOutputFile = (filePath: string): Promise<void> => {
  const fileExists = outputFileExists(filePath)
  expect(fileExists).toBeTruthy()
  // if (!fileExists) throw `expectOutputFile ${checkPath} does not exist`

  // console.log(`expectOutputFile ${checkPath} exists`)
  return new Promise(resolve => {
    const dir = path.dirname(filePath)
    const hashPath = `${dir}/identity.sha256`
    const instance = commandProcess()
    instance.input(filePath)

    instance.format('hash')
    instance.on('end', () => {
      const promise = fs.existsSync(hashPath) ? fs.promises.readFile(hashPath).then(buffer => buffer.toString()) : Promise.resolve('')
      return promise.then(string => {
        if (string) expect(string).toMatchSnapshot()
        resolve()
      })
    })
    instance.saveToFile(hashPath)
  })
}
