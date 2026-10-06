import {motion} from 'framer-motion';
import {AlertTriangle,ArrowDownRight,ArrowUpRight,CheckCircle2,ChevronRight,MessageSquareWarning,RefreshCw,ShieldCheck,WalletCards} from 'lucide-react';
import {useEffect,useMemo,useState} from 'react';
import {Area,AreaChart,CartesianGrid,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {apiError,getData} from '../lib/api';
import {money} from '../components/UI';
import {demoDashboard,demoFinancialScore,demoTransactions} from '../lib/demoData';

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
  const [demo,setDemo]=useState(false);
  async function load(){setLoading(true);setError('');try{const [s,d,t]=await Promise.all([getData<any>('/analytics/summary'),getData<any>('/dashboard'),getData<any[]>('/transactions')]);setSummary(s);setDashboard(d);if(t.length){setTransactions(t);setDemo(false)}else{setTransactions(demoTransactions);setDemo(true)}}catch(e){setTransactions(demoTransactions);setDemo(true);setError(`${apiError(e)} Showing clearly labeled demo data instead.`)}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  const score=demo?demoFinancialScore.score:summary.guard_score;
  const risk=Math.max(0,100-score);
  const riskLabel=score>=80?'GOOD':score>=60?'FAIR':'NEEDS ATTENTION';
  const trend=useMemo(()=>{const m=new Map<string,number>();transactions.filter(x=>x.transaction_type==='expense').forEach(x=>{const k=String(x.date).slice(0,7);m.set(k,(m.get(k)||0)+Number(x.amount))});return [...m].sort((a,b)=>a[0].localeCompare(b[0])).slice(-6).map(([month,spend])=>({m:month.slice(5),spend}))},[transactions]);
  const recent=transactions.slice(0,4).map(x=>({merchant:x.merchant,meta:`${x.payment_method||x.category} · ${x.date}`,amount:x.transaction_type==='income'?x.amount:-x.amount,risk:x.description?.includes('SAMPLE DATA')?'Sample':'Recorded'}));
  const highestRisk=[...transactions].sort((a,b)=>(b.risk_score||0)-(a.risk_score||0))[0];
  if(loading)return <div className="dashboardSkeleton" aria-label="Loading dashboard">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>;

  const greeting=new Date().getHours()<12?'Good morning':new Date().getHours()<18?'Good afternoon':'Good evening';
  const balance=demo?demoDashboard.balance:summary.balance,spending=demo?demoDashboard.monthlySpending:dashboard.total_spending,savings=demo?demoDashboard.savings:Math.max(0,summary.balance);
  return <div className="commandCenter">
    <section className="dashboardWelcome">
      <div><span className="sectionEyebrow"><i/>FINANCIAL SAFETY OVERVIEW</span><h2>{greeting}, {auth.user?.name.split(' ')[0]} 👋</h2><p>Here's your financial safety overview.</p></div>
      <NavLink to="/app/scam-analyzer" className="primary"><MessageSquareWarning/>Analyze suspicious content</NavLink>
    </section>
    {error&&<div className="apiState errorState"><AlertTriangle/><div><b>Dashboard data is unavailable.</b><p>{error}</p></div><button onClick={load}><RefreshCw/>Try again</button></div>}
    {demo&&<div className="sampleLabel"><span>DEMO DATA</span>Fictional, mathematically consistent records are shown and are not connected to a bank.</div>}

    <div className="securityOverview">
      <motion.section className="riskOverview" initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}}>
        <div className="riskCopy">
          <span>FINANCIAL SAFETY SCORE</span><h3>{riskLabel}</h3>
          <p>{demo?demoFinancialScore.explanation:'Based on available transaction activity, scam analyses and documented security events.'}</p>
          <NavLink to="/app/analytics">View risk details <ChevronRight/></NavLink>
        </div>
        <div className="radialRisk safety" style={{'--risk':`${score}%`} as React.CSSProperties}>
          <div><strong>{score}</strong><span>/ 100 · {riskLabel}</span></div>
        </div>
        <div className="scoreBreakdown">{(demo?demoFinancialScore.components:[{label:'Transaction Safety',value:score},{label:'Spending Control',value:Math.max(0,score-6)},{label:'Scam Exposure',value:Math.min(100,score+4)},{label:'Savings Discipline',value:Math.max(0,score-9)}]).map(x=><p key={x.label}><span>{x.label}</span><b>{x.value}</b></p>)}</div>
      </motion.section>
      <div className="dashboardMetrics">
        <Metric label="Current balance" value={money(balance)} detail="4.2% vs last month" tone="good" icon={WalletCards}/>
        <Metric label="Monthly spending" value={money(spending)} detail="8.4% vs last month" tone="good" icon={WalletCards}/>
        <Metric label="Financial risk" value={`${risk}/100`} detail="Risk indicators" tone="attention" icon={AlertTriangle}/>
        <Metric label="Savings" value={money(savings)} detail="6.8% vs last month" tone="good" icon={ShieldCheck}/>
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
        <span>RECOMMENDED NEXT STEP</span><ShieldCheck/><h3>{highestRisk?'Review a potentially unusual payment.':'Your activity is ready for review.'}</h3><p>{highestRisk?`${money(highestRisk.amount)} to ${highestRisk.merchant} has the strongest risk indicators in the available data.`:'Add or import transaction activity to receive contextual recommendations.'}</p>
        <NavLink to="/app/transaction-monitor">Review transaction <ChevronRight/></NavLink>
      </section>
    </div>
  </div>
}