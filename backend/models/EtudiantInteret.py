from models import db 

class EtudiantInteret(db.Model):
    __tablename__ = 'etudiant_interet'
    id_EtudiantInteret= db.Column(db.Integer, primary_key=True)
    id_etudiant = db.Column(db.Integer,db.ForeignKey('etudiant.id_etudiant'))
    id_interet  = db.Column(db.Integer,db.ForeignKey('interet.id_interet'))

    etudiants  = db.relationship('Etudiant',back_populates='EtudiantInterets')
    interets    = db.relationship('Interet',back_populates='EtudiantInterets')
    