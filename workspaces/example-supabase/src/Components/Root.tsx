import { Config, config } from '@moviemasher/client-core';
import React from 'react';
import ReactDOM from 'react-dom/client'

import { App } from './App';

config(Config.SUPABASE_PROJECT_URL, 'https://londrhbubledxrvsznll.supabase.co')
config(Config.SUPABASE_ANON_KEY, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvbmRyaGJ1YmxlZHhydnN6bmxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA5NDM4MTcsImV4cCI6MTk4NjUxOTgxN30.BAy8J9nnjc2BQNheVhVBsenNsTml5ImFX52pRlpL5Zs')


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<React.StrictMode><App /></React.StrictMode>)


