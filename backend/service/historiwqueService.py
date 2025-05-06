from models import Historique, Etudiant , Compte
from flask import jsonify

def get_all(email: str):
    # 1. Vérifie si le compte existe
    c = Compte.query.filter_by(email=email).first()
    if not c:
        return jsonify({'error': "Ce compte n'existe pas"}), 400

    # 2. Vérifie si l'étudiant associé existe
    etudiant = Etudiant.query.filter_by(id_etudiant=c.id_utilis).first()
    if not etudiant:
        return jsonify({'error': "Cet étudiant n'existe pas"}), 400

    # 3. Récupère ses historiques
    historiques = Historique.query.filter_by(id_etudiant=etudiant.id_etudiant).all()
    if not historiques:
        return jsonify({'error': "Aucun historique trouvé"}), 404

    # 4. Structure propre du résultat
    data = []
    for h in historiques:
        data.append({
            "id_hist": h.id_hist,
            "etat": h.etat,
            "nbr_visite": h.nbr_visite,
            "formation": {
                "id": h.formation.id_formation,
                "titre": h.formation.title,
                "description": h.formation.description,
                "lien": h.formation.link,
                "image": h.formation.image,
                'instructor':h.formation.instructor,
                "prix": h.formation.price,
                "enrolled": h.formation.enrolled
            }
        })

    return jsonify({'historique': data}), 200

