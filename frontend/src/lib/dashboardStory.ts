export type StoryTransaction = {id:string; date:string; amount:number; transaction_type:string; category:string; merchant:string; payment_method?:string; description?:string; time?:string; risk_level?:string; risk_score?:number};
export function monthKey(date:Date){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`}
export function dashboardFacts(rows:StoryTransaction[],demo:boolean,now=new Date()){
  const anchor=demo?new Date(2026,8,30,12):now;
  const month=monthKey(anchor),previous=monthKey(new Date(anchor.getFullYear(),anchor.getMonth()-1,1));
  const expenses=rows.filter(x=>x.transaction_type==='expense');
  const monthRows=expenses.filter(x=>x.date.slice(0,7)===month);
  const priorRows=expenses.filter(x=>x.date.slice(0,7)===previous);
  const total=(items:StoryTransaction[])=>items.reduce((sum,x)=>sum+Number(x.amount),0);
  const income=total(rows.filter(x=>x.transaction_type==='income'&&x.date.slice(0,7)===month));
  const spending=total(monthRows),priorSpending=total(priorRows);
  const categories=new Map<string,number>();monthRows.forEach(x=>categories.set(x.category,(categories.get(x.category)||0)+Number(x.amount)));
  const previousCategories=new Map<string,number>();priorRows.forEach(x=>previousCategories.set(x.category,(previousCategories.get(x.category)||0)+Number(x.amount)));
  const discretionaryGrowth=[...categories].filter(([name])=>['shopping','entertainment','subscriptions'].includes(name.toLowerCase())).map(([name,value])=>({name,value,previous:previousCategories.get(name)||0})).filter(x=>x.previous>0).map(x=>({...x,change:(x.value/x.previous-1)*100})).filter(x=>x.change>0).sort((a,b)=>b.change-a.change);
  const categoryData=[...categories].map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  const risks=rows.filter(x=>['HIGH','CRITICAL'].includes((x.risk_level||'').toUpperCase())).sort((a,b)=>(b.risk_score||0)-(a.risk_score||0));
  const evaluated=rows.filter(x=>Number.isFinite(x.risk_score));
  const food=total(monthRows.filter(x=>x.category.toLowerCase()==='food'));
  const priorFood=total(priorRows.filter(x=>x.category.toLowerCase()==='food'));
  return {anchor,month,previous,monthRows,income,spending,priorSpending,food,priorFood,categoryData,risks,evaluated,fastestDiscretionary:discretionaryGrowth[0]??null,
    spendingChange:priorSpending>0&&monthRows.length>0?(spending/priorSpending-1)*100:null,
    foodChange:priorFood>0&&monthRows.some(x=>x.category.toLowerCase()==='food')?(food/priorFood-1)*100:null,
    surplus:income>0?Math.max(0,income-spending):null,
    savingsRate:income>0?Math.max(0,(income-spending)/income*100):null,
    estimatedRisk:evaluated.length?Math.round(evaluated.reduce((n,x)=>n+Number(x.risk_score),0)/evaluated.length):null,
  };
}
export function spendingSeries(rows:StoryTransaction[],period:string,anchor:Date){
  const expenses=rows.filter(x=>x.transaction_type==='expense');
  const map=new Map<string,number>();
  const days=period==='7D'?7:period==='30D'?30:null;
  const end=new Date(anchor.getFullYear(),anchor.getMonth(),anchor.getDate()+1).getTime();
  const cutoff=days?new Date(anchor.getFullYear(),anchor.getMonth(),anchor.getDate()-days+1).getTime():new Date(anchor.getFullYear(),anchor.getMonth()-({'3M':2,'6M':5,'1Y':11}[period]??11),1).getTime();
  expenses.filter(x=>{const t=new Date(`${x.date.slice(0,10)}T12:00:00`).getTime();return t>=cutoff&&t<end}).forEach(x=>{const k=days?x.date.slice(0,10):x.date.slice(0,7);map.set(k,(map.get(k)||0)+Number(x.amount))});
  return [...map].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,spend])=>({date,m:days?date.slice(5):date,spend}));
}
