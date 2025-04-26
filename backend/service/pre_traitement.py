from pathlib import Path
import pandas as pd
import neattext.functions as nfx
import re

BASE_DIR = Path(__file__).resolve().parent.parent
CSV_FILE = BASE_DIR / "static" / "dataCsv" / "udemyfreebies_courses.csv"

def pretraiter_data():
    df = pd.read_csv(CSV_FILE)

    # Unifier les noms de colonnes si nécessaire
    col_map = {}
    if 'course_title' in df.columns:
        col_map['course_title'] = 'title'
    if 'url' in df.columns:
        col_map['url'] = 'link'
    if 'num_subscribers' in df.columns:
        col_map['num_subscribers'] = 'enrolled'
    if col_map:
        df = df.rename(columns=col_map)

    # Ajouter id_formation si absent
    if 'id_formation' not in df.columns:
        df.insert(0, 'id_formation', range(1, len(df) + 1))

    # Construire TitleDescpt si absent
    if 'TitleDescpt' not in df.columns:
        def make_title_desc(row):
            title = row.get('title', '')
            desc = row.get('description', '')
            if pd.notna(desc) and desc != 'Description non trouvée' and desc:
                return f"{title} {desc}"
            return title
        df['TitleDescpt'] = df.apply(make_title_desc, axis=1)

    # Nettoyer TitleDescpt directement
    df['TitleDescpt'] = (
        df['TitleDescpt']
        .apply(nfx.remove_stopwords)
        .apply(nfx.remove_special_characters)
        .str.lower()
        .apply(lambda x: re.sub(r'\d+', '', x))
        .apply(lambda x: ' '.join(x.split()))
    )

    # Enregistrer dans le même fichier
    df.to_csv(CSV_FILE, index=False)
    return df

def nettoyer_search(text: str) -> str:
    """Nettoyer un texte avec les mêmes règles que TitleDescpt."""
    text = text.lower()
    text = nfx.remove_stopwords(text)
    text = nfx.remove_special_characters(text)
    text = re.sub(r'\d+', '', text)
    text = ' '.join(text.split())
    return text


# if __name__ == "__main__":
#     pretraiter_data()
