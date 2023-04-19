
import { customElement } from 'lit/decorators/custom-element.js'
import { css } from 'lit'
import { Div } from '../Base/LeftCenterRight.js'


@customElement('moviemasher-composer-div')
export class ComposerDivElement extends Div {
  static override styles = [css`
    :host {
      display: block;
      

      isolation: isolate;
    


    }
  `, 
  css`
  :host {
    display: block;
    
  }


  div {
      overflow: auto;
      overscroll-behavior: none;
      display: grid;
      grid-template-columns: var(--track-width) 1fr;
      grid-template-rows: var(--scrubber-height) repeat(auto-fill, var(--track-height));
      row-gap: var(--spacing);
      position: relative;
    }


    div {
      --padding: 1px;
      --spacing: 0px;  
    }


    div .scrubber-bar,
    div .scrubber-icon {
      z-index: 3;
      position: -webkit-sticky;
      position: sticky;
      left: var(--track-width);
    }

    div .scrubber-bar {
      pointer-events: none;
      top: var(--scrubber-height);
    }

    div .scrubber-icon {
      box-shadow: calc(-1 * var(--track-width)) 0 0 0 var(--section-back);
      --spacing: 4px;
      top: 0px;
      background-color: var(--section-back);
    }
    div .scrubber-element-bar,
    div .scrubber-element-icon {
      position: absolute;
      cursor:pointer;
      background-color: var(--section-fore);
      transition: var(--button-transition);
    }


    div .scrubber-element-bar {
      width: 1px;
      top: 0px;
      bottom: 0px;
    }

    div .scrubber-element-icon {
      --half-width: calc(var(--scrubber-width) / 2);
      margin-left: calc(0px - (var(--scrubber-width) / 2));
      width: var(--scrubber-width);
      height: var(--scrubber-height);
      clip-path: polygon(
        0 var(--spacing),
        var(--scrubber-width) var(--spacing),
        calc(50% + 1px) var(--scrubber-height),
        50% var(--scrubber-height)
      );
    }

    div .disabled .scrubber-element-bar,
    div .disabled .scrubber-element-icon {
      pointer-events: none;
      cursor: default;
      background-color: var(--control-back-disabled);
    }

    div .drop-box {
      top: var(--scrubber-height);
      left: var(--track-width);
    }

    div .track {
      padding: var(--padding);
      --drop-size: var(--border-size);
      display: flex;
      border: var(--border);
      overflow: hidden;
      background-color: var(--div-back);
      white-space: nowrap;
    }

    div .track.selected {
      background-color: var(--item-back-selected);
    }

    div .track .clip {
      border: var(--border);
      display: inline-block;
    }

    div .track .clip:hover{
      color: var(--item-fore-hover);
      border-color: var(--item-fore-hover);
      background-color: var(--item-back-hover);
    }
    div .track .selected {
      color: var(--item-fore-selected);
      border-color: var(--item-fore-selected);
      background-color: var(--item-back-selected);
    }

    div .track .selected:hover {
      color: var(--item-fore-tertiary);
      border-color: var(--item-fore-tertiary);
      background-color: var(--item-back-tertiary);
    }


    div .track.dropping {
      border-block-color: var(--color-drop);
    }

    div .track-icon {
      border-block: var(--border);
      background-color: var(--section-back);
      color: var(--section-fore);
      display: flex;
      position: -webkit-sticky;
      position: sticky;
      left: 0;
      z-index: 2;
      height: var(--track-height);
    }

    div .track-icon.selected {
      background-color: var(--item-back-selected);
      color: var(--item-fore-selected);
    }

    div .track-icon svg {
      margin: auto;
    }
    div .track-icon.dropping {
      border-color: var(--color-drop);

    }
    div .track .clip.dropping {
      border-color: var(--color-drop);
      box-shadow:
        0 var(--drop-size) 0 0 var(--color-drop),
        0 calc(-1 * var(--drop-size)) 0 0 var(--color-drop)
      ;
    }

    div .track .clip.dropping-before {
      box-shadow: calc(-1 * var(--drop-size)) 0 0 0 var(--color-drop);
    }
    div .track .clip.dropping-after {
      box-shadow: var(--drop-size) 0 0 0 var(--color-drop);
    }

`
]
}
