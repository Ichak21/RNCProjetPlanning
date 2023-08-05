from sqlalchemy.orm import Session
import Database.models as models
from Database.database import SessionLocal
from fastapi import status, HTTPException, Depends
import Database.schemas as schemas
from sqlalchemy.orm import Session
from datetime import date
import pandas as pd
from pandas import DataFrame

# * update operateur (sur l id card)
# * delete n reload competence
# * delete n reload softcompetence
# * add ke (date)
# * add qty (date)


class ETL_Loading:
    session: Session

    def __init__(self, session: Session):
        self.session = session

    def extract(self, dataSourcePath: DataFrame, target: models):
        pass

    def transform():
        pass

    def load():
        pass


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


if __name__ == "__main__":
    print("looo")
