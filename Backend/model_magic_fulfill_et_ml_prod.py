# tourne en environ 5 secondes
import pandas as pd
import numpy as np
from joblib import load
import random

# Il faut feed en entrée la quantité à produire
quantite_a_produire = 90

dtc_qty = load('./models/dtc.joblib')
dtc_ke = load('./models/dtc_KE.joblib')
# lr_clf_qty = load('./models/lr_clf_qty.joblib')
# lr_clf_ke = load('./models/lr_clf_ke.joblib')
# SVM_QTY = load('./models/SVM_QTY.joblib')
# SVM_KE = load('./models/SVM_KE.joblib')
# GBC_QTY = load('./models/GBCLF_QTY.joblib')
# GBC_KE = load('./models/GBCLF_KE.joblib')
RFC = load('./models/RFC.joblib') 
RFC_KE = load('./models/RFC_KE.joblib') 

# import tensorflow as tf
# model_lstm_qty = tf.keras.models.Sequential([
#     tf.keras.layers.LSTM(12),
#     tf.keras.layers.Dense(1, activation='sigmoid')
# ])
# model_lstm_qty.load_weights('model_lstm')
# model_lstm_ke = tf.keras.models.Sequential([
#     tf.keras.layers.LSTM(12),
#     tf.keras.layers.Dense(1, activation='sigmoid')
# ])
# model_lstm_ke.load_weights('model_lstm_KE')


df = pd.read_csv('./dataframes/mergeKEQTYKPI_EQUIPES.csv', sep=';')
liste_operateurs = pd.read_csv('./dataframes/liste_presents_semaine.csv',sep=';')
liste_operateurs = liste_operateurs['Operator Name'].values
personne_niveau = pd.read_csv('./dataframes/personne_niveau_secteur2_new.csv', sep=';')

#pour le moment, on simule la colonne SST pas encore dans personne_niveau
SST_positions = []
for i in range (len(personne_niveau)):
    SST_positions.append(np.random.randint(3))
for i in range(len(SST_positions)):
    if SST_positions[i] == 0 or SST_positions[i] == 2:
        SST_positions[i] = False
    else:
        SST_positions[i] = True
personne_niveau['SST'] = SST_positions
personne_niveau.loc[personne_niveau['SST'] == 1, 'SST'] = True
#########


def model(quantite_a_produire:int = 0):

    df_filtre = df.loc[(df['QTY_target']==quantite_a_produire) & (df['QTY_target_met'] == 1)]
    # si on a des KE_target_met, rajouter :
    # df_filtre.loc[df_filtre['KE_target_met']==1]


    for value in df_filtre.Station.unique():
        df_filtre.loc[df_filtre['Station'] == value, value ] = 1
    df_filtre.iloc[:,-6:] = df_filtre.iloc[:,-6:].fillna(0)   

    postes_operateurs_nombre = {}
    for station in df_filtre.Station.unique():
        postes_operateurs_nombre[station] = df_filtre.groupby(['Date','Equipe']).sum().mode().head(1)[station].values[0]  

    postes_operateurs = {}
    i=0
    for key, value in postes_operateurs_nombre.items():
        i=int(value)
        for j in range(int(i)):
            postes_operateurs[key+'_'+str(j+1)] = ''


    liste_operateurs_shuffle = np.copy(liste_operateurs)
    random.shuffle(liste_operateurs_shuffle)
    operateurs_restants = len(liste_operateurs_shuffle)+1
    operateurs_restants_disponibles = operateurs_restants
    nom_general_de_poste = ''
    ancien_nom_general_de_poste = nom_general_de_poste
    SST_ONJOB = False
    i=0
    for poste, nom_operateur in postes_operateurs.items():
        i+=1
        operateurs_restants-=1
        nom_general_de_poste = poste[:-2]
        for operateur in liste_operateurs_shuffle:
            if operateur in personne_niveau.Operator.values:
                if ((personne_niveau.loc[personne_niveau['Location'] == poste[:-2]]['Nb Max'].head(1).values == 1) or (nom_general_de_poste != ancien_nom_general_de_poste)):
                    if not (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] > 1).empty:
                        if (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] > 1).values:
                            postes_operateurs[poste] = [operateur,personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])][['poste_niveau','SST','5S']].values[0]]
                            if personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['SST'].values == True:
                                SST_ONJOB = True
                            operator_to_remove = np.where(liste_operateurs_shuffle==operateur)[0]
                            liste_operateurs_shuffle = np.delete(liste_operateurs_shuffle,operator_to_remove)
                            operateurs_restants_disponibles = operateurs_restants -1
                            break
                else:
                    if not (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] >= 1).empty:
                        if (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] >= 1).values:
                            postes_operateurs[poste] = [operateur,personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])][['poste_niveau','SST','5S']].values[0]]
                            if personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['SST'].values == True:
                                SST_ONJOB = True
                            operator_to_remove = np.where(liste_operateurs_shuffle==operateur)[0]
                            liste_operateurs_shuffle = np.delete(liste_operateurs_shuffle,operator_to_remove)
                            operateurs_restants_disponibles = operateurs_restants -1
                            break
        if operateurs_restants_disponibles == operateurs_restants:
            postes_operateurs[poste] = ''
            operateurs_restants_disponibles = operateurs_restants -1
        ancien_nom_general_de_poste = nom_general_de_poste
        
    if not SST_ONJOB:
        ancien_nom_general_de_poste = ''
        for poste, nom_operateur in postes_operateurs.items():
            if SST_ONJOB:
                break
            i+=1
            nom_general_de_poste = poste[:-2]
            for operateur in liste_operateurs_shuffle:
                if operateur in personne_niveau.loc[personne_niveau['SST']==True].values:
                    if ((personne_niveau.loc[personne_niveau['Location'] == poste[:-2]]['Nb Max'].head(1).values == 1) or (nom_general_de_poste != ancien_nom_general_de_poste)):
                        if not (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] > 1).empty:
                            if (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] > 1).values:
                                postes_operateurs[poste] = [operateur,personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])][['poste_niveau','SST','5S']].values[0]]
                                SST_ONJOB = True                    
                                operator_to_remove = np.where(liste_operateurs_shuffle==operateur)[0]
                                liste_operateurs_shuffle = np.delete(liste_operateurs_shuffle,operator_to_remove)
                                operateurs_restants_disponibles = operateurs_restants -1
                                break
                    else:
                        if not (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] >= 1).empty:
                            if (personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])]['poste_niveau'] >= 1).values:
                                postes_operateurs[poste] = [operateur,personne_niveau.loc[(personne_niveau['Operator'] == operateur) & (personne_niveau['Location'] == poste[:-2])][['poste_niveau','SST','5S']].values[0]]                        
                                SST_ONJOB = True 
                                operator_to_remove = np.where(liste_operateurs_shuffle==operateur)[0]
                                liste_operateurs_shuffle = np.delete(liste_operateurs_shuffle,operator_to_remove)
                                operateurs_restants_disponibles = operateurs_restants -1
                                break
            ancien_nom_general_de_poste = nom_general_de_poste
        
#string_no_SST = 'pas de SST dans l\'équipe, veuillez mettre à jour la base'
# if not SST_ONJOB:
#     return string_no_SST
# on le fera dans le front, si SST_ONJOB est False, pour que le Team Leader mette à jour les soft skills, ou appelle un gars SST de dispo

    return postes_operateurs, SST_ONJOB

postes_operateurs = model(quantite_a_produire)[0]
SST_ONJOB = model(quantite_a_produire)[1]
#######   preprocess pour passage algo ML ######
df2 = pd.read_csv('./dataframes/prepro_ml_final_df_from_dict_qty.csv', sep=';')
result_dict = {}

# Itération sur chaque clé dans le dictionnaire d'origine
for key in postes_operateurs.keys():
    # Récupération du nom générique du poste (ex: '406_EQF2')
    post_name = key.rsplit('_', 1)[0]
    if post_name in result_dict:
        if postes_operateurs[key]:
            result_dict[post_name].append(postes_operateurs[key][0])
        else:
            result_dict[post_name].append(0)
    else:
        if postes_operateurs[key]:
            result_dict[post_name] = [postes_operateurs[key][0]]
        else:
            result_dict[post_name] = [0]

columns_to_have = df2.iloc[:,2:12].columns
for col in columns_to_have:
    if col not in result_dict.keys():
         result_dict[col] = [0,0,0,0,0,0]
for value in result_dict.values():
    value = value if len(value)==10 else value.extend([0]*(10 - len(value)))

# Création du dataframe à partir du dictionnaire résultant
df_preprocessed = pd.DataFrame.from_dict(result_dict)
df_preprocessed = df_preprocessed[columns_to_have]
df_preprocessed['QTY_target'] = [quantite_a_produire,0,0,0,0,0,0,0,0,0]
df_preprocessed['KE_target'] = [63,0,0,0,0,0,0,0,0,0]
transco = pd.read_csv('./dataframes/transco_operateurs_names_numbers.csv', sep=';')
for col in df_preprocessed.columns:
    df_preprocessed[col] = df_preprocessed[col].replace(transco.set_index('operators_names')['operators_number'])
X_prepro_qty = []
for col in df_preprocessed.columns[:-1]:
    X_prepro_qty = np.append(X_prepro_qty,df_preprocessed[col].values)
X_prepro_flat_qty = X_prepro_qty.reshape(1,-1)
X_prepro_ke = []
for col in df_preprocessed.drop('QTY_target',axis=1).columns:
    X_prepro_ke = np.append(X_prepro_ke,df_preprocessed[col].values)
X_prepro_flat_ke = X_prepro_ke.reshape(1,-1)

#### return prédiction proba meet qty, prédiction proba meet KE, dictionnaires des postes (avec poste, nom opérateur, niveau opérateur/poste, SST et 5S), et présence d'un SST dans l'équipe
print(RFC.predict_proba(X_prepro_flat_qty)[0][1],RFC_KE.predict_proba(X_prepro_flat_ke)[0][1],postes_operateurs,SST_ONJOB)