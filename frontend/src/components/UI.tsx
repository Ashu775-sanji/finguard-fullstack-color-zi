import {ReactNode} from 'react';
export const supportedCurrencies=['INR','USD','GBP','EUR'] as const;
export type Currency=typeof supportedCurrencies[number];
// FinGuard displays recorded amounts in INR by default. Formatting never converts currency.
export const getCurrency=():Currency=>'INR';
const currencyFormatters=new Map<Currency,Intl.NumberFormat>();
export const money=(n:number,c:Currency=getCurrency())=>{
  if(!Number.isFinite(n))return 'Not available';
  let formatter=currencyFormatters.get(c);
  if(!formatter){formatter=new Intl.NumberFormat('en-IN',{style:'currency',currency:c,maximumFractionDigits:0});currencyFormatters.set(c,formatter)}
  return formatter.format(n);
};
export function Card({children,className=''}:{children:ReactNode,className?:string}){return <section className={'card panel '+className}>{children}</section>}
export function PageIntro({eyebrow,title,desc,action}:{eyebrow:string,title:string,desc:string,action?:ReactNode}){return <div className="pageIntro"><div><small>{eyebrow}</small><h2>{title}</h2><p>{desc}</p></div>{action}</div>}
export function Progress({value,tone='mint'}:{value:number,tone?:string}){return <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}><i className={tone} style={{width:`${Math.min(value,100)}%`}}/></div>}
