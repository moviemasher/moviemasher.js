import type { AssetObject, AssetObjects, AssetType, Identified, Labeled, PotentialError, Sourced, Strings, Typed } from '@moviemasher/runtime-shared'
import type { Client } from 'pg'
import type { DataDefinitionDeleteRequest, DataDefinitionDeleteResponse, DataDefinitionGetRequest, DataDefinitionGetResponse, DataDefinitionPutRequest, DataDefinitionPutResponse, DataDefinitionRetrieveRequest, DataDefinitionRetrieveResponse, DataMashDefaultRequest, DataMashDefaultResponse } from '../../Api/Data.js'
import type { HostServers } from '../../Host/Host.js'
import type { ExpressHandler } from '../Server.js'
import type { DataServer, DataServerArgs } from './DataServer.js'

import { RuntimeEnvironment } from '@moviemasher/lib-server'
import { EmptyFunction, arrayOfNumbers, colorBlue, idIsTemporary, idTemporary, stringPluralize } from '@moviemasher/lib-shared'
import { ERROR, SIZE_OUTPUT, TypeMash, NUMBER, STRING, VIDEO, arrayFromOneOrMore, errorCaught, errorName, isString } from '@moviemasher/runtime-shared'
import Express from 'express'
import pg from 'pg'
import { Endpoints } from '../../Api/Endpoints.js'
import { idUnique } from '../../Utilities/Id.js'
import { ServerClass } from '../ServerClass.js'

const { Client: ClientClass } = pg

type AssetColumn = 'id' | 'label' | 'type' | 'source' | 'created' | 'deleted' | 'user_id' | 'rest'

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

export class DataServerClass extends ServerClass implements DataServer {
  constructor(public args: DataServerArgs) { super(args) }

  private assetDefault: ExpressHandler<DataMashDefaultResponse | PotentialError, DataMashDefaultRequest> = async (req, res) => {
    const { width, height } = SIZE_OUTPUT

    const response: DataMashDefaultResponse = { 
      data: { 
        aspectHeight: height, aspectWidth: width,
        aspectShortest: Math.min(width, height),
        color: colorBlue,
        type: VIDEO, source: TypeMash, id: idTemporary(), assets: [] 
      } 
    }
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetDefaultPromise(user)
      if (data) response.data = data
    } catch (error) { response.error = errorCaught(error).error }
    console.log('assetDefault', response)
    res.send(response)
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
      console.log(this.constructor.name, 'assetDefaultPromise', text, { user, text })
      return client.query(text, [user, TypeMash]).then(result => {
        const [row] = result.rows
        if (!row) return 

        const asset = AssetRowFromRaw(row)
        const { id } = asset
        return this.relatedAssetsPromise(id).then(assets => ({ ...asset, assets }))
      })
    })
  }

  private assetDelete: ExpressHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionDeleteResponse = {}
    try {
      const user = this.userFromRequest(req)
      const existing = await this.userAssetExists(user, id)
      if (existing) {
        const rows = await this.relationsPromise(id, 'asset_id')
      
        if (rows.length) {
          response.mashIds = rows.map(row => row.owner_id)
          response.error = errorName(ERROR.Reference, `Referenced by ${stringPluralize(rows.length, 'asset')}`)
        } else {
          await this.relationsUpdatePromise(id, [])
          await this.assetDeletePromise(id)
        }
      }
      else response.error = errorName(ERROR.Reference, `Could not find Asset with ID: ${id}`)
    } catch (error) { response.error = errorCaught(error).error }

    res.send(response)
  }

  private assetDeletePromise(id: string): Promise<void> {
    return this.clientPromise.then(client => {
      const text = `UPDATE assets SET deleted = $1 WHERE id = $2`
      return client.query(text, [DataServerNow(), id])
    }).then(EmptyFunction)
  }

  private assetGet: ExpressHandler<DataDefinitionGetResponse, DataDefinitionGetRequest> = async (req, res) => {
    const { id } = req.body
    const response: DataDefinitionGetResponse = {  }
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetGetPromise(user, id)
      if (data) response.data = data
      else {
        response.error = errorName(ERROR.Reference, `No asset with ID ${id}`)
      }  
    } catch (error) { response.error = errorCaught(error).error }
    res.send(response)
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

  private assetList: ExpressHandler<DataDefinitionRetrieveResponse | PotentialError, DataDefinitionRetrieveRequest> = async (req, res) => {
    console.log(this.constructor.name, 'assetList', JSON.stringify(req.body, null, 2))
    const request = req.body
    const response: DataDefinitionRetrieveResponse = { data: [] }
    try {
      const user = this.userFromRequest(req)
      const data = await this.assetListPromise(user, request)
      if (data) response.data = data
    } catch (error) { response.error = errorCaught(error).error }
    console.log('assetList', response)
    res.send(response)
  }

  private assetListPromise = (user_id: string, request: DataDefinitionRetrieveRequest): Promise<AssetObjects | undefined> => {
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
      console.log(this.constructor.name, 'assetListPromise', text, ...values)
      // console.log(this.constructor.name, 'assetListPromise', text, values)
      return client.query(text, values).then(result => {
        const { rows } = result
        const { length } = rows
        console.log(this.constructor.name, 'assetListPromise', { length })
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

  private assetPut: ExpressHandler<DataDefinitionPutResponse | PotentialError, DataDefinitionPutRequest> = async (req, res) => {
  console.log(this.constructor.name, 'assetPut', JSON.stringify(req.body, null, 2))
   const { asset } = req.body
    const response: DataDefinitionPutResponse = { id: '' }
    try {
      const user = this.userFromRequest(req)
      response.id = await this.assetPutPromise(user, asset)
    } catch (error) { response.error = errorCaught(error).error }
    console.log('assetPut', response)
    res.send(response)
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
      console.log(this.constructor.name, 'assetUpdatePromise', { text, values })
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
    const port = RuntimeEnvironment.get('MOVIEMASHER_DB_PORT', NUMBER)
    const host = RuntimeEnvironment.get('MOVIEMASHER_DB_HOST', STRING)
    const database = RuntimeEnvironment.get('MOVIEMASHER_DB_DATABASE', STRING)
    const user = RuntimeEnvironment.get('MOVIEMASHER_DB_USERNAME', STRING)
    const password = RuntimeEnvironment.get('MOVIEMASHER_DB_PASSWORD', STRING)
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
      console.log(this.constructor.name, 'relatedAssetsPromise', query, owner)
      return client.query(query, [owner]).then(result => {   
        const { rows } = result
        console.log(this.constructor.name, 'relatedAssetsPromise', ...rows)
        return AssetRowsFromRaw(rows)
      })
    })
  }

  private relationDeletePromise(ids: Strings): Promise<void> {
    return this.clientPromise.then(client => {
      const query = 'DELETE FROM asset_assets WHERE id IN($1)'
      console.log(this.constructor.name, 'relationDeletePromise', query, ...ids)
      return client.query(query, [ids]).then(EmptyFunction) 
    })
  }

  private relationInsertPromise(owner_id: string, asset_id: string): Promise<void> {
    return this.clientPromise.then(client => {
      const id = idUnique()
      const query = 'INSERT INTO asset_assets (id, owner_id, asset_id) VALUES ($1, $2, $3)'
      console.log(this.constructor.name, 'relationInsertPromise', id, query, owner_id, asset_id)
      return client.query(query, [id, owner_id, asset_id]).then(EmptyFunction)
    })
  }

  private relationsPromise(id: string, column = 'owner_id'): Promise<AssetAssets> {
    return this.clientPromise.then(client => {
      const query = `SELECT * FROM asset_assets WHERE ${column} = $1`
      console.log(this.constructor.name, 'relationsPromise', query, id)

      return client.query(query, [id]).then(result => {
        const { rows } = result
        console.log(this.constructor.name, 'relationsPromise', rows)

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

  startServer(app: Express.Application, activeServers: HostServers): Promise<void> {
    return super.startServer(app, activeServers).then(() => {
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



  // deleteMash: ExpressHandler<DataMashDeleteResponse, DataMashDeleteRequest> = async (req, res) => {
  //   const { id } = req.body
  //   const response: DataMashDeleteResponse = {}
  //   try {
  //     const user = this.userFromRequest(req)
  //     const existing = await this.rowExists(id, user)
  //     if (existing) {
  //       // const sql = `SELECT * FROM cast_mash WHERE mashId = ?`

  //       const rows = await this.client.select('*').from('cast_mash').where('mashId', id)

  //       if (rows.length) {
  //         response.castIds = rows.map(row => row.castId)
  //         response.error =errorName(ERROR.Reference, `Referenced by ${stringPluralize(rows.length, 'cast')}`)
  //       } else await this.deletePromise('mash', id)
  //     }
  //     else response.error = errorName(ERROR.Reference, `Could not find Asset with ID: ${id}`)
  //   } catch (error) { response.error = errorCaught(error).error }
  //   res.send(response)
  // }

  // private deletePromise(quotedTable: string, id: string): Promise<void> {
  //   return this.client(quotedTable).where({ id }).del()
  // }

  // fileServer?: FileServer

  // private getMash: ExpressHandler<DataMashGetResponse, DataGetRequest> = async (req, res) => {
  //   const { id } = req.body
  //   const response: DataMashGetResponse = { mash: { type: VIDEO, source: TypeMash, id: idTemporary(), assets: [] } }
  //   try {
  //     const user = this.userFromRequest(req)
  //     const mash = await this.rowJsonPromise('mash', user, id)
  //     if (mash.id !== id) response.error = errorName(ERROR.Reference, `Could not find mash ${id}`)
  //     else {
  //       const assets = await this.assetAssetsPromise(id)
  //       response.mash = { ...mash, assets }
  //     }
  //   } catch (error) { response.error = errorCaught(error).error }
  //   res.send(response)
  // }


  // private mashInsertPromise(user_id: string, mash: MashAssetObject, assetIds?: string[]): Promise<StringRecord> {
  //   const temporaryLookup: StringRecord = {}
  //   const { id } = mash
  //   const temporaryId = id || idUnique()
  //   mash.id = temporaryId

  //   const insertPromise = this.createPromise(RawFromAsset(user_id, mash))
  //   const definitionPromise = insertPromise.then(permanentId =>{
  //     if (permanentId !== temporaryId) temporaryLookup[temporaryId] = permanentId
  //     return this.relationsUpdatePromise(permanentId, assetIds)
  //   })
  //   return definitionPromise.then(() => temporaryLookup)
  // }




  // private mashUpdatePromise(user_id: string, mash: MashAssetObject, assetIds?: string[]): Promise<StringRecord> {
  //   const { id, label, ...rest } = mash
  //   if (!id) return Promise.reject(401)

  //   const json = JSON.stringify(rest)
  //   const data = { user_id, id, label, json }
  //   return this.updatePromise('mash', data).then(() =>
  //     this.mashUpdateRelationsPromise(id, assetIds)
  //   )
  // }
  // private putMash: ExpressHandler<DataMashPutResponse | PotentialError, DataMashPutRequest> = async (req, res) => {
  //   const { mash, assetIds } = req.body
  //   // console.log(this.constructor.name, Endpoints.mash.put, JSON.stringify(mash, null, 2))
  //   const response: DataMashPutResponse = {}

  //   try {
  //     const user = this.userFromRequest(req)
  //     response.temporaryIdLookup = await this.writeMashPromise(user, mash, assetIds)
  //   } catch (error) { response.error = errorCaught(error).error }
  //   res.send(response)
  // }

  // renderingServer?: RenderingServer

  // private listMash: ExpressHandler<DataRetrieveResponse | PotentialError, DataMashRetrieveRequest> = async (req, res) => {
  //   const { partial } = req.body
  //   const response: DataRetrieveResponse = { described: [] }
  //   try {
  //     const user = this.userFromRequest(req)
  //     const columns = partial ? DataServerColumns : DataServerColumnsDefault
  //     response.described = await this.selectMashesPromise(user, columns)
  //   } catch (error) { response.error = errorCaught(error).error }
  //   res.send(response)
  // }

  // private selectMashesPromise(user_id: string, columns = DataServerColumnsDefault): Promise<DescribedObject[]> {
  //   const qualified = columns.map(column => `mash.${column}`)
  //   console.log(this.constructor.name, 'selectMashesPromise', user_id, columns)

  //   return this.client
  //     .select(qualified)
  //     .from('mash')
  //     .leftJoin('cast_mash', 'cast_mash.mashId', '=', 'mash.id')
  //     .whereNull('cast_mash.mashId')
  //     .where({ user_id })
  //     .then(AssetRowsFromRaw)
  // }


  // private getMedia: ExpressHandler<DataRetrieveResponse | PotentialError, DataMashRetrieveRequest> = async (req, res) => {
  //   const { partial } = req.body
  //   const { mediaKeys } = this

  //   req.params
  //   const response: DataRetrieveResponse = { described: [] }
  //   try {
  //     const user = this.userFromRequest(req)
  //     const columns = partial ? DataServerColumns : DataServerColumnsDefault
  //     response.described = await this.selectMashesPromise(user, columns)
  //   } catch (error) { response.error = errorCaught(error).error }
  //   res.send(response)
  // }

  // private _mediaKeys?: string[]
  // private get mediaKeys(): string[] {
  //   return this._mediaKeys ||= this.mediaKeysInitialize
  // }
  // private get mediaKeysInitialize(): string[] {
  //   const columnOwner = RuntimeEnvironment.get(EnvironmentKeyAppColumnOwner)
  //   const columnSource = RuntimeEnvironment.get(EnvironmentKeyAppColumnSource)
        
  //   return [...DataServerColumns, columnOwner, columnSource].filter(Boolean)
  // }

  // private updatePromise(quotedTable: string, data: UnknownRecord): Promise<void> {
  //   const { id, ...rest } = data
  //   return this.client(quotedTable).update(rest).where({ id }).then(EmptyFunction)
  // }


  // private writeMashPromise(user_id: string, mash: MashAssetObject, assetIds?: string[]): Promise<StringRecord> {
  //   const { id } = mash
  //   const promiseJson = this.rowJsonPromise('mash', user_id, id)
  //   return promiseJson.then(row => {
  //     if (row) {
  //       return this.mashUpdatePromise(user_id, { ...row, ...mash }, assetIds)
  //     }
  //     return this.mashInsertPromise(user_id, mash, assetIds)
  //   })
  // }