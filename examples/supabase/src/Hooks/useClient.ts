import { ProtocolType, Runtime } from "@moviemasher/moviemasher.js"
import { ProtocolSupabase } from "@moviemasher/protocol-supabase"

export const useClient = () => {
  const { client } = Runtime.plugins[ProtocolType].supabase as ProtocolSupabase
  return { supabaseClient: client }
}