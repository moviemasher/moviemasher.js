import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { InspectorProperties } from './InspectorProperties'
import { InspectorContent } from './InspectorContent'
import { InspectorProps } from './Inspector'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { InspectorType } from './InspectorType'
import { InspectorTypePicker } from './InspectorTypePicker'
import { EditorRemoveButton } from '../Controls/EditorRemoveButton'
import { Button } from '../../Utilities/Button'
import { SelectType } from '@moviemasher/moviemasher.js'
import { label } from '../../Utilities/Label'

export interface InspectorPropsDefault extends PanelOptions, PropsWithoutChild {
  noApi?: boolean
}

export const DefaultInspectorProps: PropsMethod<InspectorPropsDefault, InspectorProps> = function (props) {
  const { noApi, ...options } = props

  const optionsStrict = panelOptionsStrict(options)
  optionsStrict.props.key ||= 'inspector'
  optionsStrict.props.className ||= 'panel inspector'

  optionsStrict.header.content ||= [
    DefaultIcons.inspector
  ]
 
  optionsStrict.footer.content ||= [
    <InspectorTypePicker key="mash-cast" className='icon-button' types="mash,cast">{DefaultIcons.document}</InspectorTypePicker>,
    <InspectorTypePicker key="layer" className='icon-button' types="layer">{DefaultIcons.layer}</InspectorTypePicker>,
    <InspectorTypePicker key="clip" className='icon-button' type="clip">{DefaultIcons.clip}</InspectorTypePicker>,
    <InspectorTypePicker key="content" className='icon-button' type="content">{DefaultIcons.content}</InspectorTypePicker>,
    <InspectorTypePicker key="container" className='icon-button' type="container">{DefaultIcons.container}</InspectorTypePicker>,
 ]

  const contentChildren = [<InspectorProperties key="properties" />]
  if (!noApi) {
    const types = [SelectType.Clip, SelectType.Track, SelectType.Effect]
    types.forEach(type => {
      const removeProps = { type }
      const typeProps = { ...removeProps, key: `${type}-delete` }
      const buttonProps = { 
        startIcon: DefaultIcons.remove, children: label('remove') 
      }
      contentChildren.push(
        <InspectorType { ...typeProps }>
          <EditorRemoveButton { ...removeProps }>
            <Button { ...buttonProps } />
          </EditorRemoveButton>
        </InspectorType>
      )
    })
  }
  optionsStrict.content.children ||= <>{contentChildren}</>
  

  optionsStrict.content.props!.label ||= '--clip-label'

  const children = <>
    <Bar {...optionsStrict.header} />
    <InspectorContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </InspectorContent>
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}
