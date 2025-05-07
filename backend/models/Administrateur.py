from werkzeug.security import generate_password_hash, check_password_hash
from models import db

class Administrateur(db.Model):
    __tablename__ = 'administrateur'

    id_administrateur = db.Column(db.Integer, primary_key=True)
    email             = db.Column(db.String(255), unique=True, nullable=False)
    _password_hash    = db.Column('password', db.String(255), nullable=False)
    role              = db.Column(db.String(50), nullable=False)

    @property
    def password(self):
        raise AttributeError("Password is write-only.")

    @password.setter
    def password(self, raw_password):
        self._password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self._password_hash, raw_password)
