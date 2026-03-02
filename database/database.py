import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///experiment.db"
engine = create_engine(DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    return Session(engine)