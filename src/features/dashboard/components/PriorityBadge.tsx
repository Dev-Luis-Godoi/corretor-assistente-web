import type {Priority} from '../types'

export function PriorityBadge({priority}:{priority:Priority}){return <span className={`priority priority-${priority.toLowerCase().replace('é','e')}`}><i/>{priority}</span>}
