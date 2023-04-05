import React from 'react'
import { Provider } from '@supabase/supabase-js'
import { Auth, ThemeSupa } from '@supabase/auth-ui-react'


import { AppContext } from '../Contexts/AppContext'
import { MasherApp, MasherAppDefaultProps } from '@moviemasher/client-react'
import { idTemporary, TextContainerId } from "@moviemasher/lib-core"
import { useClient } from '../Hooks/useClient'

export const AuthOrHome = () => {
  const appContext = React.useContext(AppContext)
  const { initialize, initialized } = appContext
  const client = useClient()
  const authSession = Auth.useUser()
  const { user } = authSession
  React.useEffect(() => {
    if (initialized) return 
    if (user) initialize()
    else setTimeout(initialize, 500)
  }, [initialize, initialized, user])

  if (!initialized) return null //<main />
  if (user) {
    // create mash object containing text clip on a track
    const clip = { 
      container: { string: 'Hello World!' }, 
      containerId: TextContainerId
    }
    const mash = { id: idTemporary(), request: { response: { tracks: [{ clips: [clip] }] } } } 
    const options = { edited: { mash }, previewSize: { width: 480, height: 270 } }
    const props = MasherAppDefaultProps(options)
  
    return <MasherApp { ...props } />  
  }

  const authProps = { 
    ...client, providers: ['github' as Provider], 
    appearance: { theme: ThemeSupa }, theme: 'dark',
  }

  return <main>
   <aside>
   <section><Auth { ...authProps } /></section>
    
      <h1>Welcome</h1>
      <p>
        This example Supabase deployment adds the following tables:
       
      </p>
       <ul>
          <li>media</li>
          <li>probing</li>
          <li>encoding</li>
        </ul>
    </aside>
  </main>
}

