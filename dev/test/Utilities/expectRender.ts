import path from 'path'
import fs from 'fs'
import { CommandArgs } from "../../../packages/server-express/src/Command/Command"
import { CommandFactory } from "../../../packages/server-express/src/Command/CommandFactory"

const expectRender = async (id: string, options: CommandArgs) => {
  const prefix = './dev/workspaces/example-client-react/dist'


  options.inputs.forEach(input => {
    const { source } = input
    if (!source) throw 'no source'
    if (typeof source !== 'string') return
    if (source.includes('://')) return

    const resolved = path.resolve(prefix, source)
    const url = `file://{resolved}`
    console.log("expectRender resolved", source, 'to', url)

    const exists = fs.existsSync(url)
    if (!exists) {
      console.error("expectRender could not find", source, url)
      throw `NOT FOUND ${url}`
    }
    input.source = url
  })



  const render = CommandFactory.instance(id, options)
  render.addListener('error', error => {
    console.error(options)
    throw String(error)
  })
  const { error } = await render.runPromise()
  expect(error).toBeUndefined()
}

export { expectRender }
