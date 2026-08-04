import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from '@/app/App'
import {AuthProvider} from '@/features/auth/context/AuthProvider'
import '@/styles.css'
import '@/features/auth/auth.css'
import '@/form-controls.css'
import '@/features/notifications/notifications.css'

createRoot(document.getElementById('root')!).render(<StrictMode><BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter></StrictMode>)
