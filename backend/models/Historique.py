from models import db

class Historique(db.Model):

    _tablename_ = 'historique'

    id_hist = db.Column(db.Integer, primary_key=True)
    etat = db.Column(db.String(50))

    # Foreign keys
    id_etudiant = db.Column( db.Integer, db.ForeignKey('etudiant.id_etudiant'),nullable=False)
    id_interet = db.Column(db.Integer, db.ForeignKey('interet.id_interet'),nullable=False)
    id_formation = db.Column(db.Integer, db.ForeignKey('courses.id_formation'),nullable=False)

    nbr_visite = db.Column(db.Integer, default=0)

    # Relationships
    etudiant  = db.relationship('Etudiant',   back_populates='historiques')
    interet   = db.relationship('Interet',    back_populates='historiques')
    formation = db.relationship('Course',  back_populates='historiques')

