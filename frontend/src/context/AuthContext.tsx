import {createContext,useContext,useEffect,useMemo,useState,ReactNode} from 'react';
import {api,apiError} from '../lib/api';
type User={name:string,email:string};type Result=Promise<string|null>;
type Auth={user:User|null;login:(e:string,p:string)=>Result;register:(n:string,e:string,p:string)=>Result;reset:(e:string,p:string)=>Result;logout:()=>void};
const C=createContext<Auth>(null!);const SESSION='fg_session';

async function backendLogin(email:string,password:string){
  const body=new URLSearchParams({username:email,password});
  const response=await api.post('/auth/login',body,{headers:{'Content-Type':'application/x-www-form-urlencoded'},timeout:60000});
  if(!response.data?.access_token)throw new Error('Invalid token response');
  sessionStorage.setItem('fg_token',response.data.access_token);
  const me=await api.get('/users/me');
  return {name:me.data.name,email:me.data.email} as User;
}

export function AuthProvider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(()=>{try{return JSON.parse(sessionStorage.getItem(SESSION)||'null')}catch{return null}});
  const logout=()=>{sessionStorage.removeItem(SESSION);sessionStorage.removeItem('fg_token');setUser(null)};
  useEffect(()=>{const handler=()=>logout();addEventListener('finguard:unauthorized',handler);return()=>removeEventListener('finguard:unauthorized',handler)},[]);
  const value=useMemo<Auth>(()=>({
    user,
    login:async(email,password)=>{try{const current=await backendLogin(email,password);sessionStorage.setItem(SESSION,JSON.stringify(current));setUser(current);return null}catch(error){return apiError(error,'Invalid email or password')}},
    register:async(name,email,password)=>{try{await api.post('/auth/register',{name,email,password,currency:'INR',language:'en'},{timeout:60000});const current=await backendLogin(email,password);sessionStorage.setItem(SESSION,JSON.stringify(current));setUser(current);return null}catch(error){return apiError(error,'Could not create the account')}},
    reset:async()=>Promise.resolve('Secure email password recovery is not configured yet. Contact the project administrator.'),
    logout
  }),[user]);
  return <C.Provider value={value}>{children}</C.Provider>
}
export const useAuth=()=>useContext(C);