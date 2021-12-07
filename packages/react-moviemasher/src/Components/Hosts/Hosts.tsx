import React from 'react'
import { RemoteServer, urlForRemoteServer, idPrefixSet } from '@moviemasher/moviemasher.js'

import { HostsContext } from '../../Contexts/HostsContext'

interface HostsProps {
  remoteServer?: RemoteServer
 }

const Hosts: React.FunctionComponent<HostsProps> = (props) => {
  const [servers, setServers] = React.useState<Record<string, RemoteServer>>(() => ({}))
  const [enabled, setEnabled] = React.useState<string []>(() => ([]))
  const { remoteServer, children } = props
  const server = remoteServer || { prefix: '/hosts' }
  const urlString = urlForRemoteServer(server)

  const remoteServerPromise = (id: string): Promise<RemoteServer> => {
    if (servers[id]) return Promise.resolve(servers[id])

    const url = `${urlString}/${id}`
    console.debug("Hosts fetching", url)
    return fetch(url).then(response => response.json()).then(result => {
      console.log(result)
      setServers(servers => ({ ...servers, [id]: result }))
      return result
    }).catch((error) => { console.error("Hosts failed to load", url, error) })
  }


  React.useEffect(() => {
    if (urlString) {
      console.debug("Hosts fetching", urlString)
      fetch(urlString).then(response => response.json()).catch(error => {
        console.error("Hosts failed to load", urlString, error)
        return { enabled: [] }
      }).then(result => {
        console.debug("Hosts fetched", urlString, result)
        const { enabled, uuid } = result
        setEnabled(enabled)
        if (uuid) idPrefixSet(uuid)
      })
    } else setEnabled([])
  }, [urlString])

  const hostsContext = { enabled, servers, remoteServerPromise }

  return (
    <HostsContext.Provider value={hostsContext}>
      {children}
    </HostsContext.Provider>
  )
}

export { Hosts, HostsProps }
