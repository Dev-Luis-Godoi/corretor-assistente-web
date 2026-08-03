import {Navigate,Route,Routes} from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import {LoginPage} from '@/features/auth/pages/LoginPage'
import {useAuth} from '@/features/auth/hooks/useAuth'
import {LeadsPage} from '@/features/leads/pages/LeadsPage'
import {PipelinePage} from '@/features/pipeline/pages/PipelinePage'
import {ConversationsPage} from '@/features/conversations/pages/ConversationsPage'
import {RegisterPage} from '@/features/auth/pages/RegisterPage'
import {ForgotPasswordPage} from '@/features/auth/pages/ForgotPasswordPage'
import {ResetPasswordPage} from '@/features/auth/pages/ResetPasswordPage'

export function App(){
 const {user,loading,logout}=useAuth()
 if(loading)return <div className="app-loading" role="status"><span/><p>Preparando seu espaço...</p></div>
 return <Routes>
  <Route path="/login" element={user?<Navigate to="/" replace/>:<LoginPage/>}/>
  <Route path="/register" element={user?<Navigate to="/" replace/>:<RegisterPage/>}/>
  <Route path="/forgot-password" element={user?<Navigate to="/" replace/>:<ForgotPasswordPage/>}/>
  <Route path="/reset-password" element={user?<Navigate to="/" replace/>:<ResetPasswordPage/>}/>
  <Route path="/" element={user?<DashboardPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/leads" element={user?<LeadsPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/pipeline" element={user?<PipelinePage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/conversations" element={user?<ConversationsPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="*" element={<Navigate to={user?'/':'/login'} replace/>}/>
 </Routes>
}
