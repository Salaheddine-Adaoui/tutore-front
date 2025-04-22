from models import db 

class Historique(db.Model):
    __tablename__ = 'historique'
    id_hist             = db.Column(db.Integer, primary_key=True)
    form_link           = db.Column(db.String, nullable=False)
    id_etudiant         = db.Column(db.Integer,
                                     db.ForeignKey('etudiant.id_etudiant'),
                                     nullable=False)
    id_interet          = db.Column(db.Integer,
                                     db.ForeignKey('interet.id_interet'),
                                     nullable=False)
    titre_formation     = db.Column(db.String, nullable=False)
    description_formation = db.Column(db.Text)
    nbr_visite          = db.Column(db.Integer, default=0)
    dure                = db.Column(db.Integer)  # minutes, hours, whatever
    image_link          = db.Column(db.String)

    etudiant = db.relationship('Etudiant',
                                back_populates='historiques')
    interet  = db.relationship('Interet',
                                back_populates='historiques')
