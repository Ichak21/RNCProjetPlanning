# uvicorn main:app --reload
from fastapi import FastAPI, status, HTTPException, Depends
from Database.database import Base, engine, SessionLocal
from typing import List
from sqlalchemy.orm import Session
import Database.models as models
import Database.schemas as schemas
import Database.handlers as handlers
import ETLs as ETL
from datetime import date
from fastapi.middleware.cors import CORSMiddleware
import preprocess_et_entrainement_modele as prepro
import subprocess
import model_magic_fulfill_et_ml_prod_react as fullfill


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

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return "Is alive !"

# ROUTING FOR MAGIC FULL FILL [ML MODEL] ---------------------------------------------------


@app.get("/setting/runprepro", response_model={}, status_code=status.HTTP_200_OK)
def runPrepro(session: Session = Depends(get_session)):
    try:
        update = ETL.ETL_Loading_Update(session=session)
        update.extract()
        update.load()
        # Utilisation de subprocess pour exécuter prepro.py
        subprocess.run(
            ["python", "preprocess_et_entrainement_modele.py"], check=True)
        return {"message": "Le script de preprocessing a été exécuté avec succès."}
    except subprocess.CalledProcessError as e:
        return {"error": f"Erreur lors de l'exécution de prepro.py : {e}", "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR}


@app.get("/setting/fullfll/{qty}", response_model={})
def runFullFill(qty: int, session: Session = Depends(get_session)):
    resu = fullfill.main(qty)
    return resu

# ROUTING FOR SETTINGS [SECTEUR] ---------------------------------------------------


@app.post("/setting/secteur", response_model=schemas.Secteur, status_code=status.HTTP_201_CREATED)
def createSecteur(secteur: schemas.SecteurCreate, session: Session = Depends(get_session)):
    print(secteur)
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
    # for competence in allSoftCompetence.readAll():
    #     print(competence.id_operateur)
    # return []
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


@app.get("/operateurs", response_model=List[schemas.Operateur], status_code=status.HTTP_200_OK)
def readAllOperateursTrained(session: Session = Depends(get_session)):
    allOperateurs = handlers.OperateurHandler(
        session=session, model=models.Operateur)
    return allOperateurs.readAllTrained()


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


@app.get("/planning", response_model=List[schemas.PlanningDisplay], status_code=status.HTTP_200_OK)
def readAllPlannings(session: Session = Depends(get_session)):
    allPlannings = handlers.PlanningHandler(
        session=session, model=models.Planning)
    return allPlannings.readAllDisplay()


@app.get("/planning/{week}", response_model=List[schemas.Planning], status_code=status.HTTP_200_OK)
def readPlanningWeek(week_planning: str, session: Session = Depends(get_session)):
    planning = handlers.PlanningHandler(session=session, model=models.Planning)
    return planning.readWeek(week=week_planning)

# ROUTING FOR SETTINGS [ke] ---------------------------------------------------


@app.post("/setting/ke", response_model=schemas.Ke, status_code=status.HTTP_201_CREATED)
def createKe(ke: schemas.KeCreate, session: Session = Depends(get_session)):
    newKe = handlers.KeHandler(session=session, model=models.Ke)
    return newKe.create(ke)


@app.get("/setting/ke", response_model=List[schemas.Ke], status_code=status.HTTP_200_OK)
def readAllKe(session: Session = Depends(get_session)):
    allKe = handlers.KeHandler(session=session, model=models.Ke)
    return allKe.readAll()


@app.get("/setting/ke/{id_ke}", response_model=schemas.Ke, status_code=status.HTTP_200_OK)
def readKe(id_ke: int, session: Session = Depends(get_session)):
    ke = handlers.KeHandler(session=session, model=models.Ke)
    return ke.read(id=id_ke)


# @app.put("/setting/ke/{id_ke}", response_model=schemas.Ke)
# def updateShift(id_ke: int, date_ke: date, ke: int, target_ke: int, session: Session = Depends(get_session)):
#     ke = handlers.KeHandler(session=session, model=models.Ke)
#     return ke.update(id_ke=id_ke, date_ke=date_ke, ke=ke, target_ke=target_ke)


@app.delete("/setting/ke/{id_ke}", response_model=schemas.Ke, status_code=status.HTTP_200_OK)
def deleteKe(id: int, force: bool = False, session: Session = Depends(get_session)):
    ke = handlers.KeHandler(session=session, model=models.Ke)
    return ke.delete(id)

# ROUTING FOR SETTINGS [qty] ---------------------------------------------------


@app.post("/setting/qty", response_model=schemas.Qty, status_code=status.HTTP_201_CREATED)
def createQty(Qty: schemas.QtyCreate, session: Session = Depends(get_session)):
    newQty = handlers.QtyHandler(session=session, model=models.Qty)
    return newQty.create(Qty)


@app.get("/setting/qty", response_model=List[schemas.Qty], status_code=status.HTTP_200_OK)
def readAllQty(session: Session = Depends(get_session)):
    allQty = handlers.QtyHandler(session=session, model=models.Qty)
    return allQty.readAll()


@app.get("/setting/qty/{id_qty}", response_model=schemas.Qty, status_code=status.HTTP_200_OK)
def readQty(id_qty: int, session: Session = Depends(get_session)):
    Qty = handlers.QtyHandler(session=session, model=models.Qty)
    return Qty.read(id=id_qty)


# @app.put("/setting/qty/{id_qty}", response_model=schemas.Qty)
# def updateShift(id_qty: int, date: date, Qty: int, target_qty: int, session: Session = Depends(get_session)):
#     Qty = handlers.QtyHandler(session=session, model=models.Qty)
#     return Qty.update(id_qty=id_qty, date=date, qty=Qty, target_qty=target_qty)


@app.delete("/setting/qty/{id_qty}", response_model=schemas.Qty, status_code=status.HTTP_200_OK)
def deleteQty(id_qty: int, force: bool = False, session: Session = Depends(get_session)):
    Qty = handlers.QtyHandler(session=session, model=models.Qty)
    return Qty.delete(id_qty)


@app.get("/setting/init", response_model=None, status_code=status.HTTP_200_OK)
def initiDB(session: Session = Depends(get_session)):
    initialisation = ETL.ETL_Loading_Init(session=session)
    initialisation.dropAll()
    initialisation.extract()
    initialisation.load()


@app.get("/setting/update", response_model=None, status_code=status.HTTP_200_OK)
def initiDB(session: Session = Depends(get_session)):
    update = ETL.ETL_Loading_Update(session=session)
    update.extract()
    update.load()


@app.get("/cleanNameToId/{station_name}", response_model=schemas.retourStation, status_code=status.HTTP_200_OK)
def translate(station_name: str, session: Session = Depends(get_session)):
    station_id = 0
    stationdf_conversion_dict_str_contains = {
        "330_CONTROL_ADAPT": "330 Contrï¿½le adaptation",
        "302_HABILLAGE_D2S": "302 D2S",
        "340_HABILLAGE_DET": "340 Ligne DET",
        "320_HABILLAGE_DEMT": "320 DEMT Affaires SP",
        "514_CABLAGE": "310 Cablage caissons",
        "514_FILERIE": "514 Filerie",
        "516C_MOTEUR": "514 Moteurs",
        "800C_CI": "516C Composant Indus",
        "800C_IQE": "800C IQE",
        "850D_DECHARGEMENT": "850D Dechargement Camions",
        "510D": "510D",
        "850A_RECEPTION": "850A Reception Magasin",
        "850B_TRAIN1": "850B Livraison BDL Train 1",
        "500_ROBOT_ASS": "500 Robot Assemblage",
        "502_HELLIUM": "505Controle etancheitï¿½ Helium",
        "502_MI": "502 Montage Interne",
        "501_SALLE_PROPRE": "501 Salle Propre",
        "504_CMI": "504 CMI",
        "503_COMMANDE_IP": "503 Commandes I/P",
        "504_ROBOT_FERMETURE": "504 Robot de Fermeture",
        "503_COMMANDE_QD": "503 Commandes Q/D",
        "402_CONTROLE_HT": "507Controle HT",
        "412_EMBALLAGE": "510 Emballage",
        "408_EQF4": "508 EQF4",
        "403_PREHENSEUR": "507 Prï¿½henseur Habillage",
        "406_EQF2": "508 EQF2",
        "401_FIC_&_INTERVEROUILLAGE": "506 FIC",
        "404_COLLECTEUR_&_BRIDAGE": "508 EQF1",
        "410_CONTROLE_BT": "509 Controle BT1",
        "411_CONTROLE_FINAL": "509 Contrï¿½le BT2",
        "407_EQF3": "508 EQF3",
        "505_PASS": "505 Passivation",
        "301_NKT": "301 NKT",
        "Safety": "Safety",
        "SPS & Lean": "SPS & Lean",
        "SIM": "SIM",
        "Ergonomics": "Ergonomics",
        "Manipulation des Robots": "Manipulation des Robots",
        "Programmation trajectoire & recalage": "Programmation trajectoire & recalage",
        "Soudure TIG": "Soudure TIG",
        "Soudure MIG": "Soudure MIG",
        "CACES 1": "CACES 1",
        "CACES 2": "CACES 2",
        "CACES 3": "CACES 3",
        "CACES 4": "CACES 4",
        "CACES 5": "CACES 5",
        "CACES NACELLE": "CACES NACELLE",
        "Transpalette electrique": "Transpalette electrique",
        "Chariot motorise": "Chariot motorise",
        "Manipulation de SF6": "Manipulation de SF6",
        "Secouriste": "Secouriste",
        "Pompiers": "Pompiers",
        "Habilitation elec": "Habilitation elec",
        "Habillitation ATEX": "Habillitation ATEX",
        "Informatique Production": "Informatique Production",
        "Informatique Magasin": "Informatique Magasin",
        "Informatique Maintenance": "Informatique Maintenance",
        "Informatique IQE": "Informatique IQE",
        "Informatique Qualite": "Informatique Qualite",
        "Informatique Lancement": "Informatique Lancement",
        "Local rï¿½paration": "Local rï¿½paration",
        "Safety Leader": "Safety Leader",
        "Referent AIC": "Referent AIC",
        "Leader 5S": "Leader 5S",
        "AZ": "AZ",
        "XX_MALADIE": "XX_MALADIE",
        "XX_DELEGATION": "XX_DELEGATION",
        "XX_CONGES": "XX_CONGES",
        "XX_FORMATION_EXT": "XX_FORMATION_EXT",
        "XX_PRET": "XX_PRET",
        "EXPEDITION": "Expedition",
        "S/E": "Sous ensemble"
    }
    if station_name in stationdf_conversion_dict_str_contains:
        for cle, valeur in stationdf_conversion_dict_str_contains.items():
            if station_name in cle:
                station_id = session.query(models.Station).filter(
                    models.Station.name_station == valeur).first().id_station
    else:
        station_name = 0

    return schemas.retourStation(id_station=station_id, clean_name=station_name)


@app.get("/idToCleanName/{station_id}", response_model=schemas.retourStation, status_code=status.HTTP_200_OK)
def translate(station_id: int, session: Session = Depends(get_session)):
    station_name = "ERROR_NAME"
    stationdf_conversion_dict_str_contains = {
        "330 Contrï¿½le adaptation": "330_CONTROL_ADAPT",
        "302 D2S": "302_HABILLAGE_D2S",
        "340 Ligne DET": "340_HABILLAGE_DET",
        "320 DEMT Affaires SP": "320_HABILLAGE_DEMT",
        "310 Cablage caissons": "514_CABLAGE",
        "514 Filerie": "514_FILERIE",
        "514 Moteurs": "516C_MOTEUR",
        "516C Composant Indus": "800C_CI",
        "800C IQE": "800C_IQE",
        "850D Dechargement Camions": "850D_DECHARGEMENT",
        "510D": "510D",
        "850A Reception Magasin": "850A_RECEPTION",
        "850B Livraison BDL Train 1": "850B_TRAIN1",
        "500 Robot Assemblage": "500_ROBOT_ASS",
        "505Controle etancheitï¿½ Helium": "502_HELLIUM",
        "502 Montage Interne": "502_MI",
        "501 Salle Propre": "501_SALLE_PROPRE",
        "504 CMI": "504_CMI",
        "503 Commandes I/P": "503_COMMANDE_IP",
        "504 Robot de Fermeture": "504_ROBOT_FERMETURE",
        "503 Commandes Q/D": "503_COMMANDE_QD",
        "507Controle HT": "402_CONTROLE_HT",
        "510 Emballage": "412_EMBALLAGE",
        "508 EQF4": "408_EQF4",
        "507 Prï¿½henseur Habillage": "403_PREHENSEUR",
        "508 EQF2": "406_EQF2",
        "506 FIC": "401_FIC_&_INTERVEROUILLAGE",
        "508 EQF1": "404_COLLECTEUR_&_BRIDAGE",
        "509 Controle BT1": "410_CONTROLE_BT",
        "509 Contrï¿½le BT2": "410_CONTROLE_BT",
        "509 Controle Final": "411_CONTROLE_FINAL",
        "508 EQF3": "407_EQF3",
        "505 Passivation": "505_PASS",
        "301 NKT": "301_NKT",
        "Safety": "Safety",
        "SPS & Lean": "SPS & Lean",
        "SIM": "SIM",
        "Ergonomics": "Ergonomics",
        "Manipulation des Robots": "Manipulation des Robots",
        "Programmation trajectoire & recalage": "Programmation trajectoire & recalage",
        "Soudure TIG": "Soudure TIG",
        "Soudure MIG": "Soudure MIG",
        "CACES 1": "CACES 1",
        "CACES 2": "CACES 2",
        "CACES 3": "CACES 3",
        "CACES 4": "CACES 4",
        "CACES 5": "CACES 5",
        "CACES NACELLE": "CACES NACELLE",
        "Transpalette electrique": "Transpalette electrique",
        "Chariot motorise": "Chariot motorise",
        "Manipulation de SF6": "Manipulation de SF6",
        "Secouriste": "Secouriste",
        "Pompiers": "Pompiers",
        "Habilitation elec": "Habilitation elec",
        "Habillitation ATEX": "Habillitation ATEX",
        "Informatique Production": "Informatique Production",
        "Informatique Magasin": "Informatique Magasin",
        "Informatique Maintenance": "Informatique Maintenance",
        "Informatique IQE": "Informatique IQE",
        "Informatique Qualite": "Informatique Qualite",
        "Informatique Lancement": "Informatique Lancement",
        "Local rï¿½paration": "Local rï¿½paration",
        "Safety Leader": "Safety Leader",
        "Referent AIC": "Referent AIC",
        "Leader 5S": "Leader 5S",
        "AZ": "AZ",
        "XX_MALADIE": "XX_MALADIE",
        "XX_DELEGATION": "XX_DELEGATION",
        "XX_CONGES": "XX_CONGES",
        "XX_FORMATION_EXT": "XX_FORMATION_EXT",
        "XX_PRET": "XX_PRET",
        "Expedition": "EXPEDITION",
        "Sous ensemble": "S/E"
    }
    station_poorname = session.query(
        models.Station).get(station_id).name_station
    print(station_poorname)
    for cle, valeur in stationdf_conversion_dict_str_contains.items():
        if station_poorname in cle:
            station_name = valeur

    return schemas.retourStation(id_station=station_id, clean_name=station_name)
