from __future__ import annotations 
from typing import List, Union 
import time
import pandas as pd
from pathlib import Path
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

from service.pre_traitement import pretraiter_data


# ---------------------------------------------------------------------------
# Configuration ‑‑ adjust as you like
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent        # .../backend
DEFAULT_DRIVER = BASE_DIR / "drivers" / "chromedriver.exe"
CHROMEDRIVER_PATH: str = os.getenv("CHROMEDRIVER_PATH", str(DEFAULT_DRIVER))

TARGET_URLS = [
    "https://www.udemyfreebies.com/search/hi/1"
]

# CSV_PATH = Path("udemyfreebies_courses.csv")
CSV_PATH = BASE_DIR / "static" / "dataCsv" / "udemyfreebies_courses.csv"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def convert_udemyfreebies_link(freebie_link: str) -> str:
    """Turn a udemyfreebies link into the direct Udemy course URL."""
    if "/free-udemy-course/" in freebie_link:
        slug = freebie_link.split("/free-udemy-course/")[-1]
        return f"https://www.udemy.com/course/{slug}"
    return freebie_link


def get_course_description(driver: webdriver.Chrome, url: str) -> str:
    """Open the freebie page and extract the description block."""
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "h2"))
        )
        time.sleep(2)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        desc_section = soup.find("h2", string="Description")
        if desc_section:
            desc_div = desc_section.find_next("div")
            return desc_div.get_text(separator="\n", strip=True)
    except Exception as exc:  # noqa: BLE001
        print(f"[WARN] Description not found at {url}: {exc}")
    return "Description non trouvée"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def scrape_udemyfreebies(urls: Union[List[str], str]) -> pd.DataFrame:
    """
    Scrape all pages in *urls* and return a Pandas DataFrame.
    The results are **also** cached to ``udemyfreebies_courses.csv`` so
    the frontend (or other routes) can serve the data without re‑scraping.
    """
    if isinstance(urls, str):
        urls = [urls]

    service = Service(CHROMEDRIVER_PATH)
    options = webdriver.ChromeOptions()
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-gpu")
    options.add_argument("--no-sandbox")
    options.add_argument("--lang=fr-FR")
    options.add_argument("--headless")
    options.add_argument("--disable-dev-shm-usage")


    # options.add_argument("--headless")  # enable if you want headless Chrome

    driver = webdriver.Chrome(service=service, options=options)
    all_courses: list[dict] = []

    for url in urls:
        driver.get(url)
        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "theme-block"))
            )
            print(f"[DEBUG] Scraping URL: {url}")
        except Exception as exc:  # noqa: BLE001
            print(f"[ERROR] Loading error for {url}: {exc}")
            continue

        time.sleep(3)
        soup = BeautifulSoup(driver.page_source, "html.parser")
        course_blocks = soup.find_all("div", class_="theme-block")

        for block in course_blocks:
            try:
                title_tag = block.find("div", class_="coupon-name").find("a")
                title = title_tag.text.strip()
                original_link = title_tag["href"]
                freebie_link = (
                    original_link
                    if original_link.startswith("http")
                    else f"https://www.udemyfreebies.com{original_link}"
                )
                direct_link = convert_udemyfreebies_link(original_link)

                image = block.find("a", class_="theme-img").find("img")["src"]
                category = block.find("div", class_="coupon-specility").text.strip()

                details = block.find("div", class_="coupon-details-extra-3")
                language = details.find_all("p")[0].text.strip()
                instructor = details.find_all("p")[1].text.strip()
                rating_info = details.find_all("p")[2].text.strip()
                enrolled_info = details.find_all("p")[3].text.strip()
                price_info = details.find_all("p")[4].text.strip()

                description = get_course_description(driver, freebie_link)

                all_courses.append(
                    dict(
                        title=title,
                        link=direct_link,
                        image=image,
                        category=category,
                        language=language,
                        instructor=instructor,
                        rating=rating_info,
                        enrolled=enrolled_info,
                        price=price_info,
                        description=description,
                    )
                )
            except Exception as exc:  # noqa: BLE001
                print(f"[WARN] Skipping a block: {exc}")
                continue

    driver.quit()

    df = pd.DataFrame(all_courses)
    df.to_csv(CSV_PATH, index=False, encoding="utf-8-sig")
    pretraiter_data()
    return df
