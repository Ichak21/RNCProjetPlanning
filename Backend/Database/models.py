from sqlalchemy import Column, Integer, String, ForeignKey, Date, Boolean
from Database.database import Base

# Table de description des secteur de travails


class Secteur(Base):
    __tablename__ = "secteur"
    id_secteur = Column(Integer, primary_key=True)
    name_secteur = Column(String(50), nullable=False)


class Station(Base):
    __tablename__ = "station"
    id_station = Column(Integer, primary_key=True)
    name_station = Column(String(50), nullable=False)
    capa_max = Column(Integer, nullable=False)
    id_secteur = Column(Integer, ForeignKey(
        "secteur.id_secteur"), nullable=False)


# Table de description des Organisationa
class Shift(Base):
    __tablename__ = "shift"
    id_shift = Column(Integer, primary_key=True)
    name_shift = Column(String(20), nullable=False)
    id_user = Column(Integer, ForeignKey("user.id_user"), nullable=False)


class User(Base):
    __tablename__ = "user"
    id_user = Column(Integer, primary_key=True)
    id_card = Column(String(12))
    login = Column(String(20), nullable=False)
    password = Column(String(20), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)


class Operateur(Base):
    __tablename__ = "operateur"
    id_operateur = Column(Integer, primary_key=True)
    id_card = Column(Integer, nullable=False)
    name_operateur = Column(String(70), nullable=False)
    id_shift = Column(Integer, ForeignKey("shift.id_shift"), nullable=False)
    home_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    isTemp = Column(Boolean, nullable=False)
    active_status = Column(Boolean, nullable=False)


# Table de description des competence
class Competence(Base):
    __tablename__ = "competence"
    id = Column(Integer, primary_key=True)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    level_competence = Column(Integer, nullable=False)
    last_assesement = Column(Date, nullable=False)
    id_operateur = Column(Integer, ForeignKey(
        "operateur.id_operateur"), nullable=False)


class SoftCompetence(Base):
    __tablename__ = "softcompetence"
    id = Column(Integer, primary_key=True)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    level_competence = Column(Integer, nullable=False)
    last_assesement = Column(Date, nullable=False)
    id_operateur = Column(Integer, ForeignKey(
        "operateur.id_operateur"), nullable=False)


# Table de fait
class Planning(Base):
    __tablename__ = "planning"
    id = Column(Integer, primary_key=True)
    id_operateur = Column(Integer, ForeignKey(
        "operateur.id_operateur"), nullable=False)
    id_user = Column(Integer, ForeignKey("user.id_user"), nullable=False)
    id_shift = Column(Integer, ForeignKey("shift.id_shift"), nullable=False)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    date = Column(Date, nullable=False)
    week = Column(Integer, nullable=False)
    day = Column(Integer, nullable=False)
