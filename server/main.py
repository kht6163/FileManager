import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from db.db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 서버 시작 시 데이터베이스 초기화
    init_db()
    yield
    # 서버 종료 시 실행할 코드가 있으면 여기에 작성

app = FastAPI(lifespan=lifespan)

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)