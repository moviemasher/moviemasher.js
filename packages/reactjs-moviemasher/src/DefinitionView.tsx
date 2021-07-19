
import React from 'react';
import { Definition  } from "@moviemasher/moviemasher.js"
import { View } from './View'

interface DefinitionViewObject {
  definition: Definition
}

const DefinitionView : React.FC<DefinitionViewObject> = (props) => {
  const { definition } = props

  return <View className='moviemasher-definition'>
    {definition.label}
  </View>
}

export { DefinitionView, DefinitionViewObject }
