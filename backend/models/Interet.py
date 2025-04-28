from models import db 

class Interet(db.Model):
    __tablename__ = 'interet'
    id_interet = db.Column(db.Integer, primary_key=True)
    interet    = db.Column(db.String(100), nullable=False, unique=True)

    etudiants  = db.relationship('Etudiant',
                                  secondary='etudiant_interet',
                                  back_populates='interets')

    historiques = db.relationship('Historique',
                                  back_populates='interet')
