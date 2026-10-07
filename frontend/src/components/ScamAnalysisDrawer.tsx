import {AlertTriangle,ArrowRight,Check,ExternalLink,FileText,ShieldCheck} from 'lucide-react';
import {useRef,useState} from 'react';
import {NavLink} from 'react-router-dom';
import Drawer from './Drawer';
import {api,apiError} from '../lib/api';
import {displayRisk} from '../lib/riskDisplay';
import {analysisURL,containsSecretValue} from '../lib/inputSafety';
const kinds=['Message','Transaction','Link','Call / request'] as const;
type Kind=typeof kinds[number];
type Assessment={risk_score:number;risk_level:string;signals:string[];explanation:string;recommended_actions:string[]};
type Snapshot={text:string;url:string|null;kind:Kind;amount:number;merchant:string;description:string};
export default function ScamAnalysisDrawer({open,onClose}:{open:boolean;onClose:()=>void}){
  const [kind,setKind]=useState<Kind>('Message'),[text,setText]=useState(''),[link,setLink]=useState(''),[amount,setAmount]=useState(''),[merchant,setMerchant]=useState(''),[category,setCategory]=useState('Transfer');
  const [result,setResult]=useState<Assessment|null>(null),[snapshot,setSnapshot]=useState<Snapshot|null>(null),[loading,setLoading]=useState(false),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
  const [incident,setIncident]=useState<{id:string;code:string;evidence:boolean}|null>(null);
  const sequence=useRef(0);
  function reset(){setResult(null);setSnapshot(null);setIncident(null);setError('');setNotice('')}
  function choose(next:Kind){if(loading||saving)return;sequence.current++;setKind(next);reset()}
  async function analyze(){
    if(loading)return;setError('');setNotice('');setResult(null);setIncident(null);
    if(containsSecretValue(kind==='Link'?link:kind==='Transaction'?text+' '+merchant:text))return setError('Remove secret values such as OTPs, PINs, CVVs or banking passwords before analysis. Never include them in evidence.');
    let url:string|null=null;
    try{url=analysisURL(kind==='Link'?link:'')}catch{return setError('Enter a valid HTTP/HTTPS link without login credentials.')}
    if(kind==='Link'&&!url)return setError('Add a link to check.');
    if(kind==='Transaction'&&(!(Number(amount)>0)||Number(amount)>1_000_000_000||!merchant.trim()||category.trim().length<2))return setError('Add a positive amount, merchant and category.');
    if(kind!=='Link'&&kind!=='Transaction'&&text.trim().length<3)return setError('Add at least three characters of suspicious content.');
    const copy:Snapshot={text:kind==='Link'?'':text.trim(),url,kind,amount:kind==='Transaction'?Number(amount):0,merchant:kind==='Transaction'?merchant.trim():'',description:kind==='Transaction'?`Transaction at ${merchant.trim()} for ${Number(amount)} INR. ${text.trim()}`:kind==='Link'?`User-submitted URL for pattern checking: ${url}`:text.trim()};
    const request=++sequence.current;setLoading(true);
    try{
      if(kind==='Transaction'){
        const r=await api.post('/anomaly/evaluate',{amount:copy.amount,merchant:copy.merchant,category:category.trim(),payment_method:null,description:copy.text.slice(0,500)||null},{timeout:60000});
        if(request===sequence.current){setResult({risk_score:r.data.score_100,risk_level:r.data.risk_level.toUpperCase(),signals:r.data.reason.split(' · ').filter((x:string)=>!x.startsWith('ensemble:')),explanation:r.data.reason,recommended_actions:[r.data.recommended_action]});setSnapshot(copy)}
      }else{
        const r=await api.post('/scam/analyze',{text:copy.description.slice(0,6000),url},{timeout:60000});
        if(request===sequence.current){setResult(r.data);setSnapshot(copy)}
      }
    }catch(e){if(request===sequence.current)setError(apiError(e,'The analysis could not complete. No safety score is available.'))}
    finally{if(request===sequence.current)setLoading(false)}
  }
  async function save(withEvidence:boolean){
    if(!result||!snapshot||saving)return;
    if(containsSecretValue(snapshot.description+' '+(snapshot.url||'')))return setError('Remove secret credentials before saving.');
    setSaving(true);setError('');setNotice('');let current=incident;
    try{
      if(!current){const r=await api.post('/incidents',{title:`${snapshot.kind} review${snapshot.merchant?': '+snapshot.merchant:''}`.slice(0,180),occurred_at:new Date().toISOString(),scam_type:'User-requested review',amount:snapshot.amount,payment_method:null,description:`Unverified risk indicators. Documented at analysis time, not a confirmed fraud event. ${snapshot.description}`.slice(0,6000),url:snapshot.url});current={id:r.data.id,code:r.data.incident_code,evidence:false};setIncident(current)}
      if(withEvidence&&!current.evidence){await api.post(`/incidents/${current.id}/evidence`,{evidence_type:'analysis',label:`${snapshot.kind} pattern assessment`,content:`User-submitted content:\n${snapshot.description.slice(0,4500)}\n\nPattern assessment:\n${JSON.stringify(result).slice(0,1100)}\nRisk indicators are not confirmed fraud.${snapshot.description.length>4500?'\nInput excerpt only; preserve the original message separately.':''}`});current={...current,evidence:true};setIncident(current)}
      setNotice(`${withEvidence?'Saved analysis evidence to':'Created'} incident ${current.code}. No bank or authority has been contacted. The record date is the time of documentation; review incident details if needed.`);
    }catch(e){setError(`${current?`Incident ${current.code} exists. Retry to finish saving evidence without creating a duplicate. `:''}${apiError(e)}`)}finally{setSaving(false)}
  }
  return <Drawer open={open} onClose={onClose} title="Analyze with FinGuard AI" subtitle="Available pattern checks, not guaranteed fraud detection. Never paste OTPs, PINs, CVVs, UPI PINs or banking passwords.">
    <div className="analysisKindTabs" role="tablist" aria-label="Analysis type">{kinds.map(k=><button key={k} role="tab" id={`scam-kind-${k.replace(/[^a-z0-9]+/gi,'-')}`} tabIndex={kind===k?0:-1} onKeyDown={e=>{const current=kinds.indexOf(k);let next=current;if(e.key==='ArrowRight')next=(current+1)%kinds.length;else if(e.key==='ArrowLeft')next=(current+kinds.length-1)%kinds.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=kinds.length-1;else return;e.preventDefault();choose(kinds[next]);requestAnimationFrame(()=>document.getElementById(`scam-kind-${kinds[next].replace(/[^a-z0-9]+/gi,'-')}`)?.focus())}} aria-selected={kind===k} aria-controls="scam-drawer-input" disabled={loading||saving} onClick={()=>choose(k)}>{k}</button>)}</div>
    <div id="scam-drawer-input" role="tabpanel" aria-labelledby={`scam-kind-${kind.replace(/[^a-z0-9]+/gi,'-')}`} aria-label={`${kind} analysis input`} className="scamDrawerInput">
      {kind==='Transaction'&&<><label className="drawerField">Amount (INR)<input aria-label="Transaction amount" type="number" min="0.01" max="1000000000" value={amount} disabled={loading||saving} onChange={e=>{setAmount(e.target.value);reset()}}/></label><label className="drawerField">Merchant / recipient<input aria-label="Transaction merchant" maxLength={120} value={merchant} disabled={loading||saving} onChange={e=>{setMerchant(e.target.value);reset()}}/></label><label className="drawerField">Category<input aria-label="Transaction category" maxLength={80} value={category} disabled={loading||saving} onChange={e=>{setCategory(e.target.value);reset()}}/></label></>}
      {kind==='Link'?<label className="drawerField">Link to check<input aria-label="Link to analyze" value={link} maxLength={2000} disabled={loading||saving} onChange={e=>{setLink(e.target.value);reset()}} placeholder="https://example.com"/></label>:<label className="drawerField">{kind==='Transaction'?'Optional non-sensitive context':`${kind} content`}<textarea aria-label={`${kind} content`} value={text} maxLength={kind==='Transaction'?500:6000} disabled={loading||saving} onChange={e=>{setText(e.target.value);reset()}} placeholder="Describe the suspicious request without including secret credentials."/></label>}
    </div>
    <button className="primary drawerPrimary" onClick={analyze} disabled={loading||saving}>{loading?'FinGuard is analyzing…':'Analyze with FinGuard AI'}</button>
    {loading&&<div className="analysisJourney" role="status"><b>Checking the available input…</b><ol>{['Submitted content','Pattern checks','Risk assessment','Recommended action'].map((x,i)=><li key={x} style={{'--phase':i} as React.CSSProperties}><i/><span>{x}</span></li>)}</ol><small>Pending request—not a confidence or completion indicator.</small></div>}
    {error&&<div className="drawerError" role="alert"><AlertTriangle/><p>{error}</p></div>}
    {result&&<section className="globalScamResult" aria-label="Scam analysis result"><span>{kind==='Transaction'?'TRANSACTION PATTERN ASSESSMENT':'EXPLAINABLE MESSAGE / LINK CHECKS'}</span><strong>{result.risk_score} / 100</strong><h3>{displayRisk(result.risk_level)} RISK</h3><p>{result.explanation}</p>{result.signals.length>0&&<><b>Potential indicators</b><ul>{result.signals.map((x,i)=><li key={`${x}-${i}`}>{x}</li>)}</ul></>}<b>Recommended actions</b><ol>{result.recommended_actions.map((x,i)=><li key={`${x}-${i}`}>{x}</li>)}</ol><p className="analysisDisclaimer">{kind==='Transaction'?'Pattern-based transaction checks depend on available historical data.':'Current message and link checks use explainable rules, not an LLM.'} These indicators are not proof of fraud.</p><div className="scamResultActions"><button onClick={()=>setNotice('Pause unverified payments. Independently verify the request through an official channel. FinGuard cannot stop bank transactions.')}><ShieldCheck/>Do not pay an unverified request</button><button onClick={()=>setNotice('Contact your bank or payment provider using its official app, website or a verified number from your statement—not details supplied in a suspicious message.')}><ExternalLink/>Contact provider safely</button><button onClick={()=>save(true)} disabled={saving||!!incident?.evidence}>{incident?.evidence?<><Check/>Saved to Recovery</>:saving?'Saving…':<><FileText/>Save to Recovery</>}</button><button onClick={()=>save(false)} disabled={saving||!!incident}>{incident?'Incident created':'Create incident'}</button></div></section>}
    {notice&&<p className="storyActionMessage" role="status">{notice}</p>}{incident&&<NavLink className="storyTextAction" to="/app/evidence" onClick={onClose}>Open saved evidence <ArrowRight/></NavLink>}
    <NavLink className="storyTextAction" to="/app/scam-analyzer" onClick={onClose}>Open the full Scam Analyzer <ArrowRight/></NavLink>
  </Drawer>;
}
