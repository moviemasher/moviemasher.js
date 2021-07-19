import React from 'react'
import { View } from '../View'

interface InspectorObject {
}

const Inspector : React.FC<InspectorObject> = (_props) => {


  return <View className='moviemasher-panel moviemasher-inspector' />
}

export { Inspector, InspectorObject }
