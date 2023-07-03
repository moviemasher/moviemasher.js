import type { CSSResultGroup } from 'lit'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import type { ClipOrFalseEvent } from '@moviemasher/runtime-client'

import { EventTypeSelectClip, MovieMasher } from '@moviemasher/runtime-client'
import { Component } from '../Base/Component.js'

export class ComposerCenterElement extends Component {

  protected handleClick(): void {
    const event: ClipOrFalseEvent = new CustomEvent(
      EventTypeSelectClip, { detail: false }
    )
    MovieMasher.eventDispatcher.dispatch(event)
  }
  
  protected override render() {
    return html`<span 
      @click='${this.handleClick}' class='center'
    >ComposerCenterElement</span>`
  }

  static override styles?: CSSResultGroup = [
    Component.cssHostFlex,
    css`
    
    `
  ]
}

// register web component as custom element
customElements.define('movie-masher-composer-center', ComposerCenterElement)

