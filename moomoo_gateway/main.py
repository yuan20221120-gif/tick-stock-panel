from __future__ import annotations

import os
import socket
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="YOYO Capital Moomoo Gateway", version="0.1.0")

allowed_origins = [x.strip() for x in os.getenv("YOYO_ALLOWED_ORIGINS", "*").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
)

OPEND_HOST = os.getenv("MOOMOO_OPEND_HOST", "127.0.0.1")
OPEND_PORT = int(os.getenv("MOOMOO_OPEND_PORT", "11111"))


class GatewayStatus(BaseModel):
    service: str
    status: str
    trading_enabled: bool
    opend_host_configured: bool
    opend_port: int
    opend_reachable: bool
    timestamp: str


def opend_reachable() -> bool:
    try:
        with socket.create_connection((OPEND_HOST, OPEND_PORT), timeout=1.5):
            return True
    except OSError:
        return False


@app.get("/")
def root():
    return {
        "service": "YOYO Capital Moomoo Gateway",
        "mode": "read-only",
        "trading": "disabled",
        "health": "/health",
        "status": "/api/moomoo/status",
    }


@app.get("/health")
def health():
    return {"ok": True, "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/moomoo/status", response_model=GatewayStatus)
def moomoo_status():
    reachable = opend_reachable()
    return GatewayStatus(
        service="moomoo-opend",
        status="connected" if reachable else "awaiting_opend",
        trading_enabled=False,
        opend_host_configured=bool(OPEND_HOST),
        opend_port=OPEND_PORT,
        opend_reachable=reachable,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.get("/api/moomoo/quotes/{symbol}")
def quote_placeholder(symbol: str):
    if symbol.upper() not in {"SPY", "QQQ"}:
        raise HTTPException(status_code=400, detail="V1 supports SPY and QQQ only")
    if not opend_reachable():
        raise HTTPException(
            status_code=503,
            detail="Moomoo OpenD is not reachable yet. Start/login OpenD and configure the gateway host.",
        )
    raise HTTPException(
        status_code=501,
        detail="OpenD socket is reachable; quote protocol adapter is the next activation step.",
    )
