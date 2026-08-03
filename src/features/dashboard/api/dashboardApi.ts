import {apiRequest} from '@/shared/api/apiClient'

export interface DashboardSummary{stats:{newLeads:number;awaitingResponse:number;visits:number;closed:number;closedValue:string|number};pipeline:Array<{id:string;name:string;color:string|null;position:number;isWon:boolean;isLost:boolean;leads:number}>;recentConversations:Array<{id:string;status:string;unreadCount:number;lastMessageAt:string|null;contact:{name:string|null;phone:string;avatarUrl:string|null};messages:Array<{content:string|null;type:string;sentAt:string}>}>}
export const dashboardApi={summary:()=>apiRequest<DashboardSummary>('/dashboard/summary')}
