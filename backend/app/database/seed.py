from datetime import date,timedelta
from sqlalchemy import select
from app.database.core import SessionLocal
from app.models.entities import User,Transaction,Budget,Goal,TxType
from app.security.auth import hash_password

def seed_demo_data():
    db=SessionLocal()
    try:
        if db.scalar(select(User).where(User.email=='demo@finguard.app')):return
        user=User(name='Demo User',email='demo@finguard.app',password_hash=hash_password('FinGuard@2026'),currency='INR',language='en')
        db.add(user);db.flush();today=date.today()
        rows=[('Salary deposit',62000,TxType.income,'Income',3),('Amazon',8500,TxType.expense,'Shopping',2),('Uber',1240,TxType.expense,'Transport',3),('Whole Foods',2100,TxType.expense,'Food',4),('Netflix',649,TxType.expense,'Entertainment',6),('Rent',18000,TxType.expense,'Housing',12),('Groceries',4200,TxType.expense,'Food',15),('Spotify',119,TxType.expense,'Entertainment',18)]
        for merchant,amount,kind,category,days in rows:db.add(Transaction(user_id=user.id,amount=amount,transaction_type=kind,category=category,merchant=merchant,date=today-timedelta(days=days)))
        db.add(Budget(user_id=user.id,category='Food',limit=8000,spent=6450,start_date=today.replace(day=1),end_date=today+timedelta(days=30)))
        db.add(Goal(user_id=user.id,name='New laptop',target_amount=80000,current_amount=42000,deadline=today+timedelta(days=150)))
        db.commit()
    finally:db.close()
