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

    def transform(self):
        pass

    def load(self):
        self._put_sql("secteur", self.df_secteur, engine)
        self._put_sql("station", self.df_station, engine)
        self._put_sql("init", self.df_translat_station, engine)
        self._put_sql("operateur", self.df_operateur, engine)
        self._put_sql("user", self.df_user, engine)
        self._put_sql("shift", self.df_shift, engine)
        self._put_sql("competence", self.df_competence, engine)
        self._put_sql("softcompetence", self.df_softcompetence, engine)
        self._put_sql("planning", self.df_planning, engine)
        self._put_sql("ke", self.df_ke, engine)
        self._put_sql("qty", self.df_qty, engine)


class ETL_Loading_Update(ETL):
    session: Session
    path_KE = '../DataLastWeek/Load/KPI_KE.csv'  # Delete 2 first lines
    path_QTY = '../DataLastWeek/Load/KPI_QTY.csv'  # Delete 2 first lines
    # Convertir en csv (;)
    path_OPERATEUR = '../DataLastWeek/Load/Setup_Operators.csv'
    # Convertir en csv (;)
    path_GENERALSKILLS = '../DataLastWeek/Load/Setup_VERSATILITYOperatorsGeneralSkills.csv'
    # Convertir en csv (;)
    path_SKILLS = '../DataLastWeek/Load/Setup_VERSATILITYOperatorsSkills.csv'

    df_KE: DataFrame
    df_QTY: DataFrame
    df_OPERATEUR: DataFrame
    df_GENERALSKILLS: DataFrame
    df_SKILLS: DataFrame

    df_INPUT_KE: DataFrame
    df_INPUT_QTY: DataFrame
    df_INPUT_OPERATEUR: DataFrame
    df_INPUT_GENERALSKILLS: DataFrame
    df_INPUT_SKILLS: DataFrame

    def _if_date_exist_in_base(self, date_x: str, table_x: models, attribut_x: models):
        if_exist = self.session.query(table_x).filter(
            attribut_x == date_x).first()
        if if_exist == None:
            return False
        else:
            return True

    def _cast_date(self, date_x: str):
        try:
            date_x = datetime.strptime(date_x, '%d %b %Y')
        except:
            date_x = datetime.strptime(date_x, '%d/%m/%Y')

        return str(date_x.strftime('%d/%m/%Y'))

    def extract(self):
        self.df_KE = self._read_csv(self.path_KE)
        self.df_QTY = self._read_csv(self.path_QTY)
        self.df_OPERATEUR = self._read_csv(self.path_OPERATEUR)
        self.df_GENERALSKILLS = self._read_csv(self.path_GENERALSKILLS)
        self.df_SKILLS = self._read_csv(self.path_SKILLS)

    def transform_ke(self):
        for line in self.df_KE.iterrows():
            line_date = self._cast_date(str(line[1].Day))
            if not(self.session.query(models.Ke).filter(
                    models.Ke.date_ke == line_date).first() == None):
                print(f"ignorer- {line_date}")
            else:
                try:
                    value = int(line[1].Value)
                except:
                    value = 0
                try:
                    target = int(line[1].Target)
                except:
                    target = 0
                if not(target == 0 or value == 0):
                    newKeValue = schemas.KeCreate(date_ke=str(
                        line_date), ke=value, target_ke=target)
                    keHandler = handlers.KeHandler(
                        session=self.session, model=models.Ke)
                    anwser = keHandler.create(newKeValue)
                    print(f"ajouter - {line_date} --{anwser}--")
                print(f"ignorer- {line_date}---------> 0")
        self.session.close()

    def load(self):
        pass

        # * update operateur (sur l id card)

        # * delete n reload competence
        # * delete n reload softcompetence

        # * add ke (date)
        # * add qty (date)
