"""
Script pour ajouter des donnees de test dans ChromaDB
"""

import os
import sys
import sqlite3
import chromadb
from chromadb.config import Settings
from dotenv import load_dotenv
import re

# Charger les variables d'environnement
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dotenv_path = os.path.join(parent_dir, '.env')
load_dotenv(dotenv_path)

DATABASE_URL = os.getenv("DATABASE_URL")
CHROMA_PATH = os.path.join(parent_dir, "data", "chroma_db")

# Extraire chemin SQLite
db_path_match = re.search(r'file:(.*\.db)', DATABASE_URL)
if db_path_match:
    db_path = os.path.join(parent_dir, db_path_match.group(1).replace('./', ''))
else:
    print("[ERROR] Format DATABASE_URL invalide")
    sys.exit(1)

# Donnees de test juridiques pour la Cote d'Ivoire
TEST_DOCUMENTS = [
    {
        'id': 'test_sarl_001',
        'title': 'Code des Societes - Article 25: Creation de SARL',
        'category': 'code_societes',
        'content': """Article 25 - Creation d'une Societe a Responsabilite Limitee (SARL)

La SARL est constituee par une ou plusieurs personnes qui ne supportent les pertes qu'a concurrence de leurs apports. Le capital social minimum est fixe a 1.000.000 FCFA.

La SARL doit etre immatriculee au Registre du Commerce et du Credit Mobilier (RCCM) du lieu de son siege social.

Les statuts doivent contenir:
- La denomination sociale
- La forme juridique
- L'objet social
- Le siege social
- Le capital social
- La duree de la societe
- Les modalites de fonctionnement

Le gerant est nomme dans les statuts ou par acte ulterieur. Il engage la societe par ses actes.

Les associes se reunissent en assemblee generale au moins une fois par an pour approuver les comptes.
        """,
        'url': 'https://example.ci/code-societes'
    },
    {
        'id': 'test_fiscal_002',
        'title': 'Code General des Impots - Article 15: Regime fiscal des entreprises',
        'category': 'fiscalite',
        'content': """Article 15 - Imposition des benefices des entreprises

Les entreprises etablies en Cote d'Ivoire sont soumises a l'impot sur les benefices industriels et commerciaux (BIC).

Le taux de l'impot est fixe a:
- 25% pour les grandes entreprises
- 20% pour les PME dont le chiffre d'affaires est inferieur a 200 millions FCFA

Les entreprises nouvellement creees beneficient d'une exoneration de 2 ans sous certaines conditions.

Les startups agréées par le Ministère de l'Economie Numerique beneficient d'un regime fiscal preferentiel pendant 5 ans.

Declarations obligatoires:
- Declaration mensuelle de TVA
- Declaration trimestrielle de l'acompte BIC
- Declaration annuelle des resultats
        """,
        'url': 'https://example.ci/cgi'
    },
    {
        'id': 'test_invest_003',
        'title': 'Code des Investissements - Article 10: Incitations fiscales',
        'category': 'investissement',
        'content': """Article 10 - Regime des investissements prives

Les investisseurs prives beneficient d'avantages fiscaux et douaniers selon le secteur d'activite:

Regime A (Industries manufacturieres):
- Exoneration de droits de douane sur equipements
- Exoneration d'impot sur les benefices pendant 5 ans
- Reduction de 50% de la patente pendant 5 ans

Regime B (Services):
- Exoneration de droits de douane sur equipements
- Reduction de 50% de l'impot sur les benefices pendant 3 ans

Conditions d'eligibilite:
- Investissement minimum de 50 millions FCFA
- Creation d'au moins 10 emplois permanents
- Obtention d'un agrement du CEPICI

Le dossier de demande doit etre depose au guichet unique du CEPICI avec:
- Etude de faisabilite
- Plan de financement
- Chronogramme de realisation
        """,
        'url': 'https://example.ci/code-investissements'
    },
    {
        'id': 'test_travail_004',
        'title': 'Code du Travail - Article 5: Contrat de travail',
        'category': 'droit_travail',
        'content': """Article 5 - Contrat de travail a duree determinee et indeterminee

Le contrat de travail peut etre conclu:
- A duree indeterminee (CDI)
- A duree determinee (CDD) pour une duree maximale de 2 ans renouvelable une fois

CDI:
- Periode d'essai: 1 a 6 mois selon la categorie
- Preavis de demission: 1 a 3 mois
- Indemnite de licenciement: 30% du salaire mensuel par annee d'anciennete

CDD:
- Periode d'essai: 15 jours
- Renouvellement possible une fois
- Transformation en CDI au-dela de 2 ans

Salaire minimum (SMIG): 60.000 FCFA par mois

Conges payes: 2 jours ouvrables par mois de service effectif

Jours feries: 11 jours feries payes par an
        """,
        'url': 'https://example.ci/code-travail'
    },
    {
        'id': 'test_cepici_005',
        'title': 'CEPICI - Procedure de creation d\'entreprise',
        'category': 'procedures',
        'content': """Procedure de creation d'entreprise en Cote d'Ivoire

Le CEPICI (Centre de Promotion des Investissements en Cote d'Ivoire) offre un guichet unique pour creer son entreprise en 48h.

Etapes:
1. Depot du dossier au CEPICI
2. Verification de la disponibilite de la denomination
3. Enregistrement des statuts
4. Immatriculation au RCCM
5. Declaration fiscale (DFE)
6. Inscription CNPS

Documents requis:
- Statuts en 4 exemplaires
- Piece d'identite du gerant
- Justificatif de domicile du siege social
- Declaration sur l'honneur de non-condamnation

Couts:
- Frais CEPICI: 25.000 FCFA
- Frais RCCM: Variable selon le capital
- Frais DFE: Gratuit
- Total moyen: 50.000 a 100.000 FCFA

Guichet unique situe a:
CEPICI, Boulevard Carde, Plateau, Abidjan
Tel: +225 20 21 74 00
        """,
        'url': 'https://www.cepici.ci/procedures'
    }
]

print("[SEED] Ajout de donnees de test...")

# Connexion SQLite
print(f"[DB] Connexion a {db_path}...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Connexion ChromaDB
print(f"[CHROMA] Connexion a ChromaDB...")
client = chromadb.PersistentClient(
    path=CHROMA_PATH,
    settings=Settings(anonymized_telemetry=False)
)
collection = client.get_or_create_collection(
    name="lexia_legal_docs",
    metadata={"description": "Documents juridiques CI"}
)

# Inserer dans SQLite
print("\n[DB] Insertion dans SQLite...")
for doc in TEST_DOCUMENTS:
    try:
        cursor.execute("""
            INSERT OR REPLACE INTO LegalDocument
            (id, title, category, contentPreview, sourceUrl, scrapedAt, createdAt)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        """, (
            doc['id'],
            doc['title'],
            doc['category'],
            doc['content'][:500],
            doc['url']
        ))
        print(f"  [OK] {doc['title']}")
    except Exception as e:
        print(f"  [ERROR] {doc['id']}: {e}")

conn.commit()

# Inserer dans ChromaDB
print("\n[CHROMA] Insertion dans ChromaDB...")
try:
    collection.upsert(
        ids=[doc['id'] for doc in TEST_DOCUMENTS],
        documents=[doc['content'] for doc in TEST_DOCUMENTS],
        metadatas=[{
            'title': doc['title'],
            'category': doc['category'],
            'url': doc['url']
        } for doc in TEST_DOCUMENTS]
    )
    print(f"  [OK] {len(TEST_DOCUMENTS)} documents indexes")
except Exception as e:
    print(f"  [ERROR] {e}")

print(f"\n[INFO] Total dans ChromaDB: {collection.count()} documents")

# Test de recherche
print("\n[TEST] Test de recherche...")
results = collection.query(
    query_texts=["Comment creer une SARL en Cote d'Ivoire?"],
    n_results=2
)

if results['documents'] and results['documents'][0]:
    print(f"[OK] Trouve {len(results['documents'][0])} resultats:\n")
    for i, doc in enumerate(results['documents'][0]):
        meta = results['metadatas'][0][i]
        print(f"{i+1}. {meta['title']}")
        print(f"   Extrait: {doc[:150]}...\n")

print("\n" + "=" * 60)
print("[OK] Donnees de test ajoutees avec succes!")
print("=" * 60)

cursor.close()
conn.close()
