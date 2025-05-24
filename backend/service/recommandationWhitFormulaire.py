
from pathlib import Path
import pandas as pd
import numpy as np
import re
import nltk
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from typing import List, Union

from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Téléchargement nécessaire
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

# Chemins
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "static" / "dataCsv"
DEFAULT_HISTORY = DATA_DIR / "history.csv"
DEFAULT_DATASET = DATA_DIR / "udemyfreebies_courses.csv"

# NLP
model = SentenceTransformer('all-MiniLM-L6-v2')
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()





from models import Course
# Téléchargement nécessaire
#nltk.download('stopwords')
#nltk.download('wordnet')
#nltk.download('omw-1.4')

# Chemins
#BASE_DIR = Path(__file__).resolve().parent.parent
#DATA_DIR = BASE_DIR / "static" / "dataCsv"
#DEFAULT_HISTORY = DATA_DIR / "history.csv"
#DEFAULT_DATASET = DATA_DIR / "udemyfreebies_courses.csv"

# NLP
model = SentenceTransformer('all-MiniLM-L6-v2')
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def clean_text(text: str) -> str:
    """Nettoie le texte : concaténation, nettoyage, stopwords, lemmatisation."""
    # Minuscule
    text = text.lower()
    # Enlever caractères spéciaux
    text = re.sub(r'[^a-z\s]', '', text)
    # Tokenizer
    words = text.split()
    # Enlever stop words + lemmatisation
    words = [lemmatizer.lemmatize(word) for word in words if word not in stop_words]
    # Reconstruire
    return ' '.join(words)

#def _load_df():
    #"""Charge et prépare le dataset."""
   # df = pd.read_csv(DEFAULT_DATASET)
    #if 'title' not in df.columns or 'id_formation' not in df.columns or 'description' not in df.columns:
      #  raise ValueError("Le dataset doit contenir les colonnes 'id_formation', 'title' et 'description'.")
    
    #df['full_text'] = (df['title'].fillna('') + ' ' + df['description'].fillna('')).apply(clean_text)
    
    #return df

# utiliser les formations de la base de donnee
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
    #df['TitleDescpt'] = df['title'].fillna('') + ' ' + df['description'].fillna('')
    df['full_text'] = (df['title'].fillna('') + ' ' + df['description'].fillna('')).apply(clean_text)
    return df

def recommend_from_interests(user_interests: List[str], k: int = 3) -> pd.DataFrame:
    """Recommande des formations basées sur la liste d'intérêts de l'utilisateur."""
    if not user_interests:
        raise ValueError("La liste des intérêts ne peut pas être vide.")
    
    # Charger les formations
    df = _load_df()

    # Générer les embeddings pour tous les full_text
    texts = df['full_text'].tolist()   ####################################################################
    course_embeddings = model.encode(texts, show_progress_bar=False)
    
    # Nettoyer les intérêts utilisateur aussi
    cleaned_interests = [clean_text(interest) for interest in user_interests]
    interest_embeddings = model.encode(cleaned_interests, show_progress_bar=False)

    # Calcul du centroïde des intérêts
    centroid = np.mean(interest_embeddings, axis=0, keepdims=True)

    # Calcul des similarités cosinus
    sims = cosine_similarity(centroid, course_embeddings)[0]

    # Top-k
    best_idx = np.argsort(sims)[::-1][:k]
    recs = df.iloc[best_idx].copy()
    recs['similarity'] = sims[best_idx]
    print("hi recommend from")
    return recs[['id_formation', 'title', 'similarity', 'link', 'price', 'enrolled','image']]

