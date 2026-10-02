import {AnimatePresence,motion} from 'framer-motion';
import {
  AlertTriangle,ArrowRight,BookOpen,Check,ChevronDown,Download,FileImage,FileText,
  Globe2,Link2,LockKeyhole,Mail,MessageSquare,Plus,Radio,ReceiptText,RefreshCw,
  ShieldAlert,ShieldCheck,Upload,Vault,WalletCards
} from 'lucide-react';
import {FormEvent,useEffect,useState} from 'react';
import {api} from '../lib/api';
import {money,PageIntro} from '../components/UI';

type Analysis={risk_score:number;risk_level:string;classification:string;category:string;signals:string[];explanation:string;recommended_actions:string[];confidence:number};
const sample='Your bank account will be blocked today. Verify your KYC immediately and share the OTP using this link.';
const fallback:Analysis={risk_score:91,risk_level:'CRITICAL',classification:'Potential scam',category:'kyc_scam',signals:['Urgency','Account threat','Financial impersonation','Credential request'],explanation:'FinGuard detected several patterns commonly associated with financial scams. These model signals are not definitive proof and should be independently verified.',recommended_actions:['Do not click links or send additional money.','Verify the sender through an official channel.','Preserve the message and URL as evidence.','Contact the relevant provider using its official website or app.'],confidence:.91};
const tabs=[['Message',MessageSquare],['URL',Link2],['Email',Mail],['Transaction',WalletCards]] as const;

export function ScamAnalyzer(){
  const [tab,setTab]=useState('Message'),[text,setText]=useState(sample),[url,setUrl]=useState(''),[result,setResult]=useState<Analysis|null>(null),[loading,setLoading]=useState(false),[error,setError]=useState(''),[expanded,setExpanded]=useState(true);
  async function analyze(){
    if(text.trim().length<3)return setError('Add suspicious content before starting the analysis.');
    setLoading(true);setError('');
    try{const r=await api.post('/scam/analyze',{text,url:url||null},{timeout:60000});setResult(r.data);localStorage.setItem('fg_safety_context',JSON.stringify({type:'scam analysis',risk:r.data.risk_level,category:r.data.category,signals:r.data.signals,updated:new Date().toISOString()}))}
    catch{setResult(fallback);setError('Live analysis was unavailable, so FinGuard is showing an explainable demo assessment. Try again when the service reconnects.')}
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
  const [items,setItems]=useState<Incident[]>([]),[show,setShow]=useState(false),[created,setCreated]=useState('');
  useEffect(()=>{api.get('/incidents').then(r=>setItems(r.data)).catch(()=>setItems([{id:'demo',incident_code:'FG-2026-00124',title:'Fake KYC payment request',scam_type:'UPI Scam',amount:25000,risk_level:'CRITICAL',status:'DOCUMENTING',occurred_at:'2026-09-21T10:31'}]))},[]);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const f=new FormData(e.currentTarget),body={title:f.get('title'),occurred_at:f.get('occurred_at'),scam_type:f.get('scam_type'),amount:Number(f.get('amount')||0),payment_method:f.get('payment_method')||null,description:f.get('description')};try{const r=await api.post('/incidents',body);setItems([r.data,...items]);setCreated(r.data.incident_code)}catch{setCreated('FG-DEMO-001')}setShow(false)}
  return <div className="modernSafety"><PageIntro eyebrow="INCIDENT RESPONSE" title="Incident center" desc="Document what happened, preserve evidence and track legitimate reporting steps." action={<button className="primary" onClick={()=>setShow(true)}><Plus/>Create incident</button>}/>{created&&<div className="safetyNotice"><Check/>Incident {created} created. Continue with evidence and recovery steps.</div>}
    {!items.length?<section className="helpfulEmpty"><FileWarningIcon/><h3>No incidents yet.</h3><p>FinGuard has not detected or documented any incidents.</p><a href="#/app/scam-analyzer">Analyze a suspicious message</a></section>:
    <div className="modernIncidentList">{items.map(x=>{const stage=Math.max(1,stages.indexOf(x.status)+1);return <article className="modernIncident" key={x.id}><div className="incidentIdentity"><span>INCIDENT {x.incident_code}</span><em className={x.risk_level.toLowerCase()}>{x.risk_level} RISK</em><h3>{x.title}</h3><p>{x.scam_type} · {x.occurred_at?new Date(x.occurred_at).toLocaleDateString():'Date pending'}</p></div><div className="incidentAmount"><span>AMOUNT INVOLVED</span><strong>{money(x.amount)}</strong></div><div className="statusTimeline">{stages.map((s,i)=><div className={i<stage?'complete':''} key={s}><i>{i<stage?<Check/>:i+1}</i><span>{s}</span></div>)}</div><button className="secondaryAction">Open incident <ArrowRight/></button></article>})}</div>}
    {show&&<div className="modal modernModal"><motion.form initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}} onSubmit={submit}><button type="button" className="modalX" onClick={()=>setShow(false)}>×</button><span>SAFE DOCUMENTATION</span><h3>Create a scam incident</h3><p>Never enter an OTP, PIN, CVV, password, private key or banking login.</p><input name="title" required placeholder="Incident title"/><div className="formSplit"><input name="occurred_at" required type="datetime-local"/><select name="scam_type"><option>UPI Scam</option><option>Fake KYC</option><option>Phishing</option><option>Investment Scam</option></select></div><div className="formSplit"><input name="amount" type="number" min="0" placeholder="Amount involved"/><input name="payment_method" placeholder="Payment method"/></div><textarea name="description" required minLength={10} placeholder="Describe what happened without including secret credentials."/><button className="primary">Create documented incident</button></motion.form></div>}
  </div>
}

function FileWarningIcon(){return <div className="emptyIcon"><FileText/></div>}
const recoveryActions=['Stop communicating with the suspected scammer.','Do not send additional money.','Contact the relevant bank or payment provider through an official channel.','Preserve screenshots, transaction IDs, URLs and messages.','Report through the appropriate official channel.','Secure potentially compromised accounts.'];
export function RecoveryAssistant(){const [done,setDone]=useState<number[]>([]);const progress=Math.round(done.length/recoveryActions.length*100);return <div className="modernSafety recoveryPage"><PageIntro eyebrow="CALM, GUIDED RESPONSE" title="Let's work through this step by step." desc="Clear actions for protecting your account, preserving evidence and reporting through legitimate channels."/><section className="recoveryOverview"><div><span>RECOVERY PROGRESS</span><h3>{done.length} of {recoveryActions.length} actions completed</h3><div className="recoveryProgress"><i style={{width:`${progress}%`}}/></div></div><strong>{progress}%</strong></section><div className="recoveryLayout"><section className="premiumPanel calmChecklist"><div className="panelHead"><div><span>PRIORITIZED CHECKLIST</span><h3>Urgent actions</h3></div></div>{recoveryActions.map((x,i)=><button className={done.includes(i)?'done':''} onClick={()=>setDone(d=>d.includes(i)?d.filter(n=>n!==i):[...d,i])} key={x}><i>{done.includes(i)?<Check/>:i+1}</i><span>{x}</span><em>{done.includes(i)?'Completed':'Mark complete'}</em></button>)}</section><aside className="premiumPanel recoveryTrust"><ShieldCheck/><h3>You are not alone.</h3><p>FinGuard provides organized guidance. It cannot directly recover funds.</p><a href="#/app/incidents"><FileText/>Create incident report</a><a href="#/app/evidence"><Vault/>Add evidence</a><button><Globe2/>Official reporting resources</button></aside></div></div>}

export function EvidenceVault(){
  const evidence=[[FileImage,'Screenshots','2 files'],[MessageSquare,'Messages','3 records'],[ReceiptText,'Transaction receipts','1 receipt'],[Link2,'Suspicious URLs','1 URL'],[FileText,'Reference IDs','2 references'],[BookOpen,'Notes','4 notes']] as const;
  function report(){import('jspdf').then(({jsPDF})=>{const d=new jsPDF();d.setFillColor(15,23,42);d.rect(0,0,210,42,'F');d.setTextColor(255);d.setFontSize(21);d.text('FinGuard Incident Report',16,22);d.setFontSize(9);d.text('FG-2026-00124 · AI-assisted documentation',16,33);d.setTextColor(28);d.setFontSize(12);d.text('Incident: Fake KYC / UPI scam',16,58);d.text('Amount involved: INR 25,000',16,70);d.text('Status: Documenting',16,82);d.setFontSize(10);d.text('AI-generated analysis should be independently verified.',16,194);d.text('Generated by FinGuard',16,204);d.save('FinGuard-Incident-FG-2026-00124.pdf')})}
  return <div className="modernSafety"><PageIntro eyebrow="EVIDENCE ORGANIZATION" title="Evidence vault" desc="A structured locker for user-provided references and incident records." action={<button className="primary" onClick={report}><Download/>Export incident PDF</button>}/><div className="vaultNotice"><LockKeyhole/><div><b>Protected workspace</b><p>FinGuard organizes evidence references. It does not claim file encryption unless encryption is explicitly enabled.</p></div></div><div className="modernVaultGrid">{evidence.map(([Icon,title,count])=><motion.article whileHover={{y:-3}} className="premiumPanel" key={title}><Icon/><div><h3>{title}</h3><span>{count}</span></div><button aria-label={`Open ${title}`}><ArrowRight/></button></motion.article>)}</div><section className="premiumPanel evidenceActivity"><div className="panelHead"><div><span>INCIDENT TIMELINE</span><h3>FG-2026-00124</h3></div><button className="secondaryAction"><Plus/>Add evidence</button></div>{[['10:31','Suspicious KYC message received'],['10:34','Unknown URL opened'],['10:37','UPI payment initiated'],['10:45','Incident documented']].map((x,i)=><div key={x[0]}><time>{x[0]}</time><i className={i===3?'active':''}/><p>{x[1]}</p></div>)}</section></div>
}

const lessons=[['UPI scams','Unexpected collect requests and “refund” tricks.'],['Phishing','Look-alike domains and urgent verification messages.'],['Fake KYC','Account-suspension threats used to steal credentials.'],['Investment scams','Guaranteed returns and fabricated social proof.'],['Job scams','Upfront registration or equipment fees.'],['Delivery scams','Small fake fees used to capture credentials.']];
export function ScamEducation(){const [open,setOpen]=useState(0);return <div className="modernSafety"><PageIntro eyebrow="SCAM EDUCATION" title="Recognize the pattern" desc="Practical warning signs and safer next steps, using fictional and anonymized examples."/><div className="modernEducation">{lessons.map((x,i)=><button key={x[0]} className={open===i?'active':''} onClick={()=>setOpen(i)}><span>0{i+1}</span><div><h3>{x[0]}</h3><p>{x[1]}</p>{open===i&&<motion.section initial={{opacity:0}} animate={{opacity:1}}><b>Pause before acting.</b><small>Verify through an official channel, preserve evidence and never share credentials under pressure.</small></motion.section>}</div><ChevronDown/></button>)}</div></div>}