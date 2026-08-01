import { Bell,Plus,Search } from 'lucide-react'
interface Props{onCreate:()=>void;onNotifications:()=>void;notificationsOpen:boolean;search:string;onSearch:(value:string)=>void}
export function DashboardHeader({onCreate,onNotifications,notificationsOpen,search,onSearch}:Props){return <header className="top-header">
 <div className="welcome"><p>SEXTA-FEIRA, 31 DE JULHO</p><h1>Bom dia, Luis</h1><span>Veja quem precisa da sua atenção hoje</span></div>
 <div className="header-actions"><label className="global-search"><Search size={17}/><span className="sr-only">Busca global</span><input value={search} onChange={e=>onSearch(e.target.value)} placeholder="Buscar leads, conversas..."/><kbd>⌘ K</kbd></label>
 <div className="notification-wrap"><button className="icon-button" onClick={onNotifications} aria-label="Notificações" aria-expanded={notificationsOpen}><Bell size={19}/><i/></button>{notificationsOpen&&<div className="notification-panel"><strong>Notificações</strong><p><span/>Mariana aguarda retorno há 3 dias.</p><p><span/>Visita com Carlos em 45 minutos.</p><button>Marcar todas como lidas</button></div>}</div>
 <button className="primary-button" onClick={onCreate}><Plus size={18}/>Novo lead</button></div>
 </header>}
