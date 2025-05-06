from datetime import datetime
from models import db
from models.Etudiant import Etudiant

class Visited(db.Model):
    __tablename__ = 'visited'

    id_visit    = db.Column(db.Integer, primary_key=True)
    id_etudiant = db.Column( db.Integer,  db.ForeignKey('etudiant.id_etudiant', ondelete='CASCADE'), nullable=False )
    date_visit  = db.Column( db.DateTime, nullable=False, default=datetime.utcnow )

    # relationship back to Etudiant
    etudiant = db.relationship(  'Etudiant',  back_populates='visits' )
