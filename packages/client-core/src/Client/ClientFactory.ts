import { ClientOptions } from "./Client"
import { ClientClass } from "./ClientClass"

export const clientInstance = (args: ClientOptions = {}) => (
  new ClientClass(args)
)