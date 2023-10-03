import type { AssetObject, AssetObjects, AssetType, Identified, Labeled, MashAssetObject, Sourced, Strings, Typed } from '@moviemasher/runtime-shared'
import type { Client } from 'pg'
import type { DataAssetDefaultRequest, DataAssetDeleteRequest, DataAssetGetRequest, DataAssetListRequest, DataAssetPutRequest, VersionedDataOrError } from '../Api/Api.js'
import type { DataServerArgs, ExpressHandler } from './Server.js'

import { ENVIRONMENT, idUnique } from '@moviemasher/lib-server'
import { EmptyFunction, arrayOfNumbers, colorWhite, idIsTemporary, idTemporary } from '@moviemasher/lib-shared'
import { ERROR, MASH, NUMBER, SIZE_OUTPUT, STRING, VERSION, VIDEO, arrayFromOneOrMore, errorObjectCaught, errorThrow, isString } from '@moviemasher/runtime-shared'
import { Application } from 'express'
import pg from 'pg'
import { Endpoints } from '../Api/Endpoints.js'
import { ServerClass } from './ServerClass.js'

const { Client: ClientClass } = pg

// TODO: use environment variables for these
//   const columnOwner = ENVIRONMENT.get(EnvironmentKeyAppColumnOwner)
//   const columnSource = ENVIRONMENT.get(EnvironmentKeyAppColumnSource)
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
    // console.log(this.constructor.name, 'assetDefault', JSON.stringify(req.body, null, 2))
    const defaultData: MashAssetObject = { 
      aspectHeight: height, aspectWidth: width,
      aspectShortest: Math.min(width, height),
      color: colorWhite,
      type: VIDEO, source: MASH, id: idTemporary(), assets: [] 
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
    }).then(EmptyFunction)
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
    const assetIds = assets.map(asset => asset.id)
    const data = RawFromAsset(user, asset)
    return this.clientPromise.then(client => {
      const { id } = data
      const permanentId = !id || idIsTemporary(id) ? idUnique() : id
      data.id = permanentId
      data.created ||= DataServerNow()
      const values = AssetColumns.map(column => data[column])
      const subs = substitions(AssetColumns.length, 1)
      const text = `INSERT INTO assets (${AssetColumns.join(', ')}) VALUES (${subs})`
      console.log(this.constructor.name, 'assetInsertPromise', text, ...values)
      return client.query(text, values).then(() => {
        return this.relationsUpdatePromise(permanentId, assetIds).then(() => permanentId)
      })
    })
  }

  private assetList: ExpressHandler<VersionedDataOrError<AssetObjects>, DataAssetListRequest> = async (req, res) => {
    console.log(this.constructor.name, 'assetList', JSON.stringify(req.body, null, 2))
    const request = req.body
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetListPromise(user, request) || []
      res.send({ version: VERSION, data })
    } catch (error) { 
      res.send({ version: VERSION, error: errorObjectCaught(error) })
    }    
  }

  private assetListPromise = (user_id: string, request: DataAssetListRequest): Promise<AssetObjects | undefined> => {
    return this.clientPromise.then(client => {
      const { partial, type = [], source = [], order = { created: 'ASC' }, terms } = request
      const columns = partial ? DataServerColumns : DataServerColumnsDefault
      const types = arrayFromOneOrMore(type)
      const sources = arrayFromOneOrMore(source)
      const phrases = [`SELECT ${columns.join(', ')} FROM assets WHERE user_id = $1`]
      const values = [user_id]
      const { length: typeCount } = types
      // console.log(this.constructor.name, 'assetListPromise', { columns, types, sources, typeCount, terms, order, values})
      if (typeCount) {
        const subs = substitions(typeCount, 1 + phrases.length)
        phrases.push(`AND type IN (${subs})`)
        values.push(...types)
      }
      const { length: sourceCount } = sources
      if (sourceCount) {
        const subs = substitions(sourceCount, 1 + phrases.length)
        phrases.push(`AND source IN (${subs})`)
        values.push(...sources)
      }
      if (terms) {
        const likes = terms.split(' ').map((term, index) => {
          values.push(`%${term}%`)
          return `label LIKE $${index + 1 + phrases.length}`
        })
        phrases.push(`AND (${likes.join(' OR ')})`)
      }
      if (order) {
        const orders = arrayFromOneOrMore(order).map((orRecord, index) => {
          const record = isString(orRecord) ? { [orRecord]: 'DESC' } : orRecord
          const [column, direction] = Object.entries(record)[0]
          if (!AssetOrderColumns.includes(column as AssetColumn)) return ''

          return `${column} ${direction}`
        }).filter(Boolean)
        if (orders.length) {
          phrases.push(`ORDER BY ${orders.join(', ')}`)
        }
      }
      const text = phrases.join(' ')
      // console.log(this.constructor.name, 'assetListPromise', text, ...values)
      // console.log(this.constructor.name, 'assetListPromise', text, values)
      return client.query(text, values).then(result => {
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
    })
  }

  private assetPut: ExpressHandler<VersionedDataOrError<string>, DataAssetPutRequest> = async (req, res) => {
    console.log(this.constructor.name, 'assetPut', JSON.stringify(req.body, null, 2))
    const { assetObject } = req.body
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetPutPromise(user, assetObject)
      res.send({ version: VERSION, data })
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
    const { assets = [], type, id, label, ...rest } = asset
    const assetIds = assets.map(asset => asset.id)   
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
      // console.log(this.constructor.name, 'assetUpdatePromise', { text, values })
      return client.query(text, values).then(() => (
        this.relationsUpdatePromise(id, assetIds)
      ))
    }).then(EmptyFunction)
  }
  
  private _client?: Client

  private get client() {

    return this._client ||= this.clientInitialize
  }

  private get clientInitialize() {
    const port = ENVIRONMENT.get('MOVIEMASHER_DB_PORT', NUMBER)
    const host = ENVIRONMENT.get('MOVIEMASHER_DB_HOST', STRING)
    const database = ENVIRONMENT.get('MOVIEMASHER_DB_DATABASE', STRING)
    const user = ENVIRONMENT.get('MOVIEMASHER_DB_USERNAME', STRING)
    const password = ENVIRONMENT.get('MOVIEMASHER_DB_PASSWORD', STRING)
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
    if (_client && connected) return Promise.resolve(_client)

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
        WHERE asset_assets.owner_id = $1
      `
      // console.log(this.constructor.name, 'relatedAssetsPromise', query, owner)
      return client.query(query, [owner]).then(result => {   
        const { rows } = result
        // console.log(this.constructor.name, 'relatedAssetsPromise', ...rows)
        return AssetRowsFromRaw(rows)
      })
    })
  }

  private relationDeletePromise(ids: Strings): Promise<void> {
    return this.clientPromise.then(client => {
      const query = 'DELETE FROM asset_assets WHERE id IN($1)'
      // console.log(this.constructor.name, 'relationDeletePromise', query, ...ids)
      return client.query(query, [ids]).then(EmptyFunction) 
    })
  }

  private relationInsertPromise(owner_id: string, asset_id: string): Promise<void> {
    return this.clientPromise.then(client => {
      const id = idUnique()
      const query = 'INSERT INTO asset_assets (id, owner_id, asset_id) VALUES ($1, $2, $3)'
      // console.log(this.constructor.name, 'relationInsertPromise', id, query, owner_id, asset_id)
      return client.query(query, [id, owner_id, asset_id]).then(EmptyFunction)
    })
  }

  private relationsPromise(id: string, column = 'owner_id'): Promise<AssetAssets> {
    return this.clientPromise.then(client => {
      const query = `SELECT * FROM asset_assets WHERE ${column} = $1`
      // console.log(this.constructor.name, 'relationsPromise', query, id)

      return client.query(query, [id]).then(result => {
        const { rows } = result
        // console.log(this.constructor.name, 'relationsPromise', rows)

        return rows
      })
    })
  }

  private relationsUpdatePromise(owner: string, ids: Strings): Promise<void> {
    return this.relationsPromise(owner).then(rows => {
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
        default: return Promise.all(promises).then(EmptyFunction)
      }     
    }).then(EmptyFunction)
  }

  startServer(app: Application): Promise<void> {
    return super.startServer(app).then(() => {
      console.debug(this.constructor.name, 'startServer')
      app.get(Endpoints.asset.default, this.assetDefault)
      app.post(Endpoints.asset.delete, this.assetDelete)
      app.post(Endpoints.asset.get, this.assetGet)
      app.get(Endpoints.asset.list, this.assetList)
      app.post(Endpoints.asset.put, this.assetPut)
    })
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

