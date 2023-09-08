import { ServerEventDispatcherModule } from '@moviemasher/lib-server'
import { MovieMasher } from '@moviemasher/runtime-server'
import { Host } from './Host/Host.js'
import { HostDefaultOptions } from './Host/HostDefaultOptions.js'

MovieMasher.eventDispatcher = new ServerEventDispatcherModule()
MovieMasher.importPromise.then(() => {
  const options = HostDefaultOptions()
  console.log('server.js', options)
  const host = new Host(options)
  host.start()
})
