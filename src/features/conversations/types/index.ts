export interface ConversationContact{id:string;name:string|null;phone:string;avatarUrl:string|null}
export interface ConversationAccount{id:string;name:string;phoneNumber:string|null;isConnected:boolean}
export interface ConversationLead{id:string;title:string;assignedUser:{id:string;name:string}|null;stage:{id:string;name:string;color:string|null}}
export interface Message{id:string;externalId:string|null;direction:'INBOUND'|'OUTBOUND';type:'TEXT'|'IMAGE'|'AUDIO'|'VIDEO'|'DOCUMENT'|'LOCATION'|'CONTACT'|'UNKNOWN';content:string|null;mediaUrl:string|null;sentAt:string;readAt:string|null;deliveryStatus:'SENT'|'DELIVERED'|'READ'|'FAILED';deliveredAt:string|null;metadata:unknown;createdAt:string;updatedAt:string}
export interface Conversation{id:string;status:'OPEN'|'CLOSED'|'ARCHIVED';unreadCount:number;lastMessageAt:string|null;externalId:string|null;contact:ConversationContact;whatsappAccount:ConversationAccount;lead:ConversationLead|null;messages:Array<Pick<Message,'id'|'direction'|'type'|'content'|'mediaUrl'|'sentAt'>>;createdAt:string;updatedAt:string}
export interface ConversationResponse{data:Conversation[];meta:{page:number;limit:number;total:number;totalPages:number}}
export interface MessagesResponse{data:Message[];meta:{page:number;limit:number;total:number;totalPages:number}}
export interface ConversationOptions{accounts:Array<{id:string;name:string;phoneNumber:string|null}>;users:Array<{id:string;name:string}>}
