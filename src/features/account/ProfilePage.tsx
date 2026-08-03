import {useState,type FormEvent} from 'react'
import {KeyRound,LockKeyhole,Mail,Save,ShieldCheck,UserRound} from 'lucide-react'
import {useAuth} from '@/features/auth/hooks/useAuth'
import {ApiError} from '@/shared/api/apiClient'
import {AccountPageLayout} from './AccountPageLayout'
import {accountApi} from './accountApi'
import './account.css'

const roleLabels:Record<string,string>={OWNER:'Proprietário',ADMIN:'Administrador',AGENT:'Corretor'}

export function ProfilePage({onLogout}:{onLogout:()=>void}){
 const {user,refresh}=useAuth()
 const [name,setName]=useState(user?.name??'')
 const [email,setEmail]=useState(user?.email??'')
 const [saving,setSaving]=useState(false)
 const [profileMessage,setProfileMessage]=useState('')
 const [profileError,setProfileError]=useState('')
 const [currentPassword,setCurrentPassword]=useState('')
 const [newPassword,setNewPassword]=useState('')
 const [confirmPassword,setConfirmPassword]=useState('')
 const [passwordSaving,setPasswordSaving]=useState(false)
 const [passwordMessage,setPasswordMessage]=useState('')
 const [passwordError,setPasswordError]=useState('')

 const initials=user?.name.split(' ').slice(0,2).map(part=>part[0]).join('').toUpperCase()??'--'

 const saveProfile=async(event:FormEvent)=>{event.preventDefault();setSaving(true);setProfileError('');setProfileMessage('');try{const {user:updated}=await accountApi.updateProfile({name:name.trim(),email:email.trim()});setName(updated.name);setEmail(updated.email);await refresh();setProfileMessage('Dados pessoais atualizados.')}catch(caught){setProfileError(caught instanceof ApiError&&caught.code==='EMAIL_ALREADY_IN_USE'?'Este e-mail já está em uso.':caught instanceof ApiError?caught.message:'Não foi possível atualizar seu perfil.')}finally{setSaving(false)}}
 const savePassword=async(event:FormEvent)=>{event.preventDefault();setPasswordError('');setPasswordMessage('');if(newPassword!==confirmPassword){setPasswordError('A confirmação não corresponde à nova senha.');return}setPasswordSaving(true);try{await accountApi.updatePassword({currentPassword,newPassword});setCurrentPassword('');setNewPassword('');setConfirmPassword('');setPasswordMessage('Senha alterada com segurança.')}catch(caught){setPasswordError(caught instanceof ApiError&&caught.code==='INVALID_CURRENT_PASSWORD'?'A senha atual está incorreta.':caught instanceof ApiError&&caught.code==='PASSWORD_UNCHANGED'?'Escolha uma senha diferente da atual.':caught instanceof ApiError?caught.message:'Não foi possível alterar a senha.')}finally{setPasswordSaving(false)}}

 return <AccountPageLayout eyebrow="SUA CONTA" title="Meu perfil" description="Gerencie seus dados pessoais e a segurança do acesso." onLogout={onLogout} aside={<span className="account-secure"><ShieldCheck size={15}/>Conta protegida</span>}>
  <section className="profile-summary panel"><span className="profile-avatar">{initials}</span><div><h2>{user?.name}</h2><p>{user?.email}</p><span>{roleLabels[user?.role??'']??user?.role} · {user?.organization.name}</span></div></section>
  <div className="account-grid">
   <section className="account-card panel">
    <header><span><UserRound size={18}/></span><div><h2>Dados pessoais</h2><p>Informações exibidas no atendimento e nas atividades.</p></div></header>
    <form className="settings-form" onSubmit={saveProfile}>
     <label>Nome completo<input required minLength={2} maxLength={120} value={name} onChange={event=>setName(event.target.value)} autoComplete="name"/></label>
     <label>E-mail de acesso<span className="input-with-icon"><Mail size={15}/><input required type="email" value={email} onChange={event=>setEmail(event.target.value)} autoComplete="email"/></span></label>
     {profileError&&<p className="form-feedback error" role="alert">{profileError}</p>}{profileMessage&&<p className="form-feedback success" role="status">{profileMessage}</p>}
     <button className="primary-button account-save" disabled={saving||name.trim().length<2}><Save size={15}/>{saving?'Salvando...':'Salvar alterações'}</button>
    </form>
   </section>
   <section className="account-card panel">
    <header><span><KeyRound size={18}/></span><div><h2>Alterar senha</h2><p>Confirme sua senha atual antes de definir uma nova.</p></div></header>
    <form className="settings-form" onSubmit={savePassword}>
     <label>Senha atual<input required type="password" value={currentPassword} onChange={event=>setCurrentPassword(event.target.value)} autoComplete="current-password"/></label>
     <label>Nova senha<input required type="password" minLength={8} maxLength={72} value={newPassword} onChange={event=>setNewPassword(event.target.value)} autoComplete="new-password" placeholder="Mínimo de 8 caracteres"/></label>
     <label>Confirmar nova senha<input required type="password" minLength={8} maxLength={72} value={confirmPassword} onChange={event=>setConfirmPassword(event.target.value)} autoComplete="new-password"/></label>
     {passwordError&&<p className="form-feedback error" role="alert">{passwordError}</p>}{passwordMessage&&<p className="form-feedback success" role="status">{passwordMessage}</p>}
     <button className="secondary-button account-save" disabled={passwordSaving||newPassword.length<8}><LockKeyhole size={15}/>{passwordSaving?'Atualizando...':'Atualizar senha'}</button>
    </form>
   </section>
  </div>
 </AccountPageLayout>
}
