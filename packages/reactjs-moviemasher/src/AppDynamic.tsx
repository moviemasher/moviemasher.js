import React from 'react'
import { View } from './View'

interface AppDynamicObject {
  className ? : string
}

const AppDynamicClassName = 'moviemasher-app-dynamic'

const AppDynamic : React.FC<AppDynamicObject> = (props) => {

  const { className } = props

  const name = className || AppDynamicClassName

  return <View className={name} />
}

export { AppDynamic, AppDynamicObject }
