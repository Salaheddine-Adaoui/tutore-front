import os, time
from pathlib import Path
import pandas as pd
from flask_cors import CORS
from flask import Flask, jsonify, send_file, request
import pandas as pd



from service.scraper import scrape_udemyfreebies, TARGET_URLS, CSV_PATH
from service.recommandWithSearch import semantic_search
from service.chatbot import genrer_reponse




# -----------------------------------------------------------
# Flask setup  
# -----------------------------------------------------------

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])



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
# Entrypoint
# -----------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
