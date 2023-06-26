# uvicorn main:app --reload
from fastapi import FastAPI, status, HTTPException, Depends
from Database.database import Base, engine, SessionLocal
from typing import List
from sqlalchemy.orm import Session
import Database.models as models
import Database.schemas as schemas
import Database.handlers as handlers
from datetime import date

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
    return secteur.delete(id_secteur)


# ROUTING FOR SETTINGS [STATION] ---------------------------------------------------
@app.post("/setting/station", response_model=schemas.Station, status_code=status.HTTP_201_CREATED)
def createSecteur(station: schemas.StationCreate, session: Session = Depends(get_session)):
    newStation = handlers.StationHandler(session=session, model=models.Station)
    return newStation.create(station)


@app.get("/setting/station", response_model=List[schemas.Station],  status_code=status.HTTP_200_OK)
def readAllStation(session: Session = Depends(get_session)):
    allStation = handlers.StationHandler(session=session, model=models.Station)
    return allStation.readAll()


@app.get("/setting/station/{id_station}", response_model=schemas.Station,  status_code=status.HTTP_200_OK)
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
    return station.delete(id_station)

# ROUTING FOR SETTINGS [SOFTCOMPETENCE] ---------------------------------------------------


@app.post("/setting/softcompetence", response_model=schemas.SoftCompetence, status_code=status.HTTP_201_CREATED)
def createSoftCompetence(softcompetence: schemas.SoftCompetenceCreate, session: Session = Depends(get_session)):
    newSoftCompetence = handlers.SoftCompetenceHandler(
        session=session, model=models.SoftCompetence)
    return newSoftCompetence.create(softcompetence)


@app.get("/setting/softcompetence", response_model=List[schemas.SoftCompetence], status_code=status.HTTP_200_OK)
def readAllSoftCompetence(session: Session = Depends(get_session)):
    allSoftCompetence = handlers.SoftCompetenceHandler(
        session=session, model=models.SoftCompetence)
    return allSoftCompetence.readAll()


@app.get("/setting/softcompetence/{id_softcompetence}", response_model=schemas.SoftCompetence, status_code=status.HTTP_200_OK)
def readSoftCompetence(id_softcompetence: int, session: Session = Depends(get_session)):
    softcompetence = handlers.SoftCompetenceHandler(
        session=session, model=models.SoftCompetence)
    return softcompetence.read(id=id_softcompetence)


@app.put("/setting/softcompetence/{id_softcompetence}", response_model=schemas.SoftCompetence)
def updateSoftCompetence(id_softcompetence: int, level_competence: int, last_assesement: date, session: Session = Depends(get_session)):
    softcompetence = handlers.SoftCompetenceHandler(
        session=session, model=models.SoftCompetence)
    return softcompetence.update(id_softcompetence=id_softcompetence, level_competence=level_competence, last_assesement=last_assesement)


@app.delete("/setting/softcompetence/{id_softcompetence}", response_model=schemas.SoftCompetence, status_code=status.HTTP_200_OK)
def deleteSoftCompetence(id_softcompetence: int, force: bool = False, session: Session = Depends(get_session)):
    softcompetence = handlers.SoftCompetenceHandler(
        session=session, model=models.SoftCompetence)
    return softcompetence.delete(id_softcompetence)

# ROUTING FOR SETTINGS [SHIFT] ---------------------------------------------------


@app.post("/setting/shift", response_model=schemas.Shift, status_code=status.HTTP_201_CREATED)
def createShift(shift: schemas.ShiftCreate, session: Session = Depends(get_session)):
    newShift = handlers.ShiftHandler(session=session, model=models.Shift)
    return newShift.create(shift)


@app.get("/setting/shift", response_model=List[schemas.Shift], status_code=status.HTTP_200_OK)
def readAllShifts(session: Session = Depends(get_session)):
    allShifts = handlers.ShiftHandler(session=session, model=models.Shift)
    return allShifts.readAll()


@app.get("/setting/shift/{id_shift}", response_model=schemas.Shift, status_code=status.HTTP_200_OK)
def readShift(id_shift: int, session: Session = Depends(get_session)):
    shift = handlers.ShiftHandler(session=session, model=models.Shift)
    return shift.read(id=id_shift)


@app.put("/setting/shift/{id_shift}", response_model=schemas.Shift)
def updateShift(id_shift: int, name_shift: str, id_user: int, session: Session = Depends(get_session)):
    shift = handlers.ShiftHandler(session=session, model=models.Shift)
    return shift.update(id_shift=id_shift, name_shift=name_shift, id_user=id_user)


@app.delete("/setting/shift/{id_shift}", response_model=schemas.Shift, status_code=status.HTTP_200_OK)
def deleteShift(id_shift: int, force: bool = False, session: Session = Depends(get_session)):
    shift = handlers.ShiftHandler(session=session, model=models.Shift)
    return shift.delete(id_shift)

# ROUTING FOR SETTINGS [USER] ---------------------------------------------------


@app.post("/setting/user", response_model=schemas.User, status_code=status.HTTP_201_CREATED)
def createUser(user: schemas.UserCreate, session: Session = Depends(get_session)):
    newUser = handlers.UserHandler(session=session, model=models.User)
    return newUser.create(user)


@app.get("/setting/user", response_model=List[schemas.User], status_code=status.HTTP_200_OK)
def readAllUsers(session: Session = Depends(get_session)):
    allUsers = handlers.UserHandler(session=session, model=models.User)
    return allUsers.readAll()


@app.get("/setting/user/{id_user}", response_model=schemas.User, status_code=status.HTTP_200_OK)
def readUser(id_user: int, session: Session = Depends(get_session)):
    user = handlers.UserHandler(session=session, model=models.User)
    return user.read(id=id_user)


@app.put("/setting/user/{id_user}", response_model=schemas.User)
def updateUser(id_user: int, id_card: str, login: str, password: str, start_date: date, end_date: date, session: Session = Depends(get_session)):
    user = handlers.UserHandler(session=session, model=models.User)
    return user.update(id_user=id_user, id_card=id_card, login=login, password=password, start_date=start_date, end_date=end_date)


@app.delete("/setting/user/{id_user}", response_model=schemas.User, status_code=status.HTTP_200_OK)
def deleteUser(id_user: int, force: bool = False, session: Session = Depends(get_session)):
    user = handlers.UserHandler(session=session, model=models.User)
    return user.delete(id_user)

# ROUTING FOR SETTINGS [OPERATEUR] ---------------------------------------------------


@app.post("/setting/operateur", response_model=schemas.Operateur, status_code=status.HTTP_201_CREATED)
def createOperateur(operateur: schemas.OperateurCreate, session: Session = Depends(get_session)):
    newOperateur = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return newOperateur.create(operateur)


@app.get("/setting/operateur", response_model=List[schemas.Operateur], status_code=status.HTTP_200_OK)
def readAllOperateurs(session: Session = Depends(get_session)):
    allOperateurs = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return allOperateurs.readAll()


@app.get("/setting/operateur/{id_operateur}", response_model=schemas.Operateur, status_code=status.HTTP_200_OK)
def readOperateur(id_operateur: int, session: Session = Depends(get_session)):
    operateur = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return operateur.read(id=id_operateur)


@app.put("/setting/operateur/{id_operateur}", response_model=schemas.Operateur)
def updateOperateur(id_operateur: int, id_card: int, name_operateur: str, id_shift: int, home_station: int, start_date: date, end_date: date, isTemp: bool, active_status: bool, session: Session = Depends(get_session)):
    operateur = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return operateur.update(id_operateur=id_operateur, id_card=id_card, name_operateur=name_operateur, id_shift=id_shift, home_station=home_station, start_date=start_date, end_date=end_date, isTemp=isTemp, active_status=active_status)


@app.delete("/setting/operateur/{id_operateur}", response_model=schemas.Operateur, status_code=status.HTTP_200_OK)
def deleteOperateur(id_operateur: int, force: bool = False, session: Session = Depends(get_session)):
    operateur = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return operateur.delete(id_operateur)

# ROUTING FOR SETTINGS [COMPETENCE] ---------------------------------------------------


@app.post("/setting/competence", response_model=schemas.Competence, status_code=status.HTTP_201_CREATED)
def createCompetence(competence: schemas.CompetenceCreate, session: Session = Depends(get_session)):
    newCompetence = handlers.CompetenceHandler(
        session=session, model=models.Competence)
    return newCompetence.create(competence)


@app.get("/setting/competence", response_model=List[schemas.Competence], status_code=status.HTTP_200_OK)
def readAllCompetences(session: Session = Depends(get_session)):
    allCompetences = handlers.CompetenceHandler(
        session=session, model=models.Competence)
    return allCompetences.readAll()


@app.get("/setting/competence/{id_competence}", response_model=schemas.Competence, status_code=status.HTTP_200_OK)
def readCompetence(id_competence: int, session: Session = Depends(get_session)):
    competence = handlers.CompetenceHandler(
        session=session, model=models.Competence)
    return competence.read(id=id_competence)


@app.put("/setting/competence/{id_competence}", response_model=schemas.Competence)
def updateCompetence(id_competence: int, id_station: int, level_competence: int, last_assesement: date, id_operateur: int, session: Session = Depends(get_session)):
    competence = handlers.CompetenceHandler(
        session=session, model=models.Competence)
    return competence.update(id_competence=id_competence, id_station=id_station, level_competence=level_competence, last_assesement=last_assesement, id_operateur=id_operateur)


@app.delete("/setting/competence/{id_competence}", response_model=schemas.Competence, status_code=status.HTTP_200_OK)
def deleteCompetence(id_competence: int, force: bool = False, session: Session = Depends(get_session)):
    competence = handlers.CompetenceHandler(
        session=session, model=models.Competence)
    return competence.delete(id_competence)

# ROUTING FOR SETTINGS [PLANNING] ---------------------------------------------------


@app.post("/setting/planning", response_model=schemas.Planning, status_code=status.HTTP_201_CREATED)
def createPlanning(planning: schemas.PlanningCreate, session: Session = Depends(get_session)):
    newPlanning = handlers.PlanningHandler(
        session=session, model=models.Planning)
    return newPlanning.create(planning)


@app.get("/setting/planning", response_model=List[schemas.Planning], status_code=status.HTTP_200_OK)
def readAllPlannings(session: Session = Depends(get_session)):
    allPlannings = handlers.PlanningHandler(
        session=session, model=models.Planning)
    return allPlannings.readAll()


@app.get("/setting/planning/{id_planning}", response_model=schemas.Planning, status_code=status.HTTP_200_OK)
def readPlanning(id_planning: int, session: Session = Depends(get_session)):
    planning = handlers.PlanningHandler(session=session, model=models.Planning)
    return planning.read(id=id_planning)


@app.put("/setting/planning/{id_planning}", response_model=schemas.Planning)
def updatePlanning(id_planning: int, date_planning: date, id_operateur: int, id_shift: int, session: Session = Depends(get_session)):
    planning = handlers.PlanningHandler(session=session, model=models.Planning)
    return planning.update(id_planning=id_planning, date_planning=date_planning, id_operateur=id_operateur, id_shift=id_shift)


@app.delete("/setting/planning/{id_planning}", response_model=schemas.Planning, status_code=status.HTTP_200_OK)
def deletePlanning(id_planning: int, force: bool = False, session: Session = Depends(get_session)):
    planning = handlers.PlanningHandler(session=session, model=models.Planning)
    return planning.delete(id_planning)
