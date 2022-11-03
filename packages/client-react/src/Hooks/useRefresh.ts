import React from "react"


export const useRefresh = (): [(...args: any[]) => void, number] => {
  const [nonce, setNonce] = React.useState(0)
  const updateNonce = () => { setNonce(new Date().valueOf()) }
  return [updateNonce, nonce]
}