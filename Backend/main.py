# uvicorn main:app --reload
from fastapi import FastAPI, status, HTTPException, Depends
from Database.database import Base, engine, SessionLocal
from typing import List
import Database.models as models
# import Database.schemas as schemas

# Create the database
Base.metadata.create_all(engine)

# Initialize app
app = FastAPI()


@app.get("/")
def root():
    return "Is alive ! "
