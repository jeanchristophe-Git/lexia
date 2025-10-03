"""
Scraper pour sites juridiques officiels ivoiriens
Collecte lois, décrets, codes depuis sources gouvernementales
"""

import requests
from bs4 import BeautifulSoup
import os
import sys
import time
import hashlib
import chromadb
from dotenv import load_dotenv
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse

# Charger les variables d'environnement depuis le dossier parent
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

# Configuration
USER_AGENT = "LexIA-Scraper/1.0 (Legal Research Bot; +https://lexia.ci)"
PAUSE_BETWEEN_REQUESTS = 3  # Respectueux des serveurs

# Chroma Cloud
print("[CHROMA] Connexion à Chroma Cloud...")
try:
    chroma_client = chromadb.CloudClient(
        api_key=os.getenv("CHROMA_API_KEY"),
        tenant=os.getenv("CHROMA_TENANT"),
        database=os.getenv("CHROMA_DATABASE")
    )
    collection = chroma_client.get_or_create_collection("lexia_legal_docs")
    print(f"[OK] Connecté à Chroma Cloud ({collection.count()} documents existants)")
except Exception as e:
    print(f"[ERROR] Erreur Chroma Cloud: {e}")
    sys.exit(1)

# Sites à scraper
SITES = [
    {
        "name": "Ministère de la Justice",
        "base_url": "https://www.justice.ci/",
        "selectors": ["a[href*='texte']", "a[href*='code']", "a[href*='.pdf']"],
        "priority": 1
    },
    {
        "name": "SGG - Journal Officiel",
        "base_url": "https://www.sgg.gouv.ci/",
        "selectors": ["a[href*='jo']", "a[href*='decret']", "a[href*='.pdf']"],
        "priority": 1
    },
    {
        "name": "Assemblée Nationale",
        "base_url": "https://www.assnat.ci/",
        "selectors": ["a[href*='loi']", "a[href*='projet']", "a[href*='.pdf']"],
        "priority": 2
    },
    {
        "name": "CNDJ",
        "base_url": "https://www.cndj.ci/",
        "selectors": ["a[href*='texte']", "a[href*='document']"],
        "priority": 2
    },
    {
        "name": "Droit-Afrique",
        "base_url": "https://www.droit-afrique.com/",
        "selectors": ["a[href*='cote-ivoire']", "a[href*='cotedivoire']"],
        "priority": 3
    }
]

def check_robots_txt(base_url):
    """Vérifie si le scraping est autorisé"""
    parsed = urlparse(base_url)
    robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"

    rp = RobotFileParser()
    rp.set_url(robots_url)

    try:
        rp.read()
        return rp.can_fetch(USER_AGENT, base_url)
    except:
        print(f"  [WARN] Pas de robots.txt, on continue prudemment")
        return True

def fetch_page(url):
    """Récupère une page avec headers appropriés"""
    try:
        response = requests.get(
            url,
            headers={"User-Agent": USER_AGENT},
            timeout=30
        )
        response.raise_for_status()
        return response
    except Exception as e:
        print(f"  [ERROR] Erreur fetch {url[:60]}...: {e}")
        return None

def extract_links(base_url, html, selectors):
    """Extrait les liens pertinents"""
    soup = BeautifulSoup(html, 'html.parser')
    links = set()

    for selector in selectors:
        for link in soup.select(selector):
            href = link.get('href')
            if href:
                full_url = urljoin(base_url, href)
                links.add(full_url)

    return list(links)

def extract_text_from_page(html):
    """Extrait le texte principal d'une page"""
    soup = BeautifulSoup(html, 'html.parser')

    # Supprimer scripts, styles, etc.
    for element in soup(['script', 'style', 'nav', 'header', 'footer']):
        element.decompose()

    # Chercher le contenu principal
    main_content = soup.find('main') or soup.find('article') or soup.find('div', class_=['content', 'main', 'text'])

    if main_content:
        text = main_content.get_text(separator=' ', strip=True)
    else:
        text = soup.get_text(separator=' ', strip=True)

    # Nettoyer
    text = ' '.join(text.split())
    return text

def scrape_site(site):
    """Scrape un site officiel"""
    print(f"\n{'='*60}")
    print(f"[SCRAPE] {site['name']} ({site['base_url']})")
    print(f"{'='*60}")

    # Vérifier robots.txt
    if not check_robots_txt(site['base_url']):
        print(f"  [ERROR] robots.txt interdit le scraping de {site['base_url']}")
        return []

    # Fetch page principale
    response = fetch_page(site['base_url'])
    if not response:
        return []

    # Extraire liens
    links = extract_links(site['base_url'], response.text, site['selectors'])
    print(f"  [OK] {len(links)} liens trouvés")

    documents = []

    for idx, link in enumerate(links[:10], 1):  # Limiter à 10 pour test
        print(f"\n  [{idx}/{min(len(links), 10)}] {link[:80]}...")
        time.sleep(PAUSE_BETWEEN_REQUESTS)

        # Si c'est un PDF
        if link.lower().endswith('.pdf'):
            print(f"    [INFO] PDF détecté (extraction PDF à implémenter)")
            # TODO: Télécharger et extraire texte avec PyPDF2
            continue

        # Si c'est une page HTML
        page_response = fetch_page(link)
        if not page_response:
            continue

        # Extraire contenu
        soup = BeautifulSoup(page_response.text, 'html.parser')
        title_tag = soup.find('title') or soup.find('h1')
        title = title_tag.get_text(strip=True) if title_tag else link.split('/')[-1]

        text = extract_text_from_page(page_response.text)

        if len(text) < 100:
            print(f"    [WARN] Texte trop court ({len(text)} chars), ignoré")
            continue

        doc = {
            "id": f"{site['name'].lower().replace(' ', '_')}_{hashlib.sha1(link.encode()).hexdigest()[:10]}",
            "title": title[:500],  # Limiter la longueur
            "content": text,
            "url": link,
            "source": site['name'],
            "category": "legislation"
        }

        documents.append(doc)
        print(f"    [OK] {title[:60]}... ({len(text)} chars)")

    return documents

def save_to_chroma(documents):
    """Sauvegarde dans Chroma Cloud"""
    if not documents:
        print("\n[WARN] Aucun document à sauvegarder")
        return

    print(f"\n[CHROMA] Sauvegarde de {len(documents)} documents dans Chroma Cloud...")

    try:
        ids = [doc["id"] for doc in documents]
        texts = [doc["content"] for doc in documents]
        metadatas = [{
            "title": doc["title"],
            "url": doc["url"],
            "source": doc["source"],
            "category": doc["category"]
        } for doc in documents]

        collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas
        )

        print(f"  [OK] {len(documents)} documents indexés")
        print(f"  [INFO] Total Chroma Cloud: {collection.count()} documents")

    except Exception as e:
        print(f"  [ERROR] Erreur Chroma: {e}")

def main():
    """Fonction principale"""
    print("="*60)
    print("LEXIA - Scraper Sites Officiels Ivoiriens")
    print("="*60)

    all_docs = []

    # Trier par priorité
    sorted_sites = sorted(SITES, key=lambda x: x['priority'])

    for site in sorted_sites:
        docs = scrape_site(site)
        all_docs.extend(docs)

    # Sauvegarder
    save_to_chroma(all_docs)

    print("\n" + "="*60)
    print(f"[DONE] Scraping terminé: {len(all_docs)} documents collectés")
    print("="*60)

if __name__ == "__main__":
    main()
