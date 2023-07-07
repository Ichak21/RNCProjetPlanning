from sqlalchemy.orm import Session
import Database.models as models
from Database.database import SessionLocal
from fastapi import status, HTTPException, Depends
import Database.schemas as schemas
from sqlalchemy.orm import Session
from datetime import date
from . import models, schemas


class Handler:
    model: models
    session: Session

    def __init__(self, session: Session, model: models):
        self.model = model
        self.session = session

    def create(self, model_loaded):
        # Ajouter une nouvelle entrée dans la table de base
        self.session.add(model_loaded)
        self.session.commit()
        self.session.refresh(model_loaded)
        return model_loaded

    def readAll(self):
        # Obtenir toutes les entrées de la table
        listItem = self.session.query(self.model).all()
        return listItem

    def read(self, id: int):
        # Obtenir l'élément de la table
        item = self.session.query(self.model).get(id)

        # Vérifier si l'élément avec l'ID donné existe. Sinon, générer une exception et renvoyer une réponse 404 not found
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'ID {id} n'a pas été trouvé dans la table {self.model.__tablename__}")

        return item

    def delete(self, id: int):
        # Obtenir l'élément avec l'ID donné
        item = self.session.query(self.model).get(id)

        # Si l'élément avec l'ID donné existe, le supprimer de la base de données. Sinon, générer une erreur 404
        if item:
            self.session.delete(item)
            self.session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément avec l'ID {item} n'a pas été trouvé")

        return item


class SecteurHandler(Handler):
    def create(self, secteur: schemas.SecteurCreate):
        # Créer une nouvelle entrée pour le secteur
        newSecteur = self.model(name_secteur=secteur.name_secteur)
        return super().create(newSecteur)

    def update(self, id_secteur: int, name_secteur: str):
        # Obtenir l'élément du secteur avec l'ID donné
        secteur = self.session.query(self.model).get(id_secteur)

        # Mettre à jour l'élément du secteur avec la tâche donnée (si un élément avec l'ID donné a été trouvé)
        if secteur:
            secteur.name_secteur = name_secteur
            self.session.commit()

        # Vérifier si l'élément du secteur avec l'ID donné existe. Sinon, générer une exception et renvoyer une réponse 404 not found
        if not secteur:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément du secteur avec l'ID {id_secteur} n'a pas été trouvé")

        return secteur

    def delete(self, id_secteur: int, force: bool = False):
        # Vérifier les clés étrangères (si FORCE = True --> suppression en cascade)
        # -> Table station ?
        return super().delete(id_secteur)


class StationHandler(Handler):
    def create(self, station: schemas.StationCreate):
        try:
            # Créer une nouvelle entrée pour la station
            newStation = self.model(name_station=station.name_station,
                                    capa_max=station.capa_max, id_secteur=station.id_secteur)
            return super().create(newStation)
        except:
            raise HTTPException(
                status_code=status.HTTP_418_IM_A_TEAPOT, detail=f"Aucun secteur avec l'ID {station.id_secteur} dans la table secteur !")

    def update(self, id_station: int, name_station: str, capa_max: int, id_secteur: int):
        # Obtenir l'élément de la station avec l'ID donné
        station = self.session.query(self.model).get(id_station)

        # Mettre à jour l'élément de la station avec les valeurs données (si un élément avec l'ID donné a été trouvé)
        if station:
            # Vérifier si la clé étrangère existe
            secteur_handler = SecteurHandler(
                session=self.session, model=models.Secteur)
            if secteur_handler.read(id_secteur):
                station.name_station = name_station
                station.capa_max = capa_max
                station.id_secteur = id_secteur
                self.session.commit()
            else:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément du secteur avec l'ID {id_secteur} n'a pas été trouvé")
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément de la station avec l'ID {id_station} n'a pas été trouvé")

        return secteur_handler


class ShiftHandler(Handler):
    def create(self, shift: schemas.ShiftCreate):
        newShift = self.model(name_shift=shift.name_shift,
                              id_user=shift.id_user)
        return super().create(newShift)

    def update(self, id_shift: int, name_shift: str, id_user: int):
        shift = self.session.query(self.model).get(id_shift)

        if shift:
            shift.name_shift = name_shift
            shift.id_user = id_user
            self.session.commit()

        if not shift:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément du shift avec l'ID {id_shift} n'a pas été trouvé")

        return shift


class KeHandler(Handler):
    def create(self, ke: schemas.KeCreate):
        newKe = self.model(date_ke=ke.date_ke, ke=ke.ke,
                           target_ke=ke.target_ke)
        return super().create(newKe)

    def update(self, id_ke: int, date_ke: date, ke: int, target_ke: int):
        ke = self.session.query(self.model).get(id_ke)

        if ke:
            ke.date_ke = date_ke
            ke.ke = ke
            ke.target_ke = target_ke
            self.session.commit()

        if not ke:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément du ke avec l'ID {dateke} n'a pas été trouvé")

        return ke


class QtyHandler(Handler):
    def create(self, qty: schemas.QtyCreate):
        newQty = self.model(date_qty=qty.date_qty, qty=qty.qty,
                            target_qty=qty.target_qty)
        return super().create(newQty)

    def update(self, id_qty: int, date_qty: date, qty: int, target_qty: int):
        qty = self.session.query(self.model).get(id_qty)

        if qty:
            qty.date_qty = date_qty
            qty.qty = qty
            qty.target_qty = target_qty
            self.session.commit()

        if not qty:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément du qty avec l'ID {dateqty} n'a pas été trouvé")

        return qty


class UserHandler(Handler):
    def create(self, user: schemas.UserCreate):
        new_user = self.model(
            id_card=user.id_card,
            login=user.login,
            password=user.password,
            start_date=user.start_date,
            end_date=user.end_date
        )
        return super().create(new_user)

    def update(self, id_user: int, id_card: str, login: str, password: str, start_date: date, end_date: date):
        user = self.session.query(self.model).get(id_user)

        if user:
            user.id_card = id_card
            user.login = login
            user.password = password
            user.start_date = start_date
            user.end_date = end_date
            self.session.commit()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément de l'utilisateur avec l'ID {id_user} n'a pas été trouvé")

        return user


class OperateurHandler(Handler):
    def create(self, operateur: schemas.OperateurCreate):
        new_operateur = self.model(
            id_card=operateur.id_card,
            name_operateur=operateur.name_operateur,
            id_shift=operateur.id_shift,
            home_station=operateur.home_station,
            start_date=operateur.start_date,
            end_date=operateur.end_date,
            isTemp=operateur.isTemp,
            active_status=operateur.active_status
        )
        return super().create(new_operateur)

    def update(self, id_operateur: int, id_card: int, name_operateur: str, id_shift: int, home_station: int,
               start_date: date, end_date: date, isTemp: bool, active_status: bool):
        operateur = self.session.query(self.model).get(id_operateur)

        if operateur:
            operateur.id_card = id_card
            operateur.name_operateur = name_operateur
            operateur.id_shift = id_shift
            operateur.home_station = home_station
            operateur.start_date = start_date
            operateur.end_date = end_date
            operateur.isTemp = isTemp
            operateur.active_status = active_status
            self.session.commit()

        if not operateur:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément de l'opérateur avec l'ID {id_operateur} n'a pas été trouvé")

        return operateur


class CompetenceHandler(Handler):
    def create(self, competence: schemas.CompetenceCreate):
        new_competence = self.model(
            id_station=competence.id_station,
            level_competence=competence.level_competence,
            last_assesement=competence.last_assesement,
            id_operateur=competence.id_operateur
        )
        return super().create(new_competence)

    def update(self, id_competence: int, id_station: int, level_competence: int, last_assesement: date, id_operateur: int):
        competence = self.session.query(self.model).get(id_competence)

        if competence:
            competence.id_station = id_station
            competence.level_competence = level_competence
            competence.last_assesement = last_assesement
            competence.id_operateur = id_operateur
            self.session.commit()

        if not competence:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"L'élément de compétence avec l'ID {id_competence} n'a pas été trouvé")

        return competence


class SoftCompetenceHandler(Handler):
    def create(self, soft_competence: schemas.SoftCompetenceCreate):
        new_soft_competence = self.model(
            id_station=soft_competence.id_station,
            level_competence=soft_competence.level_competence,
            last_assesement=soft_competence.last_assesement,
            id_operateur=soft_competence.id_operateur
        )
        return super().create(new_soft_competence)

    def update(self, id_soft_competence: int, id_station: int, level_competence: int, last_assesement: date,
               id_operateur: int):
        soft_competence = self.session.query(
            self.model).get(id_soft_competence)

        if soft_competence:
            soft_competence.id_station = id_station
            soft_competence.level_competence = level_competence
            soft_competence.last_assesement = last_assesement
            soft_competence.id_operateur = id_operateur
            self.session.commit()

        if not soft_competence:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"L'élément de compétence soft avec l'ID {id_soft_competence} n'a pas été trouvé")

        return soft_competence


class PlanningHandler(Handler):
    def create(self, planning: schemas.PlanningCreate):
        new_planning = self.model(
            id_operateur=planning.id_operateur,
            id_user=planning.id_user,
            id_shift=planning.id_shift,
            id_station=planning.id_station,
            date=planning.date,
            week=planning.week,
            day=planning.day
        )
        return super().create(new_planning)

    def update(self, id_planning: int, id_operateur: int, id_user: int, id_shift: int, id_station: int, date: date,
               week: int, day: int):
        planning = self.session.query(self.model).get(id_planning)

        if planning:
            planning.id_operateur = id_operateur
            planning.id_user = id_user
            planning.id_shift = id_shift
            planning.id_station = id_station
            planning.date = date
            planning.week = week
            planning.day = day
            self.session.commit()

        if not planning:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"L'élément du planning avec l'ID {id_planning} n'a pas été trouvé")

        return planning
