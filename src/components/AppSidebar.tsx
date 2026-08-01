import { BarChart3,ChevronLeft,ChevronRight,Home,Inbox,Kanban,Menu,Plug,Settings,SquareCheckBig,Users,X } from 'lucide-react'

const items=[['Visão geral',Home],['Pipeline',Kanban],['Conversas',Inbox],['Leads',Users],['Tarefas',SquareCheckBig],['Integrações',Plug],['Configurações',Settings]] as const
interface Props{collapsed:boolean;mobileOpen:boolean;onCollapse:()=>void;onMobileClose:()=>void;onUserMenu:()=>void;userMenuOpen:boolean}
export function AppSidebar({collapsed,mobileOpen,onCollapse,onMobileClose,onUserMenu,userMenuOpen}:Props){return <>
 <button className="mobile-menu" onClick={onMobileClose} aria-label="Abrir menu"><Menu size={20}/></button>
 {mobileOpen&&<button className="sidebar-backdrop" onClick={onMobileClose} aria-label="Fechar menu"/>}
 <aside className={`sidebar ${collapsed?'collapsed':''} ${mobileOpen?'mobile-open':''}`}>
  <div className="brand"><div className="brand-mark"><BarChart3 size={19}/></div><strong>Corretor<br/>Assistente</strong><button className="close-mobile" onClick={onMobileClose} aria-label="Fechar menu"><X size={20}/></button></div>
  <nav aria-label="Navegação principal">{items.map(([label,Icon],i)=><button className={`nav-item ${i===0?'active':''}`} key={label} title={collapsed?label:undefined}><Icon size={19}/><span>{label}</span></button>)}</nav>
  <div className="sidebar-bottom">
   {userMenuOpen&&<div className="user-popover"><button>Meu perfil</button><button>Preferências</button><button>Sair</button></div>}
   <button className="user-card" onClick={onUserMenu} aria-expanded={userMenuOpen}><span className="avatar dark">LG</span><span className="user-copy"><strong>Luis Godoi</strong><small>Administrador</small></span></button>
   <button className="collapse-button" onClick={onCollapse} aria-label={collapsed?'Expandir sidebar':'Recolher sidebar'}>{collapsed?<ChevronRight size={18}/>:<><ChevronLeft size={18}/><span>Recolher menu</span></>}</button>
  </div>
 </aside>
 </>}
