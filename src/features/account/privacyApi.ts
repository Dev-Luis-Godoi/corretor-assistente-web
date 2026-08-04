import {apiRequest} from '@/shared/api/apiClient'
import type {Contact} from '@/features/leads/types'

export interface PrivacySettings{id:string;name:string;dataRetentionDays:number}
export interface AuditLog{id:string;action:string;entityType:string;entityId:string|null;metadata:unknown;createdAt:string;user:{id:string;name:string}|null}

export const privacyApi={
 settings:()=>apiRequest<{settings:PrivacySettings}>('/privacy/settings'),
 updateRetention:(dataRetentionDays:number)=>apiRequest<{settings:PrivacySettings}>('/privacy/settings',{method:'PATCH',body:JSON.stringify({dataRetentionDays})}),
 exportOrganization:()=>apiRequest<Record<string,unknown>>('/privacy/export'),
 applyRetention:()=>apiRequest<{cutoff:string;deletedMessages:number;deletedExpiredTokens:number}>('/privacy/retention/apply',{method:'POST'}),
 auditLogs:()=>apiRequest<{logs:AuditLog[]}>('/privacy/audit-logs?limit=50'),
 exportContact:(contactId:string)=>apiRequest<Record<string,unknown>>(`/privacy/contacts/${contactId}/export`),
 updateConsent:(contactId:string,consentStatus:'UNKNOWN'|'GRANTED'|'REVOKED',consentSource?:string|null)=>apiRequest<{contact:Contact}>(`/privacy/contacts/${contactId}/consent`,{method:'PATCH',body:JSON.stringify({consentStatus,consentSource})}),
 deleteContact:(contactId:string)=>apiRequest<void>(`/privacy/contacts/${contactId}`,{method:'DELETE'}),
}
