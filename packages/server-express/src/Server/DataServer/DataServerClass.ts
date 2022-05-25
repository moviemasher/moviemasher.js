import Express from "express"
import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
const uuid = require('uuid').v4

import {
  Errors, MashObject, UnknownObject, StringObject, JsonObject, WithError, stringPluralize,
  DefinitionObject, DefinitionObjects, CastObject, DataServerInit, Endpoints, EmptyMethod,
  DataCastDefaultResponse, DataCastDefaultRequest,
  DataMashDefaultRequest, DataMashDefaultResponse,
  DataCastDeleteResponse, DataCastDeleteRequest,
  DataDefinitionDeleteResponse, DataDefinitionDeleteRequest,
  DataMashDeleteResponse, DataMashDeleteRequest,
  DataCastPutResponse, DataCastPutRequest,
  DataMashRetrieveRequest,
  DataDefinitionPutResponse, DataDefinitionPutRequest,
  DataMashPutRequest, DataMashPutResponse,
  DataMashGetResponse, DataGetRequest, DataRetrieveResponse,
  DataCastGetResponse,
  DataDefinitionGetResponse, DataDefinitionGetRequest,
  DataCastRetrieveRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest, AndId, Described,
  assertPopulatedString, isLayerMashObject, isLayerFolderObject, LayerObjects,
  StringsObject,
  isPopulatedString,
} from "@moviemasher/moviemasher.js"

import { ServerClass } from "../ServerClass"
import { ServerHandler } from "../Server"
import { HostServers } from "../../Host/Host"
import { DataServer, DataServerArgs } from "./DataServer"
import { FileServer } from "../FileServer/FileServer"
import { RenderingServer } from "../RenderingServer/RenderingServer"

export interface DataServerCastRelationUpdate {
  cast: CastObject
  temporaryIdLookup: StringObject
}

export interface DataServerCastRelationSelect {
  cast: CastObject
  definitions: DefinitionObject[]
}

export interface DataServerRow extends UnknownObject, AndId { }

const DataServerColumns = ['id', 'label', 'icon']
const DataServerColumnsDefault = ['*']

const DataServerNow = () => (new Date()).toISOString()

const DataServerSelect = (quotedTable: string, columns = DataServerColumnsDefault): string => {
  return `SELECT ${columns.join(', ')} FROM ${quotedTable} WHERE id = ?`
}

const DataServerJsonAnonymous = (row: any): any => {
  if (!row) return {}

  const { json, userId, ...rest } = row
  return json ? { ...JSON.parse(json), ...rest } : rest
}

const DataServerJson = (row: any): any => {
  if (!row) return {}

  const { json, ...rest } = row
  if (!json) return rest

  const parsed = JSON.parse(json)
  return DataServerJson({ ...parsed, ...rest })
}

const DataServerJsons = (rows: any[]): any[] => { return rows.map(DataServerJsonAnonymous) }

const DataServerInsert = (quotedTable: string, columns: string[]): string => {
  return `
    INSERT INTO ${quotedTable}
    (${ columns.join(', ') })
    VALUES(${Array(columns.length).fill('?').join(', ')})
  `
}

const DataServerUpdate = (quotedTable: string, columns: string[]): string => {
  return `
    UPDATE ${quotedTable}
    SET ${columns.map((column => `${column} = ?`)).join(', ')}
    WHERE id = ?
  `
}

const DataServerInsertRecord = (userId: string, data: UnknownObject): StringObject => {
  const { userId: _, type, createdAt, icon, label, id, ...rest } = data
  const json = JSON.stringify(rest)
  const record: StringObject = { json, userId }
  if (id) record.id = String(id)
  if (createdAt) record.createdAt = String(createdAt)
  if (icon) record.icon = String(icon)
  if (label) record.label = String(label)
  // for definitions
  if (type) record.type = String(type)
  return record
}

const DataServerPopulateLayers = (mashes: MashObject[], layers?: LayerObjects) => {
  layers?.forEach(layer => {
    if (isLayerFolderObject(layer)) DataServerPopulateLayers(mashes, layer.layers)
    else if (isLayerMashObject(layer)) {
      const { mash } = layer
      const { id } = mash
      const found = mashes.find(mash => mash.id === id)
      if (!found) throw new Error(Errors.internal + 'no mash with id ' + id + ' in ' + mashes.map(m => m.id).join(', '))

      layer.mash = found
    }
  })
}


export class DataServerClass extends ServerClass implements DataServer {
  constructor(public args: DataServerArgs) { super(args) }

  private castInsertPromise(userId: string, cast: CastObject, definitionIds?: StringsObject): Promise<StringObject> {
    const lookup: StringObject = {}
    const { id } = cast
    const temporaryId = id || uuid()
    const permanentId = temporaryId.startsWith(this.args.temporaryIdPrefix) ? uuid() : temporaryId
    if (permanentId !== temporaryId) lookup[temporaryId] = permanentId
    cast.id = permanentId

    const updatePromise = this.castUpdateRelationsPromise(userId, cast, definitionIds)
    const insertPromise = updatePromise.then(castData =>{
      const { cast, temporaryIdLookup } = castData
      return this.createPromise('`cast`', DataServerInsertRecord(userId, cast)).then(() => {
        return {...temporaryIdLookup, ...lookup }
      })
    })

    return insertPromise.then(lookup => ({...lookup, ...lookup}))
  }

  private castUpdatePromise(userId: string, cast: CastObject, definitionIds?: StringsObject): Promise<StringObject> {
    const { id } = cast
    if (!id) return Promise.reject(401)

    const relationsPromise = this.castUpdateRelationsPromise(userId, cast, definitionIds)
    const updatePromise = relationsPromise.then(castData => {
      const { cast, temporaryIdLookup } = castData
      return this.updatePromise('`cast`', cast).then(() => temporaryIdLookup)
    })
    return updatePromise
  }

  private createPromise(quotedTable: string, data: UnknownObject): Promise<string> {
    data.createdAt ||= DataServerNow()
    const id = data.id || uuid()
    assertPopulatedString(id)

    const permanentId = id.startsWith(this.args.temporaryIdPrefix) ? uuid() : id
    data.id = permanentId

    const keys: string[] = []
    const values: any[] = []
    Object.entries(data).forEach(([key, value]) => {
      keys.push(key)
      values.push(value)
    })
    const sql = DataServerInsert(quotedTable, keys)
    // console.log(sql, ...values)
    return this.db.run(sql, ...values).then(() => permanentId)
  }

  private _db?: Database
  private get db(): Database {
    if (!this._db) throw Errors.internal + 'db'

    return this._db
  }

  defaultCast: ServerHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest> = async (req, res) => {
    const previewSize = this.renderingServer?.args.previewSize
    const response: DataCastDefaultResponse = { cast: {}, definitions: [], previewSize }
    try {
      const user = this.userFromRequest(req)
      const cast = await this.getLatestPromise(user, '`cast`') as CastObject
      if (cast.id) {
        const castDefinitions = await this.castSelectRelationsPromise(cast)
        response.definitions = castDefinitions.definitions
        response.cast = castDefinitions.cast
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  defaultMash: ServerHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest> = async (req, res) => {
    const previewSize = this.renderingServer?.args.previewSize
    const response: DataMashDefaultResponse = { mash: {}, definitions: [], previewSize }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.getLatestPromise(user, '`mash`') as MashObject
      if (mash.id) {
        response.mash = mash
        response.definitions = await this.mashSelectRelationsPromise(String(mash.id))
      }
    } catch (error) { response.error = String(error) }
    // console.log("defaultMash", response)
    res.send(response)
  }

  deleteCast: ServerHandler<DataCastDeleteResponse, DataCastDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataCastDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.rowExists('`cast`', id, user)
      if (existing) await this.deletePromise('`cast`', id)
      else response.error = `Could not find Cast with id: ${id}`
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  deleteDefinition: ServerHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.rowExists('`mash`', id, user)
      if (existing) {
        const sql = `SELECT * FROM mash_definition WHERE definitionId = ?`
        const rows = await this.db.all(sql, id)
        if (rows.length) {
          response.mashIds = rows.map(row => row.mashid)
          response.error = `Referenced by ${stringPluralize(rows.length, 'mash', 'es')}`
        } else await this.deletePromise('`definition`', id)
      }
      else response.error = `Could not find Definition with id: ${id}`
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  deleteMash: ServerHandler<DataMashDeleteResponse, DataMashDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataMashDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.rowExists('`mash`', id, user)
      if (existing) {
        const sql = `SELECT * FROM cast_mash WHERE mashId = ?`
        const rows = await this.db.all(sql, id)
        if (rows.length) {
          response.castIds = rows.map(row => row.castId)
          response.error = `Referenced by ${stringPluralize(rows.length, 'cast')}`
        } else await this.deletePromise('`mash`', id)
      }
      else response.error = `Could not find Mash with id: ${id}`
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  private deletePromise(quotedTable: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${quotedTable} WHERE id = ?`
    return this.db.run(sql, id).then(EmptyMethod)
  }

  fileServer?: FileServer

  getCast: ServerHandler<DataCastGetResponse, DataGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataCastGetResponse = { cast: {}, definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const cast = await this.jsonPromise('`cast`', user, id)
      if (!cast) response.error = `Could not find cast ${id}`
      else {
        const castDefinitions = await this.castSelectRelationsPromise(cast)
        response.definitions = castDefinitions.definitions
        response.cast = castDefinitions.cast
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  getDefinition: ServerHandler<DataDefinitionGetResponse, DataDefinitionGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionGetResponse = { definition: {} }
    try {
      const user = this.userFromRequest(req)
      const definition = await this.jsonPromise('`definition`', user, id)
      if (!definition) {
        response.error = `Could not find definition ${id}`
      } else response.definition = definition
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  getLatestPromise(userId: string, quotedTable: string): Promise<JsonObject> {
    const sql = `SELECT * FROM ${quotedTable} WHERE userId = ? ORDER BY createdAt DESC`
    return this.db.get(sql, userId).then(row => {

      const { userId: rowUserId, ...rest } = DataServerJson(row)
      return rowUserId === userId ? rest : {}
    })
  }

  getMash: ServerHandler<DataMashGetResponse, DataGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataMashGetResponse = { mash: {}, definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.jsonPromise('`mash`', user, id)

      const { userId, ...rest } = mash

      if (!(mash.id === id && userId === user)) response.error = `Could not find mash ${id}`
      else {
        response.mash = rest
        response.definitions = await this.mashSelectRelationsPromise(id)
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  id = 'data'

  init(): DataServerInit { return { temporaryIdPrefix: this.args.temporaryIdPrefix } }


  private insertDefinitionPromise(userId: string, definition: DefinitionObject): Promise<string> {
    return this.createPromise('`definition`', DataServerInsertRecord(userId, definition))
  }

  private jsonPromise(quotedTable: string, userId: string, id?: string): Promise<any> {
    if (!id || id.startsWith(this.args.temporaryIdPrefix)) return Promise.resolve()

    return this.db.get(DataServerSelect(quotedTable), id).then(DataServerJson).then(row => {
      if (!row) return

      const { userId: rowUserId, ...rest } = row
      if (rowUserId === userId) return rest
    })
  }

  private mashInsertPromise(userId: string, mash: MashObject, definitionIds?: string[]): Promise<StringObject> {
    const temporaryLookup: StringObject = {}
    const { id } = mash
    const temporaryId = id || uuid()
    mash.id = temporaryId

    const insertPromise = this.createPromise('`mash`', DataServerInsertRecord(userId, mash))
    const definitionPromise = insertPromise.then(permanentId =>{
      if (permanentId !== temporaryId) temporaryLookup[temporaryId] = permanentId
      return this.mashUpdateRelationsPromise(permanentId, definitionIds)
    })
    return definitionPromise.then(() => temporaryLookup)
  }

  private mashUpdatePromise(userId: string, mash: MashObject, definitionIds?: string[]): Promise<StringObject> {
    const { createdAt, icon, id, label, ...rest } = mash
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { userId, createdAt, icon, id, label, json }
    return this.updatePromise('`mash`', data).then(() =>
      this.mashUpdateRelationsPromise(id, definitionIds)
    )
  }

  putCast: ServerHandler<DataCastPutResponse | WithError, DataCastPutRequest> = async (req, res) => {
    const { cast, definitionIds } = req.body
    const response: DataCastPutResponse = {}
    try {
      const user = this.userFromRequest(req)
      response.temporaryIdLookup = await this.writeCastPromise(user, cast, definitionIds)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  putDefinition: ServerHandler<DataDefinitionPutResponse | WithError, DataDefinitionPutRequest> = async (req, res) => {
    const { definition } = req.body
    const response: DataDefinitionPutResponse = { id: '' }
    try {
      const user = this.userFromRequest(req)
      response.id = await this.writeDefinitionPromise(user, definition)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  putMash: ServerHandler<DataMashPutResponse | WithError, DataMashPutRequest> = async (req, res) => {
    const { mash, definitionIds } = req.body
    // console.log(this.constructor.name, Endpoints.data.mash.put, JSON.stringify(mash, null, 2))
    const response: DataMashPutResponse = {}

    try {
      const user = this.userFromRequest(req)
      response.temporaryIdLookup = await this.writeMashPromise(user, mash, definitionIds)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  renderingServer?: RenderingServer

  retrieveCast: ServerHandler<DataRetrieveResponse | WithError, DataCastRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const response: DataRetrieveResponse = { described: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.described = await this.castsSelectPromise(user, columns)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  retrieveDefinition: ServerHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest> = async (req, res) => {
    const request = req.body
    const { partial, types } = request
    const response: DataDefinitionRetrieveResponse = { definitions: [] }
    try {
      const user = this.userFromRequest(req)
      // console.log(this.constructor.name, "retrieveDefinition", types, partial)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.definitions = await this.definitionsSelectPromise(user, types, columns)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  retrieveMash: ServerHandler<DataRetrieveResponse | WithError, DataMashRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const response: DataRetrieveResponse = { described: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.described = await this.mashesSelectPromise(user, columns)
    } catch (error) { response.error = String(error) }
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

  private castsSelectPromise(userId: string, columns = DataServerColumnsDefault): Promise<Described[]> {
    const table = '`cast`'
    const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE userId = ?`
    return this.db.all(sql, userId).then(DataServerJsons)
  }

  private definitionsSelectPromise(userId: string, types: string[], columns = DataServerColumnsDefault): Promise<MashObject[]> {
    const table = '`definition`'
    const sql = `
      SELECT ${columns.join(', ')}
      FROM ${table}
      WHERE (${Array(types.length).fill('type = ?').join(' OR ')})
      AND (userId = '' OR userId = ?)
    `
    // console.log(this.constructor.name, sql, types, userId)
    return this.db.all(sql, ...types, userId).then(DataServerJsons)
  }

  private castSelectRelationsPromise(cast: CastObject): Promise<DataServerCastRelationSelect> {
    const { id } = cast
    assertPopulatedString(id)

    const sql = `
      SELECT mash.*
      FROM cast_mash
      JOIN mash
      ON mash.id = mashId
      WHERE castId = ?
    `

    return this.db.all(sql, id).then(DataServerJsons).then((mashes:MashObject[]) => {
      DataServerPopulateLayers(mashes, cast.layers)

      const definitions: DefinitionObjects = []
      const initialData: DataServerCastRelationSelect = { cast, definitions }
      let promise: Promise<DataServerCastRelationSelect> = Promise.resolve(initialData)

      mashes.forEach(mash => {
        const { id } = mash
        assertPopulatedString(id)
        promise = promise.then(data => {
          return this.mashSelectRelationsPromise(id).then(definitions => {
            data.definitions.push(...definitions)
            return data
          })
        })
      })
      return promise
    })
  }

  private mashSelectRelationsPromise(id: string): Promise<DefinitionObjects> {
    const sql = `
      SELECT definition.*
      FROM mash_definition
      JOIN definition
      ON definition.id = definitionId
      WHERE mashId = ?
    `
    return this.db.all(sql, id).then(DataServerJsons)
  }

  private mashesSelectPromise(userId: string, columns = DataServerColumnsDefault): Promise<Described[]> {
    const table = '`mash`'
    const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE userId = ?`
    return this.db.all(sql, userId).then(DataServerJsons)
  }

  private startDatabase() {
    const { dbPath, dbMigrationsPrefix } = this.args
    console.debug(this.constructor.name, "startDatabase", dbPath)
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    open({ filename: dbPath, driver: sqlite3.Database }).then(db => {
      this._db = db
      if (dbMigrationsPrefix) {
        console.debug(this.constructor.name, "startDatabase migrating...", dbMigrationsPrefix)
        this.db.migrate({ migrationsPath: dbMigrationsPrefix }).catch(err =>
          console.error(this.constructor.name, "startDatabase migration failed", err)
        )
      }
    })
  }

  startServer(app: Express.Application, activeServers: HostServers): void {
    super.startServer(app, activeServers)
    this.fileServer = activeServers.file
    this.renderingServer = activeServers.rendering

    app.post(Endpoints.data.cast.default, this.defaultCast)
    app.post(Endpoints.data.cast.delete, this.deleteCast)
    app.post(Endpoints.data.cast.get, this.getCast)
    app.post(Endpoints.data.cast.put, this.putCast)
    app.post(Endpoints.data.cast.retrieve, this.retrieveCast)
    app.post(Endpoints.data.definition.delete, this.deleteDefinition)
    app.post(Endpoints.data.definition.get, this.getDefinition)
    app.post(Endpoints.data.definition.retrieve, this.retrieveDefinition)
    app.post(Endpoints.data.definition.put, this.putDefinition)
    app.post(Endpoints.data.mash.default, this.defaultMash)
    app.post(Endpoints.data.mash.delete, this.deleteMash)
    app.post(Endpoints.data.mash.get, this.getMash)
    app.post(Endpoints.data.mash.put, this.putMash)
    app.post(Endpoints.data.mash.retrieve, this.retrieveMash)

    this.startDatabase()
  }

  stopServer(): void { this._db?.close() }

  private updatePromise(quotedTable: string, data: UnknownObject): Promise<void> {
    const { id, ...rest } = data
    const keys: string[] = []
    const values: any[] = []
    Object.entries(rest).forEach(([key, value]) => {
      keys.push(key)
      values.push(value)
    })
    const sql = DataServerUpdate(quotedTable, keys)
    // console.log(sql, ...values, id)

    return this.db.run(sql, ...values, id).then(EmptyMethod)
  }

  private castUpdateRelationsPromise(userId: string, cast: CastObject, definitionIds?: StringsObject): Promise<DataServerCastRelationUpdate> {
    const temporaryIdLookup: StringObject = {}
    const { createdAt, icon, id, label, ...rest } = cast
    assertPopulatedString(id)

    const { layers = [] } = cast

    const layersMashes = (layers: LayerObjects): MashObject[] => {
      const { temporaryIdPrefix } = this.args
      return layers.flatMap(layer => {
        if (isLayerMashObject(layer)) {
          const { mash } = layer
          const temporaryId = mash.id!
          assertPopulatedString(temporaryId)

          const permanentId = temporaryId.startsWith(temporaryIdPrefix) ? uuid() : temporaryId
          if (temporaryId !== permanentId) {
            temporaryIdLookup[temporaryId] = permanentId
            mash.id = permanentId
          }
          layer.mash = { id: permanentId }
          return [mash]
        } else if (isLayerFolderObject(layer)) {
          const { layers } = layer
          if (layers) return layersMashes(layers)
        }
        return []
      })
    }
    const mashes = layersMashes(layers)
    let mashesPromise: Promise<StringObject> = Promise.resolve(temporaryIdLookup)
    const permanentIds = mashes.map(mash => mash.id!)

    mashes.forEach(mash => {
      const mashId = mash.id!
      const ids = definitionIds ? definitionIds[mashId] : []
      mashesPromise = mashesPromise.then(lookup => {
        return this.writeMashPromise(userId, mash, ids).then(mashLookup => (
          { ...lookup, ...mashLookup }
        ))
      })
    })
    return mashesPromise.then(mashesLookup => {
      return this.updateRelationsPromise('cast', 'mash', id, permanentIds).then(lookup => {
        const json = JSON.stringify(rest)
        const cast = { createdAt, icon, id, label, json }
        const response: DataServerCastRelationUpdate = {
          cast, temporaryIdLookup: { ...lookup, ...mashesLookup }
        }
        return response
      })
    })
  }

  private updateDefinitionPromise(definition: DefinitionObject): Promise<void> {
    const { type, createdAt, icon, id, label, ...rest } = definition
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { createdAt, icon, id, label, json }
    return this.updatePromise('`definition`', data).then(EmptyMethod)
  }

  private mashUpdateRelationsPromise(mashId: string, definitionIds?: string[]): Promise<StringObject> {
    // console.log("updateMashDefinitionsPromise", mashId, definitionIds)
    const relationPromise = this.updateRelationsPromise('mash', 'definition', mashId, definitionIds)
    return relationPromise
  }


  private updateRelationsPromise(from: string, to: string, id: string, ids?: string[]): Promise<StringObject> {
    const relatedIds = ids || []
    const temporaryLookup: StringObject = {}
    const permanentIds = relatedIds.map(id => {
      if (id.startsWith(this.args.temporaryIdPrefix)) return temporaryLookup[id] = uuid()

      return id
    })

    const quotedTable = `${from}_${to}`
    const fromId = `${from}Id`
    const toId = `${to}Id`
    const sql = `SELECT * FROM ${quotedTable} WHERE ${fromId} = ?`
    // console.log("updateRelationsPromise", sql, id)
    return this.db.all(sql, id).then(rows => {
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
          this.createPromise(quotedTable, { [toId]: relatedId, [fromId]: id }).then(EmptyMethod)
        ),
      ]
      switch (promises.length) {
        case 0: return Promise.resolve()
        case 1: return promises[0]
        default: return Promise.all(promises).then(EmptyMethod)
      }
    }).then(() => temporaryLookup)
  }

  private userIdPromise(table: string, id: string): Promise<string> {
    return this.db.get(`SELECT userId FROM ${table} WHERE id = ?`, id)
      .then(row => row?.userId || '')
  }

  private writeCastPromise(userId: string, cast: CastObject, definitionIds?: StringsObject): Promise<StringObject> {
    const { id } = cast

    const promiseJson = this.jsonPromise('`cast`', userId, id)
    return promiseJson.then(row => {
      if (row) {
        Object.assign(row, cast)
        return this.castUpdatePromise(userId, row, definitionIds)
      }
      return this.castInsertPromise(userId, cast, definitionIds)
    })
  }

  private writeDefinitionPromise(userId: string, definition: DefinitionObject): Promise<string> {
    const { id } = definition
    if (!id) return this.insertDefinitionPromise(userId, definition)

    return this.rowExists('`definition`', id, userId).then(existing => {
      if (!existing) return this.insertDefinitionPromise(userId, definition)

      return this.updateDefinitionPromise(definition).then(() => id)
    })
  }

  private writeMashPromise(userId: string, mash: MashObject, definitionIds?: string[]): Promise<StringObject> {
    const { id } = mash
    const promiseJson = this.jsonPromise('`mash`', userId, id)
    return promiseJson.then(row => {
      if (row) {
        Object.assign(row, mash)
        return this.mashUpdatePromise(userId, row, definitionIds)
      }
      return this.mashInsertPromise(userId, mash, definitionIds)
    })
  }
}
