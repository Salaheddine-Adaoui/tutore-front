# backend/service/test_service.py
from datetime import date
from typing import List, Optional
from models import db
from models.For_test_table import TestTable


def create_test(name: str, date_value: date) -> TestTable:
    rec = TestTable(name=name, date=date_value)
    db.session.add(rec)
    db.session.commit()
    return rec

def get_all_tests() -> List[TestTable]:
    return TestTable.query.all()

def get_test(test_id: int) -> Optional[TestTable]:
    return TestTable.query.get(test_id)

def update_test(
    test_id:   int,
    name:      Optional[str]  = None,
    date_value: Optional[date] = None,
) -> Optional[TestTable]:
    rec = TestTable.query.get(test_id)
    if not rec:
        return None
    if name is not None:
        rec.name = name
    if date_value is not None:
        rec.date = date_value
    db.session.commit()
    return rec

def delete_test(test_id: int) -> bool:
    rec = TestTable.query.get(test_id)
    if not rec:
        return False
    db.session.delete(rec)
    db.session.commit()
    return True
