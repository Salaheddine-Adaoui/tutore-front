# backend/models/test_table.py
from datetime import date
from models import db 

class TestTable(db.Model):
    __tablename__ = 'for_test_table'

    id   = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    date = db.Column(db.Date, nullable=False)

    def to_dict(self):
        return {
            'id':   self.id,
            'name': self.name,
            'date': self.date.isoformat()
        }
