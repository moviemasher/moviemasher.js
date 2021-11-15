import React from 'react'
import { Mash } from '@moviemasher/moviemasher.js'

import { EditorContext, EditorContextDefault } from './EditorContext'
import { View } from '../../Utilities/View'

interface EditorProps { mash?: Mash, className? : string }

const Editor: React.FunctionComponent<EditorProps> = (props) => {
  const { mash, ...rest } = props
  const { masher } = EditorContextDefault

  React.useEffect(() => { if (mash) masher.mash = mash }, [mash])

  return (
    <EditorContext.Provider value={EditorContextDefault}>
      <View {...rest} />
    </EditorContext.Provider>
  )
}

export { Editor }
