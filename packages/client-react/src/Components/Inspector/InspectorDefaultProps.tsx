import React from 'react'
import { ClassButton, EditType, SelectType } from '@moviemasher/moviemasher.js'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { InspectorProperties } from './InspectorProperties'
import { InspectorContent } from './InspectorContent'
import { InspectorProps } from './Inspector'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { InspectorPicked } from './InspectorPicked'
import { InspectorPicker } from './InspectorPicker'
import { EditorRemoveButton } from '../Controls/EditorRemoveButton'
import { Button } from '../../Utilities/Button'
import { RenderControl } from '../Controls/RenderControl'
import { ViewControl } from '../Controls/ViewControl'
import { View } from '../../Utilities/View'
import { ApiEnabled } from '../ApiClient/ApiEnabled'
import { labelInterpolate, labelTranslate } from '../../Utilities/Label'
import { EditorUndoButton } from '../Controls/EditorUndoButton'
import { EditorRedoButton } from '../Controls/EditorRedoButton'
import { Mashing } from '../Masher/Mashing'

export interface InspectorPropsDefault extends PanelOptions, PropsWithoutChild {}

export const InspectorDefaultProps: PropsMethod<InspectorPropsDefault, InspectorProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict
  optionsStrict.props.key ||= 'inspector'
  optionsStrict.props.className ||= 'panel inspector'

  optionsStrict.header.content ||= [
    <View key="panel-icon" children={icons.inspector} />,
    <EditorUndoButton key='undo'>
      <Button>{icons.undo}{labelTranslate('undo')}</Button>
    </EditorUndoButton>,
    <EditorRedoButton key='redo'>
      <Button>{icons.redo}{labelTranslate('redo')}</Button>
    </EditorRedoButton>,
  ]
 
  optionsStrict.footer.content ||= [
    <InspectorPicker key="cast" className={ClassButton} id="cast">
      {icons.broadcaster}
    </InspectorPicker>,
    <InspectorPicker key="layer" className={ClassButton} id="layer">
      {icons.composer}
    </InspectorPicker>,
    <InspectorPicker key="mash" className={ClassButton} id="mash">
      {icons.mmTube}
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
  const types = [SelectType.Clip, SelectType.Track, SelectType.Layer]

  contentChildren.push(
    <ApiEnabled key="api-enabled">
      <Mashing editType={EditType.Mash}>
        <InspectorPicked type="mash" key="inspector-mash">
          <View>
            <RenderControl key='render-process'>
              <Button>
                {labelTranslate('render')} 
                {icons.render}
              </Button>
            </RenderControl>
            <ViewControl key='view-control'>
              <Button>
                {labelTranslate('view')} 
                {icons.view}
              </Button>
            </ViewControl>    
          </View>  
        </InspectorPicked>
      </Mashing>
    </ApiEnabled>
  )

  types.forEach(type => {
    contentChildren.push(
      <InspectorPicked key={`${type}-delete`} type={type}>
        <EditorRemoveButton type={type}>
          <Button>
            {labelInterpolate('delete', { type })}
            {icons.remove}
          </Button>
        </EditorRemoveButton>
      </InspectorPicked>
    )
  })
  
  optionsStrict.content.children ||= <>{contentChildren}</>

  const children = <>
    <Bar {...optionsStrict.header} />
    <InspectorContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </InspectorContent>
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}
