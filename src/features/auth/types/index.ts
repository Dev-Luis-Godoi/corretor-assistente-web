export interface AuthUser{id:string;name:string;email:string;role:string;organization:{id:string;name:string}}
export interface LoginCredentials{email:string;password:string}
export interface RegisterInput{organizationName:string;name:string;email:string;password:string}
