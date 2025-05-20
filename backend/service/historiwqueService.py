from models import Historique, Etudiant , Compte , Course,db,Interet
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




def saveCourseLikedServ(link, student_id):
    course = Course.query.filter_by(link=link).first()
    if not course:
        return jsonify({'error': "Course not found"}), 404
    intret=Interet.query.filter_by(interet=course.category).first()



    hist = Historique.query.filter_by(
        id_etudiant=student_id,
        id_formation=course.id_formation
    ).first()

    if hist:
        if hist.etat!='liked':
           hist.etat = 'liked'
           db.session.commit()
           return jsonify({'success': "History already existed and has been updated to 'liked'"}), 200
        else:
            hist.etat='not liked'
            db.session.commit()
            return jsonify({'success': "History already existed and has been updated to 'not liked'"}), 200

    try:
        histToSave = Historique(
            id_etudiant=student_id,
            id_formation=course.id_formation,
            etat='liked',
            id_interet=intret.id_interet
        )
        db.session.add(histToSave)
        db.session.commit()
       
        return jsonify({'success': "History created and set to 'liked'"}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


def isLked(link,id):
    course = Course.query.filter_by(link=link).first()
    if not course:
        return jsonify({'error': "Course not found"}), 404
    hist=Historique.query.filter_by(id_formation=course.id_formation,id_etudiant=id).first()
    if hist :
        if hist.etat=='liked':
            return jsonify({"success":"liked"}),200
        return jsonify({"error":'not liked'}),400
    return jsonify({"succes":"not in historique"}),400
