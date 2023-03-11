import React from "react"


import { PropsAndChild } from "../../Types/Props"
import MasherContext from "../Masher/MasherContext"
import { useClient } from "../../Hooks/useClient"
import { CurrentIndex, NextIndex } from "@moviemasher/moviemasher.js"
import { useContext } from "../../Framework/FrameworkFunctions"
import { ImportOperation } from "@moviemasher/client-core"

const BrowserControlId = 'upload-control-id'

export function BrowserControl(props: PropsAndChild) {
  const client = useClient()
  const masherContext = useContext(MasherContext)
  const { drop } = masherContext

  if (!client.enabled(ImportOperation)) {
    console.log('BrowserControl disabled', ImportOperation)
    return null
  }

  return <label 
    key='browser-control'
    htmlFor={BrowserControlId}
  >
    {props.children}
    <input multiple type='file' 
      id={BrowserControlId}
      accept={client.fileAccept}
      onChange={ event => {
        const { files } = event.currentTarget
        if (files) drop(files, { clip: CurrentIndex, track: NextIndex})
        //.then(media => masher.mashMedia!.media.install(media))
      } }
      key={'browser-control-input'}
    />
  </label>
}
