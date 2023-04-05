import type { ClientMediaType } from './ClientMedia.js'

import { TypesEncoding } from '../../Plugin/Encode/Encoding/Encoding.js'
import { TypeFont } from '../../Setup/Enums.js'

export type ClientMediaTypes = ClientMediaType[]
export const ClientMediaTypes: ClientMediaTypes  = [...TypesEncoding, TypeFont]
