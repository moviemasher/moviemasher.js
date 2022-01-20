import express from "express"
import basicAuth from 'express-basic-auth'
import { Database, open } from 'sqlite'
import sqlite3 from 'sqlite3'
import fs from 'fs'
import path from 'path'
const uuid = require('uuid').v4

import {
  ClipObject, Errors, isPositive, MashObject, TrackObject, UnknownObject,
  ContentGetStoreRequest, ContentGetStoreResponse, NumberObject, ContentGetStoredResponse,
  OutputOptions, DefinitionObject, Factory, DefinitionType, Definition, StreamObject, ContentInit,
} from "@moviemasher/moviemasher.js"

import { ContentServerArgs, ContentServerAuthentication, Server } from "../declaration"
const Noop = () => {}
class ContentServer implements Server {
  constructor(args?: ContentServerArgs) {
    if (args) {
      if (args.prefix) this.prefix = args.prefix
      if (args.uploadsUrlPrefix) this.uploadsUrlPrefix = args.uploadsUrlPrefix
      if (args.uploadLimits) this.uploadLimits = args.uploadLimits
      if (args.dbPath) this.dbPath = args.dbPath
      if (args.dbMigrationsPrefix) this.dbMigrationsPrefix = args.dbMigrationsPrefix
      if (args.authentication) this.authentication = args.authentication
    }
  }

  authentication: ContentServerAuthentication = { type: 'http' }

  private _db?: Database

  get db(): Database {
    if (!this._db) throw Errors.internal

    return this._db
  }

  dbMigrationsPrefix = './dev/content/migrations'

  dbPath = './temporary/content.db'

  deleteClip(clipId: string): Promise<void> {
    return this.db.run('DELETE FROM clip WHERE id = ?', clipId).then(Noop)
  }

  deleteTrack(trackId: string): Promise<void> {
    return Promise.all([
      this.db.run('DELETE FROM track WHERE id = ?', trackId),
      this.db.run('DELETE FROM clip WHERE trackId = ?', trackId)
    ]).then(Noop)
  }

  getUserId(table: string, id: string): Promise<string> {
    return this.db.get(`SELECT userId FROM ${table} WHERE id = ?`, id)
      .then(row => row?.userId || '')
  }

  id = 'content'

  init(): ContentInit { return { uuid: uuid() }}

  selectClips(trackId: string, userId: string, select = '*'): Promise<ClipObject[]> {
    const sql = `SELECT ${select} FROM clip WHERE userId = ? AND trackId = ?`
    return this.db.all(sql, userId, trackId).then(rows => {
      return rows.map(row => {
        const { userId, data, ...rest } = row
        if (data) return { ...JSON.parse(data), ...rest }
        return rest
      })
    })
  }

  selectTracks(mashId: string, userId: string, select = '*'): Promise<TrackObject[]> {
    const sql = `SELECT ${select} FROM track WHERE userId = ? AND mashId = ?`
    return this.db.all(sql, userId, mashId).then(rows => {
      return rows.map(row => {
        const { userId, data, ...rest } = row
        if (data) return { ...JSON.parse(data), ...rest }

        return rest
      })
    })
  }

  getLatestId(userId: string, table: string): Promise<string> {
    const sql = `SELECT id FROM ${table} WHERE userId = ? ORDER BY createdAt DESC`
    return this.db.get(sql, userId).then(row => row?.id || '')
  }

  getMedia(userId: string, mediaId: string): Promise<DefinitionObject> {
    const sql = 'SELECT * FROM media WHERE userId = ? AND id = ? ORDER BY createdAt DESC'
    return this.db.get(sql, userId, mediaId).then(row => {
      if (!row) throw Errors.invalid.definition

      const { userId, data, ...rest } = row
      if (data) return { ...JSON.parse(data), ...rest }

      return rest
    })
  }


  getMash(userId: string, mashId: string): Promise<MashObject> {
    return this.rowExists('mash', mashId, userId).then(exists => {
      if (!exists) return {}

      return this.db.get(`SELECT * FROM mash WHERE id = ?`, mashId).then(row => {
        const { userId, createdAt, data, ...rest } = row
        const mashObject: MashObject = data ? { ...JSON.parse(data), ...rest } : rest
        return this.selectTracks(mashId, userId).then(tracks => {
          mashObject.tracks = tracks
          const promises = tracks.map(track => {
            const { id } = track
            if (!id) throw Errors.internal

            return this.selectClips(id, userId).then(clips => { track.clips = clips })
          })
          return Promise.all(promises).then(() => mashObject)
        })
      })
    })
  }

  getStream(userId: string, streamId: string): Promise<StreamObject> {
    return this.rowExists('stream', streamId, userId).then(exists => {
      if (!exists) return {}

      return this.db.get(`SELECT * FROM stream WHERE id = ?`, streamId).then(row => {
        const { userId, createdAt, data, ...rest } = row
        const streamObject: StreamObject = data ? { ...JSON.parse(data), ...rest } : rest
        return streamObject
        // return this.selectTracks(streamId, userId).then(tracks => {
        //   streamObject.tracks = tracks
        //   const promises = tracks.map(track => {
        //     const { id } = track
        //     if (!id) throw Errors.internal

        //     return this.selectClips(id, userId).then(clips => { track.clips = clips })
        //   })
        //   return Promise.all(promises).then(() => streamObject)
        // })
      })
    })
  }

  selectMash(userId: string, mashId?: string): Promise<MashObject> {
    if (mashId) return this.getMash(userId, mashId)

    return this.getLatestId(userId, 'mash').then(mashId => {
      if (mashId) return this.getMash(userId, mashId)

      return {}
    })
  }

  selectStream(userId: string, streamId?: string): Promise<StreamObject> {
    if (streamId) return this.getStream(userId, streamId)

    return this.getLatestId(userId, 'stream').then(mashId => {
      if (mashId) return this.getStream(userId, mashId)

      return {}
    })
  }

  selectMashes(userId: string, select = '*'): Promise<MashObject[]> {
    const sql = `SELECT ${select} FROM mash WHERE userId = ?`
    return this.db.all(sql, userId).then(rows => {
      return rows.map(row => {
        const { data, ...rest } = row
        if (data) return { ...JSON.parse(data), ...rest }
        return rest
      })
    })
  }

  insertClip(clip: ClipObject, userId: string, trackId: string): Promise<void> {
    const { definitionId, type, frame, frames, label, id, ...rest } = clip
    const data = JSON.stringify(rest)
    const sql = `
      INSERT INTO clip
      (definitionId, type, frame, frames, label, data, trackId, userId, id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    return this.db.run(sql, definitionId, type, frame, frames, label, data, trackId, userId, id)
      .then(Noop)
  }

  insertMash(mash: MashObject, userId: string): Promise<void> {
    const { createdAt, tracks, label, backcolor, quantize, id, ...rest } = mash
    if (!id) return Promise.reject(401)

    const data = JSON.stringify(rest)
    const createdAtOrNow = createdAt || (new Date()).toISOString()
    const sql = `
      INSERT INTO mash
      (quantize, label, backcolor, data, userId, createdAt, id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const promises = [
      this.db.run(sql, quantize, label, backcolor, data, userId, createdAtOrNow, id)
        .then(Noop)
    ]
    tracks?.forEach(track => { promises.push(this.writeTrack(track, userId, id)) })
    return Promise.all(promises).then(Noop)
  }

  insertTrack(track: TrackObject, userId: string, mashId: string): Promise<void> {
    const { clips, dense, trackType, layer, id, ...rest } = track
    if (!id) return Promise.reject(401)
    const data = JSON.stringify(rest)
    const sql = `
      INSERT INTO track
      (dense, trackType, layer, data, mashId, userId, id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    const promises = [
      this.db.run(sql, dense, trackType, layer, data, mashId, userId, id)
        .then(Noop)
    ]
    clips?.forEach(clip => { promises.push(this.writeClip(clip, userId, id)) })
    return Promise.all(promises).then(Noop)
  }

  prefix = '/content'

  rowExists(table: string, id: string, userId: string): Promise<boolean> {
    const promise: Promise<boolean> = new Promise((resolve, reject) => {
      this.getUserId(table, id).then(mashUserId => {
        if (mashUserId && mashUserId !== userId) return reject(403)

        return resolve(!!mashUserId)
      })
    })
    return promise
  }

  start(app: express.Application): void {
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true })
    console.log("ContentServer.start opening", this.dbPath)
    open({ filename: this.dbPath, driver: sqlite3.Database }).then(db => {
      this._db = db
      if (this.dbMigrationsPrefix) {
        console.log("ContentServer.start migrating", this.dbMigrationsPrefix)
        this.db.migrate({ migrationsPath: this.dbMigrationsPrefix }).catch(err =>
          console.error("ContentServer.start migration failed", err)
        )
      }
    })

    if (this.authentication.type === 'http') {
      const authorizer = (username: string, password: string): boolean => {
        if (!(username && password)) return false

        if (!this.authentication.password) return true

        return basicAuth.safeCompare(password, this.authentication.password)
      }
      const options: basicAuth.BasicAuthMiddlewareOptions = {
        users: this.authentication.users, authorizer,
        challenge: true, realm: 'moviemashers',
      }
      app.use(`${this.prefix}*`, basicAuth(options), (_req, _res, next) => { next() })
    }

    app.post(`${this.prefix}/mash`, async (req, res) => {
      const { body } = req
      try {
        const user = this.userFromRequest(req)
        const results = await this.writeMash(body, user).then(() => ({ ok: true }))
        res.send(results)
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })


    app.get(`${this.prefix}/stored/:id`, async (req, res) => {
      try {
        const user = this.userFromRequest(req)
        const { id } = req.params
        this.getMedia(user, id).then(media => {

          const { type, source } = media
          if (!(source && type)) throw Errors.internal
          // if (!DefinitionTypes.includes(type)) throw Errors.internal

          const definitionType = type as DefinitionType
          const definition:Definition = Factory[definitionType].definition(media)
          const clip = definition.instance

          const mash: MashObject = {
            tracks: [{ clips : [ clip ]}]
          }

          const definitions: DefinitionObject[] = [media]
          const output: OutputOptions = {}
          const server = {}
          const response: ContentGetStoredResponse = {
            renderRequests: [{ mash, output, server, definitions }]
          }
          res.send(response)
        })
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.post(`${this.prefix}/store`, async (req, res) => {
      const request: ContentGetStoreRequest = req.body
      try {
        const user = this.userFromRequest(req)
        const { size, name, type } = request

        // check that size and type are acceptable
        // create database item
        const extension = path.extname(name)
        const [mediaType] = type.split('/')

        console.log("store", user, request)
        const id = uuid()
        const source = `${this.uploadsUrlPrefix}/${user}/${id}${extension}`
        const data = JSON.stringify({ mime: type })
            const now = (new Date()).toISOString()

        const sql = `
          INSERT INTO media
          (processing, type, source, label, data, userId, id, createdAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
        this.db.run(sql, 1, mediaType, source, name, data, user, id, now).then(() => {
          const response: ContentGetStoreResponse = {
            server: { prefix: `${this.prefix}/upload/${user}/${id}${extension}` },
            method: 'PUT',
            headers: { 'Content-Type': type },
            id
          }

          res.send(response)
        })



      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.delete(`${this.prefix}/:type/:id`, (req, res) => {
      const { id, type } = req.params
      console.log(`DELETE ${this.prefix} ${type} ${id}`)
      res.send({id})
    })

    app.get(`${this.prefix}/mash`, async (req, res) => {
      try {
        const user = this.userFromRequest(req)
        res.send(await this.selectMash(user))
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.get(`${this.prefix}/stream`, async (req, res) => {
      try {
        const user = this.userFromRequest(req)
        res.send(await this.selectStream(user))
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.get(`${this.prefix}/mashes`, async (req, res) => {
      try {
        const user = this.userFromRequest(req)
        res.send(await this.selectMashes(user, 'id, label'))
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })

    app.get(`${this.prefix}/uuid`, (_req, res) => {
      try {
        const results = { uuid: uuid() }
        console.log(`GET ${this.prefix}/uuid`, results)
        res.send(results)
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    })
  }

  stop(): void {
    if (this._db) this.db.close()
  }

  updateClip(clip: ClipObject, __userId: string, __trackId: string): Promise<void> {
    const {
      trackId: _trackId, userId: _userId, definitionId: _definitionId, type: _type,
      frame, frames, label, id, ...rest
    } = clip
    const data = JSON.stringify(rest)
    const sql = `
      UPDATE clip SET
      frame = ?, frames = ?, label = ?, data = ?
      WHERE id = ?
    `
    return this.db.run(sql, frame, frames, label, data, id).then(Noop)
  }

  updateMash(mash: MashObject, userId: string): Promise<void> {
    const { createdAt: _, tracks, label, backcolor, quantize, id, ...rest } = mash
    if (!id) return Promise.reject(401)

    const getPromise = this.selectTracks(id, userId, 'id')
    const updatePromise = getPromise.then(existing => {
      const existingIds = existing.map(row => row.id || '').filter(Boolean)
      const data = JSON.stringify(rest)
      const sql = `
        UPDATE mash SET
        quantize = ?, label = ?, backcolor = ?, data = ?
        WHERE id = ?
      `
      return this.db.run(sql, quantize, label, backcolor, data, id).then(() => existingIds)
    })
    let promise = updatePromise
    const trackIds: string[] = []
    tracks?.forEach(track => {
      if (track.id) trackIds.push(track.id)
      promise = promise.then(existingIds => {
        return this.writeTrack(track, userId, id).then(() => existingIds)
      })
    })

    const deletePromise = promise.then(existingIds => {
      const promises: Promise<void>[] = []
      existingIds.forEach(trackId => {
        if (!trackIds.includes(trackId)) promises.push(this.deleteTrack(trackId))
      })
      switch (promises.length) {
        case 0: return
        case 1: return promises[0].then(Noop)
        default: return Promise.all(promises).then(Noop)
      }
    })
    return deletePromise
  }

  updateTrack(track: TrackObject, userId: string, mashId: string): Promise<void> {
    const { userId: _userId, mashId: _mashId, clips, dense, trackType, layer, id, ...rest } = track
    if (!id) return Promise.reject(401)

    const getPromise = this.selectClips(id, userId, 'id')
    const updatePromise = getPromise.then(existing => {
      const existingIds = existing.map(row => row.id || '').filter(Boolean)
      const data = JSON.stringify(rest)
      const sql = `
        UPDATE track SET
        dense = ?, trackType = ?, layer = ?, data = ?
        WHERE id = ?
      `
      return this.db.run(sql, dense, trackType, layer, data, id).then(() => existingIds)
    })
    const deletePromise = updatePromise.then(existingIds => {
      const promises: Promise<void>[] = []
      clips?.forEach(clip => {
        const { id: clipId = '' } = clip
        promises.push(this.writeClip(clip, userId, id))
        const existingIndex = existingIds.indexOf(clipId)
        if (isPositive(existingIndex)) existingIds.splice(existingIndex, 1)
      })
      existingIds.forEach(clipId => { promises.push(this.deleteClip(clipId))})
      return Promise.all(promises).then(Noop)
    })
    return deletePromise
  }

  uploadLimits: NumberObject = { video: 100, audio: 50, image: 5 }

  uploadsPrefix = "./temporary/uploads"

  uploadsUrlPrefix = "uploads"

  userFromRequest(req: unknown): string {
    const request = <basicAuth.IBasicAuthedRequest> req
    const { user } = request.auth
    return user
  }

  writeClip(clip: ClipObject, userId: string, trackId: string): Promise<void> {
    const { id } = clip
    if (!id) return Promise.reject(401)

    return this.rowExists('clip', id, userId).then(existing => {
      if (existing) {
        return this.updateClip(clip, userId, trackId)
      } else {
        return this.insertClip(clip, userId, trackId)
      }
    })
  }

  writeMash(mash: MashObject, userId: string): Promise<void> {
    const { id } = mash
     if (!id) return Promise.reject(401)

    return this.rowExists('mash', id, userId).then(existing => {
      if (existing) {
        return this.updateMash(mash, userId)
      } else {
        return this.insertMash(mash, userId)
      }
    })
  }

  writeTrack(track: TrackObject, userId: string, mashId: string): Promise<void> {
    const { id } = track
    if (!id) return Promise.reject(401)

    return this.rowExists('track', id, userId).then(existing => {
      if (existing) {
        return this.updateTrack(track, userId, mashId)
      } else {
        return this.insertTrack(track, userId, mashId)
      }
    })
  }
}

export { ContentServer, ContentServerArgs }
