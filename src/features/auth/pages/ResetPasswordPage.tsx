import {useState,type FormEvent} from 'react'
import {AlertTriangle,ArrowLeft,CheckCircle2,KeyRound} from 'lucide-react'
import {Link,useSearchParams} from 'react-router-dom'
import {authApi} from '../api/authApi'
import {ApiError} from '@/shared/api/apiClient'

export function ResetPasswordPage(){
 const [params]=useSearchParams()
 const token=params.get('token')?.trim()??''
 const [password,setPassword]=useState('')
 const [confirm,setConfirm]=useState('')
 const [loading,setLoading]=useState(false)
 const [done,setDone]=useState(false)
 const [error,setError]=useState('')
 const submit=async(event:FormEvent)=>{event.preventDefault();setError('');if(!token){setError('Este link de recuperação está incompleto.');return}if(password!==confirm){setError('As senhas não coincidem.');return}setLoading(true);try{await authApi.resetPassword(token,password);window.dispatchEvent(new Event('auth:unauthorized'));setDone(true)}catch(caught){setError(caught instanceof ApiError&&caught.code==='INVALID_RESET_TOKEN'?'Este link é inválido, já foi usado ou expirou.':'Não foi possível redefinir a senha agora. Solicite um novo link ou tente novamente em instantes.')}finally{setLoading(false)}}
 return <main className="auth-simple-page"><section><Link className="auth-back" to="/login"><ArrowLeft size={15}/>Voltar ao login</Link><div className="auth-form-card">{done?<><span className="login-lock"><CheckCircle2 size={20}/></span><h1>Senha atualizada</h1><p>Seu acesso foi recuperado. Entre novamente usando a nova senha.</p><Link className="login-submit" to="/login">Entrar com a nova senha</Link></>:!token?<><span className="login-lock"><AlertTriangle size={20}/></span><h1>Link de recuperação inválido</h1><p>Solicite um novo link para trocar sua senha com segurança.</p><Link className="login-submit" to="/forgot-password">Solicitar novo link</Link></>:<><span className="login-lock"><KeyRound size={20}/></span><h1>Defina uma nova senha</h1><p>Você não precisa informar a senha anterior. O link é válido por 30 minutos e só pode ser usado uma vez.</p><form onSubmit={submit}><label>Nova senha<input autoFocus required minLength={8} maxLength={72} type="password" autoComplete="new-password" value={password} onChange={event=>setPassword(event.target.value)} placeholder="Mínimo de 8 caracteres"/></label><label>Confirmar nova senha<input required minLength={8} maxLength={72} type="password" autoComplete="new-password" value={confirm} onChange={event=>setConfirm(event.target.value)} placeholder="Repita a nova senha"/></label>{error&&<p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading?'Atualizando...':'Atualizar senha'}</button></form></>}</div></section></main>
}
