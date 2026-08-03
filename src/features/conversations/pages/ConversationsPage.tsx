import {useEffect,useState,type FormEvent} from 'react'
import {CheckCheck,Inbox,MessageCircle,Paperclip,Search,Send,Wifi,WifiOff} from 'lucide-react'
import {AppSidebar} from '@/components/AppSidebar'
import {ApiError} from '@/shared/api/apiClient'
import {conversationsApi} from '../api/conversationsApi'
import type {Conversation,Message} from '../types'
import '../conversations.css'

const time=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'});const day=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'})
const initials=(name:string|null)=>name?.split(' ').slice(0,2).map(part=>part[0]).join('').toUpperCase()||'--'

export function ConversationsPage({onLogout}:{onLogout:()=>void}){
 const [collapsed,setCollapsed]=useState(false);const [mobileOpen,setMobileOpen]=useState(false);const [userMenu,setUserMenu]=useState(false);const [items,setItems]=useState<Conversation[]>([]);const [selected,setSelected]=useState<Conversation|null>(null);const [messages,setMessages]=useState<Message[]>([]);const [searchInput,setSearchInput]=useState('');const [search,setSearch]=useState('');const [status,setStatus]=useState('OPEN');const [loading,setLoading]=useState(true);const [error,setError]=useState('');const [draft,setDraft]=useState('');const [sending,setSending]=useState(false)
 useEffect(()=>{
  let active=true
  let inFlight=false
  const load=async()=>{if(inFlight||document.visibilityState==='hidden')return;inFlight=true;try{const result=await conversationsApi.list(search,status);if(active){setItems(result.data);setSelected(current=>current?result.data.find(item=>item.id===current.id)??result.data[0]??null:result.data[0]??null);setError('')}}catch(caught){if(active)setError(caught instanceof ApiError?caught.message:'Não foi possível carregar as conversas.')}finally{inFlight=false;if(active)setLoading(false)}}
  void load()
  const timer=window.setInterval(()=>void load(),5000)
  return()=>{active=false;window.clearInterval(timer)}
 },[search,status])
 const selectedId=selected?.id
 useEffect(()=>{
  if(!selectedId)return
  let active=true
  let inFlight=false
  const load=async()=>{if(inFlight||document.visibilityState==='hidden')return;inFlight=true;try{const result=await conversationsApi.messages(selectedId);if(active)setMessages([...result.data].reverse())}catch(caught){if(active)setError(caught instanceof ApiError?caught.message:'Não foi possível carregar as mensagens.')}finally{inFlight=false}}
  void load()
  const timer=window.setInterval(()=>void load(),3000)
  return()=>{active=false;window.clearInterval(timer)}
 },[selectedId])
 const submit=(event:FormEvent)=>{event.preventDefault();setLoading(true);setSearch(searchInput.trim())}
 const send=async(event:FormEvent)=>{event.preventDefault();if(!selected||!draft.trim())return;setSending(true);try{const {message}=await conversationsApi.sendText(selected.id,draft.trim());setMessages(current=>[...current,message]);setDraft('')}catch(caught){setError(caught instanceof ApiError?caught.message:'Não foi possível enviar a mensagem.')}finally{setSending(false)}}
 return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}>
  <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={()=>setCollapsed(value=>!value)} onMobileClose={()=>setMobileOpen(value=>!value)} onUserMenu={()=>setUserMenu(value=>!value)} userMenuOpen={userMenu} onLogout={onLogout}/>
  <main><header className="page-header"><div><span className="eyebrow">ATENDIMENTO</span><h1>Conversas</h1><p>Acompanhe seus contatos recebidos pelo WhatsApp.</p></div><span className="whatsapp-connection"><Wifi size={15}/>Atualização automática</span></header>
   <div className="conversations-content">{error&&<div className="inline-error">{error}<button onClick={()=>setError('')}>×</button></div>}<section className="conversation-workspace">
    <aside className="conversation-inbox"><div className="conversation-filters"><form onSubmit={submit}><Search size={16}/><input value={searchInput} onChange={event=>setSearchInput(event.target.value)} placeholder="Buscar contato..."/></form><select value={status} onChange={event=>{setLoading(true);setStatus(event.target.value)}}><option value="OPEN">Abertas</option><option value="CLOSED">Fechadas</option><option value="ARCHIVED">Arquivadas</option><option value="">Todas</option></select></div><div className="conversation-items">{loading?<div className="conversation-loading">Carregando...</div>:items.length===0?<div className="conversation-empty"><Inbox size={22}/>Nenhuma conversa encontrada.</div>:items.map(conversation=>{const last=conversation.messages[0];return <button className={selected?.id===conversation.id?'active':''} onClick={()=>setSelected(conversation)} key={conversation.id}><span className="avatar">{initials(conversation.contact.name)}</span><span className="conversation-preview"><strong>{conversation.contact.name||conversation.contact.phone}</strong><small>{last?.content||`Mensagem ${last?.type?.toLowerCase()||''}`}</small></span><span className="conversation-side"><time>{conversation.lastMessageAt?day.format(new Date(conversation.lastMessageAt)):''}</time>{conversation.unreadCount>0&&<b>{conversation.unreadCount}</b>}</span></button>})}</div></aside>
    <section className="chat-panel">{selected?<><header><span className="avatar">{initials(selected.contact.name)}</span><div><strong>{selected.contact.name||selected.contact.phone}</strong><small>{selected.contact.phone} · {selected.whatsappAccount.name}</small></div><span className={selected.whatsappAccount.isConnected?'connected':'disconnected'}>{selected.whatsappAccount.isConnected?<Wifi size={13}/>:<WifiOff size={13}/>}</span></header><div className="message-history">{messages.map(message=><div className={`message-bubble ${message.direction==='OUTBOUND'?'outbound':'inbound'}`} key={message.id}><p>{message.content||`[${message.type.toLowerCase()}]`}</p><span>{time.format(new Date(message.sentAt))}{message.direction==='OUTBOUND'&&<CheckCheck size={12}/>}</span></div>)}</div><form className="message-composer" onSubmit={send}><button type="button" disabled aria-label="Anexar"><Paperclip size={18}/></button><input value={draft} onChange={event=>setDraft(event.target.value)} maxLength={4096} placeholder="Digite uma mensagem..."/><button disabled={sending||!draft.trim()} aria-label="Enviar"><Send size={18}/></button></form></>:<div className="chat-placeholder"><MessageCircle size={28}/><strong>Selecione uma conversa</strong><p>O histórico aparecerá aqui.</p></div>}</section>
   </section></div>
  </main>
 </div>
}
