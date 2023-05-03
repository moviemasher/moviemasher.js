import type { ClientMediaType } from './ClientMedia.js'

import { TypesEncoding } from '../../Plugin/Encode/Encoding/Encoding.js'
import { TypeFont } from '../../Setup/Enums.js'

export type TypesClientMedia = ClientMediaType[]
export const ClientMediaTypes: TypesClientMedia  = [...TypesEncoding, TypeFont]
