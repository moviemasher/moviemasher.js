import type { AssetObject, AssetObjects, AssetObjectsResponse, AssetType, Identified, Labeled, MashAssetObject, Sourced, Strings, Typed } from '@moviemasher/shared-lib/types.js'
import type { DataAssetDefaultRequest, DataAssetDeleteRequest, DataAssetGetRequest, DataAssetListRequest, DataAssetPutRequest, VersionedDataOrError } from '../Api/Api.js'
import type { DataServerArgs, ExpressHandler } from './Server.js'

import { ENV_KEY, ENV, fileReadJsonPromise, idUnique, directoryCreatePromise } from '@moviemasher/server-lib'
import { assertTrue } from '@moviemasher/shared-lib/utility/guards.js'
import { arrayFromOneOrMore, arrayOfNumbers, CACHE_NONE, CACHE_SOURCE_TYPE, ERROR, MASH, RGB_WHITE, SIZE_OUTPUT, STRING, VERSION, VIDEO, VOID_FUNCTION, errorObjectCaught, errorThrow, idIsTemporary, isDefined, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { Application } from 'express'
import path from 'path'
// import pg from 'pg'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'
import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'

const USER_SHARED = ENV.get(ENV_KEY.SharedUser)

interface QueryResult<T> {
  rows: T[]
}
// const { Client: ClientClass } = pg

// TODO: use environment variables for these
//   const columnOwner = ENV.get(EnvironmentKeyAppColumnOwner)
//   const columnSource = ENV.get(EnvironmentKeyAppColumnSource)
type AssetColumn = 'id' | 'label' | 'type' | 'created' | 'deleted' | 'rest' | 'source' | 'user_id'

interface Row extends Partial<Record<AssetColumn, string>> {
  id: string
  source: string
}

interface AssetRow extends Row {
  type: AssetType 
  created?: string
  deleted?: string
  user_id: string
}

type AssetRows = AssetRow[]

interface RawAssetRow extends AssetRow {
  rest: string
}

interface AssetAsset {
  asset_id: string
  owner_id: string
  id: string
}

type AssetAssets = AssetAsset[]

type RawAssetRows = RawAssetRow[]

const DataServerColumns = ['id', 'label', 'type', 'source']

const DataServerColumnsDefault = ['*']

const DataServerNow = () => (new Date()).toISOString()

const AssetOrderColumns: AssetColumn[] = ['created', 'label', 'type', 'source']

const AssetColumns: AssetColumn[] = [
  ...AssetOrderColumns, 'id', 'user_id', 'rest'
] 

const AssetRowFromRaw = (row: RawAssetRow): AssetRow => {
  const { user_id: _user_id, deleted: _deleted, rest = '{}', ...others } = row
  const parsed = JSON.parse(rest)
  return { ...parsed, ...others }
}

const AssetRowsFromRaw = (rows: RawAssetRows): AssetRows => rows.map(AssetRowFromRaw) 

const RawFromAsset = (user_id: string, data: AssetObject): RawAssetRow => {
  const { assets: _, type, created, source, label, id, ...unparsed } = data
  const rest = JSON.stringify(unparsed)
  const record: RawAssetRow = { 
    type, created, label, source, user_id, id, rest
  }
  return record
}

const substitions = (count: number, start: number = 1) => (
  arrayOfNumbers(count, start).map(i => `$${i}`).join(', ')
)

export class DataServerClass extends ServerClass {
  constructor(public args: DataServerArgs) { super(args) }

  private assetDefault: ExpressHandler<VersionedDataOrError<MashAssetObject>, DataAssetDefaultRequest> = async (req, res) => {
    const { width, height } = SIZE_OUTPUT
    const defaultData: MashAssetObject = { 
      aspectHeight: height, aspectWidth: width,
      aspectShortest: Math.min(width, height),
      color: RGB_WHITE,
      type: VIDEO, source: MASH, 
      id: `temporary-${idUnique()}`, 
      assets: [] 
    } 
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetDefaultPromise(user) || defaultData
      res.send({ version: VERSION, data })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }
  }

  private assetDefaultPromise(user: string): Promise<AssetObject | undefined> {
    const text = `
      SELECT * FROM assets 
      WHERE 
      user_id = $1 
      AND source = $2 
      ORDER BY created DESC 
      LIMIT 1
    `
    // console.log(this.constructor.name, 'assetDefaultPromise', text, { user, text })
    return this.queryPromise(text, [user, MASH]).then(result => {
      const [row] = result.rows
      if (!row) return 

      const asset = AssetRowFromRaw(row)
      const { id } = asset
      return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
    })
  }

  private assetDelete: ExpressHandler<VersionedDataOrError<Strings>, DataAssetDeleteRequest> = async (req, res) => {
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const existing = await this.userAssetExists(user, id)
      if (!existing) errorThrow(ERROR.Reference, `No asset with ID ${id}`)

      const rows = await this.relationsPromise(id, 'asset_id')
      const data = rows.map(row => row.owner_id)
      if (!data.length) {
        await this.relationsUpdatePromise(id, [])
        await this.assetDeletePromise(id)
      }
      res.send({ version: VERSION, data })
    } catch (error) {       
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }
  }

  private assetDeletePromise(id: string): Promise<void> {
      const text = `UPDATE assets SET deleted = $1 WHERE id = $2`
      return this.queryPromise(text, [DataServerNow(), id]).then(VOID_FUNCTION)
  }

  private assetGet: ExpressHandler<VersionedDataOrError<AssetObject>, DataAssetGetRequest> = async (req, res) => {
    const { id } = req.body
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetGetPromise(user, id)
      if (!data) errorThrow(ERROR.Reference, `No asset with ID ${id}`)
      res.send({ version: VERSION, data })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })      
    }
  }

  private assetGetPromise(user: string, id: string): Promise<AssetObject | undefined> {
      const query = 'SELECT * FROM assets WHERE id = $1 AND user_id = $2 LIMIT 1'

    return this.queryPromise(query, [id, user]).then(result => {
      const [row] = result.rows
      if (!row) return

      const asset = AssetRowFromRaw(row)
      const { id } = asset
      return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
    })
  }

  private assetInsertPromise(user: string, asset: AssetObject): Promise<string> {
    const { assets = [] } = asset
    const data = RawFromAsset(user, asset)
    const { id } = data
    const permanentId = (!id || idIsTemporary(id)) ? idUnique() : id
    data.id = permanentId
    data.created ||= DataServerNow()
    const values = AssetColumns.map(column => data[column] || '')
    const subs = substitions(AssetColumns.length, 1)
    const text = `INSERT INTO assets (${AssetColumns.join(', ')}) VALUES (${subs})`
    // console.log(this.constructor.name, 'assetInsertPromise', text, ...values)
    return this.queryPromise(text, values).then(() => {
      return this.relationsUpdatePromise(permanentId, assets).then(() => permanentId)
    })
  }

  private assetList: ExpressHandler<VersionedDataOrError<AssetObjectsResponse>, DataAssetListRequest> = async (req, res) => {
    const request = req.query as DataAssetListRequest
    try {
      const user = this.userFromRequest(req)
      const assets = await this.assetListPromise(user, request) || []
      const cacheControl = request.terms?.length ? CACHE_NONE : CACHE_SOURCE_TYPE
      res.send({ version: VERSION, data: { assets, cacheControl } })
    } catch (error) { 
      // console.error(this.constructor.name, 'assetList', error)
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }    
  }

  private _sharedAssets?: AssetObjects

  private async sharedAssets() {
    const { _sharedAssets } = this
    if (_sharedAssets) return _sharedAssets

    const jsonPath = ENV.get(ENV_KEY.SharedAssets, STRING)
    if (!(jsonPath && USER_SHARED)) return this._sharedAssets = []

    const orError = await fileReadJsonPromise<AssetObjects>(jsonPath)

    if (isDefiniteError(orError)) {
      // console.error(this.constructor.name, 'sharedAssets', orError)
      return this._sharedAssets = []
    }
    return orError.data
  }

  private assetListPromise = (user_id: string, request: DataAssetListRequest): Promise<AssetObjects | undefined> => {
    const types = arrayFromOneOrMore(request.types || [])
    const sources = arrayFromOneOrMore(request.sources || [])
    const terms = arrayFromOneOrMore(request.terms || [])
    // console.log(this.constructor.name, 'assetListPromise', request, types, sources, terms)

    const { partial, order, descending } = request
    const ordered = order || (partial ? 'label' : 'created')
    assertTrue(AssetOrderColumns.includes(ordered as AssetColumn), `Invalid order: ${ordered}`)
    
    const desc = isDefined(descending) ? descending : (ordered === 'created')
    const columns = partial ? DataServerColumns : DataServerColumnsDefault
    
    // console.log(this.constructor.name, 'assetListPromise', { columns, types, sources, terms })
    const phrases = [`SELECT ${columns.join(', ')} FROM assets WHERE user_id in (${substitions(2)})`]
    const subStart = 2
    const values = [user_id, USER_SHARED]
    const { length: typeCount } = types
    const { length: sourceCount } = sources
    const { length: termCount } = terms
    if (typeCount) {
      const subs = substitions(typeCount, subStart + phrases.length)
      phrases.push(`AND type IN (${subs})`)
      values.push(...types)
    }
    if (sourceCount) {
      const subs = substitions(sourceCount, subStart + phrases.length)
      phrases.push(`AND source IN (${subs})`)
      values.push(...sources)
    }
    if (termCount) {
      const likes = terms.map((term, index) => {
        values.push(`%${term}%`)
        return `label LIKE $${index + subStart + phrases.length}`
      })
      phrases.push(`AND (${likes.join(' OR ')})`)
    }

    phrases.push(`ORDER BY ${ordered} ${desc ? 'DESC' : 'ASC'}`)
    const text = phrases.join(' ')
    // console.log(this.constructor.name, 'assetListPromise', text, ...values)
    // console.log(this.constructor.name, 'assetListPromise', text, values)
    const queryPromise: Promise<AssetObjects> = this.queryPromise(text, values).then(result => {
      const { rows } = result
      const { length } = rows
      // console.log(this.constructor.name, 'assetListPromise', { length })
      if (!length) return []

      if (partial) return AssetRowsFromRaw(rows)

      const promises = rows.map(row => {
        const asset = AssetRowFromRaw(row)
        const { id } = asset
        return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
      })
      return Promise.all(promises)
    }) 
    return queryPromise
    // .then(assets => {
    //   return this.sharedAssets().then(shared => {
    //     assets.push(...shared.filter(asset => {
    //       const { type, source, label } = asset
    //       if (typeCount && !types.includes(type)) return false
    //       if (sourceCount && !sources.includes(source)) return false
    //       if (termCount) return label && terms.some(term => label.includes(term))
    //       return true
    //     }))
    //     return assets
    //   })
    // })  
  }

  private assetPut: ExpressHandler<VersionedDataOrError<Identified>, DataAssetPutRequest> = async (req, res) => {
    const { assetObject } = req.body
    try {
      const user = this.userFromRequest(req)
      const id = await this.assetPutPromise(user, assetObject)
      const result = { version: VERSION, data: { id } }
      // console.log(this.constructor.name, 'assetPut result', result)
      res.send(result)
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }    
  }

  private assetPutPromise(user: string, asset: AssetObject): Promise<string> {
    const { id } = asset
    if (!id || idIsTemporary(id)) return this.assetInsertPromise(user, asset)

    return this.userAssetExists(user, id).then(existing => {
      if (!existing) return this.assetInsertPromise(user, asset)

      return this.assetUpdatePromise(user, asset).then(() => '')
    })
  }

  private assetUpdatePromise(user: string, asset: AssetObject): Promise<void> {
    const { assets = [], id } = asset
    const data = RawFromAsset(user, asset)
    const phrases: Strings = []
    const values = AssetColumns.map(column => {
      phrases.push(`${column} = $${phrases.length + 1}`)
      return data[column] || ''
    })
    values.push(id)
    const text = `
      UPDATE assets 
      SET ${phrases.join(', ')} 
      WHERE id = $${phrases.length + 1}
    `
    // console.log(this.constructor.name, 'assetUpdatePromise', { text, values })
    return this.queryPromise(text, values).then(() => {
      // console.log(this.constructor.name, 'assetUpdatePromise', id)
      return this.relationsUpdatePromise(id, assets)
    }).then(VOID_FUNCTION)
  }
  
  private _client?: Database

  private _clientPromise?: Promise<Database>

  private get clientPromise() {
    const { _client, _clientPromise } = this
    if (_client) return Promise.resolve(_client)

    if (_clientPromise) return _clientPromise

    const dbMigrationsPrefix = ENV.get(ENV_KEY.ExampleDataDir, STRING)
    const dbPath = ENV.get(ENV_KEY.ExampleDataFile, STRING)
    // console.debug(this.constructor.name, "startDatabase", dbPath)
    return this._clientPromise = directoryCreatePromise(path.dirname(dbPath)).then(() => {
      return open({ filename: dbPath, driver: sqlite3.Database }).then(db => {
        // console.debug(this.constructor.name, "startDatabase migrating...", dbMigrationsPrefix)
        return db.migrate({ migrationsPath: dbMigrationsPrefix }).then(() => {
          delete this._clientPromise
          return this._client = db
        })
      })
    })
  }
  
  id = 'asset'

  private queryPromise<T=RawAssetRow>(query: string, values?: Strings): Promise<QueryResult<T>> {
    // console.log(this.constructor.name, 'queryPromise', query, values)
    return this.clientPromise.then(client => {
      return client.all(query, values).then(rows => ({ rows }), error => {
        // console.log(this.constructor.name, 'queryPromise error', error)
        return { rows: [] }
      })
    })
  }

  private relatedAssetsPromise(owner: string): Promise<AssetObjects> {
    const query = `
      SELECT assets.* 
      FROM asset_assets 
      JOIN assets ON assets.id = asset_assets.asset_id 
      WHERE asset_assets.owner_id IN (${substitions(2)})
    `
    // console.log(this.constructor.name, 'relatedAssetsPromise', query, owner)
    return this.queryPromise(query, [owner, USER_SHARED]).then(result => {   
      const { rows } = result
      // console.log(this.constructor.name, 'relatedAssetsPromise', ...rows)
      return AssetRowsFromRaw(rows)
    })
  }

  private relationDeletePromise(ids: Strings): Promise<void> {
    const query = `DELETE FROM asset_assets WHERE id IN (${substitions(ids.length)})`
    // console.log(this.constructor.name, 'relationDeletePromise', query, ...ids)
    return this.queryPromise<AssetAsset>(query, ids).then(VOID_FUNCTION) 
  }

  private relationInsertPromise(owner_id: string, asset_id: string): Promise<void> {
    const id = idUnique()
    const now = DataServerNow()
    const query = `INSERT INTO asset_assets (id, owner_id, asset_id, created) VALUES (${substitions(4)})`
    // console.log(this.constructor.name, 'relationInsertPromise', query, id, owner_id, asset_id, now)
    return this.queryPromise<AssetAsset>(query, [id, owner_id, asset_id, now]).then(VOID_FUNCTION)
  }

  private relationsPromise(id: string, column = 'owner_id'): Promise<AssetAssets> {
      const query = `SELECT * FROM asset_assets WHERE ${column} = ${substitions(1)}`
      // console.log(this.constructor.name, 'relationsPromise', query, id)

      return this.queryPromise<AssetAsset>(query, [id]).then(result => {
        const { rows } = result
        // console.log(this.constructor.name, 'relationsPromise', rows)

        return rows
      })
 
  }

  private relationsUpdatePromise(owner: string, assets: AssetObjects): Promise<void> {
    const ids = assets.map(asset => asset.id)
    return this.relationsPromise(owner).then(rows => {
      // console.log(this.constructor.name, 'relationsUpdatePromise', { owner, ids, rows })
      const deleting: Strings = []
      const keeping: Strings = []
      rows.forEach(row => {
        const { asset_id, id } = row
        if (ids.includes(asset_id)) keeping.push(asset_id)
        else deleting.push(id)
      })
      const inserting = ids.filter(id => !keeping.includes(id))
      const promises: Promise<void>[] = [
        ...inserting.map(id => this.relationInsertPromise(owner, id))
      ]
      if (deleting.length) promises.push(this.relationDeletePromise(deleting))
      switch (promises.length) {
        case 0: return Promise.resolve()
        case 1: return promises[0]
        default: return Promise.all(promises).then(VOID_FUNCTION)
      }     
    }).then(VOID_FUNCTION)
  }

  override async startServer(app: Application): Promise<void> {
    await super.startServer(app)
    // console.debug(this.constructor.name, 'startServer')
      
    const assetsShared = await this.sharedAssets()
    assetsShared.forEach(async asset => {
      await this.assetPutPromise(USER_SHARED, asset)
    })

    app.get(Endpoints.asset.default, this.assetDefault)
    app.post(Endpoints.asset.delete, this.assetDelete)
    app.post(Endpoints.asset.get, this.assetGet)
    app.get(Endpoints.asset.list, this.assetList)
    app.post(Endpoints.asset.put, this.assetPut)
  }

  stopServer(): void { this._client?.close() }

  private userAssetExists(user_id: string, id: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this.userIdPromise(id).then(ownerId => {
        if (ownerId && ownerId !== user_id) return reject(403)

        return resolve(!!ownerId)
      })
    })
    return promise
  }

  private userIdPromise(id: string): Promise<string> {
    const query = `SELECT user_id FROM assets WHERE id = ${substitions(1)} LIMIT 1`
    return this.queryPromise(query, [id]).then(result => {
      const [row] = result.rows
      return row?.user_id || ''
    })
  }
}
