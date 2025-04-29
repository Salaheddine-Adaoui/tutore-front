from models import Etudiant,db,Compte,PasswordResetCode,Interet,EtudiantInteret
from flask import jsonify
import string
import random
from flask_mail import Mail, Message
from datetime import datetime, timedelta



import traceback

# Register 

def Register(nom, prenom, email, password):
    if Compte.query.filter_by(email=email).first():
        return jsonify({'error': "this email already exists"}), 400

    compte = Compte(email=email, password=password,role='ETUDIANT')
    
    etudiant = Etudiant(nom=nom, prenom=prenom, compte=compte)

    try:
        db.session.add(compte)
        db.session.add(etudiant)
        db.session.commit()
        return jsonify({'success': "user created successfully"}), 200
    except Exception as e:
        
        return jsonify({'error': f"user not created {str(e)}", 'message': str(e)}), 400

    


# login

def login(email,password):
    compte=Compte.query.filter_by(email=email).first()
    if compte:
        if compte.password == password:
            return jsonify({
                'succes':'login succesfuly',
                'email':compte.email
            }),200
        return jsonify({
            'error':"password is not true"
        }),400
        
    else : return jsonify({'error':"email not exist"}),400



# genertae code 

def generate_code(length=6):
    return ''.join(random.choices(string.digits, k=length))



# password oublie

def remember_password(email,mail):
    compte = Compte.query.filter_by(email=email)
    if compte:
        code =generate_code()
        code_db=PasswordResetCode(email=email,code=code,expires_at=datetime.utcnow() + timedelta(minutes=10))
        try:
            try:
                PasswordResetCode.query.filter_by(email=email).delete()
                db.session.add(code_db)
                db.session.commit()
            except Exception as e:
                return jsonify({'message': 'Erreur lors de l’envoi de l’email', 'error': str(e)}), 500

            msg = Message('Code de réinitialisation',
                        sender='adaouisalah552@gmail.com',
                        recipients=[email])
            msg.body = f"Voici votre code de réinitialisation : {code}"
            mail.send(msg)
            return jsonify({'code':code}),200
        except Exception as e:
            return jsonify({'message': 'Erreur lors de l’envoi de l’email', 'error': str(e)}), 500
           
    return jsonify({'error':"email not exist"}),400
    

# update password 

def update_password(email,password):
    compte = Compte.query.filter_by(email=email).first()
    if compte:
        compte.password = password
        db.session.commit()
        return jsonify({
            'succes':"password updated whit succes"
        }),200
    return jsonify({
        'error':"this user not exist"
    }),400


# chek the code for user

def chek_code(email,code):
    db_code=PasswordResetCode.query.filter_by(email=email,code=code).first()
    if not db_code:
        return jsonify({'error':'email or code not exist'}),400
    else:
        if db_code.is_expired():
            return jsonify({'error':'the code is expired'}),400
        else:
            return jsonify({'succes':'code is verified whit succes , you can update your password '})



def save_interet(email, interests):
    compte = Compte.query.filter_by(email=email).first()
    etudiant = Etudiant.query.filter_by(id_etudiant=compte.id_utilis).first()
    if not etudiant:
        return jsonify({'error': 'Étudiant non trouvé'}), 404
    
    try:
        for i in interests:
            interet = Interet.query.filter_by(interet=i).first()
            if not interet:
                return jsonify({'error': f'Intérêt "{i}" non trouvé'}), 404

            etudiant_interet = EtudiantInteret(
                id_etudiant=etudiant.id_etudiant,
                id_interet=interet.id_interet
            )
            db.session.add(etudiant_interet)

        db.session.commit()
        return jsonify({'success': 'Les intérêts ont été enregistrés avec succès'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la transaction DB : {str(e)}'}), 400


def getEtudiant_Interet(email):
    etudiant = Etudiant.query.filter_by(email).first()
    id_etudiant = etudiant.id_etudiant 
    Interet_etudiant_obj = EtudiantInteret.query.filter_by(id_utilis=id_etudiant).all()

    Interet_list=[]
    for ieo in Interet_etudiant_obj:
        interet_obj=Interet.query.get(ieo.id_interet)
        if interet_obj:
            Interet_list.append(interet_obj.interet)
    return Interet_list
    
    