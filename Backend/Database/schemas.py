from pydantic import BaseModel


class SecteurCreate(BaseModel):
    name_secteur: str


class Secteur(SecteurCreate):
    id_secteur: int

    class Config:
        orm_mode = True


class StationCreate(BaseModel):
    id_secteur: int
    name_station: str
    capa_max: int


class Station(BaseModel):
    id_secteur: int
    name_station: str
    id_station: int
    capa_max: int

    class Config:
        orm_mod = True
