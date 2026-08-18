export interface OwnerSummary{id:string;name:string;phone:string|null;email:string|null}
export interface Owner extends OwnerSummary{document:string|null;notes:string|null;properties?:{id:string;title:string;reference:string|null}[];_count?:{properties:number};createdAt:string;updatedAt:string}
export interface Client{id:string;name:string;phone:string|null;email:string|null;document:string|null;notes:string|null;origin:'MANUAL'|'PIPELINE';leadId:string|null;createdAt:string;updatedAt:string}
export interface RelationshipList<T>{data:T[];meta:{page:number;limit:number;total:number;totalPages:number}}
export interface RelationshipInput{name:string;phone?:string;email?:string;document?:string;notes?:string}
