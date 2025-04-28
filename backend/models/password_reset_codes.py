from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, DateTime
from models import db

class PasswordResetCode(db.Model):
    __tablename__ = "password_reset_codes"

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False)
    code = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)

    def is_expired(self):
        return datetime.utcnow() > self.expires_at

