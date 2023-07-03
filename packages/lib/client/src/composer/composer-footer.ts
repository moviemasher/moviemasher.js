import type { AssetObject, StringEvent, Time } from '@moviemasher/runtime-shared'
import type { Htmls, OptionalContent } from '../declarations.js'
import type { MashAddAssetsEventDetail, MashIndex, TimeEvent, ClipOrFalseEvent, ClientClip } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { Footer } from '../Base/LeftCenterRight.js'
import { MovieMasher, EventTypeSelectAssetObject, EventTypeAddMashTrack, EventTypeMashAddAssets, EventTypeTime, EventTypeSelectClip } from '@moviemasher/runtime-client'
import { isClip, isMashAsset, isTrack } from '@moviemasher/lib-shared'

const EventTypeComposerAdd = 'composer-add'
export class ComposerFooterElement extends Footer {
  constructor() {
    super()
    this.listeners[EventTypeSelectAssetObject] = this.handleSelectAssetObject.bind(this)
    this.listeners[EventTypeComposerAdd] = this.handleAdd.bind(this)
    this.listeners[EventTypeTime] = this.handleTime.bind(this)
    this.listeners[EventTypeSelectClip] = this.handleSelectClip.bind(this)
  }

  protected assetObject?: AssetObject

  private handleAdd(event: StringEvent): void {
    event.stopImmediatePropagation()
    const { assetObject, time, selectedClip } = this

    if (!assetObject) return

    const mashIndex: MashIndex = {
      clip: 0, track: -1
    }
    if (selectedClip) {
      const { track } = selectedClip
      const { mash } = track
      if (isMashAsset(mash)) {
        if (isClip(selectedClip) && isTrack(track)) {
          mashIndex.clip = track.dense ? track.clips.indexOf(selectedClip) : selectedClip.endFrame
          mashIndex.track = track.index
        } else if (time) {
          mashIndex.clip = time.scale(mash.quantize).frame
        }
      }
    }
    
    const detail: MashAddAssetsEventDetail = { assetObjects: [assetObject], mashIndex
    }
    MovieMasher.eventDispatcher.dispatch(new CustomEvent(EventTypeMashAddAssets, { detail }))
  }

  private selectedClip: ClientClip | false = false

  private handleSelectClip(event: ClipOrFalseEvent): void {
    this.selectedClip = event.detail
  }
  private time?: Time 

  private handleTime(event: TimeEvent): void {
    this.time = event.detail
  }

  private handleSelectAssetObject(event: CustomEvent<AssetObject>): void {
    const { detail: assetObject } = event
    this.assetObject = assetObject
    // console.log(this.tagName, 'handleSelectAssetObject', assetObject)
    event.stopImmediatePropagation()
  }

  override leftContent(slots: Htmls): OptionalContent {
    
    const htmls = [...slots]

    this.importTags('movie-masher-component-button')

    htmls.push(html`<movie-masher-component-button         
        disabled='${ifDefined(this.assetObject ? undefined : true)}'
        icon='add' emit='${EventTypeComposerAdd}' 
      ></movie-masher-component-button>`)

    htmls.push(html`<movie-masher-component-button 
        disabled='${ifDefined(this.assetObject ? undefined : true)}'
        icon='trackDense' emit='${EventTypeAddMashTrack}'  
      ></movie-masher-component-button>`)
    return super.leftContent(htmls)
  }

  override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]

    return super.rightContent(htmls)
  }

  static override properties = {
    ...Footer.properties,
    assetObject: { type: Object, attribute: false }
  }
}


// register web component as custom element
customElements.define('movie-masher-composer-footer', ComposerFooterElement)