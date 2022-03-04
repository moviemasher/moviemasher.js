import Express from "express"
import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
const uuid = require('uuid').v4

import {
  Errors, MashObject, UnknownObject, StringObject, JsonObject, WithError, stringPluralize,
  DefinitionObject, DefinitionObjects, CastObject, DataServerInit, Endpoints, EmptyMethod,
  DataCastRelations,
  DataCastDefaultResponse, DataCastDefaultRequest,
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
  DataDefinitionUpdateResponse, DataDefinitionUpdateRequest,
  DataCastRetrieveResponse, DataCastRetrieveRequest,
  DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest,
  RawType, RawTypes,
} from "@moviemasher/moviemasher.js"

import { ServerHandler } from "../../declaration"
import { ServerClass } from "../ServerClass"
import { ServerArgs } from "../Server"
import { HostServers } from "../../Host/Host"
import { RenderingServer } from "../RenderingServer/RenderingServer"
import { FileServer } from "../FileServer/FileServer"
import { definitionFromRaw } from "../../Utilities/RenderingInput"

interface DataServerArgs extends ServerArgs {
  dbMigrationsPrefix: string
  dbPath: string
}

const DataServerNow = () => (new Date()).toISOString()

const DataServerSelect = (quotedTable: string, columns = DataServerColumnsDefault): string => {
  return `SELECT ${columns.join(', ')} FROM ${quotedTable} WHERE id = ?`
}

const DataServerJson = (row: any): any => {
  if (!row) return {}

  const { json, ...rest } = row
  return json ? { ...JSON.parse(json), ...rest } : rest
}

const DataServerJsons = (rows: any[]): any[] => { return rows.map(DataServerJson) }

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
  const { processing, type, createdAt, icon, label, id, ...rest } = data
  const json = JSON.stringify(rest)
  const record: StringObject = { json, userId }
  if (id) record.id = String(id)
  if (createdAt) record.createdAt = String(createdAt)
  if (icon) record.icon = String(icon)
  if (label) record.label = String(label)
  // for definitions
  if (processing) record.processing = String(processing)
  if (type) record.type = String(type)
  return record
}

const DataServerColumns = ['id', 'label', 'icon']
const DataServerColumnsDefault = ['*']

class DataServer extends ServerClass {
  declare args: DataServerArgs

  private castRelationsPromise(id: string): Promise<DataCastRelations> {
    const mashesSql = `
      SELECT mash.*
      FROM cast_mash
      JOIN mash
      ON mash.id = mashId
      WHERE castId = ?
    `
    return this.db.all(mashesSql, id).then(DataServerJsons).then(mashes => {
      const ids = mashes.map(mash => mash.id)
      const sql = `
        SELECT UNIQUE definition.*
        FROM mash_definition
        JOIN definition
        ON definition.id = definitionId
        WHERE ${Array(ids.length).fill('mashId = ?').join(' OR ')}
      `
      return this.db.all(sql, ...ids).then(DataServerJsons).then(definitions => {
        return { mashes, definitions }
      })
    })
  }

  private createPromise(quotedTable: string, data: UnknownObject): Promise<string> {
    data.createdAt ||= DataServerNow()
    data.id ||= uuid()
    const id = data.id as string
    const keys: string[] = []
    const values: any[] = []
    Object.entries(data).forEach(([key, value]) => {
      keys.push(key)
      values.push(value)
    })
    const sql = DataServerInsert(quotedTable, keys)
    return this.db.run(sql, ...values).then(() => id)
  }

  private _db?: Database
  private get db(): Database {
    if (!this._db) throw Errors.internal + 'db'

    return this._db
  }

  defaultCast: ServerHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest> = async (req, res) => {
    const response: DataCastDefaultResponse = { cast: {}, mashes: [], definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const cast = await this.getLatestPromise(user, '`cast`')
      const { id } = cast
      if (id) {
        const relations = await this.castRelationsPromise(String(id))
        Object.assign(response, relations, { cast })
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  defaultMash: ServerHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest> = async (req, res) => {
    const response: DataMashDefaultResponse = { mash: {}, definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.getLatestPromise(user, '`mash`')
      const { id } = mash
      if (id) {
        const relations = await this.selectMashRelationsPromise(String(id))
        Object.assign(response, relations, { mash })
      }
    } catch (error) { response.error = String(error) }
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

  getCast: ServerHandler<DataCastGetResponse, DataCastGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataCastGetResponse = { cast: {}, mashes: [], definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const cast = await this.jsonPromise('`cast`', id)
      if (!(cast.id && cast.userId === user)) response.error = `Could not find cast ${id}`
      else response.cast = cast
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  getDefinition: ServerHandler<DataDefinitionGetResponse, DataDefinitionGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionGetResponse = { definition: {} }
    try {
      const user = this.userFromRequest(req)
      const definition = await this.jsonPromise('`definition`', id)
      if (!definition.id || (definition.userId && definition.userId !== user)) {
        response.error = `Could not find definition ${id}`
      } else response.definition = definition
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  getLatestPromise(userId: string, quotedTable: string): Promise<JsonObject> {
    const sql = `SELECT * FROM ${quotedTable} WHERE userId = ? ORDER BY createdAt DESC`
    return this.db.get(sql, userId).then(DataServerJson)
  }

  getMash: ServerHandler<DataMashGetResponse, DataMashGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataMashGetResponse = { mash: {}, definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const mash = await this.jsonPromise('`mash`', id)
      if (!(mash.id && mash.userId === user)) response.error = `Could not find mash ${id}`
      else {
        response.mash = mash
        response.definitions = await this.selectMashRelationsPromise(id)
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  id = 'data'

  init(): DataServerInit { return { uuid: uuid() } }

  private insertCastPromise(userId: string, cast: CastObject, mashIds: string[]): Promise<string> {
    return this.createPromise('`cast`', DataServerInsertRecord(userId, cast)).then(id =>
      this.updateCastMashesPromise(id, mashIds).then()
    )
  }

  private insertDefinitionPromise(userId: string, definition: DefinitionObject): Promise<string> {
    return this.createPromise('`definition`', DataServerInsertRecord(userId, definition))
  }

  private insertMashPromise(userId: string, mash: MashObject, definitionIds: string[]): Promise<string> {
    return this.createPromise('`mash`', DataServerInsertRecord(userId, mash)).then(id =>
      this.updateMashDefinitionsPromise(id, definitionIds).then()
    )
  }

  private jsonPromise(quotedTable: string, id: string, columns?: string[]): Promise<any> {
    return this.db.get(DataServerSelect(quotedTable, columns), id).then(DataServerJson)
  }

  putCast: ServerHandler<DataCastPutResponse | WithError, DataCastPutRequest> = async (req, res) => {
    const { cast, mashIds } = req.body
    const response: DataCastPutResponse = { id: '' }
    try {
      const user = this.userFromRequest(req)
      response.id = await this.writeCastPromise(user, cast, mashIds)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  putDefinition: ServerHandler<DataDefinitionPutResponse, DataDefinitionPutRequest> = async (req, res) => {
    const request = req.body
    const { id: requestId, name, type, size } = request
    console.log(this.constructor.name, "putDefinition", name, type, size)
    const response: DataDefinitionPutResponse = { }

    try {
      const user = this.userFromRequest(req)
      if (!(this.fileServer && this.renderingServer)) throw Errors.internal + 'servers'

      const [raw] = type.split('/') // hopefully audio, video, image

      if (!RawTypes.includes(raw)) response.error = `Unacceptable type ${type}`
      else if (!this.fileServer.withinLimits(size, raw)) response.error = 'Size exceeds limit'
      else {
        const rawType = raw as RawType
        const extension = path.extname(name).slice(1).toLowerCase()
        const id = requestId || uuid()
        const source = this.fileServer.userSourceSuffix(user, id, rawType, extension)

        const definition = definitionFromRaw(rawType, source, id, name)

        await this.insertDefinitionPromise(user, definition)
        response.id = id
        response.fileProperty = this.fileServer.property
        response.fileCallback = this.fileServer.constructCallback(request, user, id)
        response.renderingCallback = this.renderingServer.constructCallback(definition)
      }
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  putMash: ServerHandler<DataMashPutResponse | WithError, DataMashPutRequest> = async (req, res) => {
    const { mash, definitionIds } = req.body
    const response: DataMashPutResponse = { id: '' }

    try {
      const user = this.userFromRequest(req)
      response.id = await this.writeMashPromise(user, mash, definitionIds)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  renderingServer?: RenderingServer

  retrieveCast: ServerHandler<DataCastRetrieveResponse | WithError, DataCastRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const response: DataCastRetrieveResponse = { casts: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.casts = await this.selectCastsPromise(user, columns)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  retrieveDefinition: ServerHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest> = async (req, res) => {
    const { partial, type } = req.body
    const response: DataDefinitionRetrieveResponse = { definitions: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.definitions = await this.selectDefinitionsPromise(user, type, columns)
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  retrieveMash: ServerHandler<DataMashRetrieveResponse | WithError, DataMashRetrieveRequest> = async (req, res) => {
    const { partial } = req.body
    const response: DataMashRetrieveResponse = { mashes: [] }
    try {
      const user = this.userFromRequest(req)
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      response.mashes = await this.selectMashesPromise(user, columns)
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

  private selectCastsPromise(userId: string, columns = DataServerColumnsDefault): Promise<MashObject[]> {
    const table = '`cast`'
    const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE userId = ?`
    return this.db.all(sql, userId).then(rows => {
      return rows.map(row => {
        const { json, ...rest } = row
        if (json) return { ...JSON.parse(json), ...rest }
        return rest
      })
    })
  }

  private selectDefinitionsPromise(userId: string, type: string, columns = DataServerColumnsDefault): Promise<MashObject[]> {
    const table = '`definition`'
    const sql = `
      SELECT ${columns.join(', ')}
      FROM ${table}
      WHERE type = ?
      AND userId = ?
    `

    return this.db.all(sql, type, userId).then(DataServerJsons)
  }

  private selectMashRelationsPromise(id: string): Promise<DefinitionObjects> {
    const sql = `
      SELECT definition.*
      FROM mash_definition
      JOIN definition
      ON definition.id = definitionId
      WHERE mashId = ?
    `
    return this.db.all(sql, id).then(DataServerJsons)
  }

  private selectMashesPromise(userId: string, columns = DataServerColumnsDefault): Promise<MashObject[]> {
    const table = '`mash`'
    const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE userId = ?`
    return this.db.all(sql, userId).then(rows => {
      return rows.map(row => {
        const { json, ...rest } = row
        if (json) return { ...JSON.parse(json), ...rest }
        return rest
      })
    })
  }

  private startDatabase() {
    const { dbPath, dbMigrationsPrefix } = this.args
    console.log(this.constructor.name, "startDatabase", dbPath)
    fs.mkdirSync(path.dirname(dbPath), { recursive: true })
    open({ filename: dbPath, driver: sqlite3.Database }).then(db => {
      this._db = db
      if (dbMigrationsPrefix) {
        console.log(this.constructor.name, "startDatabase migrating...", dbMigrationsPrefix)
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
    if (this.fileServer && this.renderingServer) {
      app.post(Endpoints.data.definition.put, this.putDefinition)
    }
    app.post(Endpoints.data.cast.default, this.defaultCast)
    app.post(Endpoints.data.cast.delete, this.deleteCast)
    app.post(Endpoints.data.cast.get, this.getCast)
    app.post(Endpoints.data.cast.put, this.putCast)
    app.post(Endpoints.data.cast.retrieve, this.retrieveCast)
    app.post(Endpoints.data.definition.delete, this.deleteDefinition)
    app.post(Endpoints.data.definition.get, this.getDefinition)
    app.post(Endpoints.data.definition.retrieve, this.retrieveDefinition)
    app.post(Endpoints.data.definition.update, this.updateDefinition)
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
    return this.db.run(sql, ...values, id).then(EmptyMethod)
  }

  private updateCastMashesPromise(castId: string, mashIds: string[]): Promise<string> {
    return this.updateRelationsPromise('cast', 'mash', castId, mashIds)
  }

  private updateCastPromise(cast: CastObject, mashIds: string[]): Promise<void> {
    const { createdAt, icon, id, label, ...rest } = cast
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { createdAt, icon, id, label, json }
    return this.updatePromise('`cast`', data).then(() => {
      this.updateCastMashesPromise(id, mashIds)
    })
  }

  updateDefinition: ServerHandler<DataDefinitionUpdateResponse | WithError, DataDefinitionUpdateRequest> = async (req, res) => {
    const { definition } = req.body
    const { id } = definition
    const response: DataDefinitionUpdateResponse = {}
    try {
      const user = this.userFromRequest(req)
      if (id) {
        const existing = await this.jsonPromise('`definition`', id)
        if (!existing.id || (existing.userId && existing.userId !== user)) {
          response.error = `Could not find definition ${id}`
        } else {
          Object.assign(existing, definition)
          await this.updateDefinitionPromise(existing)
        }
      } else response.error = 'Required key empty: id'
    } catch (error) { response.error = String(error) }
    res.send(response)
  }

  private updateDefinitionPromise(definition: DefinitionObject): Promise<void> {
    const { type, createdAt, icon, id, label, ...rest } = definition
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { createdAt, icon, id, label, json }
    return this.updatePromise('`definition`', data).then(EmptyMethod)
  }

  private updateMashDefinitionsPromise(mashId: string, definitionIds: string[]): Promise<string> {
    return this.updateRelationsPromise('mash', 'definition', mashId, definitionIds)
  }

  private updateMashPromise(mash: MashObject, definitionIds: string[]): Promise<void> {
    const { createdAt, icon, id, label, ...rest } = mash
    if (!id) return Promise.reject(401)

    const json = JSON.stringify(rest)
    const data = { createdAt, icon, id, label, json }
    return this.updatePromise('`mash`', data).then(() => {
      this.updateMashDefinitionsPromise(id, definitionIds)
    })
  }

  private updateRelationsPromise(from: string, to: string, id: string, definitionIds: string[]): Promise<string> {
    const quotedTable = `${from}_${to}`
    const fromId = `${from}Id`
    const toId = `${to}Id`
    const sql = `SELECT * FROM ${quotedTable} WHERE ${fromId} = ?`
    return this.db.all(sql, id).then(rows => {
      const existing = Object.fromEntries(rows.map((row) => [row[toId], row.id]))
      const defined = Object.keys(existing).filter(id => definitionIds.includes(id))
      const deleting = defined.map(id => existing[id])
      const creating = definitionIds.filter(id => !defined.includes(id))
      const promises: Promise<void>[] = [
        ...deleting.map(id => this.deletePromise(quotedTable, id)),
        ...creating.map(definitionId =>
          this.createPromise(quotedTable, { [toId]: definitionId, [fromId]: id }).then(EmptyMethod)
        ),
      ]
      switch (promises.length) {
        case 0: return Promise.resolve()
        case 1: return promises[0]
        default: return Promise.all(promises).then(EmptyMethod)
      }
    }).then(() => id)
  }

  private userIdPromise(table: string, id: string): Promise<string> {
    return this.db.get(`SELECT userId FROM ${table} WHERE id = ?`, id)
      .then(row => row?.userId || '')
  }

  private writeCastPromise(userId: string, cast: CastObject, mashIds: string[]): Promise<string> {
    const { id } = cast
    if (!id) return this.insertCastPromise(userId, cast, mashIds)

    return this.rowExists('`cast`', id, userId).then(existing => {
      if (!existing) return this.insertCastPromise(userId, cast, mashIds)

      return this.updateCastPromise(cast, mashIds).then(() => id)
    })
  }

  private writeMashPromise(userId: string, mash: MashObject, definitionIds: string[]): Promise<string> {
    const { id } = mash
    if (!id) return this.insertMashPromise(userId, mash, definitionIds)

    return this.rowExists('`mash`', id, userId).then(existing => {
      if (!existing) return this.insertMashPromise(userId, mash, definitionIds)

      return this.updateMashPromise(mash, definitionIds).then(() => id)
    })
  }
}

export { DataServer, DataServerArgs }
