import {apiRequest} from '@/shared/api/apiClient'

export interface NotificationItem{key:string;type:'NEW_MESSAGE'|'TASK_DUE'|'LEAD_FOLLOW_UP';title:string;description:string;href:string;occurredAt:string}
export interface NotificationsResponse{items:NotificationItem[];total:number}

export const notificationsApi={
 list:()=>apiRequest<NotificationsResponse>('/notifications'),
 dismiss:(keys:string[])=>apiRequest<void>('/notifications/dismiss',{method:'POST',body:JSON.stringify({keys})}),
}
