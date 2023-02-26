import React from "react"
import { Client } from "@moviemasher/client-core"
import { MasherContext } from "../Components/Masher/MasherContext"

export const useClient = (): Client => React.useContext(MasherContext).client!
