import React from "react"
import { Definition } from "@moviemasher/moviemasher.js"
import { DefinitionContext } from "../Contexts/DefinitionContext"

export const useDefinition = (): Definition => React.useContext(DefinitionContext).definition!
