from models import Etudiant,db,Compte
from flask import jsonify
import string
import random
from flask_mail import Mail, Message


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

        try:
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

def chek_code(code,localstorage_code):
    if code == localstorage_code:
        return jsonify({
            'succes':"code is correct"
        }),200
    return jsonify({
        'error':"code is not correct"
    }),400


