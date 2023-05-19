import pandas as pd 
import numpy as np
from unidecode import unidecode

def preprocess():

    # creation QTYKPI
    QTYKPI = pd.read_csv('./KPI/QTYKPI.csv', delimiter = ";")
    QTYKPI = QTYKPI[['KPI_ID','Day_ID','Value','Target']].rename(columns={'Day_ID':'Day'})
    for row in QTYKPI.iterrows():
        QTYKPI.loc[QTYKPI.Value >= QTYKPI.Target, 'target_met'] = 1
        QTYKPI.loc[QTYKPI.Value < QTYKPI.Target, 'target_met'] = 0

    # creation KEKPI
    KEKPI = pd.read_csv('./KPI/KEKPI.csv', delimiter = ";")
    KEKPI.Value = KEKPI.Value.replace(',','.', regex=True)
    KEKPI.Value = KEKPI.Value.astype('float')
    KEKPI = KEKPI[['KPI','Day_ID','Value','Target']].rename(columns={'Day_ID':'Day'})
    for row in KEKPI.iterrows():
        KEKPI.loc[KEKPI.Value >= KEKPI.Target, 'target_met'] = 1
        KEKPI.loc[KEKPI.Value < KEKPI.Target, 'target_met'] = 0

    # merge QTY et KEKPI et création du df des KPI
    merged_df = KEKPI.merge(QTYKPI, on='Day')
    merged_df = merged_df.rename(columns={'KPI':'KE','Value_x':'KE_value','Target_x':'KE_target','target_met_x':'KE_target_met','KPI_ID':'QTY','Value_y':'QTY_value','Target_y':'QTY_target','target_met_y':'QTY_target_met'})
    merged_df = merged_df[['Day','KE','KE_value','KE_target','KE_target_met','QTY','QTY_value','QTY_target','QTY_target_met']]
    merged_df['NewDay'] = pd.to_datetime(merged_df.Day).dt.strftime('%d/%m/%Y')
    merged_df['NewDay'] = pd.to_datetime(merged_df['NewDay'])
    merged_df.drop('Day',axis=1,inplace=True)
    merged_df.NewDay = merged_df.NewDay - pd.offsets.Day(1)
    merged_df.to_csv('./dataframes/KEQTYKPI_last_periods.csv',sep=';',index=False)


    # liste des présents
    # ce sera dans le futur à réupérer depuis les base de données de l'app ? table opérateur
    planning_tool = pd.read_excel('PlanningToolV2_Secteur2.xlsm', sheet_name=0, header=5)
    liste_presents_semaine = planning_tool['Operator Name']
    liste_presents_semaine.to_csv('./dataframes/liste_presents_semaine.csv', sep=';', index=False)

    

    # creation df personne_niveau
    nb_max_par_poste = planning_tool[['Secteur', 'Nbrs Max ']][:11].rename(columns={'Nbrs Max ' : 'Nb Max'})
    personne_niveau = pd.read_excel('./Setup_VERSATILITYOperatorsSkills.xlsx')
    personne_niveau.drop(['C2','C3','C5','C6','C8','C9','C11','C12'], axis=1,inplace=True)
    for row in personne_niveau.iterrows():
        personne_niveau.loc[personne_niveau['C1'] == 1, 'poste_niveau'] = 1
        personne_niveau.loc[personne_niveau['C4'] == 1, 'poste_niveau'] = 2
        personne_niveau.loc[personne_niveau['C7'] == 1, 'poste_niveau'] = 3
        personne_niveau.loc[personne_niveau['C10'] == 1, 'poste_niveau'] = 4    
    personne_niveau.drop(['C1', 'C4', 'C7', 'C10'], axis=1, inplace=True)
    personne_niveau_secteur2 = personne_niveau.loc[personne_niveau['Location'].str.contains('SECTEUR 2', na=False)]
    personne_niveau_secteur2_conversion_dict_str_contains = {
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
        'FIC' : '401_FIC_&_INTERVEROUILLAGE' 
    }
    for key, value in personne_niveau_secteur2_conversion_dict_str_contains.items():
        personne_niveau_secteur2.loc[personne_niveau_secteur2.Location.str.contains(key, na=False), 'Location'] = value
    personne_niveau_secteur2.drop_duplicates(inplace=True)
    personne_niveau_secteur2.drop_duplicates(subset = ['Location', 'Operator'],inplace=True)
    personne_niveau_secteur2 = pd.merge(personne_niveau_secteur2,nb_max_par_poste, left_on='Location', right_on='Secteur').drop('Secteur',axis=1)
    list_to_replace = ['M\. ', 'M\.', 'M; ', 'Mme\. ', 'Mme\.', 'Mme ', 'Mme', 'Mlle\. ', 'Mlle ']
    personne_niveau_secteur2.Operator.replace(list_to_replace, '',inplace=True, regex=True)
    for value in df.Operator.values:
        personne_niveau_secteur2.Operator.replace(value,unidecode(value).upper(), inplace=True)
    personne_niveau_secteur2.to_csv('./dataframes/personne_niveau_secteur2.csv', sep = ';', index=False)

     # creation df soft skills
    personne_soft_skills = pd.read_excel('./Setup_VERSATILITYOperatorsGeneralSkills.xlsx')
    personne_soft_skills.drop(['C2','C3','C4','C5','C6','C7','C8','C9','C10','C11','C12','C13','C14','C15'], axis=1,inplace=True)
    personne_soft_skills = personne_soft_skills.loc[(personne_soft_skills['GeneralSkill'].isin(['Secouriste','Leader 5S'])) &(personne_soft_skills['C1'] == 1)]
    personne_soft_skills.rename(columns={'Secouriste':'SST'})
    for row in personne_soft_skills.iterrows():
        personne_soft_skills.loc[personne_soft_skills['GeneralSkill'] == 'Secouriste', 'SST'] = 1
        personne_soft_skills.loc[personne_soft_skills['GeneralSkill'] == 'Secouriste', 'Last Assessment(YYYY-MM-DD)_SST'] = personne_soft_skills['Last Assessment(YYYY-MM-DD)']
        personne_soft_skills.loc[personne_soft_skills['GeneralSkill'] == 'Leader 5S', 'Leader 5S'] = 1
        personne_soft_skills.loc[personne_soft_skills['GeneralSkill'] == 'Leader 5S', 'Last Assessment(YYYY-MM-DD)_Leader 5S'] = personne_soft_skills['Last Assessment(YYYY-MM-DD)']
    for operator in personne_soft_skills.Operator.unique():
            personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'SST'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'SST'].max()
            personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Leader 5S'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Leader 5S'].max()
            personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Last Assessment(YYYY-MM-DD)_SST'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Last Assessment(YYYY-MM-DD)_SST'].max()
            personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Last Assessment(YYYY-MM-DD)_Leader 5S'] = personne_soft_skills.loc[personne_soft_skills['Operator'] == operator, 'Last Assessment(YYYY-MM-DD)_Leader 5S'].max()
    personne_soft_skills = personne_soft_skills.rename(columns={'Secouriste':'SST', 'Leader 5S' : '5S'})        
    personne_soft_skills.drop(['Last Assessment(YYYY-MM-DD)','GeneralSkill','C1'], axis=1,inplace=True)
    personne_soft_skills.drop_duplicates(inplace=True) 
    personne_soft_skills.iloc[:,1] = personne_soft_skills.iloc[:,1].fillna(0)
    personne_soft_skills.iloc[:,3] = personne_soft_skills.iloc[:,3].fillna(0)
    personne_soft_skills.to_csv('./dataframes/personne_soft_skills.csv', sep = ';', index=False)
    
    # merge df niveau et soft skills
    personne_niveau = pd.read_csv('./dataframes/personne_niveau_secteur2.csv', sep=';')
    personne_soft_skills = pd.read_csv('./dataframes/personne_soft_skills.csv', sep=';')
    personne_niveau = personne_niveau.merge(personne_soft_skills,how='left',on='Operator')
    # personne_niveau = personne_niveau.rename(columns={'Last Assessment(YYYY-MM-DD)_x':'Last Assessment(YYYY-MM-DD)_niveau','Last Assessment(YYYY-MM-DD)_y':'Last Assessment(YYYY-MM-DD)_soft_skills'})
    personne_niveau.iloc[:,-2] = personne_niveau.iloc[:,-2].fillna(0)
    personne_niveau.iloc[:,-4] = personne_niveau.iloc[:,-4].fillna(0)
    personne_niveau.to_csv('./dataframes/personne_niveau_secteur2_new.csv', sep = ';', index=False)
    
    # df de l'historique des equipes hebdo
    # ce sera dans le futur à réupérer depuis les base de données d'historique des planning de l'app
    # table planning
    equipes_df = pd.read_excel('PlanningToolV2_Secteur2.xlsm', sheet_name=3, header=21)
    equipes_df = equipes_df.drop(['Unnamed: 0','SIM Leader','SST','Unnamed: 12'], axis=1)
    equipes_df = equipes_df.iloc[:, :10]
    equipes_df = equipes_df.loc[~equipes_df['Station'].isin(['XX_MALADIE','XX_PRET','XX_DELEGATION','XX_FORMATION_EXT','XX_CONGES'])]



    # création du df des KPI avec les equipes, c'est de lui dont j'ai besoin pour le df filtre en fait,
    #si on n'utilise pas les SAFE KPI bien sûr
    mergissime = merged_df.merge(equipes_df, left_on='NewDay',right_on='Date')
    mergissime.drop('NewDay',axis=1,inplace=True)
    mergissime.to_csv('./dataframes/mergeKEQTYKPI_EQUIPES.csv', sep=';', index=False)
    
    
    # si on veut rajouter les safekpi et les merge dans le df

    # # creation SAFEKPI
    # SAFEKPI = pd.read_excel('./KPI/ANDON_SAFE_2023125_104111.xlsx')
    # SAFEKPI = SAFEKPI.loc[SAFEKPI['ANDON Type'] == 'Safety']
    # SAFEKPI_SECTEUR2 = SAFEKPI.loc[SAFEKPI['Node'].str.contains('SECTEUR 2', na=False)]
    # SAFEKPI_SECTEUR2 = SAFEKPI_SECTEUR2.iloc[:, :13]
    # andon_conversion_dict_str_contains = {
    #     'EQF3' : '407_EQF3',
    #     'EQF4' : '408_EQF4',
    #     'EQF1' : '404_COLLECTEUR_&_BRIDAGE',
    #     'Habillage' : '403_PREHENSEUR',
    #     '510' : '412_EMBALLAGE',
    #     'Controle Final' : '411_CONTROLE_FINAL',
    #     'Contrôle Final' : '411_CONTROLE_FINAL',
    #     'Controle HT' : '402_CONTROLE_HT',
    #     'Contrôle HT' : '402_CONTROLE_HT',
    #     'T300' : '409_T300',
    #     'EQF2' : '406_EQF2',
    #     'Controle BT' : '410_CONTROLE_BT',
    #     'Contrôle BT' : '410_CONTROLE_BT',
    #     'FIC' : '401_FIC_&_INTERVEROUILLAGE' 
    # }
    # for key, value in andon_conversion_dict_str_contains.items():
    #     SAFEKPI_SECTEUR2.loc[SAFEKPI_SECTEUR2.Node.str.contains(key, na=False), 'Node'] = value
    # SAFEKPI_SECTEUR2.drop(['Node Name','Notification Level Ack','Notification Level Norm','Period Ack','Period Norm','Date Time Act'],axis=1,inplace=True)
    # SAFEKPI_SECTEUR2.to_csv('./dataframes/SAFEKPI_SECTEUR2.csv', sep=';', index=False)

    # # df final, ajout des KPI safe, inutile
    # SAFEKPI_SECTEUR2.TSDate = pd.to_datetime(SAFEKPI_SECTEUR2.TSDate)
    # final_df = almostcomplete_df.merge(SAFEKPI_SECTEUR2, how='left', left_on=['Date', 'Station'], right_on=['TSDate','Node'])
    # final_df.to_csv('./dataframes/final_df.csv',sep=';',index=False)

preprocess()