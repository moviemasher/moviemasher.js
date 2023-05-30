import type { ClientMediaType } from './ClientMedia.js'

import { TypeFont } from "../../Setup/EnumConstantsAndFunctions.js"
import { TypesAsset } from '@moviemasher/runtime-shared'

export type TypesClientMedia = ClientMediaType[]
export const ClientMediaTypes: TypesClientMedia  = [...TypesAsset, TypeFont]
