import {CalendarPlus,ChevronLeft,ChevronRight} from 'lucide-react'
import {useMemo} from 'react'
import type {Task} from '../types'
import {taskDateFromKey,taskDateKey} from '../taskDate'
import {TaskCard} from './TaskCard'

const monthLabel=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'})
const fullDate=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})
const cellDate=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long'})
const taskTime=new Intl.DateTimeFormat('pt-BR',{hour:'2-digit',minute:'2-digit'})
const weekDays=['SEG','TER','QUA','QUI','SEX','SÁB','DOM']
export function TaskCalendar({tasks,month,selectedDate,onPreviousMonth,onNextMonth,onToday,onSelectDate,onCreateForDate,onToggleStatus,onRemove}:{tasks:Task[];month:Date;selectedDate:string;onPreviousMonth:()=>void;onNextMonth:()=>void;onToday:()=>void;onSelectDate:(key:string)=>void;onCreateForDate:(key:string)=>void;onToggleStatus:(task:Task,status:Task['status'])=>void;onRemove:(task:Task)=>void}){
 const tasksByDay=useMemo(()=>tasks.reduce<Record<string,Task[]>>((result,task)=>{const key=taskDateKey(task.dueAt);(result[key]??=[]).push(task);result[key].sort((a,b)=>a.dueAt.localeCompare(b.dueAt));return result},{}),[tasks])
 const days=useMemo(()=>{const first=new Date(month.getFullYear(),month.getMonth(),1,12);const mondayOffset=(first.getDay()+6)%7;const start=new Date(first);start.setDate(first.getDate()-mondayOffset);return Array.from({length:42},(_,index)=>{const date=new Date(start);date.setDate(start.getDate()+index);return date})},[month])
 const selectedTasks=tasksByDay[selectedDate]??[]
 const monthPrefix=taskDateKey(month).slice(0,7)
 const monthTasks=tasks.filter(task=>taskDateKey(task.dueAt).startsWith(monthPrefix))
 const today=taskDateKey(new Date())

 return <section className="task-calendar-layout">
  <div className="panel task-calendar-panel">
   <header className="task-calendar-header"><div><span className="eyebrow">VISÃO MENSAL</span><h2>{monthLabel.format(month)}</h2></div><div className="task-calendar-navigation"><button onClick={onToday}>Hoje</button><button onClick={onPreviousMonth} aria-label="Mês anterior"><ChevronLeft size={17}/></button><button onClick={onNextMonth} aria-label="Próximo mês"><ChevronRight size={17}/></button></div></header>
   <div className="task-calendar-summary"><span><strong>{monthTasks.length}</strong> compromissos no mês</span><span><i className="high"/>Alta</span><span><i className="medium"/>Média</span><span><i className="low"/>Baixa</span></div>
   <div className="task-calendar-weekdays">{weekDays.map(label=><span key={label}>{label}</span>)}</div>
   <div className="task-calendar-grid">{days.map(date=>{const key=taskDateKey(date);const dayTasks=tasksByDay[key]??[];const outside=date.getMonth()!==month.getMonth();return <button className={`task-calendar-day ${outside?'outside':''} ${key===today?'today':''} ${key===selectedDate?'selected':''}`} key={key} onClick={()=>onSelectDate(key)} aria-label={`${cellDate.format(date)}, ${dayTasks.length} tarefa(s)`}><span className="task-calendar-number">{date.getDate()}</span><span className="task-calendar-items">{dayTasks.slice(0,2).map(task=><span className={`task-calendar-chip priority-${task.priority.toLowerCase()}`} key={task.id}><time>{taskTime.format(new Date(task.dueAt))}</time>{task.title}</span>)}{dayTasks.length>2&&<span className="task-calendar-more">+{dayTasks.length-2} tarefa(s)</span>}</span></button>})}</div>
  </div>
  <aside className="panel task-day-panel">
   <header><div><span className="eyebrow">AGENDA DO DIA</span><h2>{fullDate.format(taskDateFromKey(selectedDate))}</h2><p>{selectedTasks.length?`${selectedTasks.length} compromisso(s) programado(s)`:'Dia livre na agenda'}</p></div><button className="task-day-add" onClick={()=>onCreateForDate(selectedDate)}><CalendarPlus size={16}/>Agendar</button></header>
   <div className="task-day-list">{selectedTasks.length?selectedTasks.map(task=><TaskCard key={task.id} task={task} onToggleStatus={onToggleStatus} onRemove={onRemove}/>):<div className="task-day-empty"><CalendarPlus size={24}/><strong>Nenhum compromisso</strong><p>Selecione outro dia ou crie uma tarefa.</p><button onClick={()=>onCreateForDate(selectedDate)}>Adicionar tarefa</button></div>}</div>
  </aside>
 </section>
}
