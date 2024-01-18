
import { isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { CONFIGURATION  } from './Configuration.js'

import { DocumentationBuilder } from './DocumentationBuilder.js'

const renderedsOrError = await new DocumentationBuilder().run(CONFIGURATION)
if (isDefiniteError(renderedsOrError)) console.log(renderedsOrError)