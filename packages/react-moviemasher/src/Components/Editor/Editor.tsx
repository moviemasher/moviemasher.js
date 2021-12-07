import React from 'react'
import { Mash, MashFactory, urlForRemoteServer } from '@moviemasher/moviemasher.js'

import { EditorContext, EditorContextDefault } from '../../Contexts/EditorContext'
import { HostsContext } from '../../Contexts/HostsContext'
import { View } from '../../Utilities/View'

interface EditorProps {
  mash?: Mash
  className?: string
}

const Editor: React.FunctionComponent<EditorProps> = (props) => {
  const hostsContext = React.useContext(HostsContext)
  const [requested, setRequested] = React.useState(false)

  const { mash, ...rest } = props
  const { enabled, remoteServerPromise } = hostsContext
  const { masher } = EditorContextDefault


  React.useEffect(() => {
    if (mash) masher.mash = mash
    else if (!requested) {
      if (!enabled.includes('cms')) return

      setRequested(true)
      remoteServerPromise('cms').then(remoteServer => {
        const urlString = urlForRemoteServer(remoteServer, '/mash')
        console.debug("GET request", urlString)
        fetch(urlString).then(response => response.json()).then((json) => {
          console.debug("GET response", urlString, json)
          masher.mash = MashFactory.instance(json)
        })
      })
    }
  }, [enabled])

  return (
    <EditorContext.Provider value={EditorContextDefault}>
      <View {...rest} />
    </EditorContext.Provider>
  )
}

export { Editor }
