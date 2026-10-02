import {motion} from 'framer-motion';
import {AlertTriangle,ArrowDownRight,ArrowUpRight,CheckCircle2,ChevronRight,MessageSquareWarning,ShieldCheck,WalletCards} from 'lucide-react';
import {useEffect,useState} from 'react';
import {Area,AreaChart,CartesianGrid,Pie,PieChart,ResponsiveContainer,Tooltip,XAxis} from 'recharts';
import {NavLink} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {safeGet} from '../lib/api';
import {money} from '../components/UI';

const trend=[
  {m:'Apr',spend:28600,risk:24},{m:'May',spend:31900,risk:22},{m:'Jun',spend:30100,risk:20},
  {m:'Jul',spend:35600,risk:28},{m:'Aug',spend:37100,risk:23},{m:'Sep',spend:38450,risk:18}
];
const distribution=[{name:'Low',value:76,fill:'#34d399'},{name:'Medium',value:16,fill:'#facc15'},{name:'High',value:6,fill:'#fb923c'},{name:'Critical',value:2,fill:'#f87171'}];
const recent=[
  {merchant:'Salary deposit',meta:'Bank transfer · 09:02',amount:62000,risk:'Verified'},
  {merchant:'Amazon Marketplace',meta:'Card · 18:42',amount:-8500,risk:'Review'},
  {merchant:'Metro Mobility',meta:'UPI · 16:18',amount:-1240,risk:'Low'},
  {merchant:'Netflix',meta:'Recurring · 08:00',amount:-649,risk:'Low'},
];

function Metric({label,value,detail,tone='neutral',icon:Icon}:{label:string,value:string,detail:string,tone?:string,icon:any}){
  return <motion.article whileHover={{y:-2}} transition={{duration:.18}} className={`premiumMetric ${tone}`}>
    <div><span>{label}</span><i><Icon/></i></div><strong>{value}</strong>
    <small>{tone==='good'?<ArrowDownRight/>:<ArrowUpRight/>}{detail}</small>
  </motion.article>
}

export default function PremiumDashboard(){
  const auth=useAuth();
  const [loading,setLoading]=useState(true);
  const [summary,setSummary]=useState({income:62000,expenses:38450,balance:85420,guard_score:82,savings_rate:38});
  useEffect(()=>{Promise.all([safeGet('/analytics/summary',summary),new Promise(r=>setTimeout(r,450))]).then(([x])=>{setSummary({...summary,...x});setLoading(false)})},[]);
  if(loading)return <div className="dashboardSkeleton" aria-label="Loading dashboard">{Array.from({length:8},(_,i)=><i key={i}/>)}</div>;

  return <div className="commandCenter">
    <section className="dashboardWelcome">
      <div><span className="sectionEyebrow"><i/>SECURITY OVERVIEW</span><h2>Good morning, {auth.user?.name.split(' ')[0]}.</h2><p>Your financial security overview is calm. One item needs your attention.</p></div>
      <NavLink to="/app/scam-analyzer" className="primary"><MessageSquareWarning/>Analyze suspicious content</NavLink>
    </section>

    <div className="securityOverview">
      <motion.section className="riskOverview" initial={{opacity:0,scale:.98}} animate={{opacity:1,scale:1}}>
        <div className="riskCopy">
          <span>OVERALL FINANCIAL RISK</span><h3>Low risk</h3>
          <p>Based on recent transaction activity, scam analyses and documented security events.</p>
          <NavLink to="/app/analytics">View risk details <ChevronRight/></NavLink>
        </div>
        <div className="radialRisk" style={{'--risk':'18%'} as React.CSSProperties}>
          <div><strong>18</strong><span>LOW RISK</span></div>
        </div>
        <div className="riskDelta"><ArrowDownRight/><b>12%</b><span>this week</span></div>
      </motion.section>
      <div className="dashboardMetrics">
        <Metric label="Scam alerts" value="3" detail="2 new today" tone="attention" icon={MessageSquareWarning}/>
        <Metric label="Suspicious transactions" value="2" detail="1 needs review" tone="attention" icon={AlertTriangle}/>
        <Metric label="Monthly spending" value={money(summary.expenses)} detail="3.2% vs last month" icon={WalletCards}/>
        <Metric label="Protected activity" value="96%" detail="Healthy pattern" tone="good" icon={ShieldCheck}/>
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
        <div className="activityRows">{recent.map(x=><div key={x.merchant}><span className={`merchantIcon ${x.risk.toLowerCase()}`}>{x.risk==='Verified'?<CheckCircle2/>:<WalletCards/>}</span><div><b>{x.merchant}</b><small>{x.meta}</small></div><strong className={x.amount>0?'positive':''}>{x.amount>0?'+':''}{money(x.amount)}</strong><em className={x.risk.toLowerCase()}>{x.risk}</em></div>)}</div>
      </section>
      <section className="premiumPanel nextAction">
        <span>NEXT BEST ACTION</span><ShieldCheck/><h3>Review one unusual payment.</h3><p>An ₹8,500 marketplace purchase differs from your usual shopping pattern.</p>
        <NavLink to="/app/transaction-monitor">Review transaction <ChevronRight/></NavLink>
      </section>
    </div>
  </div>
}