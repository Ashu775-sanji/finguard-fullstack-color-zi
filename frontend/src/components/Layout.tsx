import {AnimatePresence,motion} from 'framer-motion';
import {
  BarChart3,Bell,BookOpen,ChevronLeft,ChevronRight,FileWarning,LayoutDashboard,
  Menu,MessageSquareWarning,Moon,ReceiptText,Settings,ShieldCheck,Sun,Vault,X
} from 'lucide-react';
import {useEffect,useState} from 'react';
import {NavLink,Outlet,useLocation,useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {api} from '../lib/api';

const primary=[
  ['/app','Dashboard',LayoutDashboard],
  ['/app/scam-analyzer','Scam Analyzer',MessageSquareWarning],
  ['/app/transactions','Transactions',ReceiptText],
  ['/app/incidents','Incidents',FileWarning],
  ['/app/recovery','Recovery',ShieldCheck],
  ['/app/analytics','Insights',BarChart3],
  ['/app/education','Education',BookOpen],
] as const;
const secondary=[
  ['/app/transaction-monitor','Live monitor',ShieldCheck],
  ['/app/evidence','Evidence vault',Vault],
  ['/app/assistant','FinGuard AI',MessageSquareWarning],
] as const;

export default function Layout(){
  const [open,setOpen]=useState(false);
  const [collapsed,setCollapsed]=useState(()=>localStorage.getItem('fg_sidebar')==='collapsed');
  const [notice,setNotice]=useState(false);
  const [notifications,setNotifications]=useState<{type:string;message:string}[]>([]);
  const [theme,setTheme]=useState<'dark'|'light'>(()=>(localStorage.getItem('fg_theme') as 'dark'|'light')||'dark');
  const loc=useLocation(),go=useNavigate(),auth=useAuth();
  const all=[...primary,...secondary];
  const title=all.find(x=>x[0]===loc.pathname)?.[1]||'FinGuard';

  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('fg_theme',theme)},[theme]);
  useEffect(()=>{localStorage.setItem('fg_sidebar',collapsed?'collapsed':'open')},[collapsed]);
  useEffect(()=>setOpen(false),[loc.pathname]);
  useEffect(()=>{api.get('/notifications').then(r=>setNotifications(r.data)).catch(()=>setNotifications([]))},[]);

  const links=(items:typeof primary|typeof secondary)=>items.map(([to,label,Icon])=>
    <NavLink to={to} end={to==='/app'} key={to} title={collapsed?label:undefined}>
      <Icon size={19}/><span>{label}</span>
      {label==='Incidents'&&<i>1</i>}
    </NavLink>
  );

  return <div className={`shell premiumShell ${collapsed?'sidebarCollapsed':''}`}>
    <aside className={open?'open':''} aria-label="Primary navigation">
      <div className="brand premiumBrand">
        <div className="mark"><ShieldCheck/></div>
        <div className="brandCopy"><b>FinGuard</b><small>Financial safety</small></div>
        <button className="close" aria-label="Close navigation" onClick={()=>setOpen(false)}><X/></button>
      </div>
      <div className="secure premiumStatus"><i/><div><b>Protection active</b><small>AI monitoring online</small></div></div>
      <nav>{links(primary)}<div className="navLabel">WORKSPACE</div>{links(secondary)}</nav>
      <div className="asideBottom">
        <NavLink className="settingsLink" to="/app/settings"><Settings size={19}/><span>Settings</span></NavLink>
        <div className="profile">
          <div className="avatar">{auth.user?.name.split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()}</div>
          <div className="profileCopy"><b>{auth.user?.name}</b><small>Personal workspace</small></div>
          <button className="profileMenu" aria-label="Sign out" onClick={()=>{auth.logout();go('/')}}>↗</button>
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
          <NavLink className="primary analyzeLink" to="/app/scam-analyzer">Analyze a scam</NavLink>
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
    <nav className="mobileDock" aria-label="Mobile navigation">
      {primary.slice(0,5).map(([to,label,Icon])=><NavLink to={to} end={to==='/app'} key={to}><Icon/><span>{label}</span></NavLink>)}
    </nav>
  </div>
}