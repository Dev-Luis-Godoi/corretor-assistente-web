import {useCallback,useEffect,useMemo,useState,type FormEvent} from 'react'
import {CalendarDays,List,Plus} from 'lucide-react'
import {useSearchParams} from 'react-router-dom'
import {AppSidebar} from '@/components/AppSidebar'
import {ApiError} from '@/shared/api/apiClient'
import {leadsApi} from '@/features/leads/api/leadsApi'
import type {Lead} from '@/features/leads/types'
import {TaskCalendar} from './components/TaskCalendar'
import {TaskCard} from './components/TaskCard'
import {taskDateFromKey,taskDateKey} from './taskDate'
import {tasksApi} from './tasksApi'
import type {Task} from './types'
import './tasks.css'
import './tasks-calendar.css'

const day=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long'})
const toLocalInput=(date=new Date(Date.now()+24*60*60_000))=>{const local=new Date(date.getTime()-date.getTimezoneOffset()*60_000);return local.toISOString().slice(0,16)}
const initialMonth=()=>{const now=new Date();return new Date(now.getFullYear(),now.getMonth(),1,12)}

export function TasksPage({onLogout}:{onLogout:()=>void}){
 const [params]=useSearchParams()
 const [collapsed,setCollapsed]=useState(false)
 const [mobileOpen,setMobileOpen]=useState(false)
 const [userMenu,setUserMenu]=useState(false)
 const [tasks,setTasks]=useState<Task[]>([])
 const [leads,setLeads]=useState<Lead[]>([])
 const [filter,setFilter]=useState('PENDING')
 const [view,setView]=useState<'calendar'|'agenda'>('calendar')
 const [month,setMonth]=useState(initialMonth)
 const [selectedDate,setSelectedDate]=useState(()=>taskDateKey(new Date()))
 const [creating,setCreating]=useState(Boolean(params.get('lead')))
 const [title,setTitle]=useState('')
 const [description,setDescription]=useState('')
 const [dueAt,setDueAt]=useState(toLocalInput())
 const [priority,setPriority]=useState('MEDIUM')
 const [leadId,setLeadId]=useState(params.get('lead')??'')
 const [error,setError]=useState('')

 const load=useCallback(()=>Promise.all([tasksApi.list(filter||undefined),leadsApi.list({page:1,limit:100})]).then(([taskResult,leadResult])=>{setTasks(taskResult.tasks);setLeads(leadResult.data);setError('')}).catch(caught=>setError(caught instanceof ApiError?caught.message:'Não foi possível carregar as tarefas.')),[filter])
 useEffect(()=>{void load()},[load])

 const groups=useMemo(()=>Object.entries(tasks.reduce<Record<string,Task[]>>((result,task)=>{const key=taskDateKey(task.dueAt);(result[key]??=[]).push(task);return result},{})).sort(([a],[b])=>a.localeCompare(b)).map(([date,items])=>[date,items.sort((a,b)=>a.dueAt.localeCompare(b.dueAt))] as const),[tasks])

 const submit=async(event:FormEvent)=>{event.preventDefault();try{const {task}=await tasksApi.create({title,description:description||undefined,dueAt:new Date(dueAt).toISOString(),priority,leadId:leadId||undefined});setTasks(items=>[...items,task].sort((a,b)=>a.dueAt.localeCompare(b.dueAt)));setSelectedDate(taskDateKey(task.dueAt));setMonth(new Date(new Date(task.dueAt).getFullYear(),new Date(task.dueAt).getMonth(),1,12));setTitle('');setDescription('');setCreating(false)}catch(caught){setError(caught instanceof ApiError?caught.message:'Não foi possível criar a tarefa.')}}
 const changeStatus=async(task:Task,status:Task['status'])=>{try{const {task:updated}=await tasksApi.update(task.id,{status});setTasks(items=>filter&&status!==filter?items.filter(item=>item.id!==task.id):items.map(item=>item.id===task.id?updated:item))}catch(caught){setError(caught instanceof ApiError?caught.message:'Não foi possível atualizar a tarefa.')}}
 const removeTask=async(task:Task)=>{if(!window.confirm(`Excluir a tarefa “${task.title}”?`))return;try{await tasksApi.remove(task.id);setTasks(items=>items.filter(item=>item.id!==task.id))}catch(caught){setError(caught instanceof ApiError?caught.message:'Não foi possível excluir a tarefa.')}}
 const moveMonth=(offset:number)=>{const next=new Date(month.getFullYear(),month.getMonth()+offset,1,12);setMonth(next);setSelectedDate(taskDateKey(next))}
 const goToday=()=>{const today=new Date();setMonth(new Date(today.getFullYear(),today.getMonth(),1,12));setSelectedDate(taskDateKey(today))}
 const selectDate=(key:string)=>{const selected=taskDateFromKey(key);setSelectedDate(key);if(selected.getMonth()!==month.getMonth()||selected.getFullYear()!==month.getFullYear())setMonth(new Date(selected.getFullYear(),selected.getMonth(),1,12))}
 const createForDate=(key:string)=>{const date=taskDateFromKey(key);date.setHours(9,0,0,0);setSelectedDate(key);setDueAt(toLocalInput(date));setCreating(true)}

 return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}>
  <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={()=>setCollapsed(value=>!value)} onMobileClose={()=>setMobileOpen(value=>!value)} onUserMenu={()=>setUserMenu(value=>!value)} userMenuOpen={userMenu} onLogout={onLogout}/>
  <main className="tasks-main">
   <header className="page-header"><div><span className="eyebrow">ORGANIZAÇÃO</span><h1>Agenda e tarefas</h1><p>Visitas, retornos e follow-ups ligados aos seus leads.</p></div><button className="primary-button" onClick={()=>{setDueAt(toLocalInput());setCreating(value=>!value)}}><Plus size={17}/>Nova tarefa</button></header>
   <div className="tasks-content">
    {creating&&<form className="task-form panel" onSubmit={event=>void submit(event)}><label>Título<input required value={title} onChange={event=>setTitle(event.target.value)} placeholder="Ex.: Retornar contato"/></label><label>Data e horário<input required type="datetime-local" value={dueAt} onChange={event=>setDueAt(event.target.value)}/></label><label>Prioridade<select value={priority} onChange={event=>setPriority(event.target.value)}><option value="LOW">Baixa</option><option value="MEDIUM">Média</option><option value="HIGH">Alta</option></select></label><label>Lead<select value={leadId} onChange={event=>setLeadId(event.target.value)}><option value="">Sem lead</option>{leads.map(lead=><option key={lead.id} value={lead.id}>{lead.contact.name||lead.title}</option>)}</select></label><label className="task-description">Descrição<input value={description} onChange={event=>setDescription(event.target.value)}/></label><button className="primary-button">Agendar</button></form>}
    <section className={`task-workspace panel view-${view}`}>
     <div className="task-toolbar">
      <div className="task-filters" aria-label="Filtrar tarefas por status"><button type="button" className={filter==='PENDING'?'active':''} onClick={()=>setFilter('PENDING')}>Pendentes</button><button type="button" className={filter==='COMPLETED'?'active':''} onClick={()=>setFilter('COMPLETED')}>Concluídas</button><button type="button" className={!filter?'active':''} onClick={()=>setFilter('')}>Todas</button></div>
      <div className="task-view-toggle" aria-label="Visualização das tarefas"><button type="button" className={view==='calendar'?'active':''} onClick={()=>setView('calendar')}><CalendarDays size={15}/>Calendário</button><button type="button" className={view==='agenda'?'active':''} onClick={()=>setView('agenda')}><List size={15}/>Agenda</button></div>
     </div>
     {error&&<div className="inline-error">{error}<button onClick={()=>setError('')}>×</button></div>}
     {view==='calendar'?<TaskCalendar tasks={tasks} month={month} selectedDate={selectedDate} onPreviousMonth={()=>moveMonth(-1)} onNextMonth={()=>moveMonth(1)} onToday={goToday} onSelectDate={selectDate} onCreateForDate={createForDate} onToggleStatus={(task,status)=>void changeStatus(task,status)} onRemove={task=>void removeTask(task)}/>:<section className="task-agenda">{groups.length===0?<div className="tasks-empty"><CalendarDays size={25}/><strong>Nenhuma tarefa neste período</strong></div>:groups.map(([date,items])=><div className="task-day" key={date}><header><CalendarDays size={16}/><strong>{day.format(taskDateFromKey(date))}</strong><span>{items.length}</span></header>{items.map(task=><TaskCard key={task.id} task={task} onToggleStatus={(item,status)=>void changeStatus(item,status)} onRemove={item=>void removeTask(item)}/>)}</div>)}</section>}
    </section>
   </div>
  </main>
 </div>
}
