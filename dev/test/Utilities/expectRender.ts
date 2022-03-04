import path from 'path'
import fs from 'fs'
import { RunningCommandFactory } from "../../../packages/server-express/src/RunningCommand/RunningCommandFactory"
import { CommandArgs } from '@moviemasher/moviemasher.js'

const expectRender = async (id: string, commandArgs: CommandArgs) => {
  const prefix = './dev/workspaces/example-client-react/dist'


  commandArgs.inputs.forEach(input => {
    const { source } = input
    if (!source) throw 'no source'
    if (typeof source !== 'string') return
    if (source.includes('://')) return

    const resolved = path.resolve(prefix, source)
    const url = `file://${resolved}`
    console.log("expectRender resolved", source, 'to', url)

    const exists = fs.existsSync(url)
    if (!exists) {
      console.error("expectRender could not find", source, url)
      throw `NOT FOUND ${url}`
    }
    input.source = url
  })



  const render = RunningCommandFactory.instance(id, commandArgs)
  render.addListener('error', error => {
    console.error(commandArgs)
    throw String(error)
  })
  const { error } = await render.runPromise('')
  expect(error).toBeUndefined()
}

export { expectRender }
