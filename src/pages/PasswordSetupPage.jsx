import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../utils/api/client';
export default function PasswordSetupPage() {
 const [password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const navigate=useNavigate();
 const token=new URLSearchParams(window.location.hash.slice(1)).get('token');
 async function submit(e) {e.preventDefault();setBusy(true);const result=await request('/api/auth/setup-password',{token,password});setBusy(false);if(result.error)setError(result.error.message);else {window.location.hash='';window.location.replace('/dashboard');}}
 return <main className="min-h-screen bg-[#08090D] text-white flex items-center justify-center p-6"><form className="w-full max-w-sm space-y-6" onSubmit={submit}><h1 className="text-2xl font-bold">Hesap şifrenizi belirleyin</h1><p className="text-zinc-400">En az 8 karakter kullanın. Bu bağlantı bir kez kullanılabilir.</p><input aria-label="Yeni şifre" autoComplete="new-password" className="w-full bg-white/10 rounded-xl p-4" type="password" minLength={8} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)} />{error&&<p role="alert" className="text-red-400">{error}</p>}<button disabled={busy||!token} className="w-full bg-blue-600 rounded-xl p-4 disabled:opacity-50">{busy?'Kaydediliyor…':'Şifreyi kaydet'}</button><button type="button" className="text-zinc-400" onClick={()=>navigate('/login')}>Giriş sayfası</button></form></main>;
}
