import {ReactNode} from 'react';
export const supportedCurrencies=['INR','USD','GBP','EUR'] as const;
export type Currency=typeof supportedCurrencies[number];
export const getCurrency=()=>{const value=localStorage.getItem('fg_currency');return supportedCurrencies.includes(value as Currency)?value as Currency:'INR'};
export const money=(n:number,c:Currency=getCurrency())=>new Intl.NumberFormat(c==='INR'?'en-IN':'en-US',{style:'currency',currency:c,maximumFractionDigits:0}).format(n);
export function Card({children,className=''}:{children:ReactNode,className?:string}){return <section className={'card panel '+className}>{children}</section>}
export function PageIntro({eyebrow,title,desc,action}:{eyebrow:string,title:string,desc:string,action?:ReactNode}){return <div className="pageIntro"><div><small>{eyebrow}</small><h2>{title}</h2><p>{desc}</p></div>{action}</div>}
export function Progress({value,tone='mint'}:{value:number,tone?:string}){return <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}><i className={tone} style={{width:`${Math.min(value,100)}%`}}/></div>}
