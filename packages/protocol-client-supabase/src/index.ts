import { createClient } from "@supabase/supabase-js"

const projectUrl = 'https://londrhbubledxrvsznll.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbmRyaGJ1YmxlZHhydnN6bmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDM4MTcsImV4cCI6MTk4NjUxOTgxN30.BAy8J9nnjc2BQNheVhVBsenNsTml5ImFX52pRlpL5Zs'
const supabase = createClient(projectUrl, anonKey)

export const useClient = () => {
  return { supabaseClient: supabase }
}