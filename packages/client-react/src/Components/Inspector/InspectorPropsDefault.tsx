import React from 'react'
import { ClassButton, SelectType, labelInterpolate, labelTranslate } from '@moviemasher/moviemasher.js'
import { DefaultIcons } from '@moviemasher/icons-default'

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
import { SaveControl } from '../Controls/SaveControl'
import { SelectEditedControl } from '../Controls/SelectEditedControl'
import { CreateEditedControl } from '../Controls/CreateEditedControl'
import { RenderControl } from '../Controls/RenderControl'
import { ViewControl } from '../Controls/ViewControl'
import { View } from '../../Utilities/View'
import { ApiEnabled } from '../ApiClient/ApiEnabled'

export interface InspectorPropsDefault extends PanelOptions, PropsWithoutChild {}

export const InspectorPropsDefault: PropsMethod<InspectorPropsDefault, InspectorProps> = function (props = {}) {
  const optionsStrict = panelOptionsStrict(props)
  optionsStrict.props.key ||= 'inspector'
  optionsStrict.props.className ||= 'panel inspector'

  optionsStrict.header.content ||= [DefaultIcons.inspector]
 
  optionsStrict.footer.content ||= [
    <InspectorPicker key="mash" className={ClassButton} id="mash">
      {DefaultIcons.document}
    </InspectorPicker>,
    <InspectorPicker key="cast" className={ClassButton} id="cast">
      {DefaultIcons.document}
    </InspectorPicker>,
    <InspectorPicker key="layer" className={ClassButton} id="layer">
      {DefaultIcons.composer}
    </InspectorPicker>,
    <InspectorPicker key="clip" className={ClassButton} id="clip">
      {DefaultIcons.clip}
    </InspectorPicker>,
    <InspectorPicker key="container" className={ClassButton} id="container">
      {DefaultIcons.container}
    </InspectorPicker>,
    <InspectorPicker key="content" className={ClassButton} id="content">
      {DefaultIcons.content}
    </InspectorPicker>,
 ]

  const contentChildren = [<InspectorProperties key="properties" />]
  const types = [SelectType.Clip, SelectType.Track, SelectType.Layer]

  contentChildren.push(
    <ApiEnabled>
      <InspectorPicked type="mash" key="inspector-mash">
        <View>
          <RenderControl key='render-process'>
            <Button>
              {labelTranslate('render')} 
              {DefaultIcons.render}
            </Button>
          </RenderControl>
          <ViewControl key='view-control'>
            <Button>
              {labelTranslate('view')} 
              {DefaultIcons.view}
            </Button>
          </ViewControl>    
        </View>  
      </InspectorPicked>
      <InspectorPicked types="mash,cast" key="inspector-document">
        <SelectEditedControl key="select-edited" />
        <View>
          <SaveControl key='save-process'>
            <Button>
              {labelTranslate('update')}
              {DefaultIcons.document}
            </Button>
          </SaveControl>
          <CreateEditedControl key="create-edited">
            <Button>
              {labelTranslate('create')} 
              {DefaultIcons.document}
            </Button>
          </CreateEditedControl>
        </View>
      </InspectorPicked>
    </ApiEnabled>
  )

  types.forEach(type => {
    contentChildren.push(
      <InspectorPicked key={`${type}-delete`} type={type}>
        <EditorRemoveButton type={type}>
          <Button>
            {labelInterpolate('delete', { type })}
            {DefaultIcons.remove}
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
