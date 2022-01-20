import { CommandArgs } from "../../../../server-node/src/Command/Command"
import { CommandFactory } from "../../../../server-node/src/Command/CommandFactory"

const expectRender = (id: string, options: CommandArgs) => {
  const render = CommandFactory.instance(id, options)
  render.addListener('error', error => {
    console.error(options)
    throw String(error)
  })
  render.run()
}

export { expectRender }
