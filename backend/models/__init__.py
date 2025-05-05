from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# bring in all models so SQLAlchemy sees them
from .Etudiant          import Etudiant
from .Compte            import Compte
from .Interet           import Interet
from .EtudiantInteret  import EtudiantInteret
from .Historique        import Historique
from .For_test_table    import TestTable
from .password_reset_codes import PasswordResetCode
from .Formation import Formation
from .Visited import Visited