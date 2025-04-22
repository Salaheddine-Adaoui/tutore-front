from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# Chargement modèle NLP
model = SentenceTransformer('all-MiniLM-L6-v2')

# Chemins par défaut
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "static" / "dataCsv"
DEFAULT_HISTORY = DATA_DIR / "history.csv"
DEFAULT_DATASET = DATA_DIR / "UdemyCleanedTitle.csv"

def _load_df():
    """Charge le dataset de formations depuis CSV."""
    df = pd.read_csv(DEFAULT_DATASET)
    if 'title' not in df.columns or 'id_formation' not in df.columns:
        raise ValueError("Le dataset doit contenir les colonnes 'id_formation' et 'title'")
    return df

def recommend_from_history(
    history_csv: str | Path | None = None,
    k: int = 10
) -> pd.DataFrame:
    """
    Recommande les k formations les plus proches du centroïde des formations visitées.
    """
    history_path = Path(history_csv) if history_csv else DEFAULT_HISTORY

    if not history_path.exists():
        raise FileNotFoundError(f"Fichier d'historique introuvable : {history_path}")

    hist = pd.read_csv(history_path)
    if 'id_formation' not in hist.columns:
        raise ValueError("Le fichier historique doit contenir une colonne 'id_formation'")

    visited_ids = hist['id_formation'].dropna().astype(int).unique().tolist()

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
    id_to_idx = {fid: idx for idx, fid in enumerate(df['id_formation'])}
    visited_idx = [id_to_idx[i] for i in visited_ids if i in id_to_idx]

    # print("\n--- Formations visitées ---")
    # print(visited_ids)
    # print("Indices correspondants :", visited_idx)

    # 5) Calcul du centroïde
    if visited_idx:
        centroid = np.mean([embeddings[i] for i in visited_idx], axis=0, keepdims=True)
    else:
        centroid = np.zeros((1, embeddings.shape[1]))

    print("\n--- Centroïde ---")
    print(np.round(centroid[0][:10], 3))  # Affiche les 10 premières dimensions

    # 6) Similarité cosinus
    sims = cosine_similarity(centroid, embeddings)[0]
    for idx in visited_idx:
        sims[idx] = -1.0  # Exclure les formations déjà visitées

    print("\n--- Similarités ---")
    simo=[]
    # for i, sim in enumerate(sims):
    #     print(f"ID {df['id_formation'].iloc[i]}: {sim:.4f}")
    print(sims)
    # 7) Top-k recommandations
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

# Test local
if __name__ == "__main__":
    try:
        recs = recommend_from_history()
        print("\n--- Recommandations ---")
        print(recs.to_markdown(index=False))
    except Exception as e:
        print(f"Erreur : {e}")
