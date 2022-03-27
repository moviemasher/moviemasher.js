import { StreamingProcessArgs } from "./StreamingProcess"
import { StreamingProcessClass } from "./StreamingProcessClass"


const connectionsById = new Map<string, StreamingProcessClass>()
const callbacksByConnection = new Map<StreamingProcessClass, () => void>()

const streamingProcessDeleteAll = ():void => {
  [...connectionsById.values()].forEach(instance => { streamingProcessDelete(instance) })
}
const streamingProcessCreate = (args: StreamingProcessArgs): StreamingProcessClass => {
  const connection = new StreamingProcessClass(args)
  const closedListener = () => { streamingProcessDelete(connection) }
  callbacksByConnection.set(connection, closedListener)
  connection.once('closed', closedListener)
  connectionsById.set(connection.id, connection)
  return connection
}

const streamingProcessDelete = (connection: StreamingProcessClass):void => {
  connectionsById.delete(connection.id)

  const closedListener = callbacksByConnection.get(connection)

  if (!closedListener) return

  callbacksByConnection.delete(connection)
  connection.removeListener('closed', closedListener)
}

const streamingProcessGet = (id:string):StreamingProcessClass | null => {
  return connectionsById.get(id) || null
}

const StreamingProcessFactory = {
  deleteAll: streamingProcessDeleteAll,
  delete: streamingProcessDelete,
  get: streamingProcessGet,
  create: streamingProcessCreate,
}

export {
  StreamingProcessFactory,
  streamingProcessDeleteAll,
  streamingProcessDelete,
  streamingProcessGet,
  streamingProcessCreate,

}
