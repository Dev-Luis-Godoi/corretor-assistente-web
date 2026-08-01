import type { LucideIcon } from 'lucide-react'
interface Props{title:string;value:string;detail:string;icon:LucideIcon;tone?:'default'|'warning'|'success'}
export function StatCard({title,value,detail,icon:Icon,tone='default'}:Props){return <article className={`stat-card ${tone}`}><div className="stat-top"><span>{title}</span><div className="stat-icon"><Icon size={18}/></div></div><strong>{value}</strong><p>{detail}</p></article>}
