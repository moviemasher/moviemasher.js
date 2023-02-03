import {
  WithError, DataCastDefaultResponse, DataCastDefaultRequest,
  DataMashDefaultRequest, DataMashDefaultResponse,
  DataCastDeleteResponse, DataCastDeleteRequest,
  DataDefinitionDeleteResponse, DataDefinitionDeleteRequest,
  DataMashDeleteResponse, DataMashDeleteRequest,
  DataCastPutResponse, DataCastPutRequest,
  DataMashRetrieveRequest,
  DataDefinitionPutResponse, DataDefinitionPutRequest,
  DataMashPutRequest, DataMashPutResponse,
  DataMashGetResponse,
  DataGetRequest, DataRetrieveResponse,
  DataCastGetResponse,
  DataDefinitionGetResponse, DataDefinitionGetRequest,
  DataCastRetrieveRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest,
} from "@moviemasher/moviemasher.js"

import { Server, ServerArgs, ExpressHandler } from "../Server"

export interface DataServerArgs extends ServerArgs {
  temporaryIdPrefix: string
  dbMigrationsPrefix: string
  dbPath: string
}

export interface DataServer extends Server {
  args: DataServerArgs
  defaultCast: ExpressHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest>
  defaultMash: ExpressHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest>
  deleteCast: ExpressHandler<DataCastDeleteResponse, DataCastDeleteRequest>
  deleteDefinition: ExpressHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest>
  deleteMash: ExpressHandler<DataMashDeleteResponse, DataMashDeleteRequest>
  getCast: ExpressHandler<DataCastGetResponse, DataGetRequest>
  getDefinition: ExpressHandler<DataDefinitionGetResponse, DataDefinitionGetRequest>
  getMash: ExpressHandler<DataMashGetResponse, DataGetRequest>
  putCast: ExpressHandler<DataCastPutResponse | WithError, DataCastPutRequest>
  putDefinition: ExpressHandler<DataDefinitionPutResponse | WithError, DataDefinitionPutRequest>
  putMash: ExpressHandler<DataMashPutResponse | WithError, DataMashPutRequest>
  retrieveCast: ExpressHandler<DataRetrieveResponse | WithError, DataCastRetrieveRequest>
  retrieveDefinition: ExpressHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest>
  retrieveMash: ExpressHandler<DataRetrieveResponse | WithError, DataMashRetrieveRequest>
}
