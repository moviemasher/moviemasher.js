import React from "react"
import { Media } from "@moviemasher/moviemasher.js"
import { DefinitionContext } from "../../Contexts/DefinitionContext"

export const useDefinition = (): Media => React.useContext(DefinitionContext).definition!
