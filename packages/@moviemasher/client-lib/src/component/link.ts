import { ComponentClicker } from '../base/Component.js'

export const LinkTag = 'movie-masher-link'
/**
 * @category Elements
 */
export class LinkElement extends ComponentClicker {}

customElements.define(LinkTag, LinkElement)
