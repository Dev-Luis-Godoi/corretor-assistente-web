import {apiRequest} from '@/shared/api/apiClient'
import type {Property,PropertyInput,PropertyListResponse,PropertyPurpose,PropertyStatus,PropertyType,StorageStatus} from './types'

interface Filters{search?:string;status?:PropertyStatus|'';type?:PropertyType|'';purpose?:PropertyPurpose|'';ownerId?:string;page?:number;limit?:number}
interface UploadTicket{uploadUrl:string;objectKey:string;expiresInSeconds:number}

export const propertiesApi={
 list(filters:Filters={}){const query=new URLSearchParams();Object.entries(filters).forEach(([key,value])=>{if(value!==undefined&&value!=='')query.set(key,String(value))});return apiRequest<PropertyListResponse>(`/properties?${query}`)},
 get(id:string){return apiRequest<{property:Property}>(`/properties/${id}`)},
 create(input:PropertyInput){return apiRequest<{property:Property}>('/properties',{method:'POST',body:JSON.stringify(input)})},
 update(id:string,input:Partial<PropertyInput>){return apiRequest<{property:Property}>(`/properties/${id}`,{method:'PATCH',body:JSON.stringify(input)})},
 storageStatus(){return apiRequest<StorageStatus>('/properties/storage-status')},
 preparePhoto(id:string,input:{fileName:string;mimeType:string;sizeBytes:number}){return apiRequest<UploadTicket>(`/properties/${id}/photos/upload-url`,{method:'POST',body:JSON.stringify(input)})},
 async uploadPhoto(uploadUrl:string,blob:Blob){const response=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':blob.type},body:blob});if(!response.ok)throw new Error('Não foi possível enviar a foto.')},
 confirmPhoto(id:string,objectKey:string){return apiRequest<{property:Property}>(`/properties/${id}/photos`,{method:'POST',body:JSON.stringify({objectKey})})},
 removePhoto(id:string,photoId:string){return apiRequest<{property:Property}>(`/properties/${id}/photos/${photoId}`,{method:'DELETE'})},
 setCover(id:string,photoId:string){return apiRequest<{property:Property}>(`/properties/${id}/photos/${photoId}/cover`,{method:'PATCH'})},
 prepareAuthorizationDocument(id:string,input:{fileName:string;mimeType:string;sizeBytes:number}){return apiRequest<UploadTicket>(`/properties/${id}/authorization-document/upload-url`,{method:'POST',body:JSON.stringify(input)})},
 async uploadAuthorizationDocument(uploadUrl:string,file:File){const response=await fetch(uploadUrl,{method:'PUT',headers:{'Content-Type':file.type},body:file});if(!response.ok)throw new Error('Não foi possível enviar o documento.')},
 confirmAuthorizationDocument(id:string,input:{objectKey:string;fileName:string}){return apiRequest<{property:Property}>(`/properties/${id}/authorization-document`,{method:'POST',body:JSON.stringify(input)})},
 removeAuthorizationDocument(id:string){return apiRequest<{property:Property}>(`/properties/${id}/authorization-document`,{method:'DELETE'})},
}
