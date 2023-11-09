
import { CONFIGURATION  } from './Configuration.js'

import { Render } from './Render.js'

const renderedsOrError = await new Render().run(CONFIGURATION)
console.log(renderedsOrError)