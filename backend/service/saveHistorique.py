# service/saveHistorique.py
from sqlalchemy import func
from models import db
from models.Historique import Historique
from models.Interet   import Interet
from models.formations    import Course
from datetime import datetime

def save_historique(id_etudiant: int, id_formation: int) -> Historique:

    # --- 1) Fetch the course and its category
    course = Course.query.get(id_formation)
    if not course:
        raise ValueError(f"Course with id {id_formation} not found")
    if not course.category:
        raise ValueError(f"Course id {id_formation} has no category set")

    interet_nom = course.category
    print("👉👉👉 resolved interet_nom from course:", interet_nom)

    # --- 2) Lookup the interest
    rec = (
        Interet.query
        .filter(func.lower(Interet.interet) == interet_nom.lower())
        .first()
    )
    if not rec:
        raise ValueError(f"No Interet row matching '{interet_nom}'")
    interet_id = rec.id_interet
    print("👉👉👉 found interet_id:", interet_id)

    # --- 3) Upsert Historique
    hist = (
        Historique.query
        .filter_by(
            id_etudiant  = id_etudiant,
            link = course.link
        )
        .first()
    )

    if hist:
        hist.nbr_visite = (hist.nbr_visite or 0) + 1
    else:
        hist = Historique(
            id_etudiant  = id_etudiant,
            id_interet   = interet_id,   # guaranteed non-null
            etat         = "not yet",
            title        = course.title,
            link        = course.link,
            image        = course.image,
            language        = course.language,
            instructor        = course.instructor,
            rating        = course.rating,
            enrolled        = course.enrolled,
            price        = course.price,
            description        = course.description,     
            scraped_at        = course.scraped_at,     
            nbr_visite   = 1,
        )
        db.session.add(hist)


    db.session.commit()
    return hist
