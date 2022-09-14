import React from "react"
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild, WithClassName } from "../../declarations"
import { Button } from "../../Utilities/Button"
import { AddFolderControl } from "../Controls/AddFolderControl"
import { AddMashControl } from "../Controls/AddMashControl"
import { Panel, PanelOptions } from "../Panel/Panel"
import { ComposerProps } from "./Composer"
import { ComposerContent } from "./ComposerContent"
import { ComposerDepth } from "./ComposerDepth"
import { ComposerFolderClose } from "./ComposerFolderClose"
import { ComposerFolderOpen } from "./ComposerFolderOpen"
import { ComposerLayerFolder } from "./ComposerLayerFolder"
import { ComposerLayerLabel } from "./ComposerLayerLabel"
import { ComposerLayerMash } from "./ComposerLayerMash"
import { ClassButton } from "@moviemasher/moviemasher.js"
import { View } from "../../Utilities/View"


export interface  ComposerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {}
export const DefaultComposerProps: PropsMethod<ComposerPropsDefault, ComposerProps> = function (props = {}) {
  const { className = "panel composer", children:_, ...rest } = props

  const children = <Panel className={className} {...rest}>
    <View key="head" className='head'>{DefaultIcons.composer}</View>
    <ComposerContent key="content" className='content'>
      <div key='layer' className='layer'>
        <div key='icons'>
          <ComposerDepth key="depth">
            <div className='depth'></div>
          </ComposerDepth>
          <ComposerLayerFolder key="layer-folder">
            <ComposerFolderOpen key="folder-open">
              <div className={ClassButton}>
                {DefaultIcons.folder}
              </div>
            </ComposerFolderOpen>
            <ComposerFolderClose key="folder-close">
              <div className={ClassButton}>
                {DefaultIcons.folderOpen}
              </div>
            </ComposerFolderClose>
          </ComposerLayerFolder>
          <ComposerLayerMash key="layer-mash">
            <div key="mash-icon" className={ClassButton}>
              {DefaultIcons.mmTube}
            </div>
          </ComposerLayerMash>
        </div>
        <ComposerLayerLabel key="label" />
        <div key="play-button" className={ClassButton}>
          {DefaultIcons.playerPlay}
        </div>
      </div>
    </ComposerContent>
    <View key="foot" className='foot'>
      <AddMashControl>
        <Button>
          {DefaultIcons.add}{DefaultIcons.mmWide} 
        </Button>
      </AddMashControl>
      <AddFolderControl>
        <Button>
          {DefaultIcons.add}{DefaultIcons.folder} 
        </Button>
      </AddFolderControl>
    </View>
  </Panel>
  return { children }
}
