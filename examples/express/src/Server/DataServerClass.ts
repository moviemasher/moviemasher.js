import type { AssetObject, AssetObjects, AssetObjectsResponse, AssetType, Identified, Labeled, MashAssetObject, Sourced, Strings, Typed } from '@moviemasher/runtime-shared'
import type { Client } from 'pg'
import type { DataAssetDefaultRequest, DataAssetDeleteRequest, DataAssetGetRequest, DataAssetListRequest, DataAssetPutRequest, VersionedDataOrError } from '../Api/Api.js'
import type { DataServerArgs, ExpressHandler } from './Server.js'

import { ENV_KEY, ENV, fileReadJsonPromise } from '@moviemasher/lib-server'
import { assertTrue } from '@moviemasher/lib-shared'
import { arrayFromOneOrMore, arrayOfNumbers, CACHE_NONE, CACHE_SOURCE_TYPE, ERROR, MASH, NUMBER, RGB_WHITE, SIZE_OUTPUT, STRING, VERSION, VIDEO, VOID_FUNCTION, errorObjectCaught, errorThrow, idIsTemporary, isDefined, isDefiniteError } from '@moviemasher/runtime-shared'
import { Application } from 'express'
import pg from 'pg'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'
import { idUnique } from '../Hash.js'

const USER_SHARED = ENV.get(ENV_KEY.SharedUser)

const { Client: ClientClass } = pg

// TODO: use environment variables for these
//   const columnOwner = ENV.get(EnvironmentKeyAppColumnOwner)
//   const columnSource = ENV.get(EnvironmentKeyAppColumnSource)
type AssetColumn = 'id' | 'label' | 'type' | 'created' | 'deleted' | 'rest' | 'source' | 'user_id'

interface AssetRow extends Identified, Labeled, Sourced, Typed {
  type: AssetType 
  created?: string
  deleted?: string
  user_id: string
}

type AssetRows = AssetRow[]

interface RawAssetRow extends AssetRow {
  rest: any
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
  const { user_id: _user_id, deleted: _deleted, rest = {}, ...others } = row
  return { ...rest, ...others }
}

const AssetRowsFromRaw = (rows: RawAssetRows): AssetRows => rows.map(AssetRowFromRaw) 

const RawFromAsset = (user_id: string, data: AssetObject): RawAssetRow => {
  const { assets: _, type, created, source, label, id, ...rest } = data
  const record: RawAssetRow = { 
    type, created, label, source, user_id, id, rest
  }
  return record
}

const substitions = (count: number, start: number) => (
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
    return this.clientPromise.then(client => {
      const text = `
        SELECT * FROM assets 
        WHERE 
        user_id = $1 
        AND source = $2 
        ORDER BY created DESC 
        LIMIT 1
      `
      // console.log(this.constructor.name, 'assetDefaultPromise', text, { user, text })
      return client.query(text, [user, MASH]).then(result => {
        const [row] = result.rows
        if (!row) return 

        const asset = AssetRowFromRaw(row)
        const { id } = asset
        return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
      })
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
    return this.clientPromise.then(client => {
      const text = `UPDATE assets SET deleted = $1 WHERE id = $2`
      return client.query(text, [DataServerNow(), id])
    }).then(VOID_FUNCTION)
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

  private assetGetPromise(user: string, id?: string): Promise<AssetObject | undefined> {
    return this.clientPromise.then(client => {
      const query = 'SELECT * FROM assets WHERE id = $1 AND user_id = $2 LIMIT 1'

      return client.query(query, [id, user]).then(result => {
        const [row] = result.rows
        if (!row) return

        const asset = AssetRowFromRaw(row)
        const { id } = asset
        return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
      })
    })
  }

  private assetInsertPromise(user: string, asset: AssetObject): Promise<string> {
    const { assets = [] } = asset
    const data = RawFromAsset(user, asset)
    return this.clientPromise.then(client => {
      const { id } = data
      const permanentId = (!id || idIsTemporary(id)) ? idUnique() : id
      data.id = permanentId
      data.created ||= DataServerNow()
      const values = AssetColumns.map(column => data[column])
      const subs = substitions(AssetColumns.length, 1)
      const text = `INSERT INTO assets (${AssetColumns.join(', ')}) VALUES (${subs})`
      console.log(this.constructor.name, 'assetInsertPromise', text, ...values)
      return client.query(text, values).then(() => {
        return this.relationsUpdatePromise(permanentId, assets).then(() => permanentId)
      })
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
      console.error(this.constructor.name, 'assetList', error)
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
      console.error(this.constructor.name, 'sharedAssets', orError)
      return this._sharedAssets = []
    }
    return orError.data
  }

  private assetListPromise = (user_id: string, request: DataAssetListRequest): Promise<AssetObjects | undefined> => {
    return this.clientPromise.then(client => {
      const types = arrayFromOneOrMore(request.types || [])
      const sources = arrayFromOneOrMore(request.sources || [])
      const terms = arrayFromOneOrMore(request.terms || [])
      console.log(this.constructor.name, 'assetListPromise', request, types, sources, terms)

      const { partial, order, descending } = request
      const ordered = order || (partial ? 'label' : 'created')
      assertTrue(AssetOrderColumns.includes(ordered as AssetColumn), `Invalid order: ${ordered}`)
      
      const desc = isDefined(descending) ? descending : (ordered === 'created')
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      
      console.log(this.constructor.name, 'assetListPromise', { columns, types, sources, terms })
      const phrases = [`SELECT ${columns.join(', ')} FROM assets WHERE user_id in ($1, $2)`]
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
      console.log(this.constructor.name, 'assetListPromise', text, ...values)
      // console.log(this.constructor.name, 'assetListPromise', text, values)
      const queryPromise: Promise<AssetObjects> = client.query(text, values).then(result => {
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
    })
  }

  private assetPut: ExpressHandler<VersionedDataOrError<Identified>, DataAssetPutRequest> = async (req, res) => {
    const { assetObject } = req.body
    try {
      const user = this.userFromRequest(req)
      const id = await this.assetPutPromise(user, assetObject)
      const result = { version: VERSION, data: { id } }
      console.log(this.constructor.name, 'assetPut result', result)
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
      return data[column]
    })
    values.push(id)
    const text = `
      UPDATE assets 
      SET ${phrases.join(', ')} 
      WHERE id = $${phrases.length + 1}
    `
    return this.clientPromise.then(client => {
      console.log(this.constructor.name, 'assetUpdatePromise', { text, values })
      return client.query(text, values).then(() => {
        console.log(this.constructor.name, 'assetUpdatePromise', id)
        return this.relationsUpdatePromise(id, assets)
      })
    }).then(VOID_FUNCTION)
  }
  
  private _client?: Client

  private get client() {

    return this._client ||= this.clientInitialize
  }

  private get clientInitialize() {
    const port = ENV.get('MOVIEMASHER_DB_PORT', NUMBER)
    const host = ENV.get('MOVIEMASHER_DB_HOST', STRING)
    const database = ENV.get('MOVIEMASHER_DB_DATABASE', STRING)
    const user = ENV.get('MOVIEMASHER_DB_USERNAME', STRING)
    const password = ENV.get('MOVIEMASHER_DB_PASSWORD', STRING)
    const client = new ClientClass({ host, database, port, user, password })
    client.on('end', () => {
      console.debug('DataServerClass', 'client end')
      this.connected = false
      this._client = undefined
    })
    client.on('error', (error) => {
      console.error('DataServerClass', 'client error', error)
      this.connected = false
      this._client = undefined
    })
    return client
  }

  private connected = false

  private get clientPromise() {
    const { _client, connected } = this
    if (_client) return Promise.resolve(_client)

    return this.client.connect().then(() => {
      this.connected = true
      return this.client
    })
  }
  
  id = 'asset'

  private relatedAssetsPromise(owner: string): Promise<AssetObjects> {
    return this.clientPromise.then(client => {
      const query = `
        SELECT assets.* 
        FROM asset_assets 
        JOIN assets ON assets.id = asset_assets.asset_id 
        WHERE asset_assets.owner_id IN ($1, $2)
      `
      console.log(this.constructor.name, 'relatedAssetsPromise', query, owner)
      return client.query(query, [owner, USER_SHARED]).then(result => {   
        const { rows } = result
        // console.log(this.constructor.name, 'relatedAssetsPromise', ...rows)
        return AssetRowsFromRaw(rows)
      })
    })
  }

  private relationDeletePromise(ids: Strings): Promise<void> {
    return this.clientPromise.then(client => {
      const query = 'DELETE FROM asset_assets WHERE id IN($1)'
      console.log(this.constructor.name, 'relationDeletePromise', query, ...ids)
      return client.query(query, [ids]).then(VOID_FUNCTION) 
    })
  }

  private relationInsertPromise(owner_id: string, asset_id: string): Promise<void> {
    return this.clientPromise.then(client => {
      const id = idUnique()
      const query = 'INSERT INTO asset_assets (id, owner_id, asset_id) VALUES ($1, $2, $3)'
      console.log(this.constructor.name, 'relationInsertPromise', id, query, owner_id, asset_id)
      return client.query(query, [id, owner_id, asset_id]).then(VOID_FUNCTION)
    })
  }

  private relationsPromise(id: string, column = 'owner_id'): Promise<AssetAssets> {
    return this.clientPromise.then(client => {
      const query = `SELECT * FROM asset_assets WHERE ${column} = $1`
      console.log(this.constructor.name, 'relationsPromise', query, id)

      return client.query(query, [id]).then(result => {
        const { rows } = result
        // console.log(this.constructor.name, 'relationsPromise', rows)

        return rows
      })
    })
  }

  private relationsUpdatePromise(owner: string, assets: AssetObjects): Promise<void> {
    const ids = assets.map(asset => asset.id)
    return this.relationsPromise(owner).then(rows => {
      console.log(this.constructor.name, 'relationsUpdatePromise', { owner, ids, rows })
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

  async startServer(app: Application): Promise<void> {
    await super.startServer(app)
    console.debug(this.constructor.name, 'startServer')
      
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

  stopServer(): void { this._client?.end() }

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
    return this.clientPromise.then(client => {
      return client.query({
        text: 'SELECT user_id FROM assets WHERE id = $1 LIMIT 1',
        values: [id],
      }).then(result => {
        const [row] = result.rows
        return row?.user_id || ''
      })
    })
  }
}

