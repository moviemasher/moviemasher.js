import { MOVIEMASHER } from '@moviemasher/shared-lib/runtime.js'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'
import { ServerEventDispatcherModule } from '@moviemasher/server-lib/utility/ServerEventDispatcherModule.js'

MOVIEMASHER.eventDispatcher = new ServerEventDispatcherModule()
MOVIEMASHER.importPromise.then(() => {
  const options = HostDefaultOptions()
  // console.log('server.js', options)
  const host = new Host(options)
  host.start()
})
