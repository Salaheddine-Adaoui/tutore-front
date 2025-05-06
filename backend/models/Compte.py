from models import db 
from werkzeug.security import generate_password_hash, check_password_hash

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
    status    = db.Column(db.String(30),nullable=False)
    email_token = db.Column(db.String(64), nullable=True, unique=True)
    etudiant  = db.relationship('Etudiant',
                                 back_populates='compte')
    
    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)
