export const isDemoMode=true;

export type DemoTransaction={
  id:string;amount:number;transaction_type:'income'|'expense'|'transfer';category:string;
  merchant:string;description:string;payment_method:string;date:string;time:string;
  risk_level:'LOW'|'MEDIUM'|'HIGH'|'CRITICAL';risk_score:number;
};

export const demoTransactions:DemoTransaction[]=[
  {id:'DEMO-TX-1001',merchant:'Unknown UPI Recipient',amount:8500,category:'Transfer',transaction_type:'expense',payment_method:'UPI',date:'2026-10-01',time:'22:42',risk_level:'HIGH',risk_score:78,description:'New recipient, unusually high amount and late transaction time.'},
  {id:'DEMO-TX-1002',merchant:'Amazon',amount:2499,category:'Shopping',transaction_type:'expense',payment_method:'Card',date:'2026-09-29',time:'14:18',risk_level:'LOW',risk_score:12,description:'Recognized merchant and amount is consistent with previous shopping activity.'},
  {id:'DEMO-TX-1003',merchant:'Swiggy',amount:680,category:'Food',transaction_type:'expense',payment_method:'UPI',date:'2026-09-28',time:'20:05',risk_level:'LOW',risk_score:8,description:'Recognized merchant and typical food-delivery amount.'},
  {id:'DEMO-TX-1004',merchant:'Netflix',amount:649,category:'Subscriptions',transaction_type:'expense',payment_method:'Card',date:'2026-09-27',time:'09:00',risk_level:'LOW',risk_score:4,description:'Expected recurring subscription.'},
  {id:'DEMO-TX-1005',merchant:'Electricity Board',amount:2840,category:'Bills',transaction_type:'expense',payment_method:'Net banking',date:'2026-09-25',time:'11:32',risk_level:'LOW',risk_score:5,description:'Expected utility payment to a recognized biller.'},
  {id:'DEMO-TX-1006',merchant:'Metro Mobility',amount:1252,category:'Travel',transaction_type:'expense',payment_method:'UPI',date:'2026-09-23',time:'08:16',risk_level:'LOW',risk_score:7,description:'Regular travel activity.'},
  {id:'DEMO-TX-1007',merchant:'Fresh Basket',amount:2000,category:'Food',transaction_type:'expense',payment_method:'Card',date:'2026-09-21',time:'18:40',risk_level:'LOW',risk_score:9,description:'Recognized grocery merchant.'},
  {id:'DEMO-TX-1008',merchant:'Unknown Merchant',amount:48500,category:'Transfer',transaction_type:'transfer',payment_method:'Bank transfer',date:'2026-09-20',time:'01:14',risk_level:'CRITICAL',risk_score:91,description:'Unrecognized recipient, unusually high value and atypical transaction time.'},
];

export const demoFinancialScore={
  score:82,status:'GOOD',
  components:[
    {label:'Transaction Safety',value:91},
    {label:'Spending Control',value:76},
    {label:'Scam Exposure',value:88},
    {label:'Savings Discipline',value:73},
  ],
  explanation:'Your financial safety score is healthy. Your strongest area is transaction safety, while spending control has room for improvement.',
};

export const demoDashboard={
  balance:42580,monthlySpending:18420,risk:18,savings:8240,
  categoryBreakdown:[
    {name:'Transfer',value:8500},{name:'Food',value:2680},{name:'Bills',value:2840},
    {name:'Shopping',value:2499},{name:'Travel',value:1252},{name:'Subscriptions',value:649},
  ],
};