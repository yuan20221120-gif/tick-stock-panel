import os
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="YOYO Moomoo Gateway", version="0.1.0")
app.add_middleware(CORSMiddleware, allow_origins=[os.environ.get("YOYO_FRONTEND_ORIGIN","https://yoyo-index-wheel-lh07m47cu-yuan2026.vercel.app")], allow_methods=["GET"], allow_headers=["*"])

@app.get("/")
def home():
    return {"service":"yoyo-moomoo-gateway","status":"online","trading_enabled":False}

@app.get("/api/health")
def health():
    return {"status":"ok","time":datetime.now(timezone.utc).isoformat()}

@app.get("/api/moomoo/status")
def moomoo_status():
    return {"provider":"moomoo","connected":False,"market_data":"pending","positions":"pending","trading_enabled":False,"reason":"OpenD persistent gateway has not been configured"}
