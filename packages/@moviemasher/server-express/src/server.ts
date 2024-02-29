import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'

await MOVIE_MASHER.importPromise()

const options = HostDefaultOptions()
const host = new Host(options)
host.start()

