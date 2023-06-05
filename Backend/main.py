# uvicorn main:app --reload
from fastapi import FastAPI, status, HTTPException, Depends
from Database.database import Base, engine, SessionLocal
from typing import List
from sqlalchemy.orm import Session
import Database.models as models
import Database.schemas as schemas
import Database.handlers as handlers

# Create the database
Base.metadata.create_all(engine)


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


# Initialize app
app = FastAPI()


@app.get("/")
def root():
    return "Is alive !"

# ROUTING FOR SETTINGS [SECTEUR] ---------------------------------------------------


@app.post("/setting/secteur", response_model=schemas.Secteur, status_code=status.HTTP_201_CREATED)
def createSecteur(secteur: schemas.SecteurCreate, session: Session = Depends(get_session)):
    newSecteur = handlers.SecteurHandler(session=session, model=models.Secteur)
    return newSecteur.create(secteur)


@app.get("/setting/secteur", response_model=List[schemas.Secteur], status_code=status.HTTP_200_OK)
def readAllSecteur(session: Session = Depends(get_session)):
    allSecteur = handlers.SecteurHandler(session=session, model=models.Secteur)
    return allSecteur.readAll()


@app.get("/setting/secteur/{id_secteur}", response_model=schemas.Secteur)
def readSecteur(id_secteur: int, session: Session = Depends(get_session)):
    secteur = handlers.SecteurHandler(session=session, model=models.Secteur)
    return secteur.read(id=id_secteur)


@app.put("/setting/secteur/{id_secteur}", response_model=schemas.Secteur)
def updateSecteur(id_secteur: int, name_secteur: str, session: Session = Depends(get_session)):
    secteur = handlers.SecteurHandler(session=session, model=models.Secteur)
    return secteur.update(id_secteur=id_secteur, name_secteur=name_secteur)


@app.delete("/setting/secteur/{id_secteur}", response_model=schemas.Secteur, status_code=status.HTTP_200_OK)
def deleteSecteur(id_secteur: int, force: bool = False, session: Session = Depends(get_session)):
    secteur = handlers.SecteurHandler(session=session, model=models.Secteur)
    return secteur.delete(id_secteur=id_secteur, force=force)


# ROUTING FOR SETTINGS [STATION] ---------------------------------------------------

@app.post("/setting/station", response_model=schemas.Station, status_code=status.HTTP_201_CREATED)
def createSecteur(station: schemas.StationCreate, session: Session = Depends(get_session)):
    newStation = handlers.StationHandler(session=session, model=models.Station)
    return newStation.create(station)


@app.get("/setting/station",response_model=List[schemas.Station],  status_code=status.HTTP_200_OK)
def readAllStation(session: Session = Depends(get_session)):
    allStation = handlers.StationHandler(session=session, model=models.Station)
    return allStation.readAll()


@app.get("/setting/station/{id_station}", response_model=schemas.Station)
def readStation(id_station: int, session: Session = Depends(get_session)):
    station = handlers.StationHandler(session=session, model=models.Station)
    return station.read(id=id_station)


@app.put("/setting/station/{id_station}", response_model=schemas.Station)
def updateStation(id_station: int, name_station: str, capa_max: int, id_secteur: int, session: Session = Depends(get_session)):
    station = handlers.StationHandler(session=session, model=models.Station)
    return station.update(id_station=id_station, name_station=name_station, capa_max=capa_max, id_secteur=id_secteur)


@app.delete("/setting/station/{id_station}", response_model=schemas.Station, status_code=status.HTTP_200_OK)
def deleteStation(id_station: int, force: bool = False, session: Session = Depends(get_session)):
    station = handlers.StationHandler(session=session, model=models.Station)
    return station.delete(id_station=id_station, force=force)
