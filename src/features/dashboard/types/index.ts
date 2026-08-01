export type Priority='Alta'|'Média'|'Baixa'
export interface Lead{id:number;name:string;initials:string;interest:string;lastInteraction:string;waiting:string;priority:Priority;phone:string;email:string;source:string;notes:string}
export interface Conversation{id:number;name:string;initials:string;message:string;time:string;unread:number;status:'online'|'offline'}
export interface ScheduleItem{id:number;time:string;title:string;type:'Ligação'|'Visita'|'Follow-up'|'Proposta'}
export interface PipelineStage{label:string;value:number}
