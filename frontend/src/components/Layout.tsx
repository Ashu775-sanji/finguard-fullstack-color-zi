import {AnimatePresence,motion} from 'framer-motion';
import {
  BarChart3,Bell,BookOpen,ChevronLeft,ChevronRight,FileWarning,LayoutDashboard,
  Menu,MessageSquareWarning,Moon,ReceiptText,Settings,ShieldCheck,Sun,Vault,X
} from 'lucide-react';
import {useEffect,useState} from 'react';
import {NavLink,Outlet,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {api} from '../lib/api';
import Drawer from './Drawer';

const primary=[
  ['/dashboard','Dashboard',LayoutDashboard],
  ['/app/scam-analyzer','Scam Analyzer',MessageSquareWarning],
  ['/app/transactions','Transactions',ReceiptText],
  ['/app/incidents','Alerts',FileWarning],
  ['/app/recovery','Recovery',ShieldCheck],
  ['/app/analytics','Insights',BarChart3],
  ['/app/education','Education',BookOpen],
] as const;
const secondary=[
  ['/app/transaction-monitor','Activity Monitor',ShieldCheck],
  ['/app/evidence','Evidence vault',Vault],
  ['/app/assistant','Fin AI',MessageSquareWarning],
] as const;

export default function Layout(){
  const [open,setOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(()=>localStorage.getItem('fg_sidebar')==='collapsed');
  const [notice,setNotice]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const [scamOpen,setScamOpen]=useState(false);
  const [scamText,setScamText]=useState('');
  const [scamResult,setScamResult]=useState<any>(null);
  const [scamLoading,setScamLoading]=useState(false);
  const [notifications,setNotifications]=useState<{type:string;message:string}[]>([]);
  const [theme,setTheme]=useState<'dark'|'light'>(()=>(localStorage.getItem('fg_theme') as 'dark'|'light')||'dark');
  const loc=useLocation(),go=useNavigate(),auth=useAuth();
  const all=[...primary,...secondary];
  const title=all.find(x=>x[0]===loc.pathname)?.[1]||'FinGuard';

  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fg_theme',theme)},[theme]);
  useEffect(()=>{localStorage.setItem('fg_sidebar',collapsed?'collapsed':'open')},[collapsed]);
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{api.get('/notifications').then(r=>setNotifications(r.data)).catch(()=>setNotifications([]))},[]);
  async function analyzeScam(){if(scamText.trim().length<3)return;setScamLoading(true);try{const r=await api.post('/scam/analyze',{text:scamText,url:null},{timeout:60000});setScamResult(r.data)}catch{setScamResult({risk_score:0,risk_level:'UNAVAILABLE',signals:[],recommended_actions:['Try again when the FinGuard analysis service is available.'],explanation:'The analysis service could not be reached.'})}finally{setScamLoading(false)}}

  const links=(items:readonly (readonly [string,string,any])[])=>items.map(([to,label,Icon])=>
    <NavLink to={to} end={to==='/dashboard'} key={to} title={collapsed?label:undefined}>
      <Icon size={19}/><span>{label}</span>
      {label==='Alerts'&&<i>1</i>}
    </NavLink>
  );

  return <div className={`shell premiumShell ${collapsed?'sidebarCollapsed':''}`}>
    <aside className={open?'open':''} aria-label="Primary navigation">
      <div className="brand premiumBrand">
        <div className="mark"><ShieldCheck/></div>
        <div className="brandCopy"><b>FinGuard</b><small>Financial safety</small></div>
        <button className="close" aria-label="Close navigation" onClick={()=>setOpen(false)}><X/></button>
      </div>
      <div className="secure premiumStatus"><i/><div><b>FinGuard analysis active</b><small>Transaction analysis ready</small></div></div>
      <nav><div className="navLabel">OVERVIEW</div>{links(primary.slice(0,1))}<div className="navLabel">SECURITY</div>{links(primary.slice(1,5))}{links(secondary.slice(1,2))}<div className="navLabel">INTELLIGENCE</div>{links(primary.slice(5,6))}{links([secondary[0],secondary[2]])}<div className="navLabel">LEARN</div>{links(primary.slice(6))}</nav>
      <div className="asideBottom">
        <NavLink className="settingsLink" to="/app/settings"><Settings size={19}/><span>Settings</span></NavLink>
        <div className="profile">
          <div className="avatar">{auth.user?.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div>
          <div className="profileCopy"><b>{auth.user?.name}</b><small>Personal workspace</small></div>
          <button className="profileMenu" aria-label="Open profile menu" aria-expanded={profileOpen} onClick={()=>setProfileOpen(x=>!x)}>•••</button>
          {profileOpen&&<div className="profilePopover"><b>{auth.user?.name}</b><NavLink to="/app/settings">Profile</NavLink><NavLink to="/app/settings">Settings</NavLink><button onClick={()=>{auth.logout();go('/')}}>Logout</button></div>}
        </div>
      </div>
      <button className="collapseRail" aria-label={collapsed?'Expand sidebar':'Collapse sidebar'} onClick={()=>setCollapsed(x=>!x)}>
        {collapsed?<ChevronRight/>:<ChevronLeft/>}
      </button>
    </aside>

    <main>
      <header className="premiumHeader">
        <button className="hamb" aria-label="Open navigation" onClick={()=>setOpen(true)}><Menu/></button>
        <div className="headerTitle"><p>FINANCIAL SAFETY</p><h1>{title}</h1></div>
        <div className="actions">
          <button aria-label={`Switch to ${theme==='dark'?'light':'dark'} mode`} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>
            {theme==='dark'?<Sun/>:<Moon/>}
          </button>
          <button aria-label="Notifications" className="bell" onClick={()=>setNotice(!notice)}><Bell/>{notifications.length>0&&<i/>}</button>
          <button className="primary analyzeLink" onClick={()=>setScamOpen(true)}>Analyze a scam</button>
        </div>
        {notice&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="headerPop noticePop">
          <div className="popTitle"><b>Notifications</b><span>{notifications.length} items</span></div>
          {notifications.length?notifications.map((x,i)=><p key={`${x.type}-${i}`}><i className={`riskDot ${x.type==='security'?'low':'medium'}`}/>{x.message}</p>):<p>No new notifications.</p>}
        </motion.div>}
      </header>
      <AnimatePresence mode="wait">
        <motion.div key={loc.pathname} className="routeMotion premiumRoute"
          initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-4}}
          transition={{duration:.2,ease:[.22,1,.36,1]}}>
          <Outlet/>
        </motion.div>
      </AnimatePresence>
    </main>
    {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
    <Drawer open={scamOpen} onClose={()=>{setScamOpen(false);setScamResult(null)}} title="Analyze with FinGuard AI" subtitle="Paste a suspicious message, transaction, link, call or payment request. Never include OTPs, PINs, CVVs or passwords.">
      <div className="analysisKinds"><span>💬 Message</span><span>💳 Transaction</span><span>🔗 Link</span><span>📞 Call / request</span></div>
      <label className="drawerField">What would you like FinGuard to analyze?<textarea value={scamText} onChange={e=>setScamText(e.target.value)} maxLength={6000} placeholder="Paste suspicious content or describe the request."/></label>
      <button className="primary drawerPrimary" onClick={analyzeScam} disabled={scamLoading||scamText.trim().length<3}>{scamLoading?'Analyzing risk indicators…':'Analyze with FinGuard AI'}</button>
      {scamResult&&<div className="globalScamResult"><span>RISK SCORE</span><strong>{scamResult.risk_score??0} / 100</strong><h3>{scamResult.risk_level} RISK</h3><p>{scamResult.explanation||'Potential risk indicators were evaluated based on the available information.'}</p>{scamResult.signals?.length>0&&<ul>{scamResult.signals.map((x:string)=><li key={x}>{x}</li>)}</ul>}<b>Recommended actions</b><ol>{(scamResult.recommended_actions||[]).slice(0,5).map((x:string)=><li key={x}>{x}</li>)}</ol></div>}
      <p className="analysisDisclaimer">FinGuard provides informational risk analysis and cannot guarantee that a message, transaction or request is fraudulent.</p>
    </Drawer>
    <nav className="mobileDock" aria-label="Mobile navigation">
      {primary.slice(0,5).map(([to,label,Icon])=><NavLink to={to} end={to==='/dashboard'} key={to}><Icon/><span>{label}</span></NavLink>)}
    </nav>
  </div>
}