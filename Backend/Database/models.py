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
    id_user = Column(String, ForeignKey("user.id_card"), nullable=False)


class User(Base):
    __tablename__ = "user"
    id_card = Column(String, primary_key=True)  # id_card
    login = Column(String(20), nullable=False)
    password = Column(String(20), nullable=False)
    start_date = Column(String, nullable=False)
    end_date = Column(String)


class Qty(Base):
    __tablename__ = "qty"
    id_qty = Column(Integer, primary_key=True)
    date_qty = Column(String)
    qty = Column(Integer)
    target_qty = Column(Integer)


class Ke(Base):
    __tablename__ = "ke"
    id_ke = Column(Integer, primary_key=True, autoincrement=True)
    date_ke = Column(String)
    ke = Column(Integer)
    target_ke = Column(Integer)


class Operateur(Base):
    __tablename__ = "operateur"
    # id_operateur = Column(Integer, primary_key=True)
    id_operateur = Column(String(25), primary_key=True)  # id_card
    name_operateur = Column(String(70), nullable=False)
    id_shift = Column(Integer, ForeignKey("shift.id_shift"), nullable=False)
    home_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    start_date = Column(String(10), nullable=False)
    end_date = Column(String(10))
    isTemp = Column(Integer, nullable=False)
    active_status = Column(Integer, nullable=False)


# Table de description des competence
class Competence(Base):
    __tablename__ = "competence"
    id = Column(Integer, primary_key=True)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    level_competence = Column(Integer, nullable=False)
    last_assesement = Column(String, nullable=False)
    id_operateur = Column(String(25), ForeignKey(
        "operateur.id_operateur"), nullable=False)


class SoftCompetence(Base):
    __tablename__ = "softcompetence"
    id = Column(Integer, primary_key=True)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    level_competence = Column(Integer, nullable=False)
    last_assesement = Column(String, nullable=False)
    id_operateur = Column(String, ForeignKey(
        "operateur.id_operateur"), nullable=False)


class Init(Base):
    __tablename__ = "translationTable"
    id = Column(Integer, primary_key=True)
    old_name = Column(String, nullable=False)
    new_name = Column(String, nullable=False)


# Table de fait
class Planning(Base):
    __tablename__ = "planning"
    id = Column(Integer, primary_key=True)
    id_operateur = Column(String, ForeignKey(
        "operateur.id_operateur"), nullable=False)
    id_user = Column(Integer, ForeignKey("user.id_card"), nullable=False)
    id_shift = Column(Integer, ForeignKey("shift.id_shift"), nullable=False)
    id_station = Column(Integer, ForeignKey(
        "station.id_station"), nullable=False)
    date = Column(String, nullable=False)
    week = Column(String, nullable=False)
    day = Column(String, nullable=False)
