import type { StringEvent } from '@moviemasher/runtime-shared'
import type { CSSResultGroup } from 'lit'
import type { Htmls, OptionalContent, StringSlot, IconSlot } from '../declarations'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'
import { MovieMasher } from '@moviemasher/runtime-client'

import { Slotted } from './Slotted.js'

const StringSlot: StringSlot = 'string'
const IconSlot: IconSlot = 'icon'

export class IconString extends Slotted {
  detail = ''
  emit = ''
  string = ''
  icon = ''

  protected clickHandler(pointerEvent: PointerEvent): void {
    const { emit } = this
    if (emit) {
      pointerEvent.stopPropagation()
      const { detail } = this
      // console.debug(this.constructor.name, 'dispatching', emit, detail)
      const init: CustomEventInit<string> = { cancelable: true, bubbles: true, composed: true, detail }
      const event: StringEvent = new CustomEvent(emit, init)
      MovieMasher.eventDispatcher.dispatch(event)
    }
  }

  protected override defaultSlottedContent(key: string, htmls: Htmls): OptionalContent { 
    switch (key) {
      case StringSlot: return this.stringContent(htmls)
      case IconSlot: return this.iconContent(htmls)
    }
  }

  private iconContent(_htmls: Htmls): OptionalContent { 
    const { [IconSlot]: icon } = this
    if (!icon) return 

    this.importTags('movie-masher-component-icon')
    return html`<movie-masher-component-icon 
      part='icon' slotted='icon'
      icon='${icon}'
    ></movie-masher-component-icon>` 
  }

  
  override slots = [IconSlot, StringSlot] 

  private stringContent(_htmls: Htmls): OptionalContent { 
    const { string } = this
    if (!string) return 

    this.importTags('movie-masher-component-string')
    return html`<movie-masher-component-string 
      part='string' slotted='string'
      string='${string}'
    ></movie-masher-component-string>` 
  }

  static cssControl = css`
    :hover {
      --back: var(--back-hover);
      --fore: var(--fore-hover);
    }

    :host(.disabled), :host(.disabled):hover,
    button:disabled, button:disabled:hover {
      --back: var(--back-disabled);
      --cursor: default;
      --fore: var(--fore-disabled);
    }
    
    :host(.selected){
      --back: var(--back-selected);
      --fore: var(--fore-selected);
    }
  `

  static cssControls = css`
    a, button {
      color: var(--fore);
      cursor: var(--cursor);
      display: inline-flex;
      gap: var(--spacing);
      height: var(--size);
    }

    a {
      font-size: var(--size);
      line-height: var(--size);
      transition: var(--button-transition);
    }

    button {
      --pad-height: calc(var(--size) - 2 * var(--padding));
      align-items: center;
      appearance: none;
      background-color: var(--back);
      border-color: var(--fore);
      border-radius: var(--border-radius);
      border: var(--border);
      font-size: var(--pad-height);
      font-weight: 500;
      line-height: var(--pad-height);
      min-width: var(--size);
      outline: none;
      padding: var(--padding);
      transition: var(--button-transition);
    }
  `

  static cssHost = css`
    :host {
      --back-disabled: var(--control-back-disabled);
      --back-hover: var(--control-back-hover);
      --back-selected: var(--control-back-selected);
      --back: var(--control-back);
      --cursor: pointer;
      --fore-disabled: var(--control-fore-disabled);
      --fore-hover: var(--control-fore-hover);
      --fore-selected: var(--control-fore-selected);
      --fore: var(--control-fore);
      --padding: var(--control-padding);
      --size: var(--button-size);
      --spacing: var(--control-spacing);
      display: inline-block;
    }
  `
  
  static override styles: CSSResultGroup = [
    IconString.cssHost,
    IconString.cssControl,
    IconString.cssControls,
  ]

  static override properties = {
    ...Slotted.properties,
    detail: { type: String },
    emit: { type: String },
    string: { type: String },
    icon: { type: String },
  }

}
