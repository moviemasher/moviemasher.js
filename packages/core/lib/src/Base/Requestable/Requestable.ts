import { UnknownRecord } from "../../Types/Core"
import { LoadType } from "../../Setup/LoadType"
import { Identified } from "../Identified"
import { Propertied } from "../Propertied"
import { Typed } from "../Typed"
import { Request } from "../../Helpers/Request/Request"

export interface RequestableObject extends UnknownRecord, Identified, Partial<Typed> {
  createdAt?: string
  request?: Request
  kind?: string
}

export interface Requestable extends Propertied, Identified, Typed {
  request: Request
  createdAt: string
  loadType: LoadType
  kind: string
}

