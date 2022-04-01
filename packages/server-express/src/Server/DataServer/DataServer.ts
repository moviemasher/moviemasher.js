import {
  WithError, DataCastDefaultResponse, DataCastDefaultRequest,
  DataMashDefaultRequest, DataMashDefaultResponse,
  DataCastDeleteResponse, DataCastDeleteRequest,
  DataDefinitionDeleteResponse, DataDefinitionDeleteRequest,
  DataMashDeleteResponse, DataMashDeleteRequest,
  DataCastPutResponse, DataCastPutRequest,
  DataMashRetrieveRequest, DataMashRetrieveResponse,
  DataDefinitionPutResponse, DataDefinitionPutRequest,
  DataMashPutRequest, DataMashPutResponse,
  DataMashGetResponse, DataMashGetRequest,
  DataCastGetResponse, DataCastGetRequest,
  DataDefinitionGetResponse, DataDefinitionGetRequest,
  DataCastRetrieveResponse, DataCastRetrieveRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ServerHandler } from "../Server"

export interface DataServerArgs extends ServerArgs {
  dbMigrationsPrefix: string
  dbPath: string
}

export interface DataServer extends Server {
  args: DataServerArgs
  defaultCast: ServerHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest>
  defaultMash: ServerHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest>
  deleteCast: ServerHandler<DataCastDeleteResponse, DataCastDeleteRequest>
  deleteDefinition: ServerHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest>
  deleteMash: ServerHandler<DataMashDeleteResponse, DataMashDeleteRequest>
  getCast: ServerHandler<DataCastGetResponse, DataCastGetRequest>
  getDefinition: ServerHandler<DataDefinitionGetResponse, DataDefinitionGetRequest>
  getMash: ServerHandler<DataMashGetResponse, DataMashGetRequest>
  putCast: ServerHandler<DataCastPutResponse | WithError, DataCastPutRequest>
  putDefinition: ServerHandler<DataDefinitionPutResponse | WithError, DataDefinitionPutRequest>
  putMash: ServerHandler<DataMashPutResponse | WithError, DataMashPutRequest>
  retrieveCast: ServerHandler<DataCastRetrieveResponse | WithError, DataCastRetrieveRequest>
  retrieveDefinition: ServerHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest>
  retrieveMash: ServerHandler<DataMashRetrieveResponse | WithError, DataMashRetrieveRequest>
}
