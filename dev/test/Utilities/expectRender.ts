import { ServerOptions } from "@moviemasher/moviemasher.js"
import { CommandArgs } from "../../../packages/server-node/src/Command/Command"
import { CommandFactory } from "../../../packages/server-node/src/Command/CommandFactory"

const expectRender = async (id: string, options: CommandArgs) => {
  const serverOptions: ServerOptions = {
    prefix: './dev/workspaces/example-client-react/dist'
  }
  const render = CommandFactory.instance(id, options, serverOptions)
  render.addListener('error', error => {
    console.error(options)
    throw String(error)
  })
  const { error } = await render.runPromise()
  expect(error).toBeUndefined()
}

export { expectRender }
