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
    date_ke: date
    ke: int
    target_ke: int


class Ke(KeCreate):
    id_ke: int
    date_ke: date
    ke: int
    target_ke: int

    class Config:
        orm_mode = True


class QtyCreate(BaseModel):
    date_qty: date
    qty: str
    target_qty: int


class Qty(QtyCreate):
    id_qty: int
    date_qty: date
    qty: int
    target_qty: int

    class Config:
        orm_mode = True


class UserCreate(BaseModel):
    id_user: str
    login: str
    password: str
    start_date: date
    end_date: date


class User(UserCreate):
    id_user: str
    login: str
    password: str
    start_date: date
    end_date: date

    class Config:
        orm_mode = True


class OperateurCreate(BaseModel):
    id_operateur: str
    name_operateur: str
    id_shift: int
    home_station: int
    start_date: date
    end_date: date
    isTemp: bool
    active_status: bool


class Operateur(OperateurCreate):
    # id_operateur: int
    id_operateur: str
    name_operateur: str
    id_shift: int
    home_station: int
    start_date: date
    end_date: date
    isTemp: bool
    active_status: bool

    class Config:
        orm_mode = True


class CompetenceCreate(BaseModel):
    id_station: int
    level_competence: int
    last_assesement: date
    id_operateur: int


class Competence(CompetenceCreate):
    id: int
    id_station: int
    level_competence: int
    last_assesement: date
    id_operateur: int

    class Config:
        orm_mode = True


class SoftCompetenceCreate(BaseModel):
    id_station: int
    level_competence: int
    last_assesement: date
    id_operateur: int


class SoftCompetence(SoftCompetenceCreate):
    id: int
    id_station: int
    level_competence: int
    last_assesement: date
    id_operateur: int

    class Config:
        orm_mode = True


class PlanningCreate(BaseModel):
    id_operateur: int
    id_user: int
    id_shift: int
    id_station: int
    date: date
    week: int
    day: int


class Planning(PlanningCreate):
    id: int
    id_operateur: int
    id_user: int
    id_shift: int
    id_station: int
    date: date
    week: int
    day: int

    class Config:
        orm_mode = True
