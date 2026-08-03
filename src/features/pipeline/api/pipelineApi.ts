import {apiRequest} from '@/shared/api/apiClient'
import type {LeadStage,PipelineStagesResponse} from '@/features/leads/types'

export const pipelineApi={
 create:(name:string,color:string)=>apiRequest<{stage:LeadStage}>('/pipeline/stages',{method:'POST',body:JSON.stringify({name,color})}),
 update:(stageId:string,input:{name?:string;color?:string})=>apiRequest<{stage:LeadStage}>(`/pipeline/stages/${stageId}`,{method:'PATCH',body:JSON.stringify(input)}),
 remove:(stageId:string)=>apiRequest<void>(`/pipeline/stages/${stageId}`,{method:'DELETE'}),
 reorder:(stageIds:string[])=>apiRequest<PipelineStagesResponse>('/pipeline/stages/reorder',{method:'PATCH',body:JSON.stringify({stageIds})}),
}
