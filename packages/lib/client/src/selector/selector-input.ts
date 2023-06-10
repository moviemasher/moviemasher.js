import type { Contents, Content, ImportEventDetail, MovieMasherContext } from '../declarations.js'

import { css } from 'lit'
import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { consume } from '@lit-labs/context'

import { IconString } from '../Base/IconString.js'

import { movieMasherContext } from '../movie-masher-context.js'
import { Component } from '../Base/Component.js'

@customElement('movie-masher-selector-input')
export class SelectorInputElement extends IconString {
  @consume({ context: movieMasherContext, subscribe: true })
  movieMasherContext?: MovieMasherContext

  protected changeHander(event: DragEvent) {
    const { emit } = this
    const { files: fileList } = event.currentTarget as HTMLInputElement
    if (!(emit && fileList?.length)) return

    const init: CustomEventInit<ImportEventDetail> = { 
      detail: { fileList }, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent(emit, init))
  }

  protected override content(contents: Contents): Content {
    const { movieMasherContext: movieMasherContext } = this
    if (!movieMasherContext) {
      console.log(this.tagName, 'no movieMasherContext')
      return html`${contents}`
    }

    // console.log(this.tagName, 'movieMasher defined')
    const BrowserControlId = 'movie-masher-selector-input-id'
    return html`<label htmlFor='${BrowserControlId}'>
      <input type='file' multiple
        id='${BrowserControlId}'
        accept='${movieMasherContext.accept}'
        @change='${this.changeHander}'
      ></input>
      ${contents}
    </label>`
  }
  static override styles = [
    Component.cssHostFlex,
    css`
      :host {
        user-select: none;
        -webkit-user-select: none;
      }
      input {
        visibility: hidden;
        vertical-align: bottom;
        width: 0px;
      }
    `,
    css`
      :host {
        --cursor: pointer;
        --fore: var(--control-fore);
        --fore-selected: var(--control-fore-selected);
        --fore-disabled: var(--control-fore-disabled);
        --fore-hover: var(--control-fore-hover);

        --size: var(--button-size);
        display: inline-block;
        height: var(--size);
      }
      :hover {
        --fore: var(--fore-hover);
      }
      :host(.selected){
        --fore: var(--fore-selected);
      }
      :host(.disabled), :host(.disabled):hover {
        --cursor: default;
        --fore: var(--fore-disabled);
      }
      a {
        cursor: var(--cursor);
        color: var(--fore);
        font-size: var(--size);
        line-height: var(--size);
        transition: var(--transition);
      }
    `
  ]
}
