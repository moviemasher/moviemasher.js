import type { Media, MediaObject } from '@moviemasher/lib-core'
import type { PropertyValues } from 'lit'

import type { Htmls, MediaEventDetail, MediaObjectEventDetail } from '../declarations.js'

import { nothing } from 'lit'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'


import { Component } from '../Base/Component.js'

@customElement('movie-masher-selector-span')
export class SelectorSpanElement extends Component {

  @property({ attribute: 'media-id' }) 
  mediaId = ''

  // @property({ attribute: false })
  icon?: SVGSVGElement | undefined
  
  media?: Media
  private mediaRefresh(mediaObject: MediaObject) {
    const detail: MediaEventDetail = { mediaObject }
    const init: CustomEventInit<MediaEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('media', init))
    const { promise } = detail
    promise?.then(media => { 
      this.media = media 
      const iconPromise = media.definitionIcon({ width: 120, height: 66 })
      iconPromise?.then(icon => { 
        this.icon = icon 
        this.requestUpdate()
      })
    })
  }


  private _mediaObject?: MediaObject
  protected get mediaObject() {
    return this._mediaObject ||= this.mediaObjectInitialize
  }
  private get mediaObjectInitialize() {
    
    const detail: MediaObjectEventDetail = { id: this.mediaId }
    const init: CustomEventInit<MediaObjectEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('mediaobject', init))
    const { mediaObject } = detail
    if (mediaObject) this.mediaRefresh(mediaObject)
    return mediaObject
  }

  override render() { 
    const { mediaObject, icon } = this
    if (!mediaObject) return nothing

    const htmls: Htmls = []
    const { label } = mediaObject
    if (label) htmls.push(html`<label>${label}</label>`)
    if (icon) htmls.push(html`${icon}`)

    return html`<div>${htmls}</div>`
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('mediaId')) {
      delete this._mediaObject
      delete this.icon
    }
  }


  static override styles = [css`
    :host {
      display: inline-block;
      position: relative;
      overflow: hidden;
      border: var(--border);
      border-radius: var(--border-radius);
      border-color: var(--item-fore);
      color: var(--item-fore);
      background-color: var(--item-back);
    }
    label {
      height: var(--icon-size);
      --padding: 5px;
      position: absolute;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      opacity: 0.5;
      padding: var(--padding);
    }

  `]
}

