import {apiRequest} from '@/shared/api/apiClient'
import type {Client,Owner,RelationshipInput,RelationshipList} from './types'

const query=(search:string)=>{const params=new URLSearchParams({page:'1',limit:'100'});if(search)params.set('search',search);return params}
export const ownersApi={
 list:(search='')=>apiRequest<RelationshipList<Owner>>(`/owners?${query(search)}`),
 create:(input:RelationshipInput)=>apiRequest<{owner:Owner}>('/owners',{method:'POST',body:JSON.stringify(input)}),
 update:(id:string,input:RelationshipInput)=>apiRequest<{owner:Owner}>(`/owners/${id}`,{method:'PATCH',body:JSON.stringify(input)}),
 remove:(id:string)=>apiRequest<void>(`/owners/${id}`,{method:'DELETE'}),
}
export const clientsApi={
 list:(search='')=>apiRequest<RelationshipList<Client>>(`/clients?${query(search)}`),
 create:(input:RelationshipInput)=>apiRequest<{client:Client}>('/clients',{method:'POST',body:JSON.stringify(input)}),
 update:(id:string,input:RelationshipInput)=>apiRequest<{client:Client}>(`/clients/${id}`,{method:'PATCH',body:JSON.stringify(input)}),
 remove:(id:string)=>apiRequest<void>(`/clients/${id}`,{method:'DELETE'}),
}
