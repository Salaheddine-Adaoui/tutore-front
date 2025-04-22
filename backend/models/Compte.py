from models import db 

class Compte(db.Model):
    __tablename__ = 'compte'
    id_compte = db.Column(db.Integer, primary_key=True)
    id_utilis = db.Column(db.Integer,
                          db.ForeignKey('etudiant.id_etudiant'),
                          unique=True,
                          nullable=False)
    email     = db.Column(db.String(120), nullable=False, unique=True)
    password  = db.Column(db.String(128), nullable=False)
    role      = db.Column(db.String(50), nullable=False)

    etudiant  = db.relationship('Etudiant',
                                 back_populates='compte')
