import type { AssetObject, StringEvent, Time } from '@moviemasher/runtime-shared'
import type { Htmls, OptionalContent } from '../declarations.js'
import type { MashAddAssetsEventDetail, MashIndex, TimeEvent, ClientClip, ClipFromIdEventDetail, MashAssetEvent } from '@moviemasher/runtime-client'

import { html } from 'lit-html/lit-html.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

import { MovieMasher, EventTypeSelectAssetObject, EventTypeMashAddTrack, EventTypeMashAddAssets, EventTypeTime, EventTypeSelectClip, EventTypeClipFromId, EventTypeMashAsset } from '@moviemasher/runtime-client'
import { isClip, isMashAsset, isTrack } from '@moviemasher/lib-shared'

import { Footer } from '../Base/LeftCenterRight.js'

const EventTypeComposerAdd = 'composer-add'
export class ComposerFooterElement extends Footer {
  constructor() {
    super()
    this.listeners[EventTypeSelectAssetObject] = this.handleSelectAssetObject.bind(this)
    this.listeners[EventTypeComposerAdd] = this.handleAdd.bind(this)
    this.listeners[EventTypeTime] = this.handleTime.bind(this)
    this.listeners[EventTypeSelectClip] = this.handleSelectClip.bind(this)
    this.listeners[EventTypeMashAsset] = this.handleMashAsset.bind(this)

  }

  protected assetObject?: AssetObject

  protected disabled = true

  private handleAdd(event: StringEvent): void {
    event.stopImmediatePropagation()
    const { assetObject, time, selectedClip } = this

    if (!assetObject) return

    const mashIndex: MashIndex = {
      // clip: 0, track: -1
      clip: -1, track: 0
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
  private handleMashAsset(event: MashAssetEvent): void {
    this.disabled = !!event.detail
  }
  
  private handleSelectAssetObject(event: CustomEvent<AssetObject>): void {
    const { detail: assetObject } = event
    this.assetObject = assetObject
    // console.log(this.tagName, 'handleSelectAssetObject', assetObject)
    event.stopImmediatePropagation()
  }

  private handleSelectClip(event: StringEvent): void {
    this.selectedClipId = event.detail
    delete this._selectedClip
  }

  private handleTime(event: TimeEvent): void {
    this.time = event.detail
  }

  override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    const { disabled, assetObject } = this
    this.importTags('movie-masher-component-button')
    htmls.push(html`<movie-masher-component-button         
        disabled='${ifDefined(assetObject && disabled? undefined : true)}'
        icon='add' emit='${EventTypeComposerAdd}' 
      ></movie-masher-component-button>
    `)

    htmls.push(html`<movie-masher-component-button 
        disabled='${ifDefined(disabled ? undefined : true)}'
        icon='track' emit='${EventTypeMashAddTrack}'  
      ></movie-masher-component-button>`)
    return super.leftContent(htmls)
  }

  override rightContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-composer-zoom')
    htmls.push(html`<movie-masher-composer-zoom></movie-masher-composer-zoom>`)

    return super.rightContent(htmls)
  }

  private selectedClipId = ''

  private _selectedClip?: ClientClip | undefined

  private get selectedClip(): ClientClip | undefined {
    if (this._selectedClip) return this._selectedClip
    
    const { selectedClipId: clipId } = this
    const detail: ClipFromIdEventDetail = { clipId }
    const event = new CustomEvent(EventTypeClipFromId, { detail })
    MovieMasher.eventDispatcher.dispatch(event)

    return this._selectedClip = detail.clip 
  }

  private time?: Time 

  static override properties = {
    ...Footer.properties,
    assetObject: { type: Object, attribute: false },
    disabled: { type: Boolean, attribute: false },
  }
}


// register web component as custom element
customElements.define('movie-masher-composer-footer', ComposerFooterElement)