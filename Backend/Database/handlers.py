from sqlalchemy.orm import Session
import Database.models as models
from fastapi import status, HTTPException, Depends
import Database.schemas as schemas


class Handler():
    model: models
    session: Session

    def __init__(self, session: Session, model: models):
        self.model = model
        self.session = session

    def create(self, model_loaded):

        # Add new entry in base table secteur
        self.session.add(model_loaded)
        self.session.commit()
        self.session.refresh(model_loaded)

        # Return message with new secteur
        return model_loaded

    def readAll(self):

        # Get All Entry From Table
        listItem = self.session.query(self.model).all()
        return listItem

    def read(self, id: int):
        # Get the item from table
        item = self.session.query(self.model).get(id)

        # check if secteur item with given id exists. If not, raise exception and return 404 not found response
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Id {id} is not found in table {self.model.__tablename__}")

        return item


class SecteurHandler(Handler):
    def create(self, secteur: schemas.SecteurCreate):

        # Create new entry for secteur
        newSecteur = self.model(name_secteur=secteur.name_secteur)
        return super().create(newSecteur)

    def update(self, id_secteur: int, name_secteur: str):
        # get the secteur item with the given id
        secteur = self.session.query(self.model).get(id_secteur)

        # update secteur item with the given task (if an item with the given id was found)
        if secteur:
            secteur.name_secteur = name_secteur
            self.session.commit()

        # check if todo item with given id exists. If not, raise exception and return 404 not found response
        if not secteur:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Secteur item with id {id_secteur} not found")

        return secteur

    def delete(self, id_secteur: int):
        # get the todo item with the given id
        secteur = self.session.query(self.model).get(id_secteur)

        # if secteur item with given id exists, delete it from the database. Otherwise raise 404 error
        if secteur:
            self.session.delete(secteur)
            self.session.commit()
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"Secteur item with id {id_secteur} not found")

        return secteur
