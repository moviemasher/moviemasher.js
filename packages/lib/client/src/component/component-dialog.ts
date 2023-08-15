import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventDialog } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Slotted } from '../Base/Slotted.js'

const PartImporter = 'importer'
export class DialogElement extends Slotted {
  constructor() {
    super()
    this.listeners[EventDialog.Type] = this.handleDialog.bind(this)
    // this.handleClose = this.handleClose.bind(this)
    // this.handleDialog = this.handleDialog.bind(this)
  }

  protected override content(contents: Contents): Content {
    return html`
      <dialog 
        @export-parts='${this.handleExportParts}'
        @close='${this.handleClose}'
      >${contents}</dialog>
    `
  }

  private get dialog(): HTMLDialogElement {
    return this.element('dialog') as HTMLDialogElement
  }

  protected dialogClose(): void {
    this.dialog.close()
  }

  protected dialogOpen(): void {
    this.dialogOpened = true
    this.dialog.showModal()
  }

  private dialogOpened = false

  private dialogOpening = false

  protected override get exportElements(): Element[] {
    return this.section ? super.exportElements : []
  }

  protected handleClose(): void {
    console.log(this.tagName, 'handleClose', this.dialogOpened)
    if (!this.dialogOpened) return

    this.dialogOpened = false
    this.handleDialog(new EventDialog())//'close'
  }

  protected handleDialog(event: EventDialog): void {
    
    const { detail: newSection = '' } = event
    const { section } = this
    console.log(this.tagName, 'handleDialog', section, '->', newSection)
    if (newSection === section) return

    const { dialogOpened } = this
    if (dialogOpened) this.dialogClose()
    if (newSection) this.dialogOpening = true
    this.section = newSection
    this.handleExportParts()
    this.dispatchExportParts()
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    const { dialogOpening } = this
    if (dialogOpening) {
      this.dialogOpening = false
      this.importTags(`movie-masher-${part}-section`)
      this.dialogOpen()
    }
    switch (part) {
      case PartImporter: {
        return html`
          <movie-masher-importer-section 
            part='${PartImporter}' 
          >${slots}</movie-masher-importer-section>`
      } 
    }
    return super.partContent(part, slots)
  }

  section = ''

  override parts = [PartImporter].join(Slotted.partSeparator)

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    section: { type: String },
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