import { Factory } from "../Definitions/Factory"
import { DefinitionTypes } from "../Setup/Enums"

DefinitionTypes.forEach(type => { Factory[type].initialize() })
