from models import db 

class Formation(db.Model):
    __tablename__ = 'Formation'

    id_formation = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text, nullable=False)
    link = db.Column(db.String(1000), nullable=False)
    image = db.Column(db.String(500), nullable=True)
    category = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(100), nullable=True)
    instructor = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Float, nullable=True)
    enrolled = db.Column(db.Integer, nullable=True)
    price = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    TitleDescpt = db.Column(db.Text, nullable=True)

    historiques = db.relationship('Historique', back_populates='formation')