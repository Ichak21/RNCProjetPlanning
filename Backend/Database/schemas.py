from pydantic import BaseModel

# Model SecteurCreation


class SecteurCreate(BaseModel):
    name_secteur: str


class Secteur(SecteurCreate):
    id_secteur: int

    class Config:
        orm_mode = True


class StationCreate(BaseModel):
    name_station: str
    capa_max: int
    id_secteur: int


class Station(StationCreate):
    id_station: int

    class Config:
        orm_mod = True
