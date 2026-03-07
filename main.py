from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from database.database import engine, create_db_and_tables # Adjusted for your folder structure
from model.models import ExperimentData
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Allows all origins (good for testing)
    allow_credentials=True,
    allow_methods=["*"],           # Specifically allows OPTIONS, POST, etc.
    allow_headers=["*"],           # Allows all headers
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/log_click")
def log_click(data: ExperimentData):
    with Session(engine) as session:
        session.add(data)
        session.commit()
    return {"status": "success"}

@app.get("/")
def read_index():
    return FileResponse('index.html')

app.mount("/", StaticFiles(directory="."), name="static")