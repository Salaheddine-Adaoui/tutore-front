# admin_auth.py

from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from models import db
from models.Administrateur import Administrateur

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/admin')

@admin_bp.route('/login', methods=['POST'])
def login_admin():
    """
    POST /admin/login
    Corps JSON attendu : { "email": "...", "password": "..." }
    Réponses :
     - 200 : { message, admin: { id, email, role } }
     - 400 : { error: "Email and password are required" }
     - 404 : { error: "Admin not found" }
     - 401 : { error: "Incorrect password" }
    """
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    # 1) Vérification des champs
    if not email or not password:
        return jsonify({ "error": "Email and password are required" }), 400

    # 2) Recherche de l'admin
    admin = Administrateur.query.filter_by(email=email).first()
    if admin is None:
        return jsonify({ "error": "Admin not found" }), 404

    # 3) Vérification du mot de passe
    if not check_password_hash(admin._password_hash, password):
        return jsonify({ "error": "Incorrect password" }), 401

    # 4) Succès
    return jsonify({
        "message": "Login successful",
        "admin": {
            "id": admin.id_administrateur,
            "email": admin.email,
            "role": admin.role
        }
    }), 200

# --- Pour l'utiliser ---
# Dans votre app.py :
#
# from admin_auth import admin_bp
# app.register_blueprint(admin_bp)

def change_password(email,cureent,new,confirm):
    admin = Administrateur.query.filter_by(email=email).first()
    if not admin :
        return jsonify({'error':"this email not exist"}),404
    
    if not check_password_hash(admin._password_hash, cureent):
        return jsonify({'error':"current mot de passe is incorrct"}),400
    
    if new != confirm:
        return jsonify({'error':'the confirm password is not true '}),400
    
    admin.password = new  
    db.session.commit()  
    
    return jsonify({'success': "Password updated successfully"}), 200