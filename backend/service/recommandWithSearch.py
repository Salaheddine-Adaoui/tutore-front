from __future__ import annotations
from functools import lru_cache
from pathlib import Path
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from models import Course
from .recommandWithHistory import _load_history

from service.pre_traitement import nettoyer_search  # garde prétraitement si nécessaire

# Constantes
#BASE_DIR = Path(__file__).resolve().parent.parent
#CSV_FILE = BASE_DIR / "static" / "dataCsv" / "udemyfreebies_courses.csv"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
TOP_K_DEFAULT = 6
SIMILARITY_THRESHOLD = 0.1


#@lru_cache(maxsize=1)
#def _load_df() -> pd.DataFrame:
 #   df = pd.read_csv(CSV_FILE)

    # ✅ Ajout de la colonne pour recherche sémantique
  #  df['TitleDescpt'] = df['title'].fillna('') + ' ' + df['description'].fillna('')
    
   # return df

# utiliser les formations de la base de donnee
@lru_cache(maxsize=1)
def _load_df() -> pd.DataFrame:
    """
    Charge les données depuis la base de données PostgreSQL.
    """
    # Récupération des cours depuis la base de données
    courses = Course.query.all()

    # Conversion en DataFrame
    data = [{
        'id_formation': course.id_formation,
        'title': course.title,
        'description': course.description,
        'link': course.link,
        'price': course.price,
        'enrolled': course.enrolled,
        'image': course.image
    } for course in courses]
    
    df = pd.DataFrame(data)

    # Ajouter la colonne pour recherche sémantique
    df['TitleDescpt'] = df['title'].fillna('') + ' ' + df['description'].fillna('')

    return df
@lru_cache(maxsize=1)
def _load_model() -> SentenceTransformer:
    return SentenceTransformer(EMBED_MODEL_NAME)


@lru_cache(maxsize=1)
def _embeddings() -> np.ndarray:
    model = _load_model()
    df = _load_df()
    return model.encode(df['TitleDescpt'].tolist(), normalize_embeddings=True)


@lru_cache(maxsize=1)
def _cosine_matrix() -> np.ndarray:
    return cosine_similarity(_embeddings())


def semantic_search(id_etudiant,query: str, k: int = TOP_K_DEFAULT) -> pd.DataFrame:
    """
    Retourne les k cours les plus similaires à la requête utilisateur.
    Utilise une recherche sémantique sur la colonne TitleDescpt.
    """


    hist = _load_history(id_etudiant)
    visited_ids = hist['id_formation'].dropna().astype(int).unique().tolist()

    df = _load_df()
    clean_q = nettoyer_search(query)
    q_emb = _load_model().encode([clean_q], normalize_embeddings=True)

    sims = cosine_similarity(q_emb, _embeddings())[0]

    id_to_idx = {fid: idx for idx, fid in enumerate(df['id_formation'])}
    visited_idx = [id_to_idx[i] for i in visited_ids if i in id_to_idx]

    for idx in visited_idx:
        sims[idx] = -1.0  # Exclure les formations déjà visitées


    best_idx = np.argsort(sims)[::-1][:k]
    

    result = df.iloc[best_idx].copy()
    result['similarity'] = sims[best_idx]

    # Filtrer par similarité minimale
    result = result[result['similarity'] >= SIMILARITY_THRESHOLD]

    if result.empty:
        return pd.DataFrame()

    # ✅ Retourne aussi l'image
    return result[[
        'id_formation',
        'title',
        'similarity',
        'link',
        'price',
        'enrolled',
        'image'
    ]]
