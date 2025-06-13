# 🌐 Flask & Extensions
from flask import Flask, request, jsonify, send_file, current_app
from flask_cors import CORS, cross_origin
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail

# 🛠️ Utilitaires Python
import os
import time
from datetime import date

# 🔐 Sécurité
from werkzeug.security import check_password_hash

# 📄 PDF Handling
import pdfplumber
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

# 📊 Données
import pandas as pd

# 📁 Models
from models import db
from models.Historique import Historique
from models.Administrateur import Administrateur

# 🧠 Services
from service.authentication import *
from service.admin_auth import change_password
from service.chatbot import generer_reponse
from service.customDashbord import get_dashboard_stats
from service.historiwqueService import *
from service.recommandWithHistory import recommend_from_history
from service.recommandationWhitFormulaire import recommend_from_interests
from service.recommandWithSearch import semantic_search
from service.saveHistorique import save_historique
from service.scraper import scrape_udemyfreebies, TARGET_URLS, CSV_PATH

# -----------------------------------------------------------
# Flask setup  
# -----------------------------------------------------------


app = Flask(__name__,template_folder='templates')

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# -----------------------------------------------------------
# postgres database setup  
# -----------------------------------------------------------
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://admin:tutore@localhost:5432/projet_tutore"
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587            
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'adaouisalah552@gmail.com'
app.config['MAIL_PASSWORD'] = 'sukqpindpewvhhoh'  # Utilise un mpot de passe d'application si Gmail
mail = Mail(app)

# 3. init the db (from models/__init__.py)
db.init_app(app)

# 5. create tables if they don't exist
with app.app_context():
    db.create_all()

# -----------------------------------------------------------
# Routes  
# -----------------------------------------------------------
# Définir le chemin vers ton PDF
PDF_PATH = "C:/Users/MBQ/Desktop/projet Tutore/backend/static/dataPdf/infos_ensa.pdf"
@app.route('/read_pdf', methods=['GET'])
def read_pdf():
    with pdfplumber.open(PDF_PATH) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return jsonify({"text": text})
@app.route('/update_pdf', methods=['POST'])
def update_pdf():
    data = request.json
    new_text = data.get('text', '')

    if not new_text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        c = canvas.Canvas(PDF_PATH, pagesize=A4)
        y = 800
        for line in new_text.split('\n'):
            c.drawString(50, y, line)
            y -= 15
            if y < 50:
                c.showPage()
                y = 800
        c.save()

        return jsonify({'message': 'PDF updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
@app.route("/")
def index():
    print("👉 Route / appelée")
    return """
        <h1>Bienvenue dans le Scraper UdemyFreebies</h1>
        <a href="/scrape">Lancer le scraping</a>
        <br><br>
        <a href="/download">Télécharger CSV</a>
    """

@app.route('/allinter', methods=['GET'])
def getallinter():
    return get_all_interet()



# scraping endpoint 
@app.route('/scr')
def scr():
    l= [] #get_all_interet()
    categorie_list = [
            "Big_Data",
            "Software_Development",
            "Data_Analytics",
            "ML",
            "AI",
            "DevOps",
            "Cybersecurity",
            "Networking",
            "Network_Security",
            "Chemical_Engineering",
            "Renewable_Energy",
            "Water_Treatment",
            "Waste_Management",
            "Electronics",
            "Electrical_Engineering",
            "Control_Systems",
            "Smart_Grids"
        ]

    for i in categorie_list:
        i= i.replace(" ","%20")
        for j in range(1,7):
            l.append( f"https://www.udemyfreebies.com/search/{i}/{j}")
    try:
        # Vider la table avant d’insérer les nouveaux
        Course.query.delete()
        db.session.commit()

        courses = scrape_udemyfreebies(l)
        return jsonify({"status": "success", "data": courses}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


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
    NOTE : This hits Udemyfreebies every time; cache if needed.
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
    id = request.args.get("id")
    if not term:
        return jsonify({"error": "query param 'q' required"}), 400

    try:
        k = int(request.args.get("k", 6))
    except ValueError:
        return jsonify({"error": "query param 'k' must be an integer"}), 400

    results = semantic_search(id,term, k)
    return jsonify(results.to_dict(orient="records"))

@app.route("/recommend_history")
def recommend_history_api():
    id_etudiant = request.args.get("id_etudiant")
    try:
        recs = recommend_from_history(id_etudiant)  # utilise STATIC/dataCsv/history.csv
        return jsonify(recs.to_dict(orient="records"))
    except FileNotFoundError as fnf:
        return jsonify({"error": str(fnf)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/getChatRespend', methods=['POST'])
def ChatbotRes():
    data = request.get_json()
    question = data.get('question') if data else None
    if question:
        rep = generer_reponse(question)
       
        return jsonify({'reponse': rep}), 200
    else:
        return jsonify({'error': "question field is mandatory"}), 400

# -----------------------------------------------------------
# For Test DB
# -----------------------------------------------------------









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

    return Register(nom, prenom, email, password, mail)

@app.route('/confirm/<token>')
def confirm_regisrtation_endp(token):
    return confirm_registartion(token)

# login (email password )
@app.route('/login', methods=['POST'])
def loginn():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    return login(email, password)

# oublier password 
@app.route('/remamber', methods=['POST'])
def rember():
    email = request.args.get('email')
    return remember_password(email, mail)

# chek code par email 
@app.route('/chekcode', methods=['POST'])
def chek_codee():
    code = request.args.get('email')

    local_storage_code = request.args.get('code')
    return check_code(code, local_storage_code)



@app.route('/updatepassword', methods=['POST'])
def password_update():
    email = request.args.get('email')



    old_password = request.args.get('oldPassword')  # attention au nom
    new_password = request.args.get('password')

    if not email or not old_password or not new_password:
        return jsonify({'error': "Champs manquants"}), 400

    return update_password(email, old_password, new_password)



@app.route("/history/<int:id_etudiant>", methods=["DELETE", "GET"])
@cross_origin()
def delete_history_for_student(id_etudiant: int):
    try:
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

    


@app.route("/history", methods=["POST"])
def add_history():
    
    sid = request.args.get("id_etudiant")
    cid = request.args.get("id_formation")

    if not sid or not cid:
        return jsonify({"error": "id_etudiant and id_formation required"}), 400

    try:
        save_historique(sid, cid)
        return jsonify({"message": "historique saved"}), 201

    except ValueError as ve:
        # e.g. course not found or interest not found
        return jsonify({"error": str(ve)}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# recommndation par formulaire 

@app.route('/recommndation_formualire', methods=['GET'])
def recommandation_formualire():
    id = request.args.get('id')
    interet = getEtudiant_Interet(id)
    return jsonify(recommend_from_interests(interet).to_dict(orient='records'))

@app.route('/saveInteret', methods=['POST'])
def saveInteret():
    email = request.args.get('email')
    interest = request.get_json().get('interet')
    return save_interet(email, interest)

@app.route("/recommend_courses", methods=["GET"])
def recommend_courses():
    id_etudiant = request.args.get("id_etudiant")
    hist_count = Historique.query.filter_by(id_etudiant=id_etudiant).count()

    if hist_count > 0:
        recs_df = recommend_from_history(id_etudiant, k=3)
    else:
        interests = getEtudiant_Interet(id_etudiant)
        recs_df = recommend_from_interests(interests, k=3)

    return jsonify(recs_df.to_dict(orient="records"))

@app.route('/getHistorique', methods=['GET'])
def get_hist():
    email = request.args.get('email')
    return get_all(email)

## Dashbord Static 
@app.route("/dashboard/<int:id_etudiant>", methods=["GET"])
def dashboard_api(id_etudiant: int):
    try:
        stats = get_dashboard_stats(id_etudiant)
        return jsonify(stats), 200
    except Exception as e:
        current_app.logger.exception("Dashboard error")
        return jsonify({"error": str(e)}), 500
    

@app.route('/updateadminpassword',methods=['POST'])
def updateAdminPassword():
    email=request.args.get('email')
    obj=request.get_json()
    passw=obj.get('password')
    new=obj.get('new')
    confirm=obj.get('confirm')
    return change_password(email,passw,new,confirm)



# save liked course 
@app.route('/saveCourseLiked',methods=['POST'])
def saveCourseLiked():
    link=request.args.get('link')
    id_etudiant=request.args.get('id')
    result = saveCourseLikedServ(link,id_etudiant)

    return result

@app.route('/isLiked')
def isLikedCourse():
    link=request.args.get('link')
    id_etudiant=request.args.get('id')
    result = isLked(link,id_etudiant)

    return result



# -----------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
