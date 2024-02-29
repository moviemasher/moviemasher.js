import { ComponentClicker } from '../base/component.js'

export const LinkTag = 'movie-masher-link'
/**
 * @category Elements
 */
export class LinkElement extends ComponentClicker {}

customElements.define(LinkTag, LinkElement)
