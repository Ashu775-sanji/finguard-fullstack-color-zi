import {lazy,Suspense} from 'react';
import {Routes,Route,Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import {useAuth} from './context/AuthContext';

const Landing=lazy(()=>import('./pages/LandingModern'));
const Login=lazy(()=>import('./pages/Login'));
const Dashboard=lazy(()=>import('./pages/PremiumDashboard'));
const finance=(name:keyof typeof import('./pages/FinanceModern'))=>lazy(()=>import('./pages/FinanceModern').then(m=>({default:m[name] as React.ComponentType})));
const safety=(name:keyof typeof import('./pages/SafetyModern'))=>lazy(()=>import('./pages/SafetyModern').then(m=>({default:m[name] as React.ComponentType})));
const experience=(name:keyof typeof import('./pages/Experiences'))=>lazy(()=>import('./pages/Experiences').then(m=>({default:m[name] as React.ComponentType})));
const Transactions=finance('Transactions'),Analytics=finance('Analytics'),Anomalies=finance('Anomalies'),Forecasts=finance('Forecasts'),Budgets=finance('Budgets'),Goals=finance('Goals'),Reports=finance('Reports'),Assistant=finance('Assistant'),Settings=finance('Settings');
const ScamAnalyzer=safety('ScamAnalyzer'),TransactionMonitor=safety('TransactionMonitor'),IncidentCenter=safety('IncidentCenter'),RecoveryAssistant=safety('RecoveryAssistant'),EvidenceVault=safety('EvidenceVault'),ScamEducation=safety('ScamEducation');
const MoneyReplay=experience('MoneyReplay'),Playground=experience('Playground'),StatementDrop=experience('StatementDrop'),FinancialSeason=experience('FinancialSeason');

function Guard(){return useAuth().user?<Layout/>:<Navigate to="/login" replace/>}
function Loading(){return <div className="routeLoading" role="status"><i/><span>Loading FinGuard…</span></div>}

export default function App(){return <Suspense fallback={<Loading/>}><Routes>
  <Route index element={<Landing/>}/><Route path="login" element={<Login/>}/>
  <Route path="app" element={<Guard/>}>
    <Route index element={<Dashboard/>}/>
    <Route path="scam-analyzer" element={<ScamAnalyzer/>}/><Route path="transaction-monitor" element={<TransactionMonitor/>}/>
    <Route path="incidents" element={<IncidentCenter/>}/><Route path="recovery" element={<RecoveryAssistant/>}/><Route path="evidence" element={<EvidenceVault/>}/><Route path="education" element={<ScamEducation/>}/>
    <Route path="transactions" element={<Transactions/>}/><Route path="analytics" element={<Analytics/>}/><Route path="anomalies" element={<Anomalies/>}/><Route path="forecasts" element={<Forecasts/>}/>
    <Route path="budgets" element={<Budgets/>}/><Route path="goals" element={<Goals/>}/><Route path="assistant" element={<Assistant/>}/><Route path="reports" element={<Reports/>}/><Route path="settings" element={<Settings/>}/>
    <Route path="replay" element={<MoneyReplay/>}/><Route path="playground" element={<Playground/>}/><Route path="import" element={<StatementDrop/>}/><Route path="season" element={<FinancialSeason/>}/>
  </Route>
  <Route path="*" element={<Navigate to="/" replace/>}/>
</Routes></Suspense>}