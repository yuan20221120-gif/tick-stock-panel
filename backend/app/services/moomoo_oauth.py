"""Moomoo OpenAPI OAuth 2.1 + PKCE helpers for YOYO Index Wheel OS.

V1 is deliberately read-only: quote:read + trade:read.
Tokens are never committed to the repository.
"""
from __future__ import annotations

import base64
import hashlib
import secrets
from urllib.parse import urlencode

import httpx

MOOMOO_BASE_URL = "https://webapi.moomoo.com"
READ_ONLY_SCOPE = "quote:read trade:read"


def generate_pkce() -> tuple[str, str, str]:
    verifier = secrets.token_urlsafe(64)
    digest = hashlib.sha256(verifier.encode("ascii")).digest()
    challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
    state = secrets.token_urlsafe(32)
    return verifier, challenge, state


async def register_client(redirect_uri: str) -> dict:
    payload = {
        "redirect_uris": [redirect_uri],
        "token_endpoint_auth_method": "none",
        "grant_types": ["authorization_code", "refresh_token"],
        "response_types": ["code"],
        "client_name": "YOYO Capital Index Wheel OS",
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{MOOMOO_BASE_URL}/oauth2/register", json=payload)
        response.raise_for_status()
        return response.json()


def build_authorize_url(client_id: str, redirect_uri: str, challenge: str, state: str) -> str:
    query = urlencode({
        "client_id": client_id,
        "code_challenge": challenge,
        "code_challenge_method": "S256",
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "state": state,
        "scope": READ_ONLY_SCOPE,
    })
    return f"{MOOMOO_BASE_URL}/oauth2/authorize/confirm?{query}"


async def exchange_code(client_id: str, redirect_uri: str, code: str, verifier: str) -> dict:
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "code_verifier": verifier,
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{MOOMOO_BASE_URL}/oauth2/token", data=data)
        response.raise_for_status()
        return response.json()


async def refresh_access_token(client_id: str, refresh_token: str) -> dict:
    data = {"grant_type": "refresh_token", "refresh_token": refresh_token, "client_id": client_id}
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{MOOMOO_BASE_URL}/oauth2/token", data=data)
        response.raise_for_status()
        return response.json()
