import {apiRequest} from '@/shared/api/apiClient'
import type {LeadsResponse,PipelineStagesResponse} from '../types'

interface ListParams{page:number;limit:number;search?:string;stageId?:string}
export const leadsApi={
 list:({page,limit,search,stageId}:ListParams)=>{const params=new URLSearchParams({page:String(page),limit:String(limit)});if(search)params.set('search',search);if(stageId)params.set('stageId',stageId);return apiRequest<LeadsResponse>(`/leads?${params}`)},
 stages:()=>apiRequest<PipelineStagesResponse>('/pipeline/stages'),
 updateStage:(leadId:string,stageId:string)=>apiRequest<{lead:import('../types').Lead}>(`/leads/${leadId}/stage`,{method:'PATCH',body:JSON.stringify({stageId})}),
}
