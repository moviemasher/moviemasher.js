import { UnknownRecord } from '../../declarations'
import { ClientMediaOrError, LoadedMedia } from "../../Load/Loaded"
import { isObject, isPopulatedString } from '../../Utility/Is'
import { Requestable, RequestableObject } from './Requestable'
import { isRequestObject, RequestObject } from '../../Api/Api'
import { assertLoadType, ImageType, LoadType, SequenceType } from '../../Setup/Enums'
import { PropertiedClass } from '../Propertied'
import { requestMediaPromise } from '../../Utility/Request'
import { assertClientMedia } from '../../Load/Loader'

export class RequestableClass extends PropertiedClass implements Requestable {
  constructor(object: RequestableObject) {
    super()
    const { id, type, kind, createdAt, request, loadedMedia } = object 
    this.id = id
    if (isPopulatedString(type)) this.type = type
    if (isPopulatedString(createdAt)) this.createdAt = createdAt
    if (isPopulatedString(kind)) this.kind = kind
    if (isRequestObject(request)) this.request = request
    if (isObject(loadedMedia)) this.loadedMedia
  }

  createdAt = ''

  id: string

  kind = ''

  get loadType(): LoadType { 
    const { type } = this
    console.log(this.constructor.name, "loadType", type)
    if (type === SequenceType) return ImageType

    assertLoadType(type)

    return type
  }

  loadedMedia?: LoadedMedia

  get loadedMediaPromise(): Promise<ClientMediaOrError> {
    const { loadedMedia } = this
    if (loadedMedia) return Promise.resolve({ clientMedia: loadedMedia })

    const { request, loadType } = this
    
    console.log(this.constructor.name, 'loadedMediaPromise...', loadType, request)
    return requestMediaPromise(request, loadType).then(orError => {
      if (orError.error) return orError
      const { clientMedia } = orError
      assertClientMedia(clientMedia)
      console.log(this.constructor.name, 'loadedMediaPromise!', loadType, request, clientMedia?.constructor.name)

      this.loadedMedia = clientMedia
      return { clientMedia }
    })
  }

  request: RequestObject = { endpoint: {} }

  type: string = ''

  toJSON(): UnknownRecord {
    const { id, type, kind, createdAt, request } = this
    return { id, request, type, kind, createdAt }
  }
}