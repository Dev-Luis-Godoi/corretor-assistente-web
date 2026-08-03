export interface LeadContact{id:string;name:string|null;phone:string;email:string|null}
export interface LeadStage{id:string;name:string;position:number;color:string;isWon:boolean;isLost:boolean}
export interface LeadAssignedUser{id:string;name:string;email:string}
export interface Lead{id:string;title:string;source:string|null;notes:string|null;estimatedValue:string|null;closedAt:string|null;lostReason:string|null;organizationId:string;contact:LeadContact;stage:LeadStage;assignedUser:LeadAssignedUser|null;createdAt:string;updatedAt:string}
export interface LeadsMeta{page:number;limit:number;total:number;totalPages:number}
export interface LeadsResponse{data:Lead[];meta:LeadsMeta}
export interface PipelineStagesResponse{stages:LeadStage[]}
