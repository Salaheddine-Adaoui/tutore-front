from models import db
from datetime import datetime

class Historique(db.Model):

    _tablename_ = 'historique'

    id_hist = db.Column(db.Integer, primary_key=True)
    etat = db.Column(db.String(50))

    # Foreign keys
    id_etudiant = db.Column( db.Integer, db.ForeignKey('etudiant.id_etudiant'),nullable=False)
    id_interet = db.Column(db.Integer, db.ForeignKey('interet.id_interet'),nullable=False)
    title = db.Column(db.String(255), nullable=False)
    link = db.Column(db.String(500), nullable=False, unique=True)
    image = db.Column(db.String(500))
    language = db.Column(db.String(100))
    instructor = db.Column(db.String(255))
    rating = db.Column(db.String(50))
    enrolled = db.Column(db.String(50))
    price = db.Column(db.String(50))
    description = db.Column(db.Text)
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)

    nbr_visite = db.Column(db.Integer, default=0)

    # Relationships
    etudiant  = db.relationship('Etudiant',   back_populates='historiques')

