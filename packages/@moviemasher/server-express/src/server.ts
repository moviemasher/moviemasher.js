import '@moviemasher/server-lib/runtime.js'

import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'

// load movie masher and its modules
await MOVIE_MASHER.importPromise()

// create and start express server
new Host(HostDefaultOptions()).start()

