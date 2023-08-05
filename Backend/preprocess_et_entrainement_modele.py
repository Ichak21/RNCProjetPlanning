# tourne en environ 10 secondes
import pandas as pd 
import numpy as np
from unidecode import unidecode
from Database.handlers import *
from Database.database import SessionLocal
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import precision_score, recall_score, f1_score
from joblib import dump, load

ke_handler = KeHandler(session=SessionLocal(), model=models.Ke)
ke_list = ke_handler.readAll()
ke_dict_list = [
    {
        'date_ke': item.date_ke,
        'ke': item.ke,
        'target_ke': item.target_ke
    }
    for item in ke_list
]

kedf = pd.DataFrame(ke_dict_list)

qty_handler = QtyHandler(session=SessionLocal(), model=models.Qty)
qty_list = qty_handler.readAll()
qty_dict_list = [
    {
        'date_qty': item.date_qty,
        'qty': item.qty,
        'target_qty': item.target_qty
    }
    for item in qty_list
]

qtydf = pd.DataFrame(qty_dict_list)

# creation QTYKPI
QTYKPI = qtydf
QTYKPI = QTYKPI.rename(columns={'date_qty':'Day','qty':'Value','target_qty':'Target'})
QTYKPI.Value = QTYKPI.Value.replace(',','.', regex=True)
QTYKPI.Value = QTYKPI.Value.astype('float')
for row in QTYKPI.iterrows():
    QTYKPI.loc[QTYKPI.Value >= QTYKPI.Target, 'target_met'] = 1
    QTYKPI.loc[QTYKPI.Value < QTYKPI.Target, 'target_met'] = 0
# creation KEKPI
KEKPI = kedf
KEKPI = KEKPI.rename(columns={'date_ke':'Day','ke':'Value','target_ke':'Target'})
KEKPI.Value = KEKPI.Value.replace(',','.', regex=True)
KEKPI.Value = KEKPI.Value.astype('float')
for row in KEKPI.iterrows():
    KEKPI.loc[KEKPI.Value >= KEKPI.Target, 'target_met'] = 1
    KEKPI.loc[KEKPI.Value < KEKPI.Target, 'target_met'] = 0
# merge QTY et KEKPI
merged_df = KEKPI.merge(QTYKPI, on='Day', how='outer')
merged_df = merged_df.rename(columns={'Value_x':'KE_value','Target_x':'KE_target','target_met_x':'KE_target_met','Value_y':'QTY_value','Target_y':'QTY_target','target_met_y':'QTY_target_met'})
merged_df['NewDay'] = pd.to_datetime(merged_df['Day'])
merged_df.drop('Day',axis=1,inplace=True)
merged_df = merged_df.sort_values('NewDay')
merged_df.NewDay = merged_df.NewDay - pd.offsets.Day(1)
merged_df.to_csv('./dataframes/KEQTYKPI_last_periods.csv',sep=';',index=False)

Operateur = OperateurHandler(session=SessionLocal(), model=models.Operateur)
Operateur_list = Operateur.readAll()
operateur_columns = [column.name for column in models.Operateur.__table__.columns]
dict_list = [dict(zip(operateur_columns, [getattr(item, column) for column in operateur_columns])) for item in Operateur_list]
operateur_df = pd.DataFrame(dict_list)
# liste des opérateurs
liste_operateurs = operateur_df[['id_operateur','name_operateur','active_status']]
list_to_replace = ['M\. ', 'M\.', 'M; ', 'Mme\. ', 'Mme\.', 'Mme ', 'Mme', 'Mlle\. ', 'Mlle ']
liste_operateurs.name_operateur.replace(list_to_replace, '',inplace=True, regex=True)
for value in liste_operateurs.name_operateur.values:
    liste_operateurs.name_operateur.replace(value,unidecode(value).upper(), inplace=True)
liste_operateurs = liste_operateurs.rename(columns={'name_operateur':'Operator Name'})
liste_operateurs.to_csv('./dataframes/liste_operateurs.csv', sep=';', index=False)

# liste des présents
liste_presents_semaine = liste_operateurs.loc[liste_operateurs.active_status==True][['id_operateur','Operator Name','active_status']]
liste_presents_semaine.to_csv('./dataframes/liste_presents_semaine.csv', sep=';', index=False)

station = StationHandler(session=SessionLocal(), model=models.Station)
station_list = station.readAll()

station_dict_list = [
    {
        'id_station': item.id_station,
        'name_station': item.name_station,
        'capa_max': item.capa_max,
    }
    for item in station_list if item.id_secteur == 2
]

stationdf = pd.DataFrame(station_dict_list)
stationdf_conversion_dict_str_contains = {
    'EQF3' : '407_EQF3',
    'EQF4' : '408_EQF4',
    'Habillage' : '403_PREHENSEUR',
    '510' : '412_EMBALLAGE',
    'Controle Final' : '411_CONTROLE_FINAL',
    'Contrôle Final' : '411_CONTROLE_FINAL',
    'Controle HT' : '402_CONTROLE_HT',
    'Contrôle HT' : '402_CONTROLE_HT',
    'T300' : '409_T300',
    'EQF2' : '406_EQF2',
    'EQF1' : '404_COLLECTEUR_&_BRIDAGE',
    'Controle BT' : '410_CONTROLE_BT',
    'Contrôle BT' : '410_CONTROLE_BT',
    'ContrÙle BT2' : '410_CONTROLE_BT',
    'FIC' : '401_FIC_&_INTERVEROUILLAGE' 
}
for key, value in stationdf_conversion_dict_str_contains.items():
    stationdf.loc[stationdf.name_station.str.contains(key, na=False), 'name_station'] = value
    
competence = CompetenceHandler(session=SessionLocal(), model=models.Competence)
competence_list = competence.readAll()
competence_dict_list = [
    {
        'id_station': item.id_station,
        'level_competence': item.level_competence,
        'last_assesement': item.last_assesement,
        'id_operateur': item.id_operateur
    }
    for item in competence_list 
]

competencedf = pd.DataFrame(competence_dict_list)
df_competence_station = pd.merge(competencedf,stationdf,on='id_station')
personne_niveau = pd.merge(liste_presents_semaine,df_competence_station)
personne_niveau = personne_niveau[['name_station','Operator Name','last_assesement','level_competence','capa_max']].rename(columns={'name_station':'Location','Operator Name':'Operator','level_competence':'poste_niveau','capa_max':'Nb Max'
})            
personne_niveau_secteur2 = personne_niveau
personne_niveau_secteur2.drop_duplicates(subset = ['Location', 'Operator'],inplace=True)
personne_niveau_secteur2.to_csv('./dataframes/personne_niveau_secteur2.csv', sep = ';', index=False)

soft_competence = SoftCompetenceHandler(session=SessionLocal(), model=models.SoftCompetence)
soft_competence_list = soft_competence.readAll()

soft_competence_dict_list = [
    {
        'id_station': item.id_station,
        'level_competence': item.level_competence,
        'last_assesement': item.last_assesement,
        'id_operateur': item.id_operateur
    }
    for item in soft_competence_list 
]
soft_competencedf = pd.DataFrame(soft_competence_dict_list)
station_soft_competence = StationHandler(session=SessionLocal(), model=models.Station)
station_soft_competence_list = station_soft_competence.readAll()
station_soft_competence_dict_list = [
    {
        'id_station': item.id_station,
        'name_station': item.name_station,
        'capa_max': item.capa_max,
    }
    for item in station_soft_competence_list if item.id_station in (52,65)
]
station_soft_competencedf = pd.DataFrame(station_soft_competence_dict_list)
df_soft_competence_station = pd.merge(soft_competencedf,station_soft_competencedf,on='id_station')
personne_soft_skills = pd.merge(liste_presents_semaine,df_soft_competence_station)
personne_soft_skills = personne_soft_skills[['name_station','Operator Name','last_assesement','level_competence']].rename(columns={'name_station':'Location','Operator Name':'Operator','level_competence':'poste_niveau'})
personne_soft_skills = personne_soft_skills.loc[personne_soft_skills['poste_niveau'] == 1]
for row in personne_soft_skills.iterrows():
    personne_soft_skills.loc[personne_soft_skills['Location'] == 'Secouriste', 'SST'] = 1
    personne_soft_skills.loc[personne_soft_skills['Location'] == 'Secouriste', 'last_assesement_SST'] = personne_soft_skills['last_assesement']
    personne_soft_skills.loc[personne_soft_skills['Location'] == 'Leader 5S', 'Leader 5S'] = 1
    personne_soft_skills.loc[personne_soft_skills['Location'] == 'Leader 5S', 'last_assesement_Leader 5S'] = personne_soft_skills['last_assesement']
personne_soft_skills.last_assesement_SST = personne_soft_skills.last_assesement_SST.fillna(pd.to_datetime('1900-01-01'))
personne_soft_skills['last_assesement_Leader 5S'] = personne_soft_skills['last_assesement_Leader 5S'].fillna(pd.to_datetime('1900-01-01'))
for operator in personne_soft_skills.Operator.unique():
        personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'SST'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'SST'].max()
        personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Leader 5S'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Leader 5S'].max()        
        personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'last_assesement_SST'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'last_assesement_SST'].max()
        personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'last_assesement_Leader 5S'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'last_assesement_Leader 5S'].max()            
personne_soft_skills = personne_soft_skills.rename(columns={'Leader 5S' : '5S'})
personne_soft_skills.drop(['last_assesement','Location','poste_niveau'], axis=1,inplace=True)
personne_soft_skills.drop_duplicates(inplace=True) 
personne_soft_skills.iloc[:,1] = personne_soft_skills.iloc[:,1].fillna(0)
personne_soft_skills.iloc[:,3] = personne_soft_skills.iloc[:,3].fillna(0)
personne_soft_skills.to_csv('./dataframes/personne_soft_skills.csv', sep = ';', index=False)

personne_niveau = personne_niveau_secteur2
personne_niveau = personne_niveau.merge(personne_soft_skills,how='left',on='Operator')
personne_niveau.iloc[:,-2] = personne_niveau.iloc[:,-2].fillna(0)
personne_niveau.iloc[:,-4] = personne_niveau.iloc[:,-4].fillna(0)
personne_niveau.to_csv('./dataframes/personne_niveau_secteur2_new.csv', sep = ';', index=False)

Planning = PlanningHandler(session=SessionLocal(), model=models.Planning)
Planning_list = Planning.readAll()
Planning_dict_list = [
    {
        'id_station': item.id_station,
        'Equipe': item.id_shift,
        'Date': item.date,
        'id_operateur': item.id_operateur
    }
    for item in Planning_list 
]

Planningdf = pd.DataFrame(Planning_dict_list)
Planningdf = pd.merge(Planningdf,liste_operateurs)
Planningdf = pd.merge(Planningdf,stationdf).drop(['id_station','id_operateur','active_status','capa_max'], axis=1)
Planningdf = Planningdf.rename(columns={'Operator Name':'Personnes','name_station':'Station'})
equipes_df = Planningdf
equipes_df = equipes_df.loc[~equipes_df['Station'].isin(['XX_MALADIE','XX_PRET','XX_DELEGATION','XX_FORMATION_EXT','XX_CONGES'])]
equipes_df['NewDay'] = pd.to_datetime(equipes_df['Date'])
mergissime = merged_df.merge(equipes_df)
mergissime.drop('NewDay',axis=1,inplace=True)
mergissime.to_csv('./dataframes/mergeKEQTYKPI_EQUIPES.csv', sep=';', index=False)

df = pd.read_csv("./dataframes/mergeKEQTYKPI_EQUIPES.csv", sep=';')
train_df = df[['Date','QTY_target','QTY_target_met','KE_target','KE_target_met','Equipe','Station','Personnes']]
#transcodification des noms operateurs en int
liste_operateurs = pd.read_csv('./dataframes/liste_presents_semaine.csv',sep=';')
operators_names = train_df.Personnes.unique()
for operator in liste_operateurs['Operator Name'].unique():
    if operator not in operators_names:
        operators_names = np.append(operator,operators_names)
i = 10000
operators = []
for operateur in range(len(operators_names)):
    i +=1
    operators.append(i)
transco = pd.DataFrame({'operators_number':operators,'operators_names':operators_names})
transco.to_csv('./dataframes/transco_operateurs_names_numbers.csv', sep=';',index=False)
train_df = train_df.merge(transco,how='left',left_on='Personnes',right_on='operators_names')
train_df.drop('operators_names',axis=1, inplace=True)
#train_df = train_df.dropna()
train_dict_df = train_df.copy()
personnes_shift_station_new_inverse = {}
date_shift = {}
for station in train_dict_df.Station.unique():
    for date in train_dict_df['Date'].unique():
        for shift in train_dict_df['Equipe'].unique():
                date_shift[(date,shift)]=train_dict_df.loc[(train_dict_df['Equipe'] == shift) & (train_dict_df['Date'] == date) & (train_dict_df['Station'] == station)]['operators_number'].values
                personnes_shift_station_new_inverse[station] = date_shift.copy()    
# ajout de 0 pour que chaque poste soit un array de 6 valeurs (nb max d'opérateurs sur un seul
# poste historiquement)
for keys, values in personnes_shift_station_new_inverse.items():
    for key, value in values.items():
        personnes_shift_station_new_inverse[keys][key] = np.append(value, np.zeros(10-len(value)))
df_from_dict = pd.DataFrame(data=personnes_shift_station_new_inverse)
df_from_dict = df_from_dict.reset_index()# si je veux avoir un index pas double
df_from_dict = df_from_dict.rename(columns={'level_0':'Date','level_1':'Equipe'})
single_date_shift_df = train_df.drop_duplicates(['Date','Equipe'])


def format_target(cell):
    return np.append(cell,np.zeros(9))

##### Pas de T300 donc ça décale
final_df_from_dict = df_from_dict.merge(single_date_shift_df, how='left',on=['Date','Equipe'])
final_df_from_dict_qty = final_df_from_dict.loc[~final_df_from_dict['QTY_target'].isna()]
final_df_from_dict_qty.iloc[:,12:13] = final_df_from_dict_qty.iloc[:,12:13].applymap(format_target)

final_df_from_dict_ke = final_df_from_dict.loc[~final_df_from_dict['KE_target'].isna()]
final_df_from_dict_ke.iloc[:,14:15] = final_df_from_dict_ke.iloc[:,14:15].applymap(format_target)
final_df_from_dict_qty.to_csv('./dataframes/prepro_ml_final_df_from_dict_qty.csv', sep=';',index=False)
final_df_from_dict_ke.to_csv('./dataframes/prepro_ml_final_df_from_dict_KE.csv', sep=';',index=False)


##################         entraînement modèle        ##############################

X=final_df_from_dict_qty.drop(['Date','QTY_target_met','KE_target','KE_target_met','Equipe','Station','Personnes','operators_number'],axis=1).values
X_flat = np.array(X.tolist(), dtype=int)
X_flat = X_flat.reshape(X.shape[0], -1)
y=final_df_from_dict_qty.QTY_target_met.values

# from sklearn.model_selection import train_test_split
# X_train,X_test,y_train,y_test = train_test_split(X_flat,y,train_size=0.8,random_state=42)


RFC = RandomForestClassifier(max_depth=8, n_estimators= 10)
RFC.fit(X_flat,y)
predicted = RFC.predict(X_flat)
precision = precision_score(y, predicted)
recall = recall_score(y, predicted)
f1 = f1_score(y, predicted)

X_KE=final_df_from_dict_ke.drop(['Date','QTY_target_met','QTY_target','KE_target_met','Equipe','Station','Personnes','operators_number'],axis=1).values
X_KE_flat = np.array(X_KE.tolist(), dtype=int)
X_KE_flat = X_KE_flat.reshape(X_KE.shape[0], -1)
y_KE = final_df_from_dict_ke.KE_target_met.values
# X_train_KE,X_test_KE,y_train_KE,y_test_KE = train_test_split(X_KE_flat,y_KE,train_size=0.8,random_state=42)
RFC_ke = RandomForestClassifier(max_depth=8, n_estimators= 10)
RFC_ke.fit(X_KE_flat,y_KE)
predicted_KE = RFC_ke.predict(X_KE_flat)
precision_KE = precision_score(y_KE, predicted_KE)
recall_KE = recall_score(y_KE, predicted_KE)
f1_KE = f1_score(y_KE, predicted_KE)
newmetric1 = precision
newmetric2 = recall
newmetric3 = f1
newmetric1_KE = precision_KE
newmetric2_KE = recall_KE
newmetric3_KE = f1_KE
# old_metrics_qty = pd.DataFrame({'metric1':[newmetric1],'metric2':[newmetric2],'metric3':[newmetric3]})
# old_metrics_ke = pd.DataFrame({'metric1':[newmetric1_KE],'metric2':[newmetric2_KE],'metric3':[newmetric3_KE]})
# old_metrics_qty.to_csv('./dataframes/metrics_qty.csv',sep=';', index=False)
# old_metrics_ke.to_csv('./dataframes/metrics_ke.csv',sep=';', index=False)
old_metrics_qty = pd.read_csv('./dataframes/metrics_qty.csv',sep=';')
old_metrics_ke = pd.read_csv('./dataframes/metrics_ke.csv',sep=';')
if ((newmetric1 >= old_metrics_qty.metric1.values) and (newmetric2 >= old_metrics_qty.metric2.values) and (newmetric3 >= old_metrics_qty.metric3.values)):
    dump(RFC, './models/RFC.joblib')
    old_metrics_qty['metric1'] = newmetric1
    old_metrics_qty['metric2'] = newmetric2
    old_metrics_qty['metric3'] = newmetric3
    old_metrics_qty.to_csv('./dataframes/metrics_qty.csv',sep=';',index=False)
if ((newmetric1_KE >= old_metrics_ke.metric1.values) & (newmetric2_KE >= old_metrics_ke.metric2.values) & (newmetric3_KE >= old_metrics_ke.metric3.values)):
    dump(RFC_ke, './models/RFC_KE.joblib')
    old_metrics_ke['metric1'] = newmetric1_KE
    old_metrics_ke['metric2'] = newmetric2_KE
    old_metrics_ke['metric3'] = newmetric3_KE
    old_metrics_ke.to_csv('./dataframes/metrics_ke.csv',sep=';',index=False)
print("Entraînement du modèle terminé")