# service/customDashbord.py

from datetime import datetime
from sqlalchemy import func
from models import db
from models.formations import Course
from models.Historique import Historique
from models.Visited import Visited

def get_dashboard_stats(id_etudiant: int) -> dict:
    """
    Returns a dict with:
      - total_formations: total number of formations in the DB
      - visited_count: total visits in Historique for this student
      - liked_count:  total 'like' states in Historique for this student
      - visits_by_month: [{ month: "Jan 2025", count: 5 }, …]
      - likes_by_category: [{ category: "Business", count: 10 }, …]
      - visits_by_category: [{ category: "Business", count: 42 }, …]
    """

    # — totals —
    total_formations = db.session.query(
        func.count(Course.id_formation)
    ).scalar() or 0

    visited_count = db.session.query(
        func.count(Historique.id_hist)
    ).filter(Historique.id_etudiant == id_etudiant).scalar() or 0

    liked_count = db.session.query(
        func.count(Historique.id_hist)
    ).filter(
        Historique.id_etudiant == id_etudiant,
        Historique.Etat.ilike("like")
    ).scalar() or 0

    # — visits by month (from Visited table) —
    raw_months = (
        db.session.query(
            func.date_trunc("month", Visited.date_visit).label("m"),
            func.count(Visited.id_visit).label("cnt")
        )
        .filter(Visited.id_etudiant == id_etudiant)
        .group_by("m")
        .order_by("m")
        .all()
    )
    visits_by_month = [
        {
          "month": m[0].strftime("%b %Y"),
          "count": m[1]
        }
        for m in raw_months
    ]

    # — likes by category (join Historique → Formation) —
    raw_likes = (
        db.session.query(
            Course.category,
            func.count(Historique.id_hist).label("cnt")
        )
        .join(Historique.formation)
        .filter(
          Historique.id_etudiant == id_etudiant,
          Historique.Etat.ilike("like")
        )
        .group_by(Course.category)
        .all()
    )
    likes_by_category = [
        { "category": cat or "Uncategorized", "count": cnt }
        for cat, cnt in raw_likes
    ]

    # — visits by category (sum nbr_visite) —
    raw_visits_cat = (
        db.session.query(
            Course.category,
            func.coalesce(func.sum(Historique.nbr_visite), 0).label("sumv")
        )
        .join(Historique.formation)
        .filter(Historique.id_etudiant == id_etudiant)
        .group_by(Course.category)
        .all()
    )
    visits_by_category = [
        { "category": cat or "Uncategorized", "count": sumv }
        for cat, sumv in raw_visits_cat
    ]

    return {
        "total_formations": total_formations,
        "visited_count": visited_count,
        "liked_count": liked_count,
        "visits_by_month": visits_by_month,
        "likes_by_category": likes_by_category,
        "visits_by_category": visits_by_category
    }
