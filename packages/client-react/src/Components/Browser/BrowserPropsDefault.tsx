import React from 'react'
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild } from '../../declarations'
import { View } from '../../Utilities/View'
import { Bar } from '../../Utilities/Bar'
import { BrowserContent } from './BrowserContent'
import { BrowserSource } from './BrowserSource'
import { BrowserProps } from './Browser'
import { BrowserDataSource } from './BrowserDataSource'
import { Process } from '../Process/Process'
import { UploadControl } from '../Controls/UploadControl'
import { ProcessActive } from '../Process/ProcessActive'
import { ProcessStatus } from '../Process/ProcessStatus'
import { ProcessProgress } from '../Process/ProcessProgress'
import { PanelOptions, panelOptionsStrict } from '../Panel/Panel'
import { BrowserDefinition } from './BrowserDefinition'

export interface BrowserPropsDefault extends PanelOptions, PropsWithoutChild {
  noApi?: boolean
}

export const DefaultBrowserProps: PropsMethod<BrowserPropsDefault, BrowserProps> = function (props) {
  const { noApi, ...options } = props

  const optionsStrict = panelOptionsStrict(options)
  optionsStrict.props.key ||= 'browser'
  optionsStrict.props.className ||= 'panel browser'
  optionsStrict.props.sourceId ||= 'text'

  optionsStrict.header.content ||= [
    <BrowserSource key='shapecontainer' id='shapecontainer' className='icon-button' children={DefaultIcons.browserShape} />,
    <BrowserSource key='textcontainer' id='textcontainer' className='icon-button' children={DefaultIcons.browserText} />,
    <BrowserSource key='colorcontent' id='colorcontent' className='icon-button' children={DefaultIcons.browserFill} />,
    <BrowserSource key='effect' id='effect' className='icon-button' children={DefaultIcons.browserEffect} />,
  ]

  const SourceClass = noApi ? BrowserSource : BrowserDataSource
  optionsStrict.header.before ||= [
    DefaultIcons.browser,
    <SourceClass key='video' id='videosequence' className='icon-button' children={DefaultIcons.browserVideo} />,
    <SourceClass key='audio' id='audio' className='icon-button' children={DefaultIcons.browserAudio} />,
    <SourceClass key='image' id='image' className='icon-button' children={DefaultIcons.browserImage} />,
  ]

  if (!noApi) {
    optionsStrict.footer.before ||= [
      <Process key='upload-process' id='data'>
        <UploadControl>
          {DefaultIcons.upload}
        </UploadControl>
        <ProcessActive>
          <ProcessStatus />
          <ProcessProgress />
        </ProcessActive>
      </Process>
    ]
  }
  optionsStrict.content.children ||= (
    <BrowserDefinition className='definition' icon="--clip-icon"></BrowserDefinition>
  )

  const children = <>
    <Bar {...optionsStrict.header} />
    <BrowserContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </BrowserContent>
    <Bar {...optionsStrict.footer} />
  </>
  return { ...optionsStrict.props, children }
}
