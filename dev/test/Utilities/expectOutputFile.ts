import path from "path"
import fs from "fs"
import { commandProcess } from "../../../packages/server-express/src/Command/CommandFactory"

const outputFilePath = (path: string): string => {
  const regExp = /%0([0-9])d/
  const matches = path.match(regExp)
  if (matches) {
    return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1')
  }
  return path
}

export const expectOutputFile = (filePath: string): Promise<void> => {
  const checkPath = outputFilePath(filePath)
  if (!fs.existsSync(checkPath)) throw `expectOutputFile ${checkPath} does not exist`

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
