"""
Test ChromaDB - Vérifie que tout fonctionne
Lance ce script pour vérifier que ChromaDB est bien configuré
"""

import os
import sys
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le dossier parent
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

CHROMA_PATH = os.path.join(parent_dir, "data", "chroma_db")

print("[CHROMADB] Connexion a ChromaDB...")
print(f"[PATH] Chemin: {CHROMA_PATH}")

# Créer le dossier si nécessaire
os.makedirs(CHROMA_PATH, exist_ok=True)

try:
    client = chromadb.PersistentClient(
        path=CHROMA_PATH,
        settings=Settings(anonymized_telemetry=False)
    )

    collection = client.get_or_create_collection(
        name="lexia_legal_docs",
        metadata={"description": "Documents juridiques CI"}
    )

    doc_count = collection.count()

    print(f"[OK] ChromaDB operationnel")
    print(f"[INFO] Documents indexes : {doc_count}")

    # Test de recherche si des documents existent
    if doc_count > 0:
        print("\n[TEST] Test de recherche...")

        results = collection.query(
            query_texts=["SARL société entreprise"],
            n_results=min(3, doc_count)
        )

        if results['documents'] and results['documents'][0]:
            print(f"[OK] Trouve {len(results['documents'][0])} resultats\n")

            for i, doc in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i]
                print(f"{i+1}. {meta.get('title', 'Sans titre')}")
                print(f"   Catégorie: {meta.get('category', 'N/A')}")
                print(f"   Extrait: {doc[:150]}...\n")
        else:
            print("[WARN] Aucun resultat trouve pour la recherche")

    else:
        print("\n[INFO] Aucun document dans ChromaDB pour le moment")
        print("   Lance 'python scraper_simple.py' pour commencer le scraping!")

    print("\n" + "=" * 60)
    print("[OK] Test ChromaDB termine avec succes")
    print("=" * 60)

except Exception as e:
    print(f"\n[ERROR] Erreur lors du test ChromaDB:")
    print(f"   {str(e)}")
    print("\n[INFO] Conseil: Verifie que chromadb est bien installe:")
    print("   pip install chromadb")
    sys.exit(1)
