// import path from "path"
import { commandProcess } from "../../../packages/server-express/src/Command/CommandFactory"
import fs from "fs"

const expectVideoFile = async (filePath: string) => {
  const instance = commandProcess()
  instance.input(filePath)
  instance.format('hash')
  const hashPath = `${filePath}.sha256`
  instance.saveToFile(hashPath)
  const promise = fs.existsSync(hashPath) ? fs.promises.readFile(hashPath).then(buffer => buffer.toString()) : Promise.resolve('')
  const string = await promise
  if (string) expect(string).toMatchSnapshot()
}

export { expectVideoFile }
