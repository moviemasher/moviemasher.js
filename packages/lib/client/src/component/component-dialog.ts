import type { StringEvent } from '@moviemasher/runtime-shared'
import type { CSSResultGroup } from 'lit'
import type { Contents, Content } from '../declarations.js'

import { html } from 'lit-html/lit-html.js'
import { css } from '@lit/reactive-element/css-tag.js'

import { MovieMasher, EventTypeDialog } from '@moviemasher/runtime-client'
import { ImporterComponent } from '../Base/ImporterComponent.js'



export class DialogElement extends ImporterComponent {
  constructor() {
    super()
    this.handleClose = this.handleClose.bind(this)
    this.handleDialogImport = this.handleDialogImport.bind(this)
  }

  protected get dialog(): HTMLDialogElement | undefined | null {
    return this.shadowRoot?.querySelector('dialog')
  }

  protected handleClose(): void {
    this.dialogIsOpen = false
  }
  protected handleDialogImport(event: StringEvent): void {
    const { detail } = event
    const { section, dialogIsOpen } = this
    console.log(this.tagName, 'handleDialogImport', detail, section, dialogIsOpen)
    if (detail === section) this.openDialogElement()
    else if (dialogIsOpen && detail === 'close') this.dialog?.close()
  }

  override connectedCallback(): void {
    super.connectedCallback()
    MovieMasher.eventDispatcher.addDispatchListener(EventTypeDialog, this.handleDialogImport)
  }

  override disconnectedCallback(): void {
    MovieMasher.eventDispatcher.removeDispatchListener(EventTypeDialog, this.handleDialogImport)
    this.dialog?.removeEventListener('close', this.handleClose)
    
    super.disconnectedCallback()
  }

  protected dialogIsOpen = false

  protected override get defaultContent(): Content | void { 
    const { section, dialogIsOpen } = this
    if (!(section && dialogIsOpen)) return 

    this.importTags(`movie-masher-${section}-section`)

    switch(section) {
      case 'importer': {
        return html`<movie-masher-importer-section></movie-masher-importer-section>`
      } 
    } 
  }

  openDialogElement():void {
    console.log(this.tagName, 'openDialogElement', this.dialogIsOpen)
    if (this.dialogIsOpen) return

    const { dialog } = this
    if (dialog) {
      dialog.addEventListener('close', this.handleClose, { once: true })
      this.dialogIsOpen = true
      dialog.showModal()
    }
  }

  protected override content(contents: Contents): Content {
    return html`<dialog>${contents}</dialog>`
  }

  protected override render(): unknown {
    return this.content(this.contents) 
  }

  section = ''

  static override properties = {
    ...ImporterComponent.properties,
    section: { type: String },
    dialogIsOpen: { type: Boolean, attribute: false },
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        position: absolute;
      }

      form {
        display: flex;
        flex-grow: 1;
      }

      dialog[open] {
        background: none;
        border: none;
        padding: 0;
        display: flex;
        height: var(--dialog-height, 90vh);
        width: var(--dialog-width, 90vw);
      }

      dialog::backdrop {
        background-color: black;
        opacity: 0.25;
      }

      @media(prefers-color-scheme: dark) {
        dialog::backdrop {
          background-color: white;
        }
      }
    `
  ]
}


// register web component as custom element
customElements.define('movie-masher-component-dialog', DialogElement)

declare global {
  interface HTMLElementTagNameMap {
    'movie-masher-component-dialog': DialogElement
  }
}