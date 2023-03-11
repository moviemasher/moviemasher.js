import { Client, ClientOptions } from "./Client"
import { ClientClass } from "./ClientClass"

export const clientInstance = (args: ClientOptions = {}): Client => (
  new ClientClass(args)
)