import {createContext} from 'react'
import type {AuthUser,LoginCredentials,RegisterInput} from '../types'

export interface AuthContextValue{user:AuthUser|null;loading:boolean;login:(credentials:LoginCredentials)=>Promise<void>;register:(input:RegisterInput)=>Promise<void>;logout:()=>Promise<void>}
export const AuthContext=createContext<AuthContextValue|null>(null)
