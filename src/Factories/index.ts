import { Factory } from "../Factory"
import { DefinitionTypes } from "../Setup/Enums"

DefinitionTypes.forEach(type => { Factory[type].initialize() })
