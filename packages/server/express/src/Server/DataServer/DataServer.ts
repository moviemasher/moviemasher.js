import {
  PotentialError, 
  DataMashDefaultRequest, DataMashDefaultResponse,
  DataDefinitionDeleteResponse, DataDefinitionDeleteRequest,
  DataMashDeleteResponse, DataMashDeleteRequest,
  DataMashRetrieveRequest,
  DataDefinitionPutResponse, DataDefinitionPutRequest,
  DataMashPutRequest, DataMashPutResponse,
  DataMashGetResponse,
  DataGetRequest, DataRetrieveResponse,
  DataDefinitionGetResponse, DataDefinitionGetRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest,
} from "@moviemasher/lib-core"

import { Server, ServerArgs, ExpressHandler } from "../Server"

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
