import React from 'react'
import { ClassButton, ClipType, TrackType } from '@moviemasher/lib-core'

import { PropsMethod, PropsWithoutChild } from "../../Types/Props"
import { Bar } from '../../Utilities/Bar'
import { InspectorProperties } from './InspectorProperties'
import { InspectorContent } from './InspectorContent'
import { InspectorProps } from './Inspector'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { InspectorPicked } from './InspectorPicked'
import { InspectorPicker } from './InspectorPicker'
import { EditorRemoveButton } from '../Controls/EditorRemoveButton'
import { EncodeControl } from '../Controls/EncodeControl'
import { ViewControl } from '../Controls/ViewControl'
import { View } from '../../Utilities/View'
import { EditorUndoButton } from '../Controls/EditorUndoButton'
import { EditorRedoButton } from '../Controls/EditorRedoButton'
import TranslationSpan from '../Translation/TranslationSpan/TranslationSpan.lite'

export interface InspectorPropsDefault extends PanelOptions, PropsWithoutChild {}

export const InspectorDefaultProps: PropsMethod<InspectorPropsDefault, InspectorProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  // optionsStrict.props.key ||= 'inspector'
  optionsStrict.props.className ||= 'panel inspector'

  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.inspector} />,
    <EditorUndoButton key='undo' button={true} label='undo'>
      {icons.undo}
    </EditorUndoButton>,
    <EditorRedoButton key='redo' button={true} label='redo'>
      {icons.redo}
    </EditorRedoButton>,
  ]
 
  optionsStrict.footer.content ||= [
    <InspectorPicker key="mash" className={ClassButton} id="mash">
      {icons.mash}
    </InspectorPicker>,
    <InspectorPicker key="clip" className={ClassButton} id="clip">
      {icons.clip}
    </InspectorPicker>,
    <InspectorPicker key="container" className={ClassButton} id="container">
      {icons.container}
    </InspectorPicker>,
    <InspectorPicker key="content" className={ClassButton} id="content">
      {icons.content}
    </InspectorPicker>,
 ]

  const contentChildren = [<InspectorProperties key="properties" />]
  const types = [ClipType, TrackType]

  contentChildren.push(
    <InspectorPicked type="mash" key="inspector-mash">
      <View>
        <EncodeControl button={true} key='render-process'>
          <TranslationSpan id='render' />
          {icons.endcode}
        </EncodeControl>
        <ViewControl button={true} key='view-control'>
          <TranslationSpan id="view" />
          {icons.view}
        </ViewControl>    
      </View>  
    </InspectorPicked>
  )

  types.forEach(type => {
    contentChildren.push(
      <InspectorPicked key={`${type}-delete`} type={type}>
        <EditorRemoveButton button={true} type={type}>
          <TranslationSpan id="delete" values={{ type }} />
          {icons.remove}
        </EditorRemoveButton>
      </InspectorPicked>
    )
  })
  
  optionsStrict.content.children ||= <>{contentChildren}</>

  const children = <>
    <Bar key='head' {...optionsStrict.header} />
    <InspectorContent key='content' {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </InspectorContent>
    <Bar key='foot' {...optionsStrict.footer} />
  </>
  return { 
    key: 'inspector',
    ...optionsStrict.props, children 
  }
}
