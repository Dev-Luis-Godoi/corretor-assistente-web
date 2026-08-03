export interface ConversationContact{id:string;name:string|null;phone:string;avatarUrl:string|null}
export interface ConversationAccount{id:string;name:string;phoneNumber:string|null;isConnected:boolean}
export interface Message{id:string;externalId:string|null;direction:'INBOUND'|'OUTBOUND';type:string;content:string|null;mediaUrl:string|null;sentAt:string;readAt:string|null;metadata:unknown;createdAt:string;updatedAt:string}
export interface Conversation{id:string;status:'OPEN'|'CLOSED'|'ARCHIVED';unreadCount:number;lastMessageAt:string|null;externalId:string|null;contact:ConversationContact;whatsappAccount:ConversationAccount;messages:Array<Pick<Message,'id'|'direction'|'type'|'content'|'mediaUrl'|'sentAt'>>;createdAt:string;updatedAt:string}
export interface ConversationResponse{data:Conversation[];meta:{page:number;limit:number;total:number;totalPages:number}}
export interface MessagesResponse{data:Message[];meta:{page:number;limit:number;total:number;totalPages:number}}
