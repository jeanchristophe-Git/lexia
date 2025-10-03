"""
Scraper avec embeddings pgvector pour Neon PostgreSQL
Retire ChromaDB et utilise directement pgvector dans Neon
"""

import os
import sys
import psycopg2
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le dossier parent
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

print("=" * 80)
print("🚀 SCRAPER PGVECTOR - LexIA")
print("=" * 80)

# Connexion PostgreSQL Neon
database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("❌ DATABASE_URL non trouvée dans .env")
    sys.exit(1)

print(f"\n📡 Connexion à Neon PostgreSQL...")
try:
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    print("✅ Connecté à Neon PostgreSQL")
except Exception as e:
    print(f"❌ Erreur connexion PostgreSQL: {e}")
    sys.exit(1)

# Vérifier que pgvector est activé
print("\n🔍 Vérification de l'extension pgvector...")
try:
    cursor.execute("SELECT * FROM pg_extension WHERE extname = 'vector';")
    result = cursor.fetchone()
    if result:
        print("✅ Extension pgvector activée")
    else:
        print("⚠️  Extension pgvector NON activée")
        print("   Allez dans Neon Console > SQL Editor et exécutez:")
        print("   CREATE EXTENSION IF NOT EXISTS vector;")
        sys.exit(1)
except Exception as e:
    print(f"❌ Erreur vérification pgvector: {e}")
    sys.exit(1)

# Charger le modèle d'embeddings (384 dimensions)
print("\n📥 Chargement du modèle d'embeddings (all-MiniLM-L6-v2)...")
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print("✅ Modèle chargé (384 dimensions)")
except Exception as e:
    print(f"❌ Erreur chargement modèle: {e}")
    print("   Installez: pip install sentence-transformers")
    sys.exit(1)

# Documents juridiques de test (basés sur OHADA et législation ivoirienne)
documents = [
    {
        "id": "ohada_sarl_capital",
        "title": "OHADA - Capital SARL",
        "category": "droit_societes",
        "content": "Le capital social de la SARL doit être intégralement souscrit. Les apports en numéraire doivent être libérés d'au moins le quart de leur montant lors de la constitution.",
        "url": "https://ohada.com"
    },
    {
        "id": "ci_capital_minimum",
        "title": "Capital minimum SARL Côte d'Ivoire",
        "category": "creation_entreprise",
        "content": "En Côte d'Ivoire, le capital minimum pour une SARL est fixé à un million (1.000.000) de francs CFA.",
        "url": "https://cepici.ci"
    },
    {
        "id": "cepici_procedure_sarl",
        "title": "CEPICI - Guide création SARL",
        "category": "creation_entreprise",
        "content": "Procédure de création SARL : 1. Réservation dénomination 2. Rédaction statuts 3. Dépôt capital 4. Enregistrement 5. RCCM 6. NIF. Délai: 5-10 jours. Coût: 150-300k FCFA.",
        "url": "https://cepici.ci"
    },
    {
        "id": "sasu_definition",
        "title": "Forme juridique - SASU",
        "category": "droit_societes",
        "content": "SASU : Société par Actions Simplifiée Unipersonnelle. Permet à un entrepreneur seul de créer une société. Capital minimum: 1.000.000 FCFA.",
        "url": "https://cepici.ci"
    },
    {
        "id": "fiscalite_is",
        "title": "DGI - Impôt sur les Sociétés",
        "category": "fiscalite",
        "content": "Taux IS : 25% du bénéfice imposable. Déclaration annuelle avant 30 avril. Acomptes provisionnels trimestriels.",
        "url": "https://dgi.gouv.ci"
    },
    {
        "id": "travail_contrat_cdd",
        "title": "Code du Travail - CDD",
        "category": "droit_travail",
        "content": "Le CDD ne peut excéder 2 ans, renouvellement compris. Doit mentionner motif, durée, description du poste. Prime de précarité = 6% du salaire brut total.",
        "url": "https://travail.gouv.ci"
    },
    {
        "id": "travail_conge_annuel",
        "title": "Code du Travail - Congés payés",
        "category": "droit_travail",
        "content": "Tout travailleur a droit à 2,5 jours ouvrables de congé par mois de service effectif, soit 30 jours par an. Indemnité de congé = salaire habituel.",
        "url": "https://travail.gouv.ci"
    },
    {
        "id": "ohada_sa_conseil",
        "title": "OHADA - Conseil d'administration SA",
        "category": "droit_societes",
        "content": "La SA est administrée par un conseil d'administration composé de 3 à 12 membres. Mandat: 6 ans maximum renouvelable.",
        "url": "https://ohada.com"
    },
    {
        "id": "bail_commercial",
        "title": "Droit Commercial - Bail commercial",
        "category": "droit_commercial",
        "content": "Durée minimale du bail commercial: 2 ans. Loyer révisable selon indice. Droit au renouvellement sauf motif grave.",
        "url": "https://justice.ci"
    },
    {
        "id": "ohada_faillite",
        "title": "OHADA - Procédure collective",
        "category": "droit_commercial",
        "content": "En cas de cessation de paiements, le débiteur doit se déclarer dans les 30 jours. Procédures: règlement préventif, redressement judiciaire, liquidation des biens.",
        "url": "https://ohada.com"
    },
]

print(f"\n💾 Insertion de {len(documents)} documents juridiques...")
print("-" * 80)

success_count = 0
error_count = 0

for i, doc in enumerate(documents, 1):
    print(f"\n[{i}/{len(documents)}] 📄 {doc['title']}")
    print(f"    Catégorie: {doc['category']}")

    try:
        # Générer embedding
        embedding = model.encode(doc['content'])
        embedding_list = embedding.tolist()
        embedding_str = '[' + ','.join(map(str, embedding_list)) + ']'

        # Insérer dans PostgreSQL avec pgvector
        cursor.execute("""
            INSERT INTO "LegalDocument"
            (id, title, category, "contentPreview", "sourceUrl", embedding, "scrapedAt", "createdAt")
            VALUES (%s, %s, %s, %s, %s, %s::vector, NOW(), NOW())
            ON CONFLICT (id) DO UPDATE SET
                embedding = EXCLUDED.embedding,
                "scrapedAt" = NOW()
        """, (
            doc['id'],
            doc['title'],
            doc['category'],
            doc['content'],
            doc['url'],
            embedding_str
        ))
        conn.commit()
        print(f"    ✅ Indexé avec embedding (384 dimensions)")
        success_count += 1
    except Exception as e:
        conn.rollback()
        print(f"    ❌ Erreur: {e}")
        error_count += 1

print("\n" + "=" * 80)
print(f"✅ TERMINÉ - {success_count} documents indexés, {error_count} erreurs")
print("=" * 80)

# Statistiques
cursor.execute('SELECT COUNT(*) FROM "LegalDocument"')
total = cursor.fetchone()[0]
print(f"\n📊 Total de documents dans la base: {total}")

cursor.execute('SELECT category, COUNT(*) FROM "LegalDocument" GROUP BY category ORDER BY COUNT(*) DESC')
categories = cursor.fetchall()
print("\n📂 Documents par catégorie:")
for cat, count in categories:
    print(f"   - {cat}: {count}")

cursor.close()
conn.close()

print("\n✅ Indexation terminée avec succès!")
print("   Vous pouvez maintenant tester l'API chat avec RAG")
