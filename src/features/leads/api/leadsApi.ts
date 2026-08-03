import {apiRequest} from '@/shared/api/apiClient'
import type {Contact,Lead,LeadActivity,LeadsResponse,OrganizationUser,PipelineStagesResponse} from '../types'

interface ListParams{page:number;limit:number;search?:string;stageId?:string;assignedUserId?:string;source?:string;tag?:string}
export interface LeadInput{title:string;contactId:string;stageId:string;assignedUserId?:string;source?:string;notes?:string;interest?:string;tags?:string[];estimatedValue?:number;nextFollowUpAt?:string;expectedCloseAt?:string}
export const leadsApi={
 list:({page,limit,...filters}:ListParams)=>{const params=new URLSearchParams({page:String(page),limit:String(limit)});Object.entries(filters).forEach(([key,value])=>value&&params.set(key,value));return apiRequest<LeadsResponse>(`/leads?${params}`)},
 get:(id:string)=>apiRequest<{lead:Lead}>(`/leads/${id}`),
 create:(input:LeadInput)=>apiRequest<{lead:Lead}>('/leads',{method:'POST',body:JSON.stringify(input)}),
 update:(id:string,input:{title?:string;assignedUserId?:string|null;source?:string|null;notes?:string|null;interest?:string|null;tags?:string[];estimatedValue?:number|null;nextFollowUpAt?:string|null;expectedCloseAt?:string|null})=>apiRequest<{lead:Lead}>(`/leads/${id}`,{method:'PATCH',body:JSON.stringify(input)}),
 stages:()=>apiRequest<PipelineStagesResponse>('/pipeline/stages'),
 updateStage:(leadId:string,stageId:string,lostReason?:string)=>apiRequest<{lead:Lead}>(`/leads/${leadId}/stage`,{method:'PATCH',body:JSON.stringify({stageId,lostReason})}),
 addActivity:(leadId:string,type:LeadActivity['type'],description:string)=>apiRequest<{activity:LeadActivity}>(`/leads/${leadId}/activities`,{method:'POST',body:JSON.stringify({type,description})}),
 createFromConversation:(conversationId:string,input:Record<string,unknown>={})=>apiRequest<{lead:Lead}>(`/leads/from-conversation/${conversationId}`,{method:'POST',body:JSON.stringify(input)}),
 contacts:()=>apiRequest<{data:Contact[]}>('/contacts?limit=100'),
 createContact:(input:{name?:string;phone:string;email?:string})=>apiRequest<{contact:Contact}>('/contacts',{method:'POST',body:JSON.stringify(input)}),
 users:()=>apiRequest<{users:OrganizationUser[]}>('/users'),
}
