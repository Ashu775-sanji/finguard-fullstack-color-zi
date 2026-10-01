from fastapi import FastAPI,Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.config import settings
from app.database.core import Base,engine
from app.api.routes import router
from app.database.seed import seed_demo_data
Base.metadata.create_all(bind=engine)
if settings.seed_demo:seed_demo_data()
app=FastAPI(title=settings.app_name,version='1.0.0',docs_url='/docs' if settings.environment!='production' else None)
app.add_middleware(CORSMiddleware,allow_origins=[x.strip() for x in settings.allowed_origins.split(',')],allow_credentials=True,allow_methods=['*'],allow_headers=['Authorization','Content-Type'])
app.add_middleware(TrustedHostMiddleware,allowed_hosts=['*'] if settings.environment!='production' else [x.strip() for x in settings.allowed_hosts.split(',')])
@app.middleware('http')
async def secure_headers(request:Request,call_next):
 r=await call_next(request);r.headers['X-Content-Type-Options']='nosniff';r.headers['X-Frame-Options']='DENY';r.headers['Referrer-Policy']='strict-origin-when-cross-origin';r.headers['Permissions-Policy']='camera=(), microphone=(), geolocation=()';return r
@app.get('/health')
def health():return {'status':'healthy','service':'finguard-api'}
app.include_router(router)
