from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from database.database import engine, create_db_and_tables
from model.models import ExperimentData
import os

app = FastAPI()

app.mount("/button", StaticFiles(directory="button"), name="button")
app.mount("/ticket", StaticFiles(directory="ticket"), name="ticket")
app.mount("/bank", StaticFiles(directory="bank"), name="bank")
app.mount("/unit", StaticFiles(directory="unit"), name="unit")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

@app.get("/button_test")
def read_button():
    return FileResponse('button/button.html')

@app.get("/ticket")
def read_ticket():
    return FileResponse('ticket/ticket.html')

@app.get("/bank")
def read_bank():
    return FileResponse('bank/bank.html')

@app.get("/unit")
def read_unit():
    return FileResponse('unit/unit.html')

@app.get("/user_progress/{user_id}")
def get_user_progress(user_id: str):
    with Session(engine) as session:
        statement = select(ExperimentData.scenario_name).where(ExperimentData.user_id == user_id).distinct()
        scenarios = session.exec(statement).all()
        
    return {
        "scenario_1": any(s in scenarios for s in ["Stroop", "unsafe_pressure", "neutral", "unsafe_no_pressure"]),
        "scenario_2": "concert_ticket" in scenarios,
        "scenario_3": "bank_transfer" in scenarios,
        "scenario_4": "unit_converter" in scenarios
    }
app.mount("/", StaticFiles(directory="."), name="static")