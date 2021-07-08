import { MovieMasher } from "../MovieMasher";
import { DefinitionTypes } from "../Setup";
DefinitionTypes.forEach(type => {
  // console.log("initializing!", type)
  MovieMasher[type].initialize()
})
