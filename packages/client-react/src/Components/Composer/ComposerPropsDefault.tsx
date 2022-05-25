import React from "react"
import { DefaultIcons } from '@moviemasher/icons-default'

import { PropsMethod, PropsWithoutChild, WithClassName } from "../../declarations"
import { Button } from "../../Utilities/Button"
import { AddFolderControl } from "../Controls/AddFolderControl"
import { AddMashControl } from "../Controls/AddMashControl"
import { Panel, PanelOptions } from "../Panel/Panel"
import { PanelFoot } from "../Panel/PanelFoot"
import { PanelHead } from "../Panel/PanelHead"
import { ComposerProps } from "./Composer"
import { ComposerContent } from "./ComposerContent"
import { ComposerDepth } from "./ComposerDepth"
import { ComposerFolderClose } from "./ComposerFolderClose"
import { ComposerFolderOpen } from "./ComposerFolderOpen"
import { ComposerLayerFolder } from "./ComposerLayerFolder"
import { ComposerLayerLabel } from "./ComposerLayerLabel"
import { ComposerLayerMash } from "./ComposerLayerMash"


export interface  ComposerPropsDefault extends PanelOptions, PropsWithoutChild, WithClassName {
  noApi?: boolean
}
export const DefaultComposerProps: PropsMethod<ComposerPropsDefault, ComposerProps> = function (props) {
  const { className = "panel composer", children:_, noApi, ...rest } = props

  const children = <Panel className={className} {...rest}>
    <PanelHead key="head" className='head'>{DefaultIcons.app}</PanelHead>
    <ComposerContent key="content" className='content'>
      <div key='layer' className='layer'>
        <div key='icons'>
          <ComposerDepth key="depth">
            <div className='depth'></div>
          </ComposerDepth>
          <ComposerLayerFolder key="layer-folder">
            <ComposerFolderOpen key="folder-open">
              <div className='icon-button'>
                {DefaultIcons.folder}
              </div>
            </ComposerFolderOpen>
            <ComposerFolderClose key="folder-close">
              <div className='icon-button'>
                {DefaultIcons.folderOpen}
              </div>
            </ComposerFolderClose>
          </ComposerLayerFolder>
          <ComposerLayerMash key="layer-mash">
            <div key="mash-icon" className='icon-button'>
              {DefaultIcons.mmTube}
            </div>
          </ComposerLayerMash>
        </div>
        <ComposerLayerLabel key="label" />
        <div key="play-button" className='icon-button'>
          {DefaultIcons.playerPlay}
        </div>
      </div>
    </ComposerContent>
    <PanelFoot key="foot" className='foot'>
      <AddMashControl>
        <Button>
          {DefaultIcons.mmTube} {DefaultIcons.add}
        </Button>
      </AddMashControl>
      <AddFolderControl>
        <Button>
          {DefaultIcons.folder} {DefaultIcons.add}
        </Button>
      </AddFolderControl>
    </PanelFoot>
  </Panel>
  return { children }
}
