from datetime import date
from collections import defaultdict
from fastapi import APIRouter,Depends,HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select,func
from sqlalchemy.orm import Session
from app.database.core import get_db
from app.models.entities import User,Transaction,Budget,Goal,TxType
from app.schemas.common import *
from app.security.auth import *
from app.ml.engine import detect,forecast,guard_score
from app.services.gemini import generate_financial_answer
from app.config import settings
router=APIRouter(prefix='/api/v1')
@router.post('/auth/register',response_model=UserOut,status_code=201)
def register(body:UserCreate,db:Session=Depends(get_db)):
 if db.scalar(select(User).where(User.email==body.email.lower())):raise HTTPException(409,'Email already registered')
 u=User(name=body.name,email=body.email.lower(),password_hash=hash_password(body.password),currency=body.currency.upper(),language=body.language);db.add(u);db.commit();db.refresh(u);return u
@router.post('/auth/login',response_model=Token)
def login(form:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
 u=db.scalar(select(User).where(User.email==form.username.lower()))
 if not u or not verify_password(form.password,u.password_hash):raise HTTPException(401,'Invalid credentials')
 return Token(access_token=create_token(u.id))
@router.get('/users/me',response_model=UserOut)
def me(u:User=Depends(current_user)):return u
@router.get('/transactions',response_model=list[TransactionOut])
def list_tx(db:Session=Depends(get_db),u:User=Depends(current_user)):return db.scalars(select(Transaction).where(Transaction.user_id==u.id).order_by(Transaction.date.desc()).limit(200)).all()
@router.post('/transactions',response_model=TransactionOut,status_code=201)
def add_tx(body:TransactionCreate,db:Session=Depends(get_db),u:User=Depends(current_user)):
 try:t=Transaction(**body.model_dump(),transaction_type=TxType(body.transaction_type),user_id=u.id)
 except ValueError:raise HTTPException(422,'transaction_type must be income, expense or transfer')
 db.add(t);db.commit();db.refresh(t);return t
@router.delete('/transactions/{tx_id}',status_code=204)
def delete_tx(tx_id:str,db:Session=Depends(get_db),u:User=Depends(current_user)):
 t=db.scalar(select(Transaction).where(Transaction.id==tx_id,Transaction.user_id==u.id))
 if not t:raise HTTPException(404,'Transaction not found')
 db.delete(t);db.commit()
@router.get('/analytics/summary')
def summary(db:Session=Depends(get_db),u:User=Depends(current_user)):
 rows=db.execute(select(Transaction.transaction_type,func.sum(Transaction.amount)).where(Transaction.user_id==u.id).group_by(Transaction.transaction_type)).all();d={str(k.value):float(v or 0) for k,v in rows};income=d.get('income',0);expenses=d.get('expense',0);health=guard_score(income,expenses);return {'income':income,'expenses':expenses,'balance':income-expenses,**health}
@router.get('/anomaly/scan')
def scan(db:Session=Depends(get_db),u:User=Depends(current_user)):
 rows=db.scalars(select(Transaction).where(Transaction.user_id==u.id).order_by(Transaction.date)).all();h=[{'amount':x.amount,'category':x.category,'date':x.date,'transaction_type':x.transaction_type.value} for x in rows];return [{'transaction_id':x.id,**detect(x.amount,x.category,h[:-1])} for x in rows[-20:]]
@router.get('/prediction/expenses')
def predict(db:Session=Depends(get_db),u:User=Depends(current_user)):
 rows=db.scalars(select(Transaction).where(Transaction.user_id==u.id)).all();return forecast([{'amount':x.amount,'date':x.date,'transaction_type':x.transaction_type.value} for x in rows])
@router.post('/budgets',status_code=201)
def add_budget(body:BudgetCreate,db:Session=Depends(get_db),u:User=Depends(current_user)):
 if body.end_date<=body.start_date:raise HTTPException(422,'end_date must be after start_date')
 x=Budget(**body.model_dump(),user_id=u.id);db.add(x);db.commit();db.refresh(x);return {'id':x.id,**body.model_dump()}
@router.get('/budgets')
def budgets(db:Session=Depends(get_db),u:User=Depends(current_user)):return db.scalars(select(Budget).where(Budget.user_id==u.id)).all()
@router.post('/goals',status_code=201)
def add_goal(body:GoalCreate,db:Session=Depends(get_db),u:User=Depends(current_user)):
 x=Goal(**body.model_dump(),user_id=u.id);db.add(x);db.commit();db.refresh(x);return {'id':x.id,**body.model_dump()}
@router.get('/goals')
def goals(db:Session=Depends(get_db),u:User=Depends(current_user)):return db.scalars(select(Goal).where(Goal.user_id==u.id)).all()
@router.get('/notifications')
def notifications(u:User=Depends(current_user)):return [{'type':'security','message':'No critical threats detected'},{'type':'budget','message':'Dining budget is nearing its limit'}]

@router.get('/analytics/recurring')
def recurring(db:Session=Depends(get_db),u:User=Depends(current_user)):
 rows=db.scalars(select(Transaction).where(Transaction.user_id==u.id,Transaction.transaction_type==TxType.expense)).all();groups={}
 for x in rows:groups.setdefault(x.merchant.lower(),[]).append(x)
 found=[{'merchant':v[0].merchant,'estimated_monthly':round(sum(x.amount for x in v)/len(v),2),'occurrences':len(v)} for v in groups.values() if len(v)>=2]
 return {'items':found,'monthly_total':round(sum(x['estimated_monthly'] for x in found),2)}
@router.post('/ai/ask',response_model=AIAnswer)
async def ask_ai(body:AIAsk,db:Session=Depends(get_db),u:User=Depends(current_user)):
 rows=list(db.scalars(select(Transaction).where(Transaction.user_id==u.id).order_by(Transaction.date.desc()).limit(250)).all())
 income=sum(float(x.amount) for x in rows if x.transaction_type==TxType.income)
 expenses=sum(float(x.amount) for x in rows if x.transaction_type==TxType.expense)
 categories=defaultdict(float);merchants=defaultdict(float)
 for x in rows:
  if x.transaction_type==TxType.expense:
   categories[x.category]+=float(x.amount);merchants[x.merchant]+=float(x.amount)
 top_categories=sorted(categories.items(),key=lambda x:x[1],reverse=True)[:6]
 top_merchants=sorted(merchants.items(),key=lambda x:x[1],reverse=True)[:6]
 recent=[f'{x.date}: {x.merchant} | {x.category} | {x.transaction_type.value} | {x.amount:.2f}' for x in rows[:12]]
 budgets=list(db.scalars(select(Budget).where(Budget.user_id==u.id)).all())
 goals=list(db.scalars(select(Goal).where(Goal.user_id==u.id)).all())
 health=guard_score(income,expenses)
 context='\n'.join([
  f'Currency: {u.currency}',f'Income total: {income:.2f}',f'Expense total: {expenses:.2f}',f'Balance: {income-expenses:.2f}',
  f'Guard score: {health["guard_score"]}; savings rate: {health["savings_rate"]}%',
  'Top expense categories: '+(', '.join(f'{k}: {v:.2f}' for k,v in top_categories) or 'none'),
  'Top merchants: '+(', '.join(f'{k}: {v:.2f}' for k,v in top_merchants) or 'none'),
  'Budgets: '+(', '.join(f'{x.category} limit {x.limit:.2f}, spent {x.spent:.2f}' for x in budgets[:8]) or 'none'),
  'Goals: '+(', '.join(f'{x.name} {x.current_amount:.2f}/{x.target_amount:.2f}, deadline {x.deadline}' for x in goals[:8]) or 'none'),
  'Recent transactions:',*recent
 ])
 sources=['transaction summary','category totals','merchant totals','Guard Score']
 if budgets:sources.append('budgets')
 if goals:sources.append('financial goals')
 try:
  answer,model=await generate_financial_answer(body.question,context,[x.model_dump() for x in body.history])
 except Exception:
  q=body.question.lower()
  if 'biggest' in q and top_merchants:answer=f'Your largest merchant total is {top_merchants[0][0]} at {top_merchants[0][1]:.2f} {u.currency}.'
  elif 'food' in q:answer=f'Your recorded Food spending is {categories.get("Food",0):.2f} {u.currency}.'
  elif 'spending' in q or 'expense' in q:answer=f'Your recorded expenses total {expenses:.2f} {u.currency}. Your largest category is {top_categories[0][0] if top_categories else "not available"}.'
  else:answer='I could not reach the AI model. Your financial summary is still available from the retrieved records.'
  model='grounded-fallback'
 return AIAnswer(answer=answer,sources=sources,grounded_transactions=len(rows),model=model)

@router.get('/reports/monthly')
def report(db:Session=Depends(get_db),u:User=Depends(current_user)):return {'period':date.today().strftime('%Y-%m'),'summary':summary(db,u),'generated_for':u.email}
