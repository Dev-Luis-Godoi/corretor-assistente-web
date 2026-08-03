import {useEffect,useState,type FormEvent} from 'react'
import {Building2,Check,Kanban,LayoutList,Save,ShieldCheck,UsersRound} from 'lucide-react'
import {useAuth} from '@/features/auth/hooks/useAuth'
import {ApiError} from '@/shared/api/apiClient'
import {AccountPageLayout} from './AccountPageLayout'
import {accountApi,type OrganizationSettings} from './accountApi'
import {getDefaultCommercialView,setDefaultCommercialView,type DefaultCommercialView} from './preferences'
import './account.css'

const createdAtFormatter=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'})

export function SettingsPage({onLogout}:{onLogout:()=>void}){
 const {user,refresh}=useAuth()
 const canManage=user?.role==='OWNER'||user?.role==='ADMIN'
 const [organization,setOrganization]=useState<OrganizationSettings|null>(null)
 const [name,setName]=useState(user?.organization.name??'')
 const [view,setView]=useState<DefaultCommercialView>(getDefaultCommercialView)
 const [loading,setLoading]=useState(true)
 const [saving,setSaving]=useState(false)
 const [message,setMessage]=useState('')
 const [error,setError]=useState('')

 useEffect(()=>{let active=true;accountApi.organization().then(({organization:current})=>{if(active){setOrganization(current);setName(current.name)}}).catch(caught=>{if(active)setError(caught instanceof ApiError?caught.message:'Não foi possível carregar as configurações.')}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[])
 const saveOrganization=async(event:FormEvent)=>{event.preventDefault();if(!canManage)return;setSaving(true);setError('');setMessage('');try{const result=await accountApi.updateOrganization(name.trim());setOrganization(result.organization);await refresh();setMessage('Dados da organização atualizados.')}catch(caught){setError(caught instanceof ApiError?caught.message:'Não foi possível atualizar a organização.')}finally{setSaving(false)}}
 const chooseView=(next:DefaultCommercialView)=>{setView(next);setDefaultCommercialView(next);setMessage('Preferência salva neste dispositivo.');setError('')}

 return <AccountPageLayout eyebrow="ESPAÇO DE TRABALHO" title="Configurações" description="Ajuste sua organização e a experiência de uso da plataforma." onLogout={onLogout} aside={<span className="account-secure"><ShieldCheck size={15}/>Dados protegidos</span>}>
  {loading?<div className="account-loading panel"><span/>Carregando configurações...</div>:<div className="account-grid settings-grid">
   <section className="account-card panel">
    <header><span><Building2 size={18}/></span><div><h2>Organização</h2><p>Nome usado para identificar seu espaço de trabalho.</p></div></header>
    <form className="settings-form" onSubmit={saveOrganization}>
     <label>Nome da empresa<input required minLength={2} maxLength={120} disabled={!canManage} value={name} onChange={event=>setName(event.target.value)}/></label>
     {!canManage&&<p className="form-hint">Somente proprietários e administradores podem alterar este dado.</p>}
     {error&&<p className="form-feedback error" role="alert">{error}</p>}{message&&<p className="form-feedback success" role="status">{message}</p>}
     <button className="primary-button account-save" disabled={!canManage||saving||name.trim().length<2}><Save size={15}/>{saving?'Salvando...':'Salvar organização'}</button>
    </form>
    <div className="organization-meta"><span><UsersRound size={15}/><b>{organization?._count.users??0}</b> usuário{organization?._count.users===1?'':'s'}</span><span>Conta criada em {organization?createdAtFormatter.format(new Date(organization.createdAt)):'—'}</span></div>
   </section>
   <section className="account-card panel">
    <header><span><Kanban size={18}/></span><div><h2>Visualização comercial</h2><p>Escolha como Leads e Pipeline devem abrir por padrão.</p></div></header>
    <div className="view-preference" role="radiogroup" aria-label="Visualização comercial padrão">
     <button className={view==='kanban'?'selected':''} role="radio" aria-checked={view==='kanban'} onClick={()=>chooseView('kanban')}><span><Kanban size={19}/></span><div><strong>Kanban</strong><small>Colunas por etapa do funil</small></div>{view==='kanban'&&<Check size={16}/>}</button>
     <button className={view==='list'?'selected':''} role="radio" aria-checked={view==='list'} onClick={()=>chooseView('list')}><span><LayoutList size={19}/></span><div><strong>Em linha</strong><small>Tabela compacta para consulta</small></div>{view==='list'&&<Check size={16}/>}</button>
    </div>
    <p className="preference-note">Essa preferência fica apenas neste dispositivo e não altera os dados do seu funil.</p>
   </section>
  </div>}
 </AccountPageLayout>
}
