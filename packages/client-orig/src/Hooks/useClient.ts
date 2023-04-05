import type { Client } from "@moviemasher/client-core"

import React from "react"

import { ClientContext } from "../Contexts/ClientContext"

export const useClient = (): Client => React.useContext(ClientContext).client!
