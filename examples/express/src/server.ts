import { ServerEventDispatcherModule } from '@moviemasher/lib-server'
import { MOVIEMASHER_SERVER } from '@moviemasher/runtime-server'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'

MOVIEMASHER_SERVER.eventDispatcher = new ServerEventDispatcherModule()
MOVIEMASHER_SERVER.importPromise.then(() => {
  const options = HostDefaultOptions()
  console.log('server.js', options)
  const host = new Host(options)
  host.start()
})
