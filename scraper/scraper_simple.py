"""
LexIA - Scraper Simple avec Chroma Cloud
Scrape sites ivoiriens -> PostgreSQL + Chroma Cloud
"""

import requests
from bs4 import BeautifulSoup
import os
import sys
import time
import psycopg2
import chromadb
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le dossier parent
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

# Configuration
DATABASE_URL = os.getenv("DATABASE_URL")
CHROMA_API_KEY = os.getenv("CHROMA_API_KEY")
CHROMA_TENANT = os.getenv("CHROMA_TENANT")
CHROMA_DATABASE = os.getenv("CHROMA_DATABASE")

# Verifier les variables d'environnement
if not DATABASE_URL:
    print("[ERROR] DATABASE_URL non trouve dans .env")
    sys.exit(1)

if not all([CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE]):
    print("[ERROR] Credentials Chroma Cloud manquants dans .env")
    print("  Requis: CHROMA_API_KEY, CHROMA_TENANT, CHROMA_DATABASE")
    sys.exit(1)

# Connexion PostgreSQL (Prisma)
print("[DB] Connexion a PostgreSQL...")
try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    print(f"[OK] Connecte a PostgreSQL")
except Exception as e:
    print(f"[ERROR] Erreur connexion PostgreSQL: {e}")
    sys.exit(1)

# Connexion Chroma Cloud
print("[CHROMA] Connexion a Chroma Cloud...")
try:
    chroma_client = chromadb.CloudClient(
        api_key=CHROMA_API_KEY,
        tenant=CHROMA_TENANT,
        database=CHROMA_DATABASE
    )
    collection = chroma_client.get_or_create_collection(
        name="lexia_legal_docs",
        metadata={"description": "Documents juridiques Cote d'Ivoire"}
    )
    print(f"[OK] Connecte a Chroma Cloud ({collection.count()} documents existants)")
except Exception as e:
    print(f"[ERROR] Erreur Chroma Cloud: {e}")
    print(f"  Verifie tes credentials dans .env")
    sys.exit(1)

# Sites a scraper
SITES = {
    "journal_officiel": "https://jo.gouv.ci",
    "cepici": "https://www.cepici.ci",
    "dgi": "https://www.dgi.gouv.ci",
}

def clean_text(text):
    """Nettoie le texte"""
    if not text:
        return ""
    return ' '.join(text.split()).strip()

def scrape_site(name, url):
    """Scrape un site"""
    print(f"\n[SCRAPE] Scraping {name}...")

    try:
        response = requests.get(url, timeout=30, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        documents = []

        # ADAPTER selon le site reel
        # Ces selecteurs sont generiques et devront etre ajustes

        # Essayer plusieurs selecteurs possibles
        articles = (
            soup.find_all('article')[:10] or
            soup.find_all('div', class_='post')[:10] or
            soup.find_all('div', class_='content')[:10] or
            soup.find_all('div', class_='document')[:10]
        )

        if not articles:
            print(f"  [WARN] Aucun article trouve avec les selecteurs par defaut")
            print(f"  [INFO] Conseil: Inspecte le site et ajuste les selecteurs dans scraper_simple.py")
            return []

        for idx, article in enumerate(articles):
            try:
                # Chercher le titre
                title_elem = (
                    article.find(['h1', 'h2', 'h3', 'h4']) or
                    article.find(class_=['title', 'titre', 'heading'])
                )
                title = clean_text(title_elem.text) if title_elem else f"{name} Document #{idx+1}"

                # Extraire le contenu
                content = clean_text(article.get_text())

                # Ignorer les contenus trop courts
                if len(content) < 100:
                    continue

                # Creer un ID unique
                doc_id = f"{name}_{idx}_{abs(hash(content)) % 1000000}"

                doc = {
                    'id': doc_id,
                    'title': title[:500],  # Limiter la longueur
                    'category': name,
                    'content': content,
                    'content_preview': content[:500],
                    'url': url
                }

                documents.append(doc)
                print(f"  [OK] {title[:60]}...")

            except Exception as e:
                print(f"  [ERROR] Erreur article {idx}: {e}")
                continue

        time.sleep(2)  # Etre respectueux avec les serveurs
        return documents

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Erreur reseau {name}: {e}")
        return []
    except Exception as e:
        print(f"[ERROR] Erreur {name}: {e}")
        return []

def save_to_prisma(documents):
    """Sauvegarde dans PostgreSQL (Prisma)"""
    if not documents:
        print("\n[WARN] Aucun document a sauvegarder dans PostgreSQL")
        return

    print(f"\n[DB] Sauvegarde PostgreSQL...")
    saved_count = 0

    for doc in documents:
        try:
            # PostgreSQL syntax
            cursor.execute("""
                INSERT INTO "LegalDocument"
                (id, title, category, "contentPreview", "sourceUrl", "scrapedAt", "createdAt")
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                ON CONFLICT (id) DO NOTHING
            """, (
                doc['id'],
                doc['title'],
                doc['category'],
                doc['content_preview'],
                doc['url']
            ))

            conn.commit()
            saved_count += 1

        except Exception as e:
            conn.rollback()
            print(f"  [ERROR] Erreur save {doc['id']}: {e}")

    print(f"  [OK] {saved_count}/{len(documents)} documents sauvegardes")

def save_to_chromadb(documents):
    """Sauvegarde dans Chroma Cloud (vecteurs)"""
    if not documents:
        print("\n[WARN] Aucun document a sauvegarder dans Chroma Cloud")
        return

    print(f"\n[CHROMA] Indexation Chroma Cloud...")

    try:
        # Preparer les donnees
        ids = [doc['id'] for doc in documents]
        texts = [doc['content'] for doc in documents]
        metadatas = [{
            'title': doc['title'],
            'category': doc['category'],
            'url': doc['url']
        } for doc in documents]

        # Chroma Cloud genere automatiquement les embeddings
        collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas
        )

        print(f"  [OK] {len(documents)} documents indexes dans Chroma Cloud")
        print(f"  [INFO] Total dans Chroma Cloud: {collection.count()} documents")

    except Exception as e:
        print(f"  [ERROR] Erreur Chroma Cloud: {e}")

def main():
    """Fonction principale"""
    print("=" * 60)
    print("LEXIA - Scraping Legislation Ivoirienne")
    print("=" * 60)

    all_documents = []

    # Scraper chaque site
    for name, url in SITES.items():
        docs = scrape_site(name, url)
        all_documents.extend(docs)

        # Pause entre chaque site
        if docs:
            time.sleep(3)

    # Sauvegarder
    if all_documents:
        save_to_prisma(all_documents)
        save_to_chromadb(all_documents)
    else:
        print("\n[WARN] Aucun document trouve!")
        print("[INFO] Conseil: Les sites ont peut-etre change leur structure.")
        print("   Inspecte les sites et ajuste les selecteurs CSS dans ce script.")

    print("\n" + "=" * 60)
    print(f"[DONE] TERMINE - {len(all_documents)} documents scrapes")
    print(f"[INFO] Chroma Cloud: {collection.count()} documents au total")
    print("[OK] Disponibles pour Next.js maintenant!")
    print("=" * 60)

    # Fermer les connexions
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()
