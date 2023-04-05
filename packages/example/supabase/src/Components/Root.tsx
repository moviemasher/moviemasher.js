import { Runtime } from '@moviemasher/lib-core'
import { EnvironmentKeySupabaseProjectUrl, EnvironmentKeySupabaseAnonKey } from '@moviemasher/protocol-supabase'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './App'

Runtime.environment.set(
  EnvironmentKeySupabaseProjectUrl, 'https://londrhbubledxrvsznll.supabase.co'
)
Runtime.environment.set(
  EnvironmentKeySupabaseAnonKey, 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbmRyaGJ1YmxlZHhydnN6bmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDM4MTcsImV4cCI6MTk4NjUxOTgxN30.BAy8J9nnjc2BQNheVhVBsenNsTml5ImFX52pRlpL5Zs'
)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
