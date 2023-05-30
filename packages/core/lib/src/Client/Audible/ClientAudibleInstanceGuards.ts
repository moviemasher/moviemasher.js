import { isAudibleInstance } from "../../Shared/Audible/AudibleGuards.js";
import { isClientInstance } from "../ClientGuards.js";
import { ClientAudibleInstance } from "../ClientTypes.js";

export const isClientAudibleInstance = (value: any): value is ClientAudibleInstance => (
  isClientInstance(value) && isAudibleInstance(value)
)

