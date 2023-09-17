from sqlalchemy.orm import Session
import Database.models as models
from Database.database import SessionLocal, engine
from fastapi import status, HTTPException, Depends
import Database.schemas as schemas
from sqlalchemy.orm import Session
from datetime import date
import pandas as pd
from pandas import DataFrame
from datetime import datetime
from sqlalchemy import create_engine, select, func
import Database.handlers as handlers


def get_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


class ETL:
    def __init__(self, session: Session):
        self.session = session

    def _read_csv(self, path_source: str):
        try:
            df_target = pd.read_csv(
                path_source, encoding='ISO-8859-1', sep=';')
            return df_target
        except:
            filename = path_source.split('/')[-1]
            print(
                f"Arret de l'initialisation fichier introuvable : {filename}")
            raise

    def _put_sql(self, table: str, df_source: DataFrame, myengine):
        df_source.to_sql(
            table, con=myengine, if_exists='replace', index=False)


class ETL_Loading_Init(ETL):
    session: Session
    path_secteur = '../Init/secteur.csv'
    path_station = '../Init/station.csv'
    path_translat_station = '../Init/init.csv'
    path_operateur = '../Init/operateur.csv'
    path_user = '../Init/user.csv'
    path_shift = '../Init/shift.csv'
    path_competence = '../Init/competence.csv'
    path_softcompetence = '../Init/softcompetence.csv'
    path_planning = '../Init/planning.csv'
    path_ke = '../Init/ke.csv'
    path_qty = '../Init/qty.csv'

    df_secteur: DataFrame
    df_station: DataFrame
    df_translat_station: DataFrame
    df_operateur: DataFrame
    df_user: DataFrame
    df_shift: DataFrame
    df_competence: DataFrame
    df_softcompetence: DataFrame
    df_planning: DataFrame
    df_ke: DataFrame
    df_qty: DataFrame

    def _update_secteur(self, secteur_input: schemas.SecteurCreate):
        print("    (Chargement table SECTEUR)")
        listSecteurs = self.session.query(models.Secteur).all()

        for secteurCSV in self.df_secteur.iterrows():
            secteurCSV_name = str(secteurCSV[1][1])
            secteur_input.name_secteur = secteurCSV_name

            for secteur in listSecteurs:
                if secteur.name_secteur == secteur_input.name_secteur:
                    print(f"(-) Secteur ignorer - {secteurCSV_name}")
                    break
            else:
                secteurHandler = handlers.SecteurHandler(
                    session=self.session, model=models.Secteur)
                secteurHandler.create(secteur_input)
                print(f"(+) Secteur ajouter - {secteurCSV_name}")

    def _update_station(self, station_input: schemas.StationCreate):
        print("    (Chargement table STATION)")
        listStation = self.session.query(models.Station).all()

        for stationCSV in self.df_station.iterrows():
            stationCSV_name = str(stationCSV[1][1])
            stationCSV_capa = str(stationCSV[1][2])
            stationCSV_secteur = str(stationCSV[1][3])

            station_input.name_station = stationCSV_name
            station_input.capa_max = stationCSV_capa
            station_input.id_secteur = stationCSV_secteur

            for station in listStation:
                if station.name_station == station_input.name_station:
                    print(f"(-) Station ignorer - {stationCSV_name}")
                    break
            else:
                stationHandler = handlers.StationHandler(
                    session=self.session, model=models.Station)
                stationHandler.create(station_input)
                print(f"(+) Station ajouter - {stationCSV_name}")

    def _update_user(self, user_input: schemas.UserCreate):
        print("    (Chargement table USER)")
        listUser = self.session.query(models.User).all()

        for userCSV in self.df_user.iterrows():
            userCSV_idcard = str(userCSV[1][0])
            userCSV_login = str(userCSV[1][1])
            userCSV_password = str(userCSV[1][2])
            userCSV_start_date = str(userCSV[1][3])
            userCSV_end_date = str(userCSV[1][4])

            user_input.id_card = userCSV_idcard
            user_input.login = userCSV_login
            user_input.password = userCSV_password
            user_input.start_date = datetime.strptime(
                userCSV_start_date, '%d/%m/%Y').date()
            user_input.end_date = datetime.strptime(
                userCSV_end_date, '%d/%m/%Y').date()

            for user in listUser:
                if user.login == user_input.login:
                    print(f"(-) User ignorer - {userCSV_login}")
                    break
            else:
                userHandler = handlers.UserHandler(
                    session=self.session, model=models.User)
                userHandler.create(user_input)
                print(f"(+) User ajouter - {userCSV_login}")

    def _update_shift(self, shift_input: schemas.ShiftCreate):
        print("    (Chargement table SHIFT)")
        listShift = self.session.query(models.Shift).all()

        for shiftCSV in self.df_shift.iterrows():
            shiftCSV_name = str(shiftCSV[1][1])
            shiftCSV_idcard = str(shiftCSV[1][2])

            shift_input.name_shift = shiftCSV_name
            shift_input.id_user = shiftCSV_idcard

            for shift in listShift:
                if shift.name_shift == shift_input.name_shift:
                    print(f"(-) Shift ignorer - {shiftCSV_name}")
                    break
            else:
                shiftHandler = handlers.ShiftHandler(
                    session=self.session, model=models.Shift)
                shiftHandler.create(shift_input)
                print(f"(+) User ajouter - {shiftCSV_name}")

    def _update_operateur(self, operateur_input: schemas.OperateurCreate):
        print("    (Chargement table OPERATEUR)")
        listOperateur = self.session.query(models.Operateur).all()

        for operateurCSV in self.df_operateur.iterrows():
            operateurCSV_idcard = str(operateurCSV[1][0])
            operateurCSV_name = str(operateurCSV[1][1])
            operateurCSV_shift = str(operateurCSV[1][2])
            operateurCSV_home = str(operateurCSV[1][3])
            operateurCSV_start_date = str(operateurCSV[1][4])
            operateurCSV_end_date = str(operateurCSV[1][5])
            operateurCSV_istemps = str(operateurCSV[1][6])
            operateurCSV_active = str(operateurCSV[1][7])

            operateur_input.id_operateur = operateurCSV_idcard
            operateur_input.name_operateur = operateurCSV_name
            operateur_input.id_shift = operateurCSV_shift
            operateur_input.home_station = operateurCSV_home
            operateur_input.start_date = datetime.strptime(
                operateurCSV_start_date, '%d/%m/%Y').date()
            operateur_input.end_date = datetime.strptime(
                operateurCSV_end_date, '%d/%m/%Y').date()
            operateur_input.isTemp = operateurCSV_istemps
            operateur_input.active_status = operateurCSV_active

            for operateur in listOperateur:
                if (operateur.id_operateur+operateur.name_operateur) == (operateur_input.id_operateur+operateur_input.name_operateur):
                    operateurHandler = handlers.OperateurHandler(
                        session=self.session, model=models.Operateur)
                    operateurHandler.update(
                        id_operateur=operateur.id_operateur,
                        name_operateur=operateur_input.name_operateur,
                        id_shift=operateur_input.id_shift,
                        home_station=operateur_input.home_station,
                        start_date=operateur_input.start_date,
                        end_date=operateur_input.end_date,
                        isTemp=operateur_input.isTemp,
                        active_status=operateur_input.active_status
                    )
                    print(f"(%) Operateur updated - {operateurCSV_name}")
                    break
            else:
                operateurHandler = handlers.OperateurHandler(
                    session=self.session, model=models.Operateur)
                operateurHandler.create(operateur_input)
                print(f"(+) Operateur ajouter - {operateurCSV_name}")

    def _update_competences(self, competence_input: schemas.CompetenceCreate):
        print("    (Chargement table COMPETENCES)")
        listCompetences = self.session.query(models.Competence).all()

        for competenceCSV in self.df_competence.iterrows():
            competenceCSV_idstation = str(competenceCSV[1][1])
            competenceCSV_level = str(competenceCSV[1][2])
            competenceCSV_lastass = str(competenceCSV[1][3])
            competenceCSV_id_op = str(competenceCSV[1][4])

            competence_input.id_station = competenceCSV_idstation
            competence_input.level_competence = competenceCSV_level
            competence_input.last_assesement = datetime.strptime(
                competenceCSV_lastass, '%d/%m/%Y').date()
            competence_input.id_operateur = competenceCSV_id_op

            for competence in listCompetences:
                if (str(competence.id_station)+str(competence.id_operateur)) == (str(competence_input.id_station)+str(competence_input.id_operateur)):
                    competenceHandler = handlers.CompetenceHandler(
                        session=self.session, model=models.Competence)
                    competenceHandler.update(id_competence=competence.id,
                                             id_station=competence_input.id_station,
                                             level_competence=competence_input.level_competence,
                                             last_assesement=competence_input.last_assesement,
                                             id_operateur=competence_input.id_operateur)
                    print(
                        f"(%) Competence updated - {competenceCSV_id_op} on {competenceCSV_idstation}")
                    break
            else:
                competenceHandler = handlers.CompetenceHandler(
                    session=self.session, model=models.Competence)
                competenceHandler.create(competence_input)
                print(
                    f"(+) Competence ajouter - {competenceCSV_id_op} on {competenceCSV_idstation}")

    def _update_competencesSoft(self, competencesoft_input: schemas.SoftCompetenceCreate):
        print("    (Chargement table SOFT COMPETENCES)")
        listCompetencesSoft = self.session.query(models.SoftCompetence).all()

        for competenceCSV in self.df_softcompetence.iterrows():
            competenceCSV_idstation = str(competenceCSV[1][1])
            competenceCSV_level = str(competenceCSV[1][2])
            competenceCSV_lastass = str(competenceCSV[1][3])
            competenceCSV_id_op = str(competenceCSV[1][4])

            competencesoft_input.id_station = competenceCSV_idstation
            competencesoft_input.level_competence = competenceCSV_level
            competencesoft_input.last_assesement = datetime.strptime(
                competenceCSV_lastass, '%d/%m/%Y').date()
            competencesoft_input.id_operateur = competenceCSV_id_op

            for competence in listCompetencesSoft:
                if (str(competence.id_station)+str(competence.id_operateur)) == (str(competencesoft_input.id_station)+str(competencesoft_input.id_operateur)):
                    competenceHandler = handlers.SoftCompetenceHandler(
                        session=self.session, model=models.SoftCompetence)
                    competenceHandler.update(id_soft_competence=competence.id,
                                             id_station=competencesoft_input.id_station,
                                             level_competence=competencesoft_input.level_competence,
                                             last_assesement=competencesoft_input.last_assesement,
                                             id_operateur=competencesoft_input.id_operateur)
                    print(
                        f"(%) Competence updated - {competenceCSV_id_op} on {competenceCSV_idstation}")
                    break
            else:
                competenceHandler = handlers.SoftCompetenceHandler(
                    session=self.session, model=models.SoftCompetence)
                competenceHandler.create(competencesoft_input)
                print(
                    f"(+) Competence ajouter - {competenceCSV_id_op} on {competenceCSV_idstation}")

    def _update_planning(self, planning_input: schemas.PlanningCreate):
        print("    (Chargement table PLANNING)")
        listPlanning = self.session.query(models.Planning).all()

        for planningCSV in self.df_planning.iterrows():
            planningCSV_idop = str(planningCSV[1][1])
            planningCSV_iduser = str(planningCSV[1][2])
            planningCSV_idshift = str(planningCSV[1][3])
            planningCSV_idstation = str(planningCSV[1][4])
            planningCSV_date = str(planningCSV[1][5])
            planningCSV_week = str(planningCSV[1][6])
            planningCSV_day = str(planningCSV[1][7])

            planning_input.id_operateur = planningCSV_idop
            planning_input.id_user = planningCSV_iduser
            planning_input.id_shift = planningCSV_idshift
            planning_input.id_station = planningCSV_idstation
            planning_input.date = datetime.strptime(
                planningCSV_date, '%d/%m/%Y').date()
            planning_input.week = planningCSV_week
            planning_input.day = planningCSV_day

            for planning in listPlanning:
                if (str(planning.id_operateur)+str(planning.id_station)+str(planning.date)) == (str(planning_input.id_operateur)+str(planning_input.id_station)+str(planning_input.date)):
                    planningHandler = handlers.PlanningHandler(
                        session=self.session, model=models.Planning)
                    planningHandler.update(id_planning=planning.id,
                                           id_operateur=planning_input.id_operateur,
                                           id_user=planning_input.id_user,
                                           id_shift=planning_input.id_shift,
                                           id_station=planning_input.id_station,
                                           date=planning_input.date,
                                           week=planning_input.week,
                                           day=planning_input.day)
                    print(
                        f"(%) Planning updated - {planningCSV_idop} on {planningCSV_date}")
                    break
            else:
                planningHandler = handlers.PlanningHandler(
                    session=self.session, model=models.Planning)
                planningHandler.create(planning_input)
                print(
                    f"(+) Planning ajouter - {planningCSV_idop} on {planningCSV_date}")

    def extract(self):
        self.df_secteur = self._read_csv(self.path_secteur)
        self.df_station = self._read_csv(self.path_station)
        self.df_translat_station = self._read_csv(self.path_translat_station)
        self.df_operateur = self._read_csv(self.path_operateur)
        self.df_user = self._read_csv(self.path_user)
        self.df_shift = self._read_csv(self.path_shift)
        self.df_competence = self._read_csv(self.path_competence)
        self.df_softcompetence = self._read_csv(self.path_softcompetence)
        self.df_planning = self._read_csv(self.path_planning)
        self.df_ke = self._read_csv(self.path_ke)
        self.df_qty = self._read_csv(self.path_qty)

    def dropAll(self):
        self.session.query(models.Qty).delete()
        self.session.query(models.Ke).delete()
        self.session.query(models.Planning).delete()
        self.session.query(models.SoftCompetence).delete()
        self.session.query(models.Competence).delete()
        self.session.query(models.Shift).delete()
        self.session.query(models.User).delete()
        self.session.query(models.Operateur).delete()
        self.session.query(models.Init).delete()
        self.session.query(models.Station).delete()
        self.session.query(models.Secteur).delete()
        self.session.commit()

    def transform(self):
        pass

    def load(self):
        self._update_secteur(secteur_input=schemas.SecteurCreate)
        self._update_station(station_input=schemas.StationCreate)
        self._update_user(user_input=schemas.UserCreate)
        self._update_shift(shift_input=schemas.ShiftCreate)
        self._update_operateur(operateur_input=schemas.OperateurCreate)
        self._update_competences(competence_input=schemas.CompetenceCreate)
        self._update_competencesSoft(
            competencesoft_input=schemas.SoftCompetenceCreate)
        self._update_planning(planning_input=schemas.PlanningCreate)


# class ETL_Loading_Update(ETL):
#     session: Session
#     path_KE = '../DataLastWeek/Load/KPI_KE.csv'  # Delete 2 first lines
#     path_QTY = '../DataLastWeek/Load/KPI_QTY.csv'  # Delete 2 first lines
#     # Convertir en csv (;)
#     path_OPERATEUR = '../DataLastWeek/Load/Setup_Operators.csv'
#     # Convertir en csv (;)
#     path_GENERALSKILLS = '../DataLastWeek/Load/Setup_VERSATILITYOperatorsGeneralSkills.csv'
#     # Convertir en csv (;)
#     path_SKILLS = '../DataLastWeek/Load/Setup_VERSATILITYOperatorsSkills.csv'

#     df_KE: DataFrame
#     df_QTY: DataFrame
#     df_OPERATEUR: DataFrame
#     df_GENERALSKILLS: DataFrame
#     df_SKILLS: DataFrame

#     df_INPUT_KE: DataFrame
#     df_INPUT_QTY: DataFrame
#     df_INPUT_OPERATEUR: DataFrame
#     df_INPUT_GENERALSKILLS: DataFrame
#     df_INPUT_SKILLS: DataFrame

#     def _if_date_exist_in_base(self, date_x: str, table_x: models, attribut_x: models):
#         if_exist = self.session.query(table_x).filter(
#             attribut_x == date_x).first()
#         if if_exist == None:
#             return False
#         else:
#             return True

#     def _cast_date(self, date_x: str):
#         try:
#             date_x = datetime.strptime(date_x, '%d %b %Y')
#         except:
#             date_x = datetime.strptime(date_x, '%d/%m/%Y')

#         return str(date_x.strftime('%d/%m/%Y'))

#     def extract(self):
#         self.df_KE = self._read_csv(self.path_KE)
#         self.df_QTY = self._read_csv(self.path_QTY)
#         self.df_OPERATEUR = self._read_csv(self.path_OPERATEUR)
#         self.df_GENERALSKILLS = self._read_csv(self.path_GENERALSKILLS)
#         self.df_SKILLS = self._read_csv(self.path_SKILLS)

#     def transform_ke(self):
#         for line in self.df_KE.iterrows():
#             line_date = self._cast_date(str(line[1].Day))
#             if not(self.session.query(models.Ke).filter(
#                     models.Ke.date_ke == line_date).first() == None):
#                 print(f"ignorer- {line_date}")
#             else:
#                 try:
#                     value = int(line[1].Value)
#                 except:
#                     value = 0
#                 try:
#                     target = int(line[1].Target)
#                 except:
#                     target = 0
#                 if not(target == 0 or value == 0):
#                     newKeValue = schemas.KeCreate(date_ke=str(
#                         line_date), ke=value, target_ke=target)
#                     keHandler = handlers.KeHandler(
#                         session=self.session, model=models.Ke)
#                     anwser = keHandler.create(newKeValue)
#                     print(f"ajouter - {line_date} --{anwser}--")
#                 print(f"ignorer- {line_date}---------> 0")
#         self.session.close()

#     def load(self):
#         pass

#         # * update operateur (sur l id card)

#         # * delete n reload competence
#         # * delete n reload softcompetence

#         # * add ke (date)
#         # * add qty (date)
