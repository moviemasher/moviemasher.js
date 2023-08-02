import { Header } from '../Base/LeftCenterRight.js'

export class ComposerHeaderElement extends Header {}

// register web component as custom element
customElements.define('movie-masher-composer-header', ComposerHeaderElement)
