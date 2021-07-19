import { MovieMasher } from "../MovieMasher"
import { DefinitionTypes } from "../Setup/Enums"

DefinitionTypes.forEach(type => { MovieMasher[type].initialize() })
