export interface AuthUser{id:string;name:string;email:string;role:string;organization:{id:string;name:string;status:'TRIAL'|'ACTIVE'|'SUSPENDED'|'CANCELED'}}
export interface LoginCredentials{email:string;password:string}
export interface RegisterInput{name:string;email:string;password:string}
