import {lazy,Suspense} from 'react'
import {Navigate,Route,Routes,useLocation} from 'react-router-dom'
import {DashboardPage} from '@/features/dashboard/pages/DashboardPage'
import {LoginPage} from '@/features/auth/pages/LoginPage'
import {useAuth} from '@/features/auth/hooks/useAuth'
import {PipelinePage} from '@/features/pipeline/pages/PipelinePage'
import {ConversationsPage} from '@/features/conversations/pages/ConversationsPage'
import {RegisterPage} from '@/features/auth/pages/RegisterPage'
import {ForgotPasswordPage} from '@/features/auth/pages/ForgotPasswordPage'
import {ResetPasswordPage} from '@/features/auth/pages/ResetPasswordPage'
import {WhatsAppIntegrationPage} from '@/features/integrations/pages/WhatsAppIntegrationPage'
import {TasksPage} from '@/features/tasks/TasksPage'
import {AutomationsPage} from '@/features/automations/AutomationsPage'
import {ProfilePage} from '@/features/account/ProfilePage'
import {SettingsPage} from '@/features/account/SettingsPage'
import {PrivacyPage} from '@/features/account/PrivacyPage'
import {useAdminAuth} from '@/features/admin/useAdminAuth'

const AdminLoginPage=lazy(()=>import('@/features/admin/AdminLoginPage').then(module=>({default:module.AdminLoginPage})))
const AdminDashboardPage=lazy(()=>import('@/features/admin/AdminDashboardPage').then(module=>({default:module.AdminDashboardPage})))

export function App(){
 const {user,loading,logout}=useAuth()
 const {admin,loading:adminLoading}=useAdminAuth()
 const {pathname,search}=useLocation()
 if(pathname.startsWith('/admin')){if(adminLoading)return <div className="app-loading" role="status"><span/><p>Validando acesso administrativo...</p></div>;return <Suspense fallback={<div className="app-loading" role="status"><span/><p>Preparando administração...</p></div>}><Routes><Route path="/admin/login" element={admin?<Navigate to="/admin" replace/>:<AdminLoginPage/>}/><Route path="/admin" element={admin?<AdminDashboardPage/>:<Navigate to="/admin/login" replace/>}/><Route path="/admin/*" element={<Navigate to={admin?'/admin':'/admin/login'} replace/>}/></Routes></Suspense>}
 if(loading)return <div className="app-loading" role="status"><span/><p>Preparando seu espaço...</p></div>
 const canManageWhatsApp=user?.role==='OWNER'||user?.role==='ADMIN'
 return <Routes>
  <Route path="/login" element={user?<Navigate to="/" replace/>:<LoginPage/>}/>
  <Route path="/register" element={user?<Navigate to="/" replace/>:<RegisterPage/>}/>
  <Route path="/forgot-password" element={user?<Navigate to="/" replace/>:<ForgotPasswordPage/>}/>
  <Route path="/reset-password" element={<ResetPasswordPage/>}/>
  <Route path="/" element={user?<DashboardPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/leads" element={<Navigate to={user?`/pipeline${search}`:'/login'} replace/>}/>
  <Route path="/pipeline" element={user?<PipelinePage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/conversations" element={user?<ConversationsPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/tasks" element={user?<TasksPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/automations" element={user?<AutomationsPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/profile" element={user?<ProfilePage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/settings" element={user?<SettingsPage onLogout={logout}/>:<Navigate to="/login" replace/>}/>
  <Route path="/settings/privacy" element={user?(canManageWhatsApp?<PrivacyPage onLogout={logout}/>:<Navigate to="/settings" replace/>):<Navigate to="/login" replace/>}/>
  <Route path="/integrations/whatsapp" element={user?(canManageWhatsApp?<WhatsAppIntegrationPage onLogout={logout}/>:<Navigate to="/" replace/>):<Navigate to="/login" replace/>}/>
  <Route path="*" element={<Navigate to={user?'/':'/login'} replace/>}/>
 </Routes>
}
