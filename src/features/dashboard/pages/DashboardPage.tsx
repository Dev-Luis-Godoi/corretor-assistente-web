import {useMemo,useState} from 'react'
import {CalendarCheck,Handshake,MessageSquareWarning,UserPlus} from 'lucide-react'
import {AppSidebar} from '@/components/AppSidebar'
import {DashboardHeader} from '@/components/DashboardHeader'
import {AssistantCard} from '../components/AssistantCard'
import {AttentionLeadList} from '../components/AttentionLeadList'
import {CreateLeadModal} from '../components/CreateLeadModal'
import {LeadDetailsDrawer} from '../components/LeadDetailsDrawer'
import {PipelineSummary} from '../components/PipelineSummary'
import {RecentConversationList} from '../components/RecentConversationList'
import {StatCard} from '../components/StatCard'
import {TodaySchedule} from '../components/TodaySchedule'
import {conversations,leads,pipeline,schedule} from '../data/mockData'
import type {Lead} from '../types'

export function DashboardPage(){const [collapsed,setCollapsed]=useState(false);const [mobileOpen,setMobileOpen]=useState(false);const [userMenu,setUserMenu]=useState(false);const [notifications,setNotifications]=useState(false);const [createOpen,setCreateOpen]=useState(false);const [selectedLead,setSelectedLead]=useState<Lead|null>(null);const [search,setSearch]=useState('');const visibleLeads=useMemo(()=>leads.filter(l=>`${l.name} ${l.interest}`.toLowerCase().includes(search.toLowerCase())),[search]);return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}>
 <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={()=>setCollapsed(v=>!v)} onMobileClose={()=>setMobileOpen(v=>!v)} onUserMenu={()=>setUserMenu(v=>!v)} userMenuOpen={userMenu}/>
 <main><DashboardHeader onCreate={()=>setCreateOpen(true)} onNotifications={()=>setNotifications(v=>!v)} notificationsOpen={notifications} search={search} onSearch={setSearch}/><div className="dashboard-content">
  <div className="stats-grid"><StatCard title="Novos leads" value="18" detail="↑ 12% esta semana" icon={UserPlus} tone="success"/><StatCard title="Aguardando resposta" value="7" detail="Requer sua atenção" icon={MessageSquareWarning} tone="warning"/><StatCard title="Visitas agendadas" value="6" detail="3 para hoje" icon={CalendarCheck}/><StatCard title="Negócios fechados" value="3" detail="R$ 1,2 mi em VGV" icon={Handshake} tone="success"/></div>
  <AssistantCard/><div className="main-grid"><AttentionLeadList leads={visibleLeads} onOpen={setSelectedLead}/><PipelineSummary stages={pipeline}/></div><div className="lower-grid"><RecentConversationList items={conversations}/><TodaySchedule items={schedule}/></div>
 </div></main><CreateLeadModal open={createOpen} onClose={()=>setCreateOpen(false)}/><LeadDetailsDrawer lead={selectedLead} onClose={()=>setSelectedLead(null)}/></div>}
