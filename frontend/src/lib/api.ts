import axios,{AxiosError} from 'axios';

export const api=axios.create({
  baseURL:import.meta.env.VITE_API_URL||'http://localhost:8000/api/v1',
  timeout:45000,
  headers:{Accept:'application/json'}
});

api.interceptors.request.use(config=>{
  const token=sessionStorage.getItem('fg_token');
  if(token)config.headers.Authorization=`Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response=>response,
  error=>{
    if(error.response?.status===401){
      sessionStorage.removeItem('fg_token');
      sessionStorage.removeItem('fg_session');
      window.dispatchEvent(new Event('finguard:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export function apiError(error:unknown,fallback='Something went wrong. Please try again.'){
  const e=error as AxiosError<{detail?:string|{msg?:string}[]}>;
  if(e.code==='ECONNABORTED')return 'The service is taking longer than expected. Render may be waking up—please try again.';
  if(!e.response)return 'FinGuard could not reach the API. Check your connection and try again.';
  if(e.response.status===429)return 'Too many requests. Please wait a moment and try again.';
  if(e.response.status>=500)return 'The FinGuard service is temporarily unavailable. Please try again shortly.';
  const detail=e.response.data?.detail;
  if(typeof detail==='string')return detail;
  if(Array.isArray(detail))return detail.map((item:{msg?:string})=>item.msg||'Invalid input').join('. ');
  return fallback;
}

export async function getData<T>(url:string):Promise<T>{
  const response=await api.get<T>(url);
  if(response.data===null||response.data===undefined)throw new Error('Empty API response');
  return response.data;
}

/** @deprecated New connected screens use getData and render explicit error states. */
export async function safeGet<T>(url:string,fallback:T):Promise<T>{
  try{return await getData<T>(url)}catch{return fallback}
}