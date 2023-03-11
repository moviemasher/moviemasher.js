import { DotChar, IdPrefix } from "../../../Setup/Constants"
import { assertMediaType, MediaType, isMediaType } from "../../../Setup/MediaType"
import { assertPopulatedString, isArray } from "../../../Utility/Is"
import { Media, MediaObject, MediaObjects, MediaArray } from "../../Media"
import { mediaDefinition } from "../../MediaFactory"
import { MediaDefaults } from "../../MediaDefaults"
import { assertMedia, assertMediaObject } from "../../MediaFunctions"

const counters = {
  count: 0
}

export class MediaCollection {
  constructor() {
    counters.count++
    this.id = counters.count
    // console.log(this.constructor.name, this.id, 'constructor')
  }
  id = 0
  byId = new Map<string, Media>()

  private byIdAdd(media: Media | MediaArray) {
    const mediaArray = Array.isArray(media) ? media : [media]
    mediaArray.forEach(media => {
      console.log(this.constructor.name, this.id, 'byIdAdd', media.id, ...this.byId.keys())

      this.byId.set(media.id, media)
    })
  }

  byType(type: MediaType): MediaArray {
    const list = this.mediaArraysByType.get(type)
    if (list) return list

    const definitions = MediaDefaults[type]
    this.mediaArraysByType.set(type, definitions)
    return definitions
  }

  define(media: MediaObject | MediaObjects) : MediaArray {
    const mediaArray = isArray(media) ? media : [media]

    return mediaArray.map(object => this.fromObject(object))
  }

  private deleteFromArray(media: Media): void {
    const { type, id } = media
    const mediaArray = this.byType(type)
    const index = mediaArray.findIndex(media => id === media.id)
    // console.log(this.constructor.name, this.id, "definitionDelete", type, id, index)
    if (index < 0) return

    mediaArray.splice(index, 1)
  }

  fromId(id: string): Media {
    if (this.installed(id)) return this.byId.get(id)!

    const mediaType = this.mediaTypeFromId(id)
    assertMediaType(mediaType, `in MediaCollection.fromId('${id}')`)

    const found = this.byType(mediaType).find(media => media.id === id)
    assertMedia(found, id)
    return found
  }

  fromObject(object: MediaObject): Media {
    assertMediaObject(object)

    const { id, type } = object
    assertPopulatedString(id)

    if (this.installed(id) || this.predefined(id)) return this.fromId(id)

    const mediaType = type || this.mediaTypeFromId(id)
    assertMediaType(mediaType, 'type')

    object.type ||= mediaType
    return this.media(object)
  }

  get ids(): string[] { return [...this.byId.keys()] }

  install(media: Media | MediaArray): MediaArray {
    const mediaArray = isArray(media) ? media : [media]
    return mediaArray.map(media => {
        const { type, id } = media
      // console.log(this.constructor.name, this.id, "install", media.label)

      if (this.installed(id) || this.predefined(id)) return this.fromId(id)
      
      this.byIdAdd(media)
      this.byType(type).push(media)
      return media
    })
  }

  installed(id: string): boolean { 
    return this.byId.has(id)
  }

  media(object: MediaObject): Media {
    const { type } = object
    assertMediaType(type)

    return mediaDefinition(object)
  }

  private mediaArraysByType = new Map<MediaType, MediaArray>()

  private mediaTypeFromId(id: string): MediaType | undefined {
    const bits = id.split(DotChar)
    const penultimate = bits.slice(-2)
    const type = penultimate.shift()
    const is = isMediaType(type) ? type : undefined
    if (!is) console.log(this.constructor.name, this.id, "mediaTypeFromId", id, type, bits, penultimate)
    return is
  }

  predefined(id: string) { 
    if (id.startsWith(IdPrefix)) return true

    const mediaType = this.mediaTypeFromId(id)
    if (!mediaType) return false

    const array = this.byType(mediaType)
    return array.some(media => media.id === id)
  }

  undefineAll() {
    // console.log(this.constructor.name, this.id, "undefineAll")
    // TODO: be more graceful - tell definitions they are being destroyed...
    this.byId = new Map<string, Media>()
    this.mediaArraysByType = new Map<MediaType, MediaArray>()
  }

  updateDefinition(oldDefinition: Media, newDefinition: Media): Media {
    // console.log(this.constructor.name, this.id, "updateDefinition", oldDefinition.type, oldDefinition.id, "->", newDefinition.type, newDefinition.id)

    this.uninstall(oldDefinition)
    this.install(newDefinition)
    return newDefinition
  }

  updateDefinitionId(oldId: string, newId: string) {
    // console.log(this.constructor.name, this.id, "updateDefinitionId", oldId, "->", newId)

    const media = this.byId.get(oldId)
    assertMedia(media, 'media')

    this.byId.delete(oldId)
    this.byId.set(newId, media)
  }

  uninstall(media: Media) {
    this.deleteFromArray(media)
    const { id } = media
    this.byId.delete(id)
    return media
  }
  
}