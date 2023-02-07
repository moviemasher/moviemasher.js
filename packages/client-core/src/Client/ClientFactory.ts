import { ClientOptions, ClientDefaultArgs } from "./Client"
import { ClientClass } from "./ClientClass"

export const clientInstance = (args: ClientOptions = ClientDefaultArgs) => (
  new ClientClass(args)
)