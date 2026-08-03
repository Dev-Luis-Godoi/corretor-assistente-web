import {Columns3,List} from 'lucide-react'

export type LeadViewMode='kanban'|'list'
export function ViewToggle({value,onChange}:{value:LeadViewMode;onChange:(mode:LeadViewMode)=>void}){return <div className="view-toggle" aria-label="Modo de visualização"><button className={value==='kanban'?'active':''} onClick={()=>onChange('kanban')} aria-pressed={value==='kanban'}><Columns3 size={15}/>Kanban</button><button className={value==='list'?'active':''} onClick={()=>onChange('list')} aria-pressed={value==='list'}><List size={15}/>Em linha</button></div>}
