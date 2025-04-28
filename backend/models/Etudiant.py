from models import db 
from werkzeug.security import generate_password_hash, check_password_hash




class Etudiant(db.Model):
    __tablename__ = 'etudiant'
    id_etudiant = db.Column(db.Integer, primary_key=True)
    nom         = db.Column(db.String(100), nullable=False)
    prenom      = db.Column(db.String(100), nullable=False)

    # one‑to‑one → Compte
    compte      = db.relationship('Compte',
                                   uselist=False,
                                   back_populates='etudiant')

    # one‑to‑many → Historique
    historiques = db.relationship('Historique',
                                   back_populates='etudiant')

    # many‑to‑many → Interet via EtudiantInteret
    interets    = db.relationship('Interet',
                                   secondary='etudiant_interet',
                                   back_populates='etudiants')
    
    