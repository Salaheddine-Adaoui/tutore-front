from flask_cors import CORS
# from pathlib import Path
import os, time
from datetime import date
from flask import Flask, jsonify, send_file, request
import pandas as pd
from flask_sqlalchemy import SQLAlchemy
from service.authentication import Register,login,remember_password,chek_code,update_password
from service.scraper import scrape_udemyfreebies, TARGET_URLS, CSV_PATH
from service.recommandWithSearch import semantic_search
from service.chatbot import genrer_reponse
from flask_mail import Mail
from models import db
from models import Etudiant, Compte, Interet, Historique,EtudiantInteret
from service.for_test_service import create_test, get_all_tests, get_test, update_test, delete_test


# -----------------------------------------------------------
# Flask setup  
# -----------------------------------------------------------

app = Flask(__name__)
CORS(app,origins=['http://localhost:3000'])


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
    return """
        <h1>Bienvenue dans le Scraper UdemyFreebies</h1>
        <a href="/scrape">Lancer le scraping</a>
        <br><br>
        <a href="/download">Télécharger CSV</a>
    """


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

# update password 
@app.route('/updatepassword',methods=['POST'])
def password_update():
    password = request.args.get('password')
    email = request.args.get('email')
    return update_password(email,password)


# -----------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
