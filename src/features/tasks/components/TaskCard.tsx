import {Check,Clock3,Trash2} from 'lucide-react'
import type {Task} from '../types'

const dateTime=new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short'})

export function TaskCard({task,onToggleStatus,onRemove}:{task:Task;onToggleStatus:(task:Task,status:Task['status'])=>void;onRemove:(task:Task)=>void}){
 return <article className={`task-card priority-${task.priority.toLowerCase()} ${task.status!=='PENDING'?'done':''}`}>
  <button className="task-check" onClick={()=>onToggleStatus(task,task.status==='COMPLETED'?'PENDING':'COMPLETED')} aria-label={task.status==='COMPLETED'?`Reabrir ${task.title}`:`Concluir ${task.title}`}><Check size={15}/></button>
  <div><strong>{task.title}</strong><p>{task.description||task.lead?.title||'Tarefa geral'}</p><small><Clock3 size={12}/>{dateTime.format(new Date(task.dueAt))}{task.lead&&<> · {task.lead.contact.name||task.lead.contact.phone}</>}</small></div>
  <span className={`priority-label ${task.priority.toLowerCase()}`}>{task.priority==='HIGH'?'Alta':task.priority==='LOW'?'Baixa':'Média'}</span>
  <button className="task-delete" onClick={()=>onRemove(task)} aria-label={`Excluir ${task.title}`}><Trash2 size={15}/></button>
 </article>
}
