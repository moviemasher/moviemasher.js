import React from "react"

import { ClassButton } from "@moviemasher/moviemasher.js"

import { PropsMethod, PropsWithoutChild, WithClassName } from "../../declarations"
import { Button } from "../../Utilities/Button"
import { AddFolderControl } from "../Controls/AddFolderControl"
import { AddMashControl } from "../Controls/AddMashControl"
import { PanelOptions, panelOptionsStrict } from "../Panel/Panel"
import { ComposerProps } from "./Composer"
import { ComposerContent } from "./ComposerContent"
import { ComposerDepth } from "./ComposerDepth"
import { ComposerFolderClose } from "./ComposerFolderClose"
import { ComposerFolderOpen } from "./ComposerFolderOpen"
import { ComposerLayerFolder } from "./ComposerLayerFolder"
import { ComposerLayerLabel } from "./ComposerLayerLabel"
import { ComposerLayerMash } from "./ComposerLayerMash"
import { Bar } from "../../Utilities/Bar"


export interface  ComposerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}
export const DefaultComposerProps: PropsMethod<ComposerPropsDefault, ComposerProps> = function (props = {}) {
  
  const optionsStrict = panelOptionsStrict(props)
  const { icons } = optionsStrict

  optionsStrict.props.key ||= 'composer'
  optionsStrict.props.className ||= 'panel composer'
  optionsStrict.props.initialPicked ||= 'container'
  optionsStrict.header.content ||= [icons.composer]

  optionsStrict.footer.content ||= [
    <AddMashControl>
      <Button>
        {icons.add}{icons.mmWide} 
      </Button>
    </AddMashControl>,
    <AddFolderControl>
      <Button>
        {icons.add}{icons.folder} 
      </Button>
    </AddFolderControl>
  ]

  optionsStrict.content.children ||= (
    <div key='layer' className='layer'>
      <div key='icons'>
        <ComposerDepth key="depth">
          <div className='depth'></div>
        </ComposerDepth>
        <ComposerLayerFolder key="layer-folder">
          <ComposerFolderOpen key="folder-open">
            <div className={ClassButton}>
              {icons.folder}
            </div>
          </ComposerFolderOpen>
          <ComposerFolderClose key="folder-close">
            <div className={ClassButton}>
              {icons.folderOpen}
            </div>
          </ComposerFolderClose>
        </ComposerLayerFolder>
        <ComposerLayerMash key="layer-mash">
          <div key="mash-icon" className={ClassButton}>
            {icons.mmTube}
          </div>
        </ComposerLayerMash>
      </div>
      <ComposerLayerLabel key="label" />
      <div key="play-button" className={ClassButton}>
        {icons.playerPlay}
      </div>
    </div>
  )

  const children = <>
    <Bar {...optionsStrict.header} />
    <ComposerContent {...optionsStrict.content.props}>
      {optionsStrict.content.children}
    </ComposerContent>
    <Bar {...optionsStrict.footer} />
  </>


  return { ...optionsStrict.props, children }
}
