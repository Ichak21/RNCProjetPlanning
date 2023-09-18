import sys
import os
Database = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(Database))
from Database.handlers import *
from Database.database import SessionLocal
from model_magic_fulfill_et_ml_prod import *
from unittest.mock import MagicMock
import pytest
import pandas as pd
import numpy as np
from joblib import load
import random


def test_team_length():
    team_1 = model(90)[0]
    team_2 = model(100)[0]
    
    assert len(team_1) <= len(team_2)
    
def test_team_type():
    team = model(90)[0]
    assert type(team) is dict
    
def test_SST_ONJOB():
    team = model(90)
    assert type(SST_ONJOB) is bool
        
def test_always_SST_in_team():
    teams = []
    #true_only_teams = [1,1,1,1,1,1,1,1,1,1]
    for i in range (10):
        team = model(90)[1]
        assert team 
        # teams.append(team)
    # assert teams == true_only_teams

def test_proba_entre_0_et_1():
    team = model(100) 
    proba = RFC.predict_proba(X_prepro_flat_qty)[0][1]
    assert 0 <= proba <= 1
    
def test_operateur_niv_1_pas_tout_seul(): #ou pas sans tuteur, tester si ça marche à tous les coups :
    postes_operateurs = model(90)[0]
    posts_names = []
    for key, value in postes_operateurs.items():
        if value[1][0] == 1:  # si on trouve un opérateur de niveau 1, on retient son poste général
            post_name = key.rsplit('_', 1)[0]
            posts_names.append(post_name)
    posts_levels = {}
    post_levels = []
    for post in posts_names:  # pour chaque poste général contenant un niveau 1, on retient le niveau des autres opérateurs sur le poste       
        for key,value in postes_operateurs.items():
            if (key.rsplit('_', 1)[0] == post) and (value[1][0] != 1):
                post_levels.append(value[1][0])
                posts_levels[post] = post_levels
        post_levels = []
    if len(posts_names) != 0:
        for value in posts_levels.values():
            assert len(value) != 0   # pour chaque poste avec niveau 1, il n'est pas tout seul 
    else:
        assert len(posts_levels) == 0 # aucun opérateur de niveau 1 dans l'équipe
        
def test_operateur_niv_1_pas_sans_tuteur():
    postes_operateurs = model(90)[0]
    posts_names = []
    for key, value in postes_operateurs.items():
        if value[1][0] == 1:  # si on trouve un opérateur de niveau 1, on retient son poste général
            post_name = key.rsplit('_', 1)[0]
            posts_names.append(post_name)
    posts_levels = {}
    post_levels = []
    for post in posts_names:  # pour chaque poste général contenant un niveau 1, on retient le niveau des autres opérateurs sur le poste       
        for key,value in postes_operateurs.items():
            if (key.rsplit('_', 1)[0] == post) and (value[1][0] != 1):
                post_levels.append(value[1][0])
                posts_levels[post] = post_levels
        post_levels = []
    if len(posts_names) != 0:
        for value in posts_levels.values():
            assert (3 in value or 4 in value)   # pour chaque poste avec niveau 1, il y a un tuteur niveau 3 ou 4 
    else:
        assert len(posts_levels) == 0 # aucun opérateur de niveau 1 dans l'équipe
            
    




