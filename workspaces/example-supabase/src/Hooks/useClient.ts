import { Plugins } from "@moviemasher/moviemasher.js"
import { ProtocolSupabase } from "@moviemasher/protocol-supabase"
// import { SupabaseClient } from "@supabase/supabase-js"

export const useClient = () => {
  console.log('useClient', Plugins)
  const { client } = Plugins.protocol.supabase as ProtocolSupabase
  // const client  = Plugins.protocol.supabase.client as SupabaseClient

  return { supabaseClient: client }
}