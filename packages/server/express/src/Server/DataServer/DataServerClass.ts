import Express from "express"
import fs from 'fs'
import path from 'path'
import knex, { Knex } from 'knex'

import {
  MashMediaObject, UnknownRecord, StringRecord, JsonRecord, PotentialError, stringPluralize,
  MediaObject, MediaObjects, DataServerInit, Endpoints, EmptyFunction,
  
  DataMashDefaultRequest, DataMashDefaultResponse,
  
  DataDefinitionDeleteResponse, DataDefinitionDeleteRequest,
  DataMashDeleteResponse, DataMashDeleteRequest,
  
  DataMashRetrieveRequest,
  DataDefinitionPutResponse, DataDefinitionPutRequest,
  DataMashPutRequest, DataMashPutResponse,
  DataMashGetResponse, DataGetRequest, DataRetrieveResponse,
  DataDefinitionGetResponse, DataDefinitionGetRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest, Identified,
  assertPopulatedString, 
  DescribedObject,
  idTemporary,
  errorCaught,
  ErrorName,
  errorName,
  Runtime, 
} from "@moviemasher/lib-core"

import { ServerClass } from "../ServerClass"
import { ExpressHandler } from "../Server"
import { HostServers } from "../../Host/Host"
import { DataServer, DataServerArgs } from "./DataServer"
import { FileServer } from "../FileServer/FileServer"
import { idUnique } from "../../Utilities/Id"
import { RenderingServer } from "../RenderingServer/RenderingServer"
import { EnvironmentKeyAppColumnOwner, EnvironmentKeyAppColumnSource } from "@moviemasher/server-core"


export interface DataServerRow extends UnknownRecord, Identified { }

const DataServerColumns = ['id', 'label']
const DataServerColumnsDefault = ['*']

const DataServerNow = () => (new Date()).toISOString()

const DataServerJsonAnonymous = (row: any): any => {
  if (!row) return {}

  const { json, userId, ...rest } = row
  return json ? { ...JSON.parse(json), ...rest } : rest
}

const DataServerMediaKeys = [
  "object_id", "user_id", "created_at", "deleted_at", "type", "kind", "request" 
]
const DataServerJson = (row: any): any => {
  if (!row) return {}

  const { json, ...rest } = row
  if (!json) return rest

  const parsed = JSON.parse(json)
  return DataServerJson({ ...parsed, ...rest })
}

const DataServerJsons = (rows: any[]): any[] => { return rows.map(DataServerJsonAnonymous) }

const DataServerInsertRecord = (userId: string, data: UnknownRecord): StringRecord => {
  const { userId: _, type, createdAt, icon, label, id, ...rest } = data
  const json = JSON.stringify(rest)
  const record: StringRecord = { json, userId }
  if (id) record.id = String(id)
  if (createdAt) record.createdAt = String(createdAt)
  if (icon) record.icon = String(icon)
  if (label) record.label = String(label)
  // for definitions
  if (type) record.type = String(type)
  return record
}



export class DataServerClass extends ServerClass implements DataServer {
  constructor(public args: DataServerArgs) { super(args) }


  private createPromise(quotedTable: string, data: UnknownRecord): Promise<string> {
    data.createdAt ||= DataServerNow()
    const id = data.id || idUnique()
    assertPopulatedString(id)

    const permanentId = id.startsWith(this.args.temporaryIdPrefix) ? idUnique() : id
    data.id = permanentId

    return this.database(quotedTable).insert(data).then(() => permanentId)
  }

  private _database?: Knex
  private get database() {
    return this._database ||= this.databaseInitialize
  }
  private get databaseInitialize() {

    const { dbPath } = this.args

    const pgConfig = {
      client: 'pg',
      connection: process.env.PG_CONNECTION_STRING,
      searchPath: ['knex', 'public'],
    }
    const sqliteConfig = {
      client: 'sqlite3', 
      connection: { filename: dbPath },
      useNullAsDefault: true,
    }
    const database = knex(sqliteConfig)
    return database

  }

  defaultMash: ExpressHandler<DataMashDefaultResponse | PotentialError, DataMashDefaultRequest> = async (req, res) => {
    const previewSize = this.renderingServer?.args.previewSize
    const response: DataMashDefaultResponse = { mash: { id: idTemporary(), media: [] }, previewSize }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.database
        .first('mash.*')
        .from('mash')
        .leftJoin('cast_mash', 'cast_mash.mashId', '=', 'mash.id')
        .whereNull('cast_mash.mashId')
        .where(`mash.userId`, user)
        .orderBy('createdAt', 'desc').then(row => {
          const { userId: rowUserId, ...rest } = DataServerJson(row)
          return rowUserId === user ? rest : {}
        }) as MashMediaObject

      if (mash.id) {
        const media = await this.selectMashRelationsPromise(String(mash.id))
        response.mash = { ...mash, media }
        
      }
    } catch (error) { response.error = errorCaught(error).error }
    // console.log("defaultMash", response)
    res.send(response)
  }



  deleteDefinition: ExpressHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.rowExists('mash', id, user)
      if (existing) {
        const rows = await (await this.database.select('*').from('mash_definition').where('definitionId', id))
        if (rows.length) {
          response.mashIds = rows.map(row => row.mashid)
          response.error = errorName(ErrorName.Reference, `Referenced by ${stringPluralize(rows.length, 'mash', 'es')}`)
        } else await this.deletePromise('definition', id)
      }
      else response.error = errorName(ErrorName.Reference, `Could not find Media with ID: ${id}`)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  deleteMash: ExpressHandler<DataMashDeleteResponse, DataMashDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataMashDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.rowExists('mash', id, user)
      if (existing) {
        // const sql = `SELECT * FROM cast_mash WHERE mashId = ?`

        const rows = await this.database.select('*').from('cast_mash').where('mashId', id)

        if (rows.length) {
          response.castIds = rows.map(row => row.castId)
          response.error =errorName(ErrorName.Reference, `Referenced by ${stringPluralize(rows.length, 'cast')}`)
        } else await this.deletePromise('mash', id)
      }
      else response.error = errorName(ErrorName.Reference, `Could not find Media with ID: ${id}`)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  private deletePromise(quotedTable: string, id: string): Promise<void> {
    return this.database(quotedTable).where({ id }).del()
  }

  fileServer?: FileServer


  getDefinition: ExpressHandler<DataDefinitionGetResponse, DataDefinitionGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionGetResponse = {  }
    try {
      const user = this.userFromRequest(req)
      const definition = await this.rowJsonPromise('definition', user, id)
      if (!definition) {
        response.error = errorName(ErrorName.Reference, `Could not find Media with ID ${id}`)
      } else response.definition = definition
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  getLatestPromise(userId: string, quotedTable: string): Promise<JsonRecord> {
    return this.database
      .first('*')
      .from(quotedTable)
      .where({ userId })
      .orderBy('createAt')
      .then(row => {
        const { userId: rowUserId, ...rest } = DataServerJson(row)
        return rowUserId === userId ? rest : {}
      })
  }

  getMash: ExpressHandler<DataMashGetResponse, DataGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataMashGetResponse = { mash: { id: idTemporary(), media: [] } }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.rowJsonPromise('mash', user, id)
      if (mash.id !== id) response.error = errorName(ErrorName.Reference, `Could not find mash ${id}`)
      else {
        const media = await this.selectMashRelationsPromise(id)
        response.mash = { ...mash, media }
      }
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  id = 'data'

  init(): DataServerInit { return { temporaryIdPrefix: this.args.temporaryIdPrefix } }

  private insertDefinitionPromise(userId: string, definition: MediaObject): Promise<string> {
    return this.createPromise('definition', DataServerInsertRecord(userId, definition))
  }

  private rowJsonPromise(quotedTable: string, userId: string, id?: string): Promise<any> {
    if (!id || id.startsWith(this.args.temporaryIdPrefix)) return Promise.resolve()

    return this.database.first(DataServerColumnsDefault).from(quotedTable).where({ id }).then(row => {
      if (!row) return

      const { userId: rowUserId, ...rest } = row
      if (rowUserId === userId) return rest
    })
  }

  private mashInsertPromise(userId: string, mash: MashMediaObject, definitionIds?: string[]): Promise<StringRecord> {
    const temporaryLookup: StringRecord = {}
    const { id } = mash
    const temporaryId = id || idUnique()
    mash.id = temporaryId

    const insertPromise = this.createPromise('mash', DataServerInsertRecord(userId, mash))
    const definitionPromise = insertPromise.then(permanentId =>{
      if (permanentId !== temporaryId) temporaryLookup[temporaryId] = permanentId
      return this.mashUpdateRelationsPromise(permanentId, definitionIds)
    })
    return definitionPromise.then(() => temporaryLookup)
  }

  private mashUpdatePromise(userId: string, mash: MashMediaObject, definitionIds?: string[]): Promise<StringRecord> {
    const { createdAt, icon, id, label, ...rest } = mash
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { userId, createdAt, icon, id, label, json }
    return this.updatePromise('mash', data).then(() =>
      this.mashUpdateRelationsPromise(id, definitionIds)
    )
  }

  putDefinition: ExpressHandler<DataDefinitionPutResponse | PotentialError, DataDefinitionPutRequest> = async (req, res) => {
    const { definition } = req.body
    const response: DataDefinitionPutResponse = { id: '' }
    try {
      const user = this.userFromRequest(req)
      response.id = await this.writeDefinitionPromise(user, definition)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  putMash: ExpressHandler<DataMashPutResponse | PotentialError, DataMashPutRequest> = async (req, res) => {
    const { mash, definitionIds } = req.body
    // console.log(this.constructor.name, Endpoints.data.mash.put, JSON.stringify(mash, null, 2))
    const response: DataMashPutResponse = {}

    try {
      const user = this.userFromRequest(req)
      response.temporaryIdLookup = await this.writeMashPromise(user, mash, definitionIds)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  renderingServer?: RenderingServer

  retrieveDefinition: ExpressHandler<DataDefinitionRetrieveResponse | PotentialError, DataDefinitionRetrieveRequest> = async (req, res) => {
    const request = req.body
    const { partial, types } = request
    const response: DataDefinitionRetrieveResponse = { definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.definitions = await this.selectDefinitionsPromise(user, types, columns)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  retrieveMash: ExpressHandler<DataRetrieveResponse | PotentialError, DataMashRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const response: DataRetrieveResponse = { described: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.described = await this.selectMashesPromise(user, columns)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  private rowExists(quotedTable: string, id: string, userId: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this.userIdPromise(quotedTable, id).then(ownerId => {
        if (ownerId && ownerId !== userId) return reject(403)

        return resolve(!!ownerId)
      })
    })
    return promise
  }


  private selectDefinitionsPromise(userId: string, types: string[], columns = DataServerColumnsDefault): Promise<MediaObject[]> {
    // console.log(this.constructor.name, "selectDefinitionsPromise", userId, types)
    return this.database
      .select(columns)
      .from('definition')
      .whereIn('type', types)
      .where({ userId })
      .then(DataServerJsons)
  }


  private selectMashRelationsPromise(mashId: string): Promise<MediaObjects> {
    return this.database
      .select('definition.*')
      .from('mash_definition')
      .join('definition', 'definition.id', '=', 'definitionId')
      .where({ mashId })
      .then(DataServerJsons)
  }

  private selectMashesPromise(userId: string, columns = DataServerColumnsDefault): Promise<DescribedObject[]> {
    const qualified = columns.map(column => `mash.${column}`)
    console.log(this.constructor.name, "selectMashesPromise", userId, columns)

    return this.database
      .select(qualified)
      .from('mash')
      .leftJoin('cast_mash', 'cast_mash.mashId', '=', 'mash.id')
      .whereNull('cast_mash.mashId')
      .where({ userId })
      .then(DataServerJsons)
  }

  private startDatabase(): Promise<void> {
    const { dbPath, dbMigrationsPrefix } = this.args
    console.debug(this.constructor.name, "startDatabase", dbPath)
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })

    const { database } = this
    if (!dbMigrationsPrefix) return Promise.resolve()
  
    console.debug(this.constructor.name, "startDatabase migrating...", dbMigrationsPrefix)
    const directories = fs.readdirSync(dbMigrationsPrefix)
    const promises = directories.map(file => {
      const absolutePath = path.resolve(dbMigrationsPrefix, file)
    
      const buffer = fs.readFileSync(absolutePath)
      const sql = buffer.toString()
      return database.raw(sql).then(() => {
        console.log(this.constructor.name, 'startDatabase migrated:', file)
      })
    })
    return Promise.all(promises).then(() => {}) 
  }

  getMedia: ExpressHandler<DataRetrieveResponse | PotentialError, DataMashRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const { mediaKeys } = this

    req.params
    const response: DataRetrieveResponse = { described: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.described = await this.selectMashesPromise(user, columns)
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
  }

  private _mediaKeys?: string[]
  private get mediaKeys(): string[] {
    return this._mediaKeys ||= this.mediaKeysInitialize
  }
  private get mediaKeysInitialize(): string[] {
    const { environment } = Runtime
    const columnOwner = environment.get(EnvironmentKeyAppColumnOwner)
    const columnSource = environment.get(EnvironmentKeyAppColumnSource)
        
    return [...DataServerColumns, columnOwner, columnSource].filter(Boolean)
  }

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
      this.fileServer = activeServers.file
      this.renderingServer = activeServers.rendering

      app.get('/media', this.getMedia)
   
      app.post(Endpoints.data.definition.delete, this.deleteDefinition)
      app.post(Endpoints.data.definition.get, this.getDefinition)
      app.post(Endpoints.data.definition.retrieve, this.retrieveDefinition)
      app.post(Endpoints.data.definition.put, this.putDefinition)
      app.post(Endpoints.data.mash.default, this.defaultMash)
      app.post(Endpoints.data.mash.delete, this.deleteMash)
      app.post(Endpoints.data.mash.get, this.getMash)
      app.post(Endpoints.data.mash.put, this.putMash)
      app.post(Endpoints.data.mash.retrieve, this.retrieveMash)

      return this.startDatabase()   
    })
   
  }

  stopServer(): void { this._database?.destroy() }

  private updatePromise(quotedTable: string, data: UnknownRecord): Promise<void> {
    const { id, ...rest } = data
    return this.database(quotedTable).update(rest).where({ id }).then(EmptyFunction)
  }


  private updateDefinitionPromise(definition: MediaObject): Promise<void> {
    const { type, createdAt, icon, id, label, ...rest } = definition
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { createdAt, icon, id, label, json }
    return this.updatePromise('definition', data).then(EmptyFunction)
  }

  private mashUpdateRelationsPromise(mashId: string, definitionIds?: string[]): Promise<StringRecord> {
    // console.log("updateMashDefinitionsPromise", mashId, definitionIds)
    return this.updateRelationsPromise('mash', 'definition', mashId, definitionIds)
  }


  private updateRelationsPromise(from: string, to: string, id: string, ids?: string[]): Promise<StringRecord> {
    const temporaryLookup: StringRecord = {}
    if (!ids) return Promise.resolve(temporaryLookup)
    
    const permanentIds = ids.map(id => {
      if (id.startsWith(this.args.temporaryIdPrefix)) return temporaryLookup[id] = idUnique()

      return id
    })

    const quotedTable = `${from}_${to}`
    const fromId = `${from}Id`
    const toId = `${to}Id`
    return this.database.select('*').from(quotedTable).where(fromId, id).then(rows => {
      const toDelete: string[] = []
      const toKeep: string[] = []
      rows.forEach((row: DataServerRow) => {
        const relatedId = String(row[toId])
        if (permanentIds.includes(relatedId)) toKeep.push(relatedId)
        else toDelete.push(row.id)
      })
      const toCreate = permanentIds.filter(id => !toKeep.includes(id))
      const promises: Promise<void>[] = [
        ...toDelete.map(id => this.deletePromise(quotedTable, id)),
        ...toCreate.map(relatedId =>
          this.createPromise(quotedTable, { [toId]: relatedId, [fromId]: id }).then(EmptyFunction)
        ),
      ]
      switch (promises.length) {
        case 0: return Promise.resolve()
        case 1: return promises[0]
        default: return Promise.all(promises).then(EmptyFunction)
      }
    }).then(() => temporaryLookup)
  }

  private userIdPromise(table: string, id: string): Promise<string> {
    return this.database
      .first('userId')
      .from(table)
      .where({ id })
      .then(row => row?.userId || '')
  }

  private writeDefinitionPromise(userId: string, definition: MediaObject): Promise<string> {
    const { id } = definition
    if (!id) return this.insertDefinitionPromise(userId, definition)

    return this.rowExists('definition', id, userId).then(existing => {
      if (!existing) return this.insertDefinitionPromise(userId, definition)

      return this.updateDefinitionPromise(definition).then(() => id)
    })
  }

  private writeMashPromise(userId: string, mash: MashMediaObject, definitionIds?: string[]): Promise<StringRecord> {
    const { id } = mash
    const promiseJson = this.rowJsonPromise('mash', userId, id)
    return promiseJson.then(row => {
      if (row) {
        return this.mashUpdatePromise(userId, { ...row, ...mash }, definitionIds)
      }
      return this.mashInsertPromise(userId, mash, definitionIds)
    })
  }
}
