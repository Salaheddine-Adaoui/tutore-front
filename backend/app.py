import os, time
from pathlib import Path
import pandas as pd

from flask import Flask, jsonify, send_file
import pandas as pd

from scraper import scrape_udemyfreebies, TARGET_URLS, CSV_PATH

# -----------------------------------------------------------
# Flask setup  
# -----------------------------------------------------------

app = Flask(__name__)

# Optional: enable CORS so a Next.js dev‑server on localhost:3000 can call the API.
# Comment these two lines if you don't need CORS.
try:
    from flask_cors import CORS

    CORS(app)
except ImportError:
    pass  # flask‑cors not installed – ignore


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


# -----------------------------------------------------------
# Entrypoint
# -----------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
