from fastapi import APIRouter
from .endpoints import auth

api_router = APIRouter()

api_router.include_router(auth.auth_router, prefix="/auth", tags=["auth"])
