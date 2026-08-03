import {apiRequest} from '@/shared/api/apiClient'
import type {AuthUser,LoginCredentials,RegisterInput} from '../types'

interface AuthResponse{user:AuthUser}
export const authApi={
 login:(credentials:LoginCredentials)=>apiRequest<AuthResponse>('/auth/login',{method:'POST',body:JSON.stringify(credentials)}),
 me:()=>apiRequest<AuthResponse>('/auth/me'),
 logout:()=>apiRequest<void>('/auth/logout',{method:'POST'}),
 register:(input:RegisterInput)=>apiRequest<AuthResponse>('/auth/register',{method:'POST',body:JSON.stringify(input)}),
 forgotPassword:(email:string)=>apiRequest<{message:string}>('/auth/forgot-password',{method:'POST',body:JSON.stringify({email})}),
 resetPassword:(token:string,password:string)=>apiRequest<void>('/auth/reset-password',{method:'POST',body:JSON.stringify({token,password})}),
}
