import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'

await MOVIEMASHER.importPromise()

const options = HostDefaultOptions()
const host = new Host(options)
host.start()

