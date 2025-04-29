import pandas as pd
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "static" / "dataCsv"
# Charger ton fichier CSV (remplace le chemin si besoin)
DEFAULT_DATASET = DATA_DIR / "udemyfreebies_courses.csv"
csv_path = DEFAULT_DATASET 
df = pd.read_csv(csv_path)

# Ajouter la colonne id_formation (de 1 à N)
df.insert(0, "id_formation", range(1, len(df) + 1))

# Sauvegarder dans un nouveau fichier ou écraser l'existant
df.to_csv(DEFAULT_DATASET, index=False)

print("✅ Colonne 'id_formation' ajoutée avec succès.")
