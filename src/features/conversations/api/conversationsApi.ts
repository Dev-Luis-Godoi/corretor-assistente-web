import {apiRequest} from '@/shared/api/apiClient'
import type {Conversation,ConversationOptions,ConversationResponse,Message,MessagesResponse} from '../types'

interface ConversationFilters{search:string;status:string;whatsappAccountId:string;assignedUserId:string}
export const conversationsApi={
 list:(filters:ConversationFilters)=>{const params=new URLSearchParams({limit:'50'});Object.entries(filters).forEach(([key,value])=>value&&params.set(key,value));return apiRequest<ConversationResponse>(`/whatsapp/conversations?${params}`)},
 options:()=>apiRequest<ConversationOptions>('/whatsapp/conversation-options'),
 messages:(conversationId:string)=>apiRequest<MessagesResponse>(`/whatsapp/conversations/${conversationId}/messages?limit=100`),
 markRead:(conversationId:string)=>apiRequest<void>(`/whatsapp/conversations/${conversationId}/read`,{method:'PATCH'}),
 updateStatus:(conversationId:string,status:Conversation['status'])=>apiRequest<{conversation:Conversation}>(`/whatsapp/conversations/${conversationId}/status`,{method:'PATCH',body:JSON.stringify({status})}),
 sendText:(conversationId:string,content:string)=>apiRequest<{message:Message}>(`/whatsapp/conversations/${conversationId}/messages`,{method:'POST',body:JSON.stringify({content})}),
 sendMedia:(conversationId:string,input:{type:'IMAGE'|'AUDIO'|'DOCUMENT';mimeType:string;fileName:string;base64:string;caption?:string})=>apiRequest<{message:Message}>(`/whatsapp/conversations/${conversationId}/media`,{method:'POST',body:JSON.stringify(input)}),
}
