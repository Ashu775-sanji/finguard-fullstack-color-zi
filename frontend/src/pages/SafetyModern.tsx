import {AnimatePresence,motion} from 'framer-motion';
import {
  AlertTriangle,ArrowRight,BookOpen,Check,ChevronDown,Download,FileImage,FileText,
  Globe2,Link2,LockKeyhole,Mail,MessageSquare,Plus,Radio,ReceiptText,RefreshCw,
  Phone,QrCode,ShieldAlert,ShieldCheck,Upload,Vault,WalletCards
} from 'lucide-react';
import {FormEvent,useEffect,useState} from 'react';
import {api} from '../lib/api';
import {money,PageIntro} from '../components/UI';

type Analysis={risk_score:number;risk_level:string;classification:string;category:string;signals:string[];explanation:string;recommended_actions:string[];confidence:number};
const sample='Your bank account will be blocked today. Verify your KYC immediately and share the OTP using this link.';
const tabs=[['Message',MessageSquare],['URL',Link2],['Email',Mail],['Transaction',WalletCards],['Call',Phone],['Payment / QR',QrCode]] as const;

export function ScamAnalyzer(){
  const [tab,setTab]=useState('Message'),[text,setText]=useState(sample),[url,setUrl]=useState(''),[result,setResult]=useState<Analysis|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[expanded,setExpanded]=useState(true);
  async function analyze(){
    if(text.trim().length<3)return setError('Add suspicious content before starting the analysis.');
    setLoading(true);setError('');
    try{const r=await api.post('/scam/analyze',{text,url:url||null},{timeout:60000});setResult(r.data);localStorage.setItem('fg_safety_context',JSON.stringify({type:'scam analysis',risk:r.data.risk_level,category:r.data.category,signals:r.data.signals,updated:new Date().toISOString()}))}
    catch(e:any){setResult(null);setError(e?.code==='ECONNABORTED'?'Analysis timed out. Render may be waking up—please try again.':'We could not analyze this content right now. Check your connection and try again.')}
    finally{setLoading(false)}
  }
  return <div className="modernSafety">
    <PageIntro eyebrow="AI SCAM INTELLIGENCE" title="Analyze suspicious activity" desc="Understand the signals, the risk and the safest next step. Never paste passwords, PINs, CVVs, OTPs or banking credentials."/>
    <div className="analyzerWorkspace">
      <section className={`analyzerComposer ${loading?'scanning':''}`}>
        <div className="analyzerTabs" role="tablist">{tabs.map(([name,Icon])=><button role="tab" aria-selected={tab===name} className={tab===name?'active':''} onClick={()=>setTab(name)} key={name}><Icon/>{name}</button>)}</div>
        <div className="inputLabel"><span>{tab==='URL'?'SUSPICIOUS URL':`${tab.toUpperCase()} CONTENT`}</span><small>{text.length}/6,000</small></div>
        <textarea aria-label={`${tab} content`} value={text} maxLength={6000} onChange={e=>setText(e.target.value)} placeholder={`Paste the suspicious ${tab.toLowerCase()} here…`}/>
        {tab!=='URL'&&<div className="modernUrl"><Link2/><input aria-label="Optional URL" value={url} onChange={e=>setUrl(e.target.value)} placeholder="Optional URL to check"/></div>}
        {error&&<div className="softError"><AlertTriangle/><span>{error}</span><button onClick={analyze}>Try again</button></div>}
        <div className="analyzerFooter"><p><ShieldCheck/>Analysis identifies patterns, not definitive proof.</p><button className="primary" onClick={analyze} disabled={loading}>{loading?<><RefreshCw className="spin"/>Analyzing signals…</>:<><ShieldAlert/>Analyze with AI</>}</button></div>
        {loading&&<div className="scanLine" aria-label="Analysis in progress"/>}
      </section>
      <AnimatePresence mode="wait">
        {!result&&!loading?<motion.section initial={{opacity:0}} animate={{opacity:1}} className="analysisEmpty"><div><ShieldCheck/></div><h3>Ready when you are.</h3><p>Your risk score, detected signals and recommended actions will appear here.</p><div className="emptySignals"><i/><i/><i/></div></motion.section>:
        loading?<motion.section className="analysisSkeleton" initial={{opacity:0}} animate={{opacity:1}}><i/><i/><i/><i/><i/></motion.section>:
        result&&<motion.section key={result.risk_score} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`analysisResult ${result.risk_level.toLowerCase()}`}>
          <div className="resultTop"><div><span>AI RISK ASSESSMENT</span><h3>{result.classification}</h3><p>{result.category.replace(/_/g,' ')}</p></div><div className="compactRisk"><strong>{result.risk_score}</strong><span>{result.risk_level}</span></div></div>
          <div className="riskBar"><i style={{width:`${result.risk_score}%`}}/></div>
          <div className="signalChips">{result.signals.map(x=><span key={x}><AlertTriangle/>{x}</span>)}</div>
          <button className="explanationToggle" onClick={()=>setExpanded(!expanded)} aria-expanded={expanded}><span><ShieldAlert/>Why FinGuard flagged this</span><ChevronDown className={expanded?'up':''}/></button>
          {expanded&&<motion.div className="explanationPanel" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}><p>{result.explanation}</p>{result.signals.slice(0,3).map((x,i)=><div key={x}><b>0{i+1}</b><span><strong>{x}</strong>Pattern detected in the supplied content.</span></div>)}</motion.div>}
          <div className="recommended"><span>RECOMMENDED ACTIONS</span>{result.recommended_actions.slice(0,3).map((x,i)=><p key={x}><i>{i+1}</i>{x}</p>)}</div>
          <footer>Confidence {(result.confidence*100).toFixed(0)}% · AI-generated analysis · Independently verify important decisions.</footer>
        </motion.section>}
      </AnimatePresence>
    </div>
  </div>
}

type Sim={id:string;amount:number;risk:string;merchant:string;method:string;time:string;score:number};
export function TransactionMonitor(){
  const seed:Sim[]=[
    {id:'1',amount:48500,risk:'HIGH',merchant:'Unknown Merchant',method:'UPI',time:'10:42 PM',score:87},
    {id:'2',amount:5890,risk:'LOW',merchant:'Grocery Market',method:'Card',time:'08:24 PM',score:12},
    {id:'3',amount:1240,risk:'LOW',merchant:'Metro Mobility',method:'UPI',time:'06:18 PM',score:8},
  ];
  const [rows,setRows]=useState(seed),[running,setRunning]=useState(true),[msg,setMsg]=useState('');
  useEffect(()=>{if(!running)return;const id=setInterval(()=>{const amount=[2100,76000,899,14500][Math.floor(Math.random()*4)],score=amount>50000?96:amount>12000?78:11,risk=score>90?'CRITICAL':score>60?'HIGH':'LOW';setRows(x=>[{id:crypto.randomUUID(),amount,risk,merchant:risk==='LOW'?'Verified Merchant':'New Recipient',method:'UPI',time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),score},...x].slice(0,7))},3600);return()=>clearInterval(id)},[running]);
  async function upload(file?:File){if(!file)return;const f=new FormData();f.append('file',file);try{const r=await api.post('/transactions/upload',f,{timeout:30000});setMsg(`${r.data.imported} transactions imported for anomaly analysis.`)}catch(e:any){setMsg(e.response?.data?.detail||'We could not import this CSV. Check the required columns and file size.')}}
  return <div className="modernSafety">
    <PageIntro eyebrow="LIVE DEMO SIMULATION" title="Transaction monitor" desc="A transparent simulation of feature extraction, ML scoring and alert generation." action={<button className="secondaryAction" onClick={()=>setRunning(!running)}><Radio/>{running?'Pause stream':'Resume stream'}</button>}/>
    <div className="demoBanner"><span><i className={running?'pulseDot':''}/>LIVE DEMO SIMULATION</span><p>This interface is not connected to a real bank.</p></div>
    <div className="monitorLayout">
      <section className="premiumPanel liveFeed"><div className="panelHead"><div><span>REAL-TIME RISK STREAM</span><h3>Incoming transactions</h3></div><em>{rows.length} events</em></div>
        <div className="transactionHeader"><span>Merchant</span><span>Method / time</span><span>Amount</span><span>Risk score</span><span>Status</span></div>
        <AnimatePresence initial={false}>{rows.map((x,i)=><motion.div layout initial={i===0?{opacity:0,y:-14}:false} animate={{opacity:1,y:0}} className="streamRow" key={x.id}>
          <div><i className={x.risk.toLowerCase()}><WalletCards/></i><b>{x.merchant}</b></div><span>{x.method}<small>{x.time}</small></span><strong>{money(x.amount)}</strong><span className="scoreCell">{x.score}%</span><em className={x.risk.toLowerCase()}>{x.risk} RISK</em>
        </motion.div>)}</AnimatePresence>
      </section>
      <aside className="premiumPanel importPanel"><Upload/><span>TRANSACTION DATA</span><h3>Import an anonymized CSV</h3><p>Required: date, amount, merchant, category and payment method.</p><label className="primary">Choose CSV<input type="file" accept=".csv,text/csv" onChange={e=>upload(e.target.files?.[0])}/></label>{msg&&<div className="uploadMessage">{msg}</div>}<small>Maximum 2 MB · 1,000 rows. Imported records are not presented as live bank data.</small></aside>
    </div>
  </div>
}

type Incident={id:string;incident_code:string;title:string;scam_type:string;amount:number;risk_level:string;status:string;occurred_at?:string};
const stages=['DETECTED','DOCUMENTING','REPORTED','MONITORING','RESOLVED'];
export function IncidentCenter(){
  const [items,setItems]=useState<Incident[]>([]),[show,setShow]=useState(false),[created,setCreated]=useState(''),[error,setError]=useState('');
  async function load(){try{const r=await api.get('/incidents');setItems(r.data);setError('')}catch{setError('Incident records could not be loaded. Please try again.')}}
  useEffect(()=>{load()},[]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget),body={title:f.get('title'),occurred_at:f.get('occurred_at'),scam_type:f.get('scam_type'),amount:Number(f.get('amount')||0),payment_method:f.get('payment_method')||null,description:f.get('description')};try{const r=await api.post('/incidents',body);setCreated(r.data.incident_code);setShow(false);load()}catch{setError('The incident could not be created. Verify the required fields and try again.')}}
  return <div className="modernSafety"><PageIntro eyebrow="INCIDENT RESPONSE" title="Incident center" desc="Document what happened, preserve evidence and track legitimate reporting steps." action={<button className="primary" onClick={()=>setShow(true)}><Plus/>Create incident</button>}/>{created&&<div className="safetyNotice"><Check/>Incident {created} created. Continue with evidence and recovery steps.</div>}{error&&<div className="softError"><AlertTriangle/><span>{error}</span><button onClick={load}>Try again</button></div>}
    {!items.length?<section className="helpfulEmpty"><FileWarningIcon/><h3>No incidents yet.</h3><p>FinGuard has not detected or documented any incidents.</p><a href="#/app/scam-analyzer">Analyze a suspicious message</a></section>:
    <div className="modernIncidentList">{items.map(x=>{const stage=Math.max(1,stages.indexOf(x.status)+1);return <article className="modernIncident" key={x.id}><div className="incidentIdentity"><span>INCIDENT {x.incident_code}</span><em className={x.risk_level.toLowerCase()}>{x.risk_level} RISK</em><h3>{x.title}</h3><p>{x.scam_type} · {x.occurred_at?new Date(x.occurred_at).toLocaleDateString():'Date pending'}</p></div><div className="incidentAmount"><span>AMOUNT INVOLVED</span><strong>{money(x.amount)}</strong></div><div className="statusTimeline">{stages.map((s,i)=><div className={i<stage?'complete':''} key={s}><i>{i<stage?<Check/>:i+1}</i><span>{s}</span></div>)}</div><button className="secondaryAction">Open incident <ArrowRight/></button></article>})}</div>}
    {show&&<div className="modal modernModal"><motion.form initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} onSubmit={submit}><button type="button" className="modalX" onClick={()=>setShow(false)}>×</button><span>SAFE DOCUMENTATION</span><h3>Create a scam incident</h3><p>Never enter an OTP, PIN, CVV, password, private key or banking login.</p><input name="title" required placeholder="Incident title"/><div className="formSplit"><input name="occurred_at" required type="datetime-local"/><select name="scam_type"><option>UPI Scam</option><option>Fake KYC</option><option>Phishing</option><option>Investment Scam</option></select></div><div className="formSplit"><input name="amount" type="number" min="0" placeholder="Amount involved"/><input name="payment_method" placeholder="Payment method"/></div><textarea name="description" required minLength={10} placeholder="Describe what happened without including secret credentials."/><button className="primary">Create documented incident</button></motion.form></div>}
  </div>
}

function FileWarningIcon(){return <div className="emptyIcon"><FileText/></div>}
const recoveryActions=['Stop communicating with the suspected scammer.','Do not send additional money.','Contact the relevant bank or payment provider through an official channel.','Preserve screenshots, transaction IDs, URLs and messages.','Report through the appropriate official channel.','Secure potentially compromised accounts.'];
export function RecoveryAssistant(){const [done,setDone]=useState<number[]>(()=>{try{return JSON.parse(localStorage.getItem('fg_recovery_steps')||'[]')}catch{return[]}});const progress=Math.round(done.length/recoveryActions.length*100);function toggle(i:number){setDone((current:number[])=>{const next=current.includes(i)?current.filter(n=>n!==i):[...current,i];localStorage.setItem('fg_recovery_steps',JSON.stringify(next));return next})}return <div className="modernSafety recoveryPage"><PageIntro eyebrow="CALM, GUIDED RESPONSE" title="Let's work through this step by step." desc="Clear actions for protecting your account, preserving evidence and reporting through legitimate channels."/><section className="recoveryOverview"><div><span>RECOVERY PROGRESS</span><h3>{done.length} of {recoveryActions.length} actions completed</h3><div className="recoveryProgress"><i style={{width:`${progress}%`}}/></div></div><strong>{progress}%</strong></section><div className="recoveryLayout"><section className="premiumPanel calmChecklist"><div className="panelHead"><div><span>PRIORITIZED CHECKLIST</span><h3>Urgent actions</h3></div></div>{recoveryActions.map((x,i)=><button className={done.includes(i)?'done':''} onClick={()=>toggle(i)} key={x}><i>{done.includes(i)?<Check/>:i+1}</i><span>{x}</span><em>{done.includes(i)?'Completed':'Mark complete'}</em></button>)}</section><aside className="premiumPanel recoveryTrust"><ShieldCheck/><h3>You are not alone.</h3><p>FinGuard provides organized guidance. It cannot directly recover funds.</p><a href="#/app/incidents"><FileText/>Create incident report</a><a href="#/app/evidence"><Vault/>Add evidence</a><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer"><Globe2/>Official cybercrime portal</a><p className="officialNote">For India, the official cybercrime helpline is 1930. Verify resources for your own country.</p></aside></div></div>}

export function EvidenceVault(){
  const [incidents,setIncidents]=useState<any[]>([]),[selected,setSelected]=useState(''),[detail,setDetail]=useState<any>(null),[show,setShow]=useState(false),[error,setError]=useState('');
  useEffect(()=>{api.get('/incidents').then(r=>{setIncidents(r.data);if(r.data[0])setSelected(r.data[0].id)}).catch(()=>setError('Incident records could not be loaded.'))},[]);
  useEffect(()=>{if(!selected)return;api.get(`/incidents/${selected}`).then(r=>setDetail(r.data)).catch(()=>setError('Evidence could not be loaded.'))},[selected]);
  async function add(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget);try{await api.post(`/incidents/${selected}/evidence`,{evidence_type:f.get('evidence_type'),label:f.get('label'),content:f.get('content'),occurred_at:new Date().toISOString()});setShow(false);const r=await api.get(`/incidents/${selected}`);setDetail(r.data)}catch{setError('The evidence reference could not be saved.')}}
  async function report(){if(!selected)return;try{const r=await api.get(`/incidents/${selected}/report`),data=r.data;const {jsPDF}=await import('jspdf');const d=new jsPDF();d.setFillColor(15,23,42);d.rect(0,0,210,42,'F');d.setTextColor(255);d.setFontSize(21);d.text('FinGuard Incident Report',16,22);d.setFontSize(9);d.text(`${data.incident.incident_code} · AI-assisted documentation`,16,33);d.setTextColor(28);d.setFontSize(11);d.text(`Incident: ${data.incident.title}`,16,58);d.text(`Amount involved: INR ${data.incident.amount}`,16,69);d.text(`Status: ${data.incident.status}`,16,80);d.text('Evidence references',16,98);data.evidence.slice(0,10).forEach((x:any,i:number)=>d.text(`${i+1}. ${x.label} [${x.evidence_type}]`,20,110+i*9));d.setFontSize(9);d.text(data.verification_notice,16,204);d.text(data.recovery_notice,16,214);d.save(`FinGuard-${data.incident.incident_code}.pdf`)}catch{setError('The incident report could not be generated.')}}
  return <div className="modernSafety"><PageIntro eyebrow="EVIDENCE ORGANIZATION" title="Evidence vault" desc="A structured locker for user-provided references. Do not add passwords, OTPs, PINs or card security codes." action={<button className="primary" onClick={report} disabled={!selected}><Download/>Export incident PDF</button>}/>{error&&<div className="softError"><AlertTriangle/><span>{error}</span></div>}<div className="vaultNotice"><LockKeyhole/><div><b>Protected workspace</b><p>FinGuard organizes evidence references. It does not claim file encryption unless encryption is explicitly enabled.</p></div></div>{!incidents.length?<section className="helpfulEmpty"><FileText/><h3>No incident selected.</h3><p>Create an incident before adding evidence.</p><a href="#/app/incidents">Create incident</a></section>:<><label className="incidentPicker">Incident<select value={selected} onChange={e=>setSelected(e.target.value)}>{incidents.map(x=><option value={x.id} key={x.id}>{x.incident_code} — {x.title}</option>)}</select></label><section className="premiumPanel evidenceActivity"><div className="panelHead"><div><span>INCIDENT EVIDENCE</span><h3>{detail?.incident?.incident_code||'Loading…'}</h3></div><button className="secondaryAction" onClick={()=>setShow(true)}><Plus/>Add evidence</button></div>{detail?.evidence?.length?detail.evidence.map((x:any,i:number)=><div key={x.id}><time>{x.occurred_at?new Date(x.occurred_at).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}):`0${i+1}`}</time><i className={i===detail.evidence.length-1?'active':''}/><p><b>{x.label}</b><span>{x.evidence_type}</span></p></div>):<div className="panelEmpty">No evidence references yet.</div>}</section></>}{show&&<div className="modal modernModal"><form onSubmit={add}><button type="button" className="modalX" onClick={()=>setShow(false)}>×</button><span>ADD EVIDENCE REFERENCE</span><h3>Document evidence</h3><select name="evidence_type"><option>Screenshot</option><option>Message</option><option>Transaction receipt</option><option>URL</option><option>Phone number</option><option>Transaction ID</option><option>Note</option></select><input required name="label" maxLength={180} placeholder="Short label"/><textarea required name="content" maxLength={6000} placeholder="Reference or description — never include credentials"/><button className="primary">Save evidence reference</button></form></div>}</div>
}

const lessons=[['UPI scams','Unexpected collect requests and “refund” tricks.'],['Phishing','Look-alike domains and urgent verification messages.'],['Fake KYC','Account-suspension threats used to steal credentials.'],['Investment scams','Guaranteed returns and fabricated social proof.'],['Job scams','Upfront registration or equipment fees.'],['Delivery scams','Small fake fees used to capture credentials.']];
export function ScamEducation(){const [open,setOpen]=useState(0);return <div className="modernSafety"><PageIntro eyebrow="SCAM EDUCATION" title="Recognize the pattern" desc="Practical warning signs and safer next steps, using fictional and anonymized examples."/><div className="modernEducation">{lessons.map((x,i)=><button key={x[0]} className={open===i?'active':''} onClick={()=>setOpen(i)}><span>0{i+1}</span><div><h3>{x[0]}</h3><p>{x[1]}</p>{open===i&&<motion.section initial={{opacity:0}} animate={{opacity:1}}><b>Pause before acting.</b><small>Verify through an official channel, preserve evidence and never share credentials under pressure.</small></motion.section>}</div><ChevronDown/></button>)}</div></div>}