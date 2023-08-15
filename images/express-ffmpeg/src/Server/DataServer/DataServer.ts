
import type { PotentialError } from '@moviemasher/runtime-shared'
import type { DataDefinitionDeleteRequest, DataDefinitionDeleteResponse, DataDefinitionGetRequest, DataDefinitionGetResponse, DataDefinitionPutRequest, DataDefinitionPutResponse, DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, DataGetRequest, DataMashDefaultRequest, DataMashDefaultResponse, DataMashDeleteRequest, DataMashDeleteResponse, DataMashGetResponse, DataMashPutRequest, DataMashPutResponse, DataMashRetrieveRequest, DataRetrieveResponse } from '../../Api/Data.js'
import type { ExpressHandler, Server, ServerArgs } from '../Server.js'

export interface DataServerArgs extends ServerArgs {
  temporaryIdPrefix: string
  dbMigrationsPrefix: string
  dbPath: string
}

export interface DataServer extends Server {
  args: DataServerArgs
  defaultMash: ExpressHandler<DataMashDefaultResponse | PotentialError, DataMashDefaultRequest>
  deleteDefinition: ExpressHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest>
  deleteMash: ExpressHandler<DataMashDeleteResponse, DataMashDeleteRequest>
  getDefinition: ExpressHandler<DataDefinitionGetResponse, DataDefinitionGetRequest>
  getMash: ExpressHandler<DataMashGetResponse, DataGetRequest>
  putDefinition: ExpressHandler<DataDefinitionPutResponse | PotentialError, DataDefinitionPutRequest>
  putMash: ExpressHandler<DataMashPutResponse | PotentialError, DataMashPutRequest>
  retrieveDefinition: ExpressHandler<DataDefinitionRetrieveResponse | PotentialError, DataDefinitionRetrieveRequest>
  retrieveMash: ExpressHandler<DataRetrieveResponse | PotentialError, DataMashRetrieveRequest>
}
