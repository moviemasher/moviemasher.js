
import { IconString } from '../Base/IconString.js'

export class AElement extends IconString {}

// register web component as custom element
customElements.define('movie-masher-component-a', AElement)
