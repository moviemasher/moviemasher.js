import React from "react"
import { ReactResult, PropsWithChildren } from "../../declarations"
import { ApiContext } from "./ApiContext"

export function ApiEnabled(props: PropsWithChildren): ReactResult {
  const apiContext = React.useContext(ApiContext)
  const { enabled } = apiContext
  if (!enabled) return null

  return <>{props.children}</>
}