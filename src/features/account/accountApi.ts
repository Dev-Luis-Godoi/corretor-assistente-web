import {apiRequest} from '@/shared/api/apiClient'
import type {AuthUser} from '@/features/auth/types'

export interface OrganizationSettings{
 id:string
 name:string
 createdAt:string
 _count:{users:number}
}

export const accountApi={
 updateProfile:(input:{name:string;email:string})=>apiRequest<{user:AuthUser}>('/users/me',{method:'PATCH',body:JSON.stringify(input)}),
 updatePassword:(input:{currentPassword:string;newPassword:string})=>apiRequest<void>('/users/me/password',{method:'PATCH',body:JSON.stringify(input)}),
 organization:()=>apiRequest<{organization:OrganizationSettings}>('/organization'),
 updateOrganization:(name:string)=>apiRequest<{organization:OrganizationSettings}>('/organization',{method:'PATCH',body:JSON.stringify({name})}),
}
