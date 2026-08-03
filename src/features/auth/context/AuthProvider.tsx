import {useCallback,useEffect,useMemo,useState,type PropsWithChildren} from 'react'
import {ApiError} from '@/shared/api/apiClient'
import {authApi} from '../api/authApi'
import type {AuthUser,LoginCredentials,RegisterInput} from '../types'
import {AuthContext} from './AuthContext'

export function AuthProvider({children}:PropsWithChildren){
 const [user,setUser]=useState<AuthUser|null>(null)
 const [loading,setLoading]=useState(true)
 useEffect(()=>{const clearSession=()=>setUser(null);window.addEventListener('auth:unauthorized',clearSession);return()=>window.removeEventListener('auth:unauthorized',clearSession)},[])
 useEffect(()=>{let active=true;authApi.me().then(({user:current})=>{if(active)setUser(current)}).catch(error=>{if(!(error instanceof ApiError)||error.status!==401)console.warn('Session check failed',error)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[])
 const login=useCallback(async(credentials:LoginCredentials)=>{const response=await authApi.login(credentials);setUser(response.user)},[])
 const register=useCallback(async(input:RegisterInput)=>{const response=await authApi.register(input);setUser(response.user)},[])
 const logout=useCallback(async()=>{try{await authApi.logout()}finally{setUser(null)}},[])
 const refresh=useCallback(async()=>{const response=await authApi.me();setUser(response.user)},[])
 const value=useMemo(()=>({user,loading,login,register,logout,refresh}),[user,loading,login,register,logout,refresh])
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
