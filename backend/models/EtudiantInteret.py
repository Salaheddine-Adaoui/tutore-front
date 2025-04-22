from models import db 

class EtudiantInteret(db.Model):
    __tablename__ = 'etudiant_interet'
    id_etudiant = db.Column(db.Integer,
                             db.ForeignKey('etudiant.id_etudiant'),
                             primary_key=True)
    id_interet  = db.Column(db.Integer,
                             db.ForeignKey('interet.id_interet'),
                             primary_key=True)
