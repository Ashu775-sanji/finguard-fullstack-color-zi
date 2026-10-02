import {motion} from 'framer-motion';
import {AlertTriangle,ArrowDownRight,ArrowUpRight,CheckCircle2,ChevronRight,MessageSquareWarning,RefreshCw,ShieldCheck,WalletCards} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {Area,AreaChart,CartesianGrid,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {apiError,getData} from '../lib/api';
import {money} from '../components/UI';

const distribution=[{name:'Low',value:76,fill:'#34d399'},{name:'Medium',value:16,fill:'#facc15'},{name:'High',value:6,fill:'#fb923c'},{name:'Critical',value:2,fill:'#f87171'}];

function Metric({label,value,detail,tone='neutral',icon:Icon}:{label:string,value:string,detail:string,tone?:string,icon:any}){
  return <motion.article whileHover={{y:-2}} transition={{duration:.18}} className={`premiumMetric ${tone}`}>
    <div><span>{label}</span><i><Icon/></i></div><strong>{value}</strong>
    <small>{tone==='good'?<ArrowDownRight/>:<ArrowUpRight/>}{detail}</small>
  </motion.article>
}

export default function PremiumDashboard(){
  const auth=useAuth();
  const [loading,setLoading]=useState(true);
  const [summary,setSummary]=useState({income:0,expenses:0,balance:0,guard_score:0,savings_rate:0});
  const [dashboard,setDashboard]=useState({scam_alerts:0,suspicious_transactions:0,total_spending:0,open_incidents:0});
  const [transactions,setTransactions]=useState<any[]>([]);
  const [error,setError]=useState('');
  async function load(){setLoading(true);setError('');try{const [s,d,t]=await Promise.all([getData<any>('/analytics/summary'),getData<any>('/dashboard'),getData<any[]>('/transactions')]);setSummary(s);setDashboard(d);setTransactions(t)}catch(e){setError(apiError(e))}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const risk=Math.max(0,100-summary.guard_score);
  const riskLabel=risk<30?'Low risk':risk<60?'Medium risk':'High risk';
  const trend=useMemo(()=>{const m=new Map<string,number>();transactions.filter(x=>x.transaction_type==='expense').forEach(x=>{const k=String(x.date).slice(0,7);m.set(k,(m.get(k)||0)+Number(x.amount))});return [...m].sort((a,b)=>a[0].localeCompare(b[0])).slice(-6).map(([month,spend])=>({m:month.slice(5),spend}))},[transactions]);
  const recent=transactions.slice(0,4).map(x=>({merchant:x.merchant,meta:`${x.payment_method||x.category} · ${x.date}`,amount:x.transaction_type==='income'?x.amount:-x.amount,risk:x.description?.includes('SAMPLE DATA')?'Sample':'Recorded'}));
  if(loading)return <div className="dashboardSkeleton" aria-label="Loading dashboard">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>;

  return <div className="commandCenter">
    <section className="dashboardWelcome">
      <div><span className="sectionEyebrow"><i/>SECURITY OVERVIEW</span><h2>Good morning, {auth.user?.name.split(' ')[0]}.</h2><p>Your financial security overview is calm. One item needs your attention.</p></div>
      <NavLink to="/app/scam-analyzer" className="primary"><MessageSquareWarning/>Analyze suspicious content</NavLink>
    </section>
    {error&&<div className="apiState errorState"><AlertTriangle/><div><b>Dashboard data is unavailable.</b><p>{error}</p></div><button onClick={load}><RefreshCw/>Try again</button></div>}
    <div className="sampleLabel"><span>SAMPLE DATA</span>The demo account uses fictional records and is not connected to a bank.</div>

    <div className="securityOverview">
      <motion.section className="riskOverview" initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}}>
        <div className="riskCopy">
          <span>OVERALL FINANCIAL RISK</span><h3>{riskLabel}</h3>
          <p>Based on recent transaction activity, scam analyses and documented security events.</p>
          <NavLink to="/app/analytics">View risk details <ChevronRight/></NavLink>
        </div>
        <div className="radialRisk" style={{'--risk':`${risk}%`} as React.CSSProperties}>
          <div><strong>{risk}</strong><span>{riskLabel.toUpperCase()}</span></div>
        </div>
        <div className="riskDelta"><ArrowDownRight/><b>12%</b><span>this week</span></div>
      </motion.section>
      <div className="dashboardMetrics">
        <Metric label="Scam alerts" value={String(dashboard.scam_alerts)} detail="Recorded analyses" tone="attention" icon={MessageSquareWarning}/>
        <Metric label="Suspicious transactions" value={String(dashboard.suspicious_transactions)} detail="Model signals" tone="attention" icon={AlertTriangle}/>
        <Metric label="Total spending" value={money(dashboard.total_spending)} detail="Available history" icon={WalletCards}/>
        <Metric label="Financial health" value={`${summary.guard_score}%`} detail="Calculated score" tone="good" icon={ShieldCheck}/>
      </div>
    </div>

    <div className="dashboardGrid">
      <section className="premiumPanel trendPanel">
        <div className="panelHead"><div><span>FINANCIAL ACTIVITY</span><h3>Spending and risk trend</h3></div><div className="legend"><i className="spend"/>Spending<i className="risk"/>Risk</div></div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={trend}>
            <defs><linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c8cff" stopOpacity=".28"/><stop offset="1" stopColor="#7c8cff" stopOpacity="0"/></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)"/><XAxis dataKey="m" axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={{background:'var(--raised)',border:'1px solid var(--line)',borderRadius:12}}/>
            <Area type="monotone" dataKey="spend" stroke="#7c8cff" strokeWidth={2.4} fill="url(#spendFill)"/>
          </AreaChart>
        </ResponsiveContainer>
      </section>
      <section className="premiumPanel distributionPanel">
        <div className="panelHead"><div><span>RISK DISTRIBUTION</span><h3>Recent activity</h3></div></div>
        <div className="donutWrap"><ResponsiveContainer width="100%" height={185}><PieChart><Pie data={distribution} dataKey="value" innerRadius={58} outerRadius={76} paddingAngle={3}/></PieChart></ResponsiveContainer><div><strong>82</strong><span>events</span></div></div>
        <div className="riskLegend">{distribution.map(x=><p key={x.name}><i style={{background:x.fill}}/><span>{x.name}</span><b>{x.value}%</b></p>)}</div>
      </section>
      <section className="premiumPanel activityPanel">
        <div className="panelHead"><div><span>TRANSACTION INTELLIGENCE</span><h3>Recent activity</h3></div><NavLink to="/app/transactions">View all</NavLink></div>
        <div className="activityRows">{recent.length?recent.map((x,i)=><div key={`${x.merchant}-${i}`}><span className={`merchantIcon ${x.risk.toLowerCase()}`}>{x.amount>0?<CheckCircle2/>:<WalletCards/>}</span><div><b>{x.merchant}</b><small>{x.meta}</small></div><strong className={x.amount>0?'positive':''}>{x.amount>0?'+':''}{money(x.amount)}</strong><em className={x.risk.toLowerCase()}>{x.risk}</em></div>):<p className="panelEmpty">No transactions yet.</p>}</div>
      </section>
      <section className="premiumPanel nextAction">
        <span>NEXT BEST ACTION</span><ShieldCheck/><h3>Review one unusual payment.</h3><p>An ₹8,500 marketplace purchase differs from your usual shopping pattern.</p>
        <NavLink to="/app/transaction-monitor">Review transaction <ChevronRight/></NavLink>
      </section>
    </div>
  </div>
}