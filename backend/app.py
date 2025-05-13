
from flask import request, jsonify
from models.Historique import Historique
from service.recommandWithHistory import recommend_from_history
from service.recommandationWhitFormulaire import recommend_from_interests
from flask_cors import CORS
# from pathlib import Path
import os, time
from datetime import date
from flask import Flask, jsonify, send_file, request , current_app
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from flask_cors import cross_origin
from service.authentication import Register,login,remember_password,chek_code,update_password
from werkzeug.security import check_password_hash
from service.authentication import Register,login,remember_password,chek_code,update_password,save_interet,getEtudiant_Interet1
from service.customDashbord import get_dashboard_stats


from service.authentication import Register,login,remember_password,chek_code,update_password,save_interet,getEtudiant_Interet1
from service.customDashbord import get_dashboard_stats
from flask_cors import CORS

from models.Historique import Historique
from models import db
from service.scraper import scrape_udemyfreebies, TARGET_URLS, CSV_PATH
from service.recommandWithSearch import semantic_search
from service.chatbot import genrer_reponse
from flask_mail import Mail
from models import db
from service.recommandationWhitFormulaire import recommend_from_interests
from service.recommandWithHistory import recommend_from_history
from service.for_test_service import create_test, get_all_tests, get_test, update_test, delete_test

from models.Administrateur import Administrateur


# -----------------------------------------------------------
# Flask setup  
# -----------------------------------------------------------

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})


# -----------------------------------------------------------
# postgres database setup  
# -----------------------------------------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://admin:tutore@localhost:5432/projet_tutore"

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'adaouisalah552@gmail.com'
app.config['MAIL_PASSWORD'] = 'sukqpindpewvhhoh'  # Utilise un mot de passe d'application si Gmail
mail = Mail(app)




# 3. init the db (from models/__init__.py)
db.init_app(app)

# 5. create tables if they don't exist
with app.app_context():
    db.create_all()




# -----------------------------------------------------------
# Routes  
# -----------------------------------------------------------

@app.route("/")
def index():
    print("👉 Route / appelée")
    return """
        <h1>Bienvenue dans le Scraper UdemyFreebies</h1>
        <a href="/scrape">Lancer le scraping</a>
        <br><br>
        <a href="/download">Télécharger CSV</a>
    """

@app.route('/admin/login', methods=['POST'])
def login_admin():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    admin = Administrateur.query.filter_by(email=email).first()
    if not admin:
        return jsonify({"error": "Admin not found"}), 404

    if not check_password_hash(admin._password_hash, password):
        return jsonify({"error": "Incorrect password"}), 401

    return jsonify({
        "message": "Login successful",
        "admin": {
            "id": admin.id_administrateur,
            "email": admin.email,
            "role": admin.role
        }
    }), 200
    
@app.route("/scrape")
def scrape():
    """
    Scrape now and return an HTML table.  
    NOTE : This hits Udemyfreebies every time; cache if needed.
    """
    df = scrape_udemyfreebies(TARGET_URLS)
    return df.to_html(classes="table table-striped", border=0)


@app.route("/json")
def get_json():
    """
    Serve the CSV as JSON.  Scrapes first time if file is missing.
    """
    if not CSV_PATH.exists():
        scrape_udemyfreebies(TARGET_URLS)
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
    return jsonify(df.to_dict(orient="records"))


@app.route("/download")
def download_file():
    """
    Offer the CSV for download.
    """
    if not CSV_PATH.exists():
        scrape_udemyfreebies(TARGET_URLS)
    return send_file(CSV_PATH, as_attachment=True)



# test GET http://localhost:5000/recommendsearch?q=build%20robust%20portfolio&k=2
@app.route("/recommendsearch")
def recommendsearch_api():
    term = request.args.get("q")
    if not term:
        return jsonify({"error": "query param 'q' required"}), 400

    try:
        k = int(request.args.get("k", 6))
    except ValueError:
        return jsonify({"error": "query param 'k' must be an integer"}), 400

    results = semantic_search(term, k)
    return jsonify(results.to_dict(orient="records"))


@app.route("/recommend_history")
def recommend_history_api():
    try:
        recs = recommend_from_history()  # utilise STATIC/dataCsv/history.csv
        return jsonify(recs.to_dict(orient="records"))
    except FileNotFoundError as fnf:
        return jsonify({"error": str(fnf)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.route('/getChatRespend',methods=['POST'])
def ChatbotRes():
    data=request.get_json()
    question=data.get('question') if data else None
    if question:
        rep=genrer_reponse(question)
        return jsonify({'reponse':rep}),200
    else:
        return jsonify({'error':"question field is mandatory"}),400

    


# -----------------------------------------------------------
# For Test DB
# -----------------------------------------------------------

# 1) Create
#    GET http://localhost:5000/tests/create?name=MBQ&date=2025-04-21
@app.route('/tests/create')
def create_test_route():
    name     = request.args.get('name')
    date_str = request.args.get('date')
    if not name or not date_str:
        return {'error': 'name and date are required'}, 400

    try:
        d = date.fromisoformat(date_str)
    except ValueError:
        return {'error': 'date must be YYYY-MM-DD'}, 400

    rec = create_test(name, d)
    return rec.to_dict(), 201

# 2) List all
#    GET http://localhost:5000/tests
@app.route('/tests')
def list_tests_route():
    return jsonify([r.to_dict() for r in get_all_tests()])

# 3) Get one
#    GET http://localhost:5000/tests/1
@app.route('/tests/<int:test_id>')
def get_test_route(test_id):
    rec = get_test(test_id)
    if not rec:
        return {'error': 'not found'}, 404
    return rec.to_dict()

# 4) Update
#    GET http://localhost:5000/tests/update/1?name=FooUpdated&date=2025-05-01
@app.route('/tests/update/<int:test_id>')
def update_test_route(test_id):
    name     = request.args.get('name')
    date_str = request.args.get('date')
    d = None
    if date_str:
        try:
            d = date.fromisoformat(date_str)
        except ValueError:
            return {'error': 'date must be YYYY-MM-DD'}, 400

    rec = update_test(test_id, name=name, date_value=d)
    if not rec:
        return {'error': 'not found'}, 404
    return rec.to_dict()

# 5) Delete
#    GET http://localhost:5000/tests/delete/1
@app.route('/tests/delete/<int:test_id>')
def delete_test_route(test_id):
    if not delete_test(test_id):
        return {'error': 'not found'}, 404
    return {'deleted': True}

# -----------------------------------------------------------
# Rgister
# -----------------------------------------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nom = data.get('lastName')
    prenom = data.get('firstName')
    email = data.get('email')
    password = data.get('password')

    return Register(nom, prenom, email, password)



# login (emial password )
@app.route('/login',methods=['POST'])
def loginn():
    data = request.json
    email=data.get('email');password=data.get('password')
    return login(email,password)

# oublier password 
@app.route('/remamber',methods=['POST'])
def rember():
    email=request.args.get('email')
    return remember_password(email,mail)

# chek code par email 
@app.route('/chekcode',methods=['POST'])
def chek_codee():
    code = request.args.get('email')
    local_storage_code=request.args.get('code')
    return chek_code(code,local_storage_code)
@app.route('/updatepassword', methods=['POST'])
def password_update():
    email = request.args.get('email')
    old_password = request.args.get('oldPassword')  # attention au nom
    new_password = request.args.get('password')

    if not email or not old_password or not new_password:
        return jsonify({'error': "Champs manquants"}), 400

    return update_password(email, old_password, new_password)


@app.route("/history/<int:id_etudiant>", methods=["DELETE", "GET"])
@cross_origin()                               # ← retire si CORS est déjà global
def delete_history_for_student(id_etudiant: int):
    """
    Supprime TOUT l'historique d’un étudiant.
    Ex : DELETE http://localhost:5000/history/3
    """
    try:
        # .delete() renvoie le nombre de lignes supprimées
        rows = (
            Historique.query
            .filter_by(id_etudiant=id_etudiant)
            .delete(synchronize_session=False)
        )
        db.session.commit()
        return jsonify({"message": f"{rows} lignes supprimées"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
    
# recommndation par formulaire 
@app.route('/recommndation_formualire', methods=['GET'])
def recommandation_formualire():
    id_etudiant = request.args.get('id_etudiant')  # lire depuis l'URL
    if not id_etudiant:
        return jsonify({'error': 'id_etudiant est requis'}), 400

    interets = getEtudiant_Interet1(id_etudiant)
    return jsonify(recommend_from_interests(interets).to_dict(orient='records'))


@app.route('/saveInteret',methods=['POST'])
def saveInteret():
    email = request.args.get('email')
    interest = request.get_json().get('interet')
    return save_interet(email,interest)

@app.route("/recommend_courses", methods=["GET"])
def recommend_courses():
    # 1) récupérer l'id (1 par défaut si absent)
    id_etudiant = request.args.get("id_etudiant", default=1, type=int)

    # 2) compter le nb d’entrées d’historique
    hist_count = Historique.query.filter_by(id_etudiant=id_etudiant).count()

    # 3) choisir la méthode de recommandation
    if hist_count > 0:
        # on a de l’historique → on utilise recommend_from_history
        recs_df = recommend_from_history(history_csv=None, k=3)
    else:
        # pas d’historique → on prend les centres d’intérêt
        interests = getEtudiant_Interet1(id_etudiant)
        recs_df = recommend_from_interests(interests, k=3)

    # 4) renvoyer en JSON
    return jsonify(recs_df.to_dict(orient="records"))


## Dashbord Static 
@app.route("/dashboard/<int:id_etudiant>", methods=["GET"])
def dashboard_api(id_etudiant: int):
    """
    GET /dashboard/3
    Returns JSON with totals + three breakdowns.
    """
    try:
        stats = get_dashboard_stats(id_etudiant)
        return jsonify(stats), 200
    except Exception as e:
        current_app.logger.exception("Dashboard error")
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
