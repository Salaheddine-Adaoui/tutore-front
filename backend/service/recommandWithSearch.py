# service/recommandWithSearch.py

from __future__ import annotations
from functools import lru_cache
from pathlib import Path

import neattext.functions as nfx
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_FILE = BASE_DIR / "static" / "dataCsv" / "UdemyCleanedTitle.csv"
EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
TOP_K_DEFAULT = 6

@lru_cache(maxsize=1)
def _load_df() -> pd.DataFrame:
    df = pd.read_csv(CSV_FILE)
    df["clean"] = (
        df["course_title"]
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
    return model.encode(df["clean"].tolist(), normalize_embeddings=True)

@lru_cache(maxsize=1)
def _cosine_matrix() -> np.ndarray:
    return cosine_similarity(_embeddings())


def semantic_search(query: str, k: int = TOP_K_DEFAULT) -> pd.DataFrame:

    df = _load_df()
    # clean the query exactly as we did for titles
    clean_q = nfx.remove_special_characters(nfx.remove_stopwords(query))
    model = _load_model()
    q_emb = model.encode([clean_q], normalize_embeddings=True)  # shape (1, dim)
    sims = cosine_similarity(q_emb, _embeddings())[0]           # shape (n_titles,)
    best_idx = np.argsort(sims)[::-1][:k]
    result = df.iloc[best_idx].copy()
    result["similarity"] = sims[best_idx]
    return result[["course_title", "similarity", "url", "price", "num_subscribers"]]
