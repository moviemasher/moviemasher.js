import React from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { SupabaseProtocol } from '@moviemasher/protocol-supabase'
import { ProtocolType } from '@moviemasher/moviemasher.js'


import { AuthOrHome } from './AuthOrHome'
import { AppContext, AppContextInterface } from '../Contexts/AppContext'
import { useClient } from '../Hooks/useClient'

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
  const client = useClient()
  const authProps = { children: <AuthApp />, ...client }
  return <Auth.UserContextProvider { ...authProps } />
}
