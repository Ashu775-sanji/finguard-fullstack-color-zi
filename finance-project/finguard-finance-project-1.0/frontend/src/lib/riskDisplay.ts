export function displayRisk(value?:string|null){const level=(value||'NOT EVALUATED').toUpperCase();return level==='MEDIUM'?'MODERATE':level}
