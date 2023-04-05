import React from "react"
import { Media } from "@moviemasher/lib-core"
import { DefinitionContext } from "../../Contexts/DefinitionContext"

export const useDefinition = (): Media => React.useContext(DefinitionContext).definition!
