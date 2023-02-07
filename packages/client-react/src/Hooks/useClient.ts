import React from "react"
import { Client } from "@moviemasher/client-core"
import { ClientContext } from "../Contexts/ClientContext"

export const useClient = (): Client => React.useContext(ClientContext).client!
