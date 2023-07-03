import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { Div, LeftCenterRight } from '../Base/LeftCenterRight.js'
import { Component } from '../Base/Component.js'

export class ViewerDivElement extends Div {
  override centerContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.importTags('movie-masher-viewer-content')
    htmls.push(html`<movie-masher-viewer-content></movie-masher-viewer-content>`)
    return html`${htmls}`
  }



  // private drawHandler(): void {
  //   delete this._previewItemsPromise
  //   this.requestUpdate()
  // }

  // override async getUpdateComplete(): Promise<boolean> {
  //   return super.getUpdateComplete().then(complete => {
  //     if (!complete) {
  //       console.log(this.constructor.name, 'getUpdateComplete SUPER', complete)
  //       return false
  //     }
  //     return this.previewItemsPromise.then(() => {  
  //       console.log(this.constructor.name, 'getUpdateComplete iconPromise', this.previewItems.length)
  //       // this.requestUpdate()
  //       return true
  //     })
  //   })
  // }

  // private _previewItemsPromise: Promise<PreviewItems> | undefined
  // private get previewItemsPromise(): Promise<PreviewItems> {
  //   return this._previewItemsPromise ||= this.previewItemsPromiseInitialize
  // }
  // private get previewItemsPromiseInitialize(): Promise<PreviewItems> {
  //   const detail: PreviewItemsEventDetail = {}
  //   const init: CustomEventInit<PreviewItemsEventDetail> = { 
  //     detail, composed: true, bubbles: true, cancelable: true
  //   }
  //   const event = new CustomEvent<PreviewItemsEventDetail>('preview-items', init)
  //   MovieMasher.eventDispatcher.dispatch(event)
  //   const { promise } = detail
  //   if (!promise) return Promise.resolve([]) 

  //   return promise.then(items => this.previewItems = items)
  // }

  // previewItems: PreviewItems = []

  // override willUpdate(changedProperties: PropertyValues<this>) {
  //   if (changedProperties.has('client') && changedProperties.get('client')) {
  //     console.debug(this.constructor.name, 'willUpdate', changedProperties)
  //     this.requestUpdate()
  //   }
  // }
  

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    LeftCenterRight.cssDiv,
    LeftCenterRight.cssDivLeft,
    LeftCenterRight.cssDivRight,
  ]

  static override properties = {
    ...Div.properties,
  }
}

// register web component as custom element
customElements.define('movie-masher-viewer-div', ViewerDivElement)