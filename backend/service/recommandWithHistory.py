from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from typing import Union
from models import Course, Historique
# Chargement modèle NLP
model = SentenceTransformer('all-MiniLM-L6-v2')

# Chemins par défaut
#BASE_DIR = Path(__file__).resolve().parent.parent
#DATA_DIR = BASE_DIR / "static" / "dataCsv"
#DEFAULT_HISTORY = DATA_DIR / "history.csv"
#DEFAULT_DATASET = DATA_DIR / "udemyfreebies_courses.csv"

#def _load_df():
   # """Charge le dataset de formations depuis CSV."""
  #  df = pd.read_csv(DEFAULT_DATASET)
  #  if 'title' not in df.columns or 'id_formation' not in df.columns:
  #      raise ValueError("Le dataset doit contenir les colonnes 'id_formation' et 'title'")
  #  return df


#utiliser la base de donnee au lieux de csv
def _load_df():
    """Charge les formations depuis la base de données avec SQLAlchemy."""
    courses = Course.query.all()
    data = [{
            'id_formation': course.id_formation,
            'title': course.title,
            'link': course.link,
            'price': course.price,
            'enrolled': course.enrolled,
            'image': course.image
        } for course in courses]
    return pd.DataFrame(data)

def _load_history(id):
    """Charge l'historique depuis la base de données avec SQLAlchemy."""
    history = Historique.query.filter_by(id_etudiant=id).all()
    data = [{'link': h.link} for h in history]
    return pd.DataFrame(data)

def recommend_from_history(
    # the code below support from Version 3.10 and newest
    # history_csv: str | Path | None = None,  
    id_etudiant,
    k: int = 3
    ) -> pd.DataFrame:
    """
    Recommande les k formations les plus proches du centroïde des formations visitées.
    """
    #history_path = Path(history_csv) if history_csv else DEFAULT_HISTORY
     # Charger l'historique
    hist = _load_history(id_etudiant)
    visited_ids = hist['link'].dropna().astype(str).unique().tolist()


    # 1) Charger les données
    df = _load_df()

    # 2) Générer les embeddings dynamiquement à partir des titres
    titles = df['title'].fillna("").tolist()
    embeddings = model.encode(titles, show_progress_bar=False)

    # 3) Debug : Affichage des embeddings
    # print("\n--- Embeddings ---")
    # for fid, emb in zip(df['id_formation'], embeddings):
    #     print(f"ID {fid}: {np.round(emb[:5], 3).tolist()}...")  # Affiche les 5 premières dimensions pour lisibilité

    # 4) Map des IDs
    id_to_idx = {fid: idx for idx, fid in enumerate(df['link'])}
    visited_idx = [id_to_idx[i] for i in visited_ids if i in id_to_idx]


    # 5) Calcul du centroïde
    if visited_idx:
        centroid = np.mean([embeddings[i] for i in visited_idx], axis=0, keepdims=True)
    else:
        centroid = np.zeros((1, embeddings.shape[1]))

    print("\n--- Centroïde ---")
    #print(np.round(centroid[0][:10], 3))  # Affiche les 10 premières dimensions

    # 6) Similarité cosinus
    sims = cosine_similarity(centroid, embeddings)[0]
    for idx in visited_idx:
        sims[idx] = -1.0  # Exclure les formations déjà visitées

    print("\n--- Similarités ---")
    simo=[]
    # for i, sim in enumerate(sims):
    #     print(f"ID {df['id_formation'].iloc[i]}: {sim:.4f}")
    #print(sims)
    # 7) Top-k recommandations
    best_idx = np.argsort(sims)[::-1][:k]
    recs = df.iloc[best_idx].copy()
    recs['similarity'] = sims[best_idx]
    print("recommend history")
    return recs[[
    'id_formation',
    'title',
    'similarity',
    'link',
    'price',
    'enrolled',
    'image'          # ← on ajoute la colonne image
]]

# Test local
if __name__ == "__main__":
    try:
        recs = recommend_from_history()
        print("\n--- Recommandations ---")
        print(recs.to_markdown(index=False))
    except Exception as e:
        print(f"Erreur : {e}")
