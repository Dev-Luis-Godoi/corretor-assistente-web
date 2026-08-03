import {apiRequest} from '@/shared/api/apiClient'
import type {
  ConnectWhatsAppAccountResponse,
  CreateWhatsAppAccountResponse,
  WhatsAppAccountsResponse,
  WhatsAppAccountStatusResponse,
} from '../types'

export const whatsappAccountsApi={
  list:()=>apiRequest<WhatsAppAccountsResponse>('/whatsapp/accounts'),
  create:(name:string)=>apiRequest<CreateWhatsAppAccountResponse>('/whatsapp/accounts',{
    method:'POST',
    body:JSON.stringify({name}),
  }),
  connect:(accountId:string)=>apiRequest<ConnectWhatsAppAccountResponse>(`/whatsapp/accounts/${accountId}/connect`),
  status:(accountId:string)=>apiRequest<WhatsAppAccountStatusResponse>(`/whatsapp/accounts/${accountId}/status`),
}
