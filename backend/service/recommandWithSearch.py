from __future__ import annotations
from functools import lru_cache
from pathlib import Path

import neattext.functions as nfx
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_FILE = BASE_DIR / "static" / "dataCsv" / "udemyfreebies_courses.csv"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
TOP_K_DEFAULT = 6
SIMILARITY_THRESHOLD = 0.3

@lru_cache(maxsize=1)
def _load_df() -> pd.DataFrame:
    """Read CSV, unify column names, add id_formation, build TitleDescpt, then pre-clean for embedding."""
    df = pd.read_csv(CSV_FILE)

    # 0) Unify column names from different CSV formats
    col_map = {}
    if 'course_title' in df.columns:
        col_map['course_title'] = 'title'
    if 'url' in df.columns:
        col_map['url'] = 'link'
    if 'num_subscribers' in df.columns:
        col_map['num_subscribers'] = 'enrolled'
    if col_map:
        df = df.rename(columns=col_map)

    # 1) Auto‑increment id as first column
    df.insert(0, 'id_formation', range(1, len(df) + 1))

    # 2) Build TitleDescpt = title + " " + description (if description exists)
    def make_title_desc(row):
        title = row.get('title', '')
        desc = row.get('description', '')
        if pd.notna(desc) and desc != 'Description non trouvée' and desc:
            return f"{title} {desc}"
        return title

    df['TitleDescpt'] = df.apply(make_title_desc, axis=1)

    # 3) Clean the merged text for embedding
    df['clean'] = (
        df['TitleDescpt']
           .apply(nfx.remove_stopwords)
           .apply(nfx.remove_special_characters)
    )

    return df

@lru_cache(maxsize=1)
def _load_model() -> SentenceTransformer:
    return SentenceTransformer(EMBED_MODEL_NAME)

@lru_cache(maxsize=1)
def _embeddings() -> np.ndarray:
    model = _load_model()
    df = _load_df()
    return model.encode(df['clean'].tolist(), normalize_embeddings=True)

@lru_cache(maxsize=1)
def _cosine_matrix() -> np.ndarray:
    return cosine_similarity(_embeddings())


def semantic_search(query: str, k: int = TOP_K_DEFAULT) -> pd.DataFrame:
    """
    Return k courses most semantically similar to the free-text query, using TitleDescpt as basis.
    Filters out any matches below SIMILARITY_THRESHOLD.
    """
    df = _load_df()
    # Clean the query exactly as we do for TitleDescpt
    clean_q = nfx.remove_special_characters(nfx.remove_stopwords(query))
    q_emb = _load_model().encode([clean_q], normalize_embeddings=True)

    # Compute similarities against precomputed embeddings
    sims = cosine_similarity(q_emb, _embeddings())[0]

    # Get top-k indices
    best_idx = np.argsort(sims)[::-1][:k]
    result = df.iloc[best_idx].copy()
    result['similarity'] = sims[best_idx]

    # Filter by similarity threshold
    result = result[result['similarity'] >= SIMILARITY_THRESHOLD]

    # Return an empty DataFrame if none meet the threshold
    if result.empty:
        return pd.DataFrame()

    # Select relevant columns including the new id_formation
    return result[[
        'id_formation',
        'title',
        'similarity',
        'link',
        'price',
        'enrolled'
    ]]
