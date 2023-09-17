from pydantic import BaseModel
from datetime import date


class SecteurCreate(BaseModel):
    name_secteur: str


class Secteur(SecteurCreate):
    id_secteur: int
    name_secteur: str

    class Config:
        orm_mode = True


class StationCreate(BaseModel):
    name_station: str
    capa_max: int
    id_secteur: int


class Station(StationCreate):
    id_station: int

    class Config:
        orm_mode = True


class ShiftCreate(BaseModel):
    name_shift: str
    id_user: int


class Shift(ShiftCreate):
    id_shift: int
    name_shift: str
    id_user: int

    class Config:
        orm_mode = True


class KeCreate(BaseModel):
    date_ke: str
    ke: int
    target_ke: int


class Ke(KeCreate):
    id_ke: int
    date_ke: str
    ke: int
    target_ke: int

    class Config:
        orm_mode = True


class QtyCreate(BaseModel):
    date_qty: str
    qty: str
    target_qty: int


class Qty(QtyCreate):
    id_qty: int
    date_qty: str
    qty: int
    target_qty: int

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    id_card: str
    login: str
    password: str
    start_date: str
    end_date: str


class User(UserCreate):
    id_card: str
    login: str
    password: str
    start_date: str
    end_date: str

    class Config:
        orm_mode = True


class OperateurCreate(BaseModel):
    id_operateur: str
    name_operateur: str
    id_shift: int
    home_station: int
    start_date: str
    end_date: str
    isTemp: int
    active_status: int


class Operateur(OperateurCreate):
    # id_operateur: int
    id_operateur: str
    name_operateur: str
    id_shift: int
    home_station: int
    start_date: str
    end_date: str
    isTemp: int
    active_status: int

    class Config:
        orm_mode = True


class CompetenceCreate(BaseModel):
    id_station: int
    level_competence: int
    last_assesement: str
    id_operateur: str


class Competence(CompetenceCreate):
    id: int
    id_station: int
    level_competence: int
    last_assesement: str
    id_operateur: str

    class Config:
        orm_mode = True


class SoftCompetenceCreate(BaseModel):
    id_station: int
    level_competence: int
    last_assesement: str
    id_operateur: str


class SoftCompetence(SoftCompetenceCreate):
    id: int
    id_station: int
    level_competence: int
    last_assesement: str
    id_operateur: str

    class Config:
        orm_mode = True


class PlanningCreate(BaseModel):
    id_operateur: str
    id_user: int
    id_shift: int
    id_station: int
    date: str
    week: str
    day: str


class Planning(PlanningCreate):
    id: int
    id_operateur: str
    id_user: int
    id_shift: int
    id_station: int
    date: str
    week: str
    day: str

    class Config:
        orm_mode = True


class PlanningDisplay(BaseModel):
    id: int
    id_operateur: str
    id_user: str
    id_shift: str
    id_station: str
    date: str
    week: str
    day: str

    class Config:
        orm_mode = True


class InitCreate(BaseModel):
    old_name: str
    new_name: str


class Init(InitCreate):
    id: int
    old_name: str
    new_name: str

    class Config:
        orm_mode = True
