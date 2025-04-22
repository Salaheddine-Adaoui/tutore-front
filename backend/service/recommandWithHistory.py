# service/history_recommendation.py

from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# On reprend vos caches existants pour df et embeddings
from service.recommandWithSearch import _load_df, _embeddings

# Chemin par défaut vers history.csv, même dossier que udemyfreebies_courses.csv
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "static" / "dataCsv"
DEFAULT_HISTORY = DATA_DIR / "history.csv"

def recommend_from_history(
    history_csv: str | Path | None = None,
    k: int = 3
) -> pd.DataFrame:
    """
    Recommande les k formations les plus proches du centroid des formations
    visitées : history_csv doit contenir une colonne 'id_formation'.
    Si history_csv n'est pas fourni, on cherche DEFAULT_HISTORY.
    """
    # 1) Détermine le chemin du CSV d'historique
    history_path = Path(history_csv) if history_csv else DEFAULT_HISTORY

    if not history_path.exists():
        raise FileNotFoundError(
            f"Le fichier d'historique n'a pas été trouvé : {history_path}"
        )

    # 2) Lecture et validation
    hist = pd.read_csv(history_path)
    if 'id_formation' not in hist.columns:
        raise ValueError(
            "Le fichier historique doit contenir une colonne 'id_formation'"
        )
    visited_ids = hist['id_formation'].dropna().astype(int).unique().tolist()

    # 3) Chargement des données et embeddings
    df = _load_df()
    embeddings = _embeddings()  # shape (n_courses, emb_dim)

    # 4) Map ids → indices
    id_to_idx = {fid: idx for idx, fid in enumerate(df['id_formation'])}
    visited_idx = [id_to_idx[i] for i in visited_ids if i in id_to_idx]

    # 5) Calcul du centroid (ou vecteur nul si pas d'historique)
    if visited_idx:
        centroid = np.mean(embeddings[visited_idx], axis=0, keepdims=True)
    else:
        centroid = np.zeros((1, embeddings.shape[1]))

    # 6) Similarités et exclusion des déjà vus
    sims = cosine_similarity(centroid, embeddings)[0]
    for idx in visited_idx:
        sims[idx] = -1.0

    # 7) Top‑k
    best_idx = np.argsort(sims)[::-1][:k]
    recs = df.iloc[best_idx].copy()
    recs['similarity'] = sims[best_idx]

    return recs[[
        'id_formation',
        'title',
        'similarity',
        'link',
        'price',
        'enrolled'
    ]]

if __name__ == "__main__":
    # Petit test en local
    try:
        recs = recommend_from_history()
        print(recs.to_markdown(index=False))
    except Exception as e:
        print(f"Erreur : {e}")
