from models import db

class Historique(db.Model):
    __tablename__ = 'historique'

    id_hist = db.Column(db.Integer, primary_key=True)
    Etat = db.Column(db.String(50))
    nbr_visite = db.Column(db.Integer, default=0)
    # Foreign keys
    id_etudiant = db.Column( db.Integer, db.ForeignKey('etudiant.id_etudiant'),nullable=False)
    id_formation = db.Column(db.Integer, db.ForeignKey('Formation.id_formation'),nullable=False)

    # Relationships
    etudiant  = db.relationship('Etudiant',   back_populates='historiques')
    formation = db.relationship('Formation',  back_populates='historiques') 