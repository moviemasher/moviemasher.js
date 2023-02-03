import { UnknownObject } from '../../declarations'
import { assertPopulatedString } from '../../Utility/Is'
import { Requestable, RequestableObject } from './Requestable'
import { RequestObject } from '../../Api/Api'

export class RequestableClass implements Requestable {
  constructor(object: RequestableObject) {
    const { id, request } = object 
    assertPopulatedString(id)

    this.id = id
    if (request) this.request = request
  }

  id: string
  request: RequestObject = { endpoint: {} }

  toJSON(): UnknownObject {
    const { id, request } = this
    return { id, request }
  }
}