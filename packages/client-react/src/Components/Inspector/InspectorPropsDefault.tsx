import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { Bar } from '../../Utilities/Bar'
import { EditorUndoButton } from '../Controls/EditorUndoButton'
import { EditorRedoButton } from '../Controls/EditorRedoButton'
import { InspectorProperties } from './InspectorProperties'
import { InspectorContent } from './InspectorContent'
import { InspectorProps } from './Inspector'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { Button } from '../../Utilities/Button'
import { Process } from '../Process/Process'
import { SaveControl } from '../Controls/SaveControl'
import { View } from '../../Utilities/View'

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
  if (!noApi) {
    optionsStrict.footer.content ||= [
      <Process key='save-process' id='data'>
        <View>
          <SaveControl><Button>Save</Button></SaveControl>
        </View>
      </Process>
    ]
  }
  optionsStrict.footer.after ||= [
    <EditorUndoButton key='undo'><Button startIcon={DefaultIcons.undo}>Undo</Button></EditorUndoButton>,
    <EditorRedoButton key='redo'><Button startIcon={DefaultIcons.redo}>Redo</Button></EditorRedoButton>,
  ]


  optionsStrict.content.children ||= <InspectorProperties><label /></InspectorProperties>

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
