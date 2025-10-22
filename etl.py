import pandas as pd # import data to create dataframe
import sqlite3      #import sqlite to connect database


csv_url = "https://datahub.io/core/gdp/r/gdp.csv" # link of csv file
db_name = "Banks.db"                             # database name
table_name = "Largest_banks"                     # table name

# Extraire les donnees csv file
df = pd.read_csv(csv_url) # read dataframe

# transformer les donnees
df_recent = df.sort_values("Year", ascending=False).drop_duplicates(subset=["Country Name"])
# in the dataframe select the latest year for isch country

# Convertir GDP millions à billions USD
df_recent["GDP_USD_billions"] = (df_recent["Value"].astype(float) / 1_000_000_000).round(2)

#telecharger les donnees apres la transformations
df_final = df_recent[["Country Name", "GDP_USD_billions"]].copy()
df_final.columns = ["Country", "GDP_USD_billions"]

# conncter la base de donnees avec sqlite
conn = sqlite3.connect(db_name) #connect basesql
df_final.to_sql(table_name, conn, if_exists="replace", index=False)# Save to SQLite
conn.close()

print("Database created successfully:", db_name) # show message and database name
print(df_final.head())

#requete sql 

db_name = "Banks.db"
table_name = "Largest_banks"
seuil = 10000
conn = sqlite3.connect(db_name)
query = f"SELECT * FROM {table_name} WHERE GDP_USD_billions >= ?"
df_filtered = pd.read_sql_query(query, conn, params=(seuil,))
conn.close()
# afficher le resultats avec le seuil
print(f"Countries with GDP >= {seuil} billions USD:")
print(df_filtered)


