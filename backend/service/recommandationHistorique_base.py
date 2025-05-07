from models import db, Historique, Course, Etudiant
from sentence_transformers import SentenceTransformer
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

def _load_df_from_db():
    """
    Charge les données des formations depuis la base de données.
    """
    courses = Course.query.all()
    return pd.DataFrame([{
        'id_formation': c.id_formation,
        'title': c.title,
        'link': c.link,
        'price': c.price,
        'enrolled': c.enrolled,
        'description':c.description,
        'image': c.image
    } for c in courses])

def _get_history_by_email(email: str):
    """
    Récupère les historiques de formations visitées pour un utilisateur donné par email.
    """
    etudiant = Etudiant.query.filter_by(email=email).first()
    if not etudiant:
        raise ValueError(f"Aucun étudiant trouvé avec l'email : {email}")

    historiques = Historique.query.filter_by(id_etudiant=etudiant.id_etudiant).all()
    return [h.titre_formation + ' ' + (h.description_formation or '') for h in historiques]

def recommend_from_history_db(email: str, k: int = 3) -> pd.DataFrame:
    """
    Recommande les k formations les plus proches du centroïde des formations visitées.
    """
    # 1) Charger les données
    df = _load_df_from_db()

    # 2) Récupérer les formations visitées (titres) depuis la base
    visited_titles = _get_history_by_email(email)

    if not visited_titles:
        raise ValueError(f"Aucune formation visitée trouvée pour l'utilisateur {email}")

    # 3) Générer les embeddings
    titles = df['title'].fillna("").tolist()
    embeddings = model.encode(titles, show_progress_bar=False)

    # 4) Trouver les indices des titres visités
    visited_idx = [i for i, t in enumerate(titles) if t in visited_titles]

    if not visited_idx:
        raise ValueError("Aucune correspondance entre les formations visitées et le dataset")

    # 5) Calcul du centroïde
    centroid = np.mean([embeddings[i] for i in visited_idx], axis=0, keepdims=True)

    # 6) Calcul de la similarité cosinus
    sims = cosine_similarity(centroid, embeddings)[0]
    for idx in visited_idx:
        sims[idx] = -1.0  # Ignorer les formations déjà vues

    # 7) Récupérer les top-k recommandations
    best_idx = np.argsort(sims)[::-1][:k]
    recs = df.iloc[best_idx].copy()
    recs['similarity'] = sims[best_idx]

    return recs[['id_formation', 'title', 'similarity', 'link', 'price', 'enrolled', 'image']]
