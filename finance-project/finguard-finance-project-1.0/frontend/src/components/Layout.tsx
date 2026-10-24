import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {
  BarChart3,Bell,BookOpen,ChevronLeft,ChevronRight,FileWarning,LayoutDashboard,
  Menu,MessageSquareWarning,Moon,ReceiptText,Settings,ShieldCheck,Sun,Vault,X
} from 'lucide-react';
import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import {NavLink,Outlet,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {api} from '../lib/api';
const ScamAnalysisDrawer=lazy(()=>import('./ScamAnalysisDrawer'));

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
  ['/app/forecasts','Predictions',BarChart3],
] as const;

export default function Layout(){
  const navigation=useRef<HTMLElement>(null),reducedMotion=useReducedMotion();
  const [open,setOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(()=>localStorage.getItem('fg_sidebar')==='collapsed');
  const [notice,setNotice]=useState(false);
  const [profileOpen,setProfileOpen]=useState(false);
  const [scamOpen,setScamOpen]=useState(false);
  const [scamHasOpened,setScamHasOpened]=useState(false);
  useEffect(()=>{if(scamOpen)setScamHasOpened(true)},[scamOpen]);
  const [notifications,setNotifications]=useState<{id:string;type:string;title:string;message:string;risk_level:string;is_read:boolean;created_at:string}[]>([]);
  const [theme,setTheme]=useState<'dark'|'light'>(()=>(localStorage.getItem('fg_theme') as 'dark'|'light')||'dark');
  const loc=useLocation(),go=useNavigate(),auth=useAuth();
  const all=[...primary,...secondary];
  const title=all.find(x=>x[0]===loc.pathname)?.[1]||'FinGuard';

  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fg_theme',theme)},[theme]);
  useEffect(()=>{localStorage.setItem('fg_sidebar',collapsed?'collapsed':'open')},[collapsed]);
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{
    if(!open)return;
    const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    const frame=requestAnimationFrame(()=>navigation.current?.querySelector<HTMLElement>('.close')?.focus());
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();setOpen(false)}if(e.key==='Tab'&&navigation.current){const items=[...navigation.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')].filter(x=>x.getClientRects().length);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}};
    document.addEventListener('keydown',key);return()=>{cancelAnimationFrame(frame);document.removeEventListener('keydown',key);document.body.style.overflow=overflow;if(previous?.isConnected)previous.focus({preventScroll:true})};
  },[open]);
  useEffect(()=>{api.get('/notifications').then(r=>setNotifications(r.data)).catch(()=>setNotifications([]))},[]);
  useEffect(()=>{const openAnalyzer=()=>setScamOpen(true);addEventListener('finguard:open-scam-analyzer',openAnalyzer);return()=>removeEventListener('finguard:open-scam-analyzer',openAnalyzer)},[]);
  const unread=notifications.filter(x=>!x.is_read).length;
  async function markAllRead(){try{await api.post('/notifications/mark-all-read');setNotifications(items=>items.map(x=>({...x,is_read:true})))}catch{}}


  const links=(items:readonly (readonly [string,string,any])[])=>items.map(([to,label,Icon])=>
    <NavLink to={to} end={to==='/dashboard'} key={to} title={collapsed?label:undefined}>
      <Icon size={19}/><span>{label}</span>
      {label==='Alerts'&&unread>0&&<i>{unread}</i>}
    </NavLink>
  );

  return <div className={`shell premiumShell ${collapsed?'sidebarCollapsed':''}`}>
    <aside ref={navigation} className={open?'open':''} aria-label="Primary navigation">
      <div className="brand premiumBrand">
        <div className="mark"><ShieldCheck/></div>
        <div className="brandCopy"><b>FinGuard</b><small>Financial safety</small></div>
        <button className="close" aria-label="Close navigation" onClick={()=>setOpen(false)}><X/></button>
      </div>
      <div className="secure premiumStatus"><i/><div><b>FinGuard workspace</b><small>Recorded and sample activity</small></div></div>
      <nav><div className="navLabel">OVERVIEW</div>{links(primary.slice(0,1))}<div className="navLabel">SECURITY</div>{links(primary.slice(1,5))}{links(secondary.slice(1,2))}<div className="navLabel">INTELLIGENCE</div>{links(primary.slice(5,6))}{links([secondary[3],secondary[0],secondary[2]])}<div className="navLabel">LEARN</div>{links(primary.slice(6))}</nav>
      <div className="asideBottom"><div className="navLabel">SYSTEM</div>
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
          <button aria-label={`Notifications${unread?`, ${unread} unread`:''}`} aria-expanded={notice} className="bell" onClick={()=>setNotice(!notice)}><Bell/>{unread>0&&<i/>}</button>
          <button className="primary analyzeLink" onClick={()=>setScamOpen(true)}>Analyze a scam</button>
        </div>
        {notice&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="headerPop noticePop">
          <div className="popTitle"><b>Notifications</b><span>{unread} unread</span></div>
          {notifications.length?notifications.map(x=><p key={x.id}><i className={`riskDot ${x.risk_level?.toLowerCase()||'medium'}`}/><span><b>{x.title}</b>{x.message}</span></p>):<p>No notifications yet.</p>}
          {unread>0&&<button className="markRead" onClick={markAllRead}>Mark all as read</button>}
        </motion.div>}
      </header>
      <AnimatePresence mode="wait">
        <motion.div key={loc.pathname} className="routeMotion premiumRoute"
          initial={reducedMotion?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={reducedMotion?{opacity:0}:{opacity:0,y:-4}}
          transition={{duration:reducedMotion?0:.2,ease:[.22,1,.36,1]}}>
          <Outlet/>
        </motion.div>
      </AnimatePresence>
    </main>
    {open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
    {(scamOpen||scamHasOpened)&&<Suspense fallback={<div className="drawerModuleLoading" role="status">Opening analyzer…</div>}><ScamAnalysisDrawer open={scamOpen} onClose={()=>setScamOpen(false)}/></Suspense>}
    <nav className="mobileDock" aria-label="Mobile navigation">
      {primary.slice(0,5).map(([to,label,Icon])=><NavLink to={to} end={to==='/dashboard'} key={to}><Icon/><span>{label}</span></NavLink>)}
    </nav>
  </div>
}