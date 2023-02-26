import React from 'react'
// import { Auth } from './Auth'
import { Auth } from '@supabase/auth-ui-react'

// import '@moviemasher/theme-default/moviemasher.css'

import { AuthOrHome } from './AuthOrHome'
import { AppContext, AppContextInterface } from '../Contexts/AppContext'
import { useClient } from '../Hooks/useClient'
import { SupabaseProtocol } from '@moviemasher/protocol-supabase'
import { ProtocolType } from '@moviemasher/moviemasher.js'
 
// export const App = () => {
//   const [session, setSession] = React.useState<Session | null>(null)

//   React.useEffect(() => {
//     const supabase = Plugins.protocol.supabase.client as SupabaseClient

//     supabase.auth.getSession().then(({ data: { session } }) => {
//       console.log('getSession', session)
//       setSession(session)
//     })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       console.log('onAuthStateChange', session)
//       setSession(session)
//     })
//   }, [])

//   if (!session) return <Auth />
  
//   // create mash object containing text clip on a track
//   const clip = { 
//     container: { string: 'Hello World!' }, 
//     containerId: TextContainerId
//   }
//   const mash = { id: idTemporary(), request: { response: { tracks: [{ clips: [clip] }] } } } 
//   const options = { edited: { mash }, previewSize: { width: 480, height: 270 } }
//   const props = MasherDefaultProps(options)

//   return <Masher { ...props } />
// }



export const AuthApp = () => {
  const [initialized, setInitialized] = React.useState(false)
  // const children = [<header key='header'>Media<SignOut /></header>]
  // children.push()
  // children.push(<footer key='footer'>Made with 🍁 in Vermont</footer>)
  const initialize = () => { setInitialized(true) }
  const appContext: AppContextInterface = { initialized, initialize }
  const appProps = {
    value: appContext, children: <AuthOrHome key='main'/>
  }
  return <AppContext.Provider { ...appProps }/>
}

export const App = () => {

console.log('ProtocolSupabase', ProtocolType, SupabaseProtocol)
  // return <div>APP</div>
  const client = useClient()
  const authProps = { children: <AuthApp />, ...client }
  return <Auth.UserContextProvider { ...authProps } />
}
