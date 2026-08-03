import {useEffect,useState} from 'react'
import {CalendarCheck,Handshake,MessageSquareWarning,UserPlus} from 'lucide-react'
import {AppSidebar} from '@/components/AppSidebar'
import {DashboardHeader} from '@/components/DashboardHeader'
import {CreateLeadModal} from '../components/CreateLeadModal'
import {PipelineSummary} from '../components/PipelineSummary'
import {RecentConversationList} from '../components/RecentConversationList'
import {StatCard} from '../components/StatCard'
import type {Conversation,PipelineStage} from '../types'
import {dashboardApi,type DashboardSummary} from '../api/dashboardApi'
import '../dashboard.css'

const compactMoney=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',notation:'compact',maximumFractionDigits:1});const clock=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'})
export function DashboardPage({onLogout}:{onLogout:()=>void}){const [collapsed,setCollapsed]=useState(false);const [mobileOpen,setMobileOpen]=useState(false);const [userMenu,setUserMenu]=useState(false);const [notifications,setNotifications]=useState(false);const [createOpen,setCreateOpen]=useState(false);const [search,setSearch]=useState('');const [summary,setSummary]=useState<DashboardSummary|null>(null)
 useEffect(()=>{let active=true;dashboardApi.summary().then(result=>{if(active)setSummary(result)}).catch(()=>undefined);return()=>{active=false}},[])
 const pipeline:PipelineStage[]=summary?.pipeline.map(stage=>({label:stage.name,value:stage.leads}))??[];const conversations:Conversation[]=summary?.recentConversations.map((item,index)=>({id:index,name:item.contact.name||item.contact.phone,initials:(item.contact.name||item.contact.phone).slice(0,2).toUpperCase(),message:item.messages[0]?.content||`Mensagem ${item.messages[0]?.type?.toLowerCase()||''}`,time:item.lastMessageAt?clock.format(new Date(item.lastMessageAt)):'',unread:item.unreadCount,status:'online'}))??[]
 return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}><AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={()=>setCollapsed(value=>!value)} onMobileClose={()=>setMobileOpen(value=>!value)} onUserMenu={()=>setUserMenu(value=>!value)} userMenuOpen={userMenu} onLogout={onLogout}/><main><DashboardHeader onCreate={()=>setCreateOpen(true)} onNotifications={()=>setNotifications(value=>!value)} notificationsOpen={notifications} search={search} onSearch={setSearch}/><div className="dashboard-content compact-dashboard"><div className="stats-grid"><StatCard title="Novos leads" value={String(summary?.stats.newLeads??'—')} detail="Nos últimos 7 dias" icon={UserPlus} tone="success"/><StatCard title="Aguardando resposta" value={String(summary?.stats.awaitingResponse??'—')} detail="Conversas não lidas" icon={MessageSquareWarning} tone="warning"/><StatCard title="Em etapa de visita" value={String(summary?.stats.visits??'—')} detail="Oportunidades ativas" icon={CalendarCheck}/><StatCard title="Negócios fechados" value={String(summary?.stats.closed??'—')} detail={summary?`${compactMoney.format(Number(summary.stats.closedValue))} em VGV`:'Carregando...'} icon={Handshake} tone="success"/></div><div className="compact-dashboard-grid"><PipelineSummary stages={pipeline}/><RecentConversationList items={conversations}/></div></div></main><CreateLeadModal open={createOpen} onClose={()=>setCreateOpen(false)}/></div>}
