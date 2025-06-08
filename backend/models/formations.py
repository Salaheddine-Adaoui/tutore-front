from models import db
from datetime import datetime

class Course(db.Model):
    __tablename__ = "courses"

    id_formation = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(500), nullable=False, unique=True)
    image = db.Column(db.String(500))
    category = db.Column(db.String(100))
    language = db.Column(db.String(100))
    instructor = db.Column(db.String(255))
    rating = db.Column(db.String(50))
    enrolled = db.Column(db.String(50))
    price = db.Column(db.String(50))
    description = db.Column(db.Text)
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)

 
