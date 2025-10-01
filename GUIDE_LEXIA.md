# 🇨🇮 LexIA - Guide Complet du Projet

> Guide pour comprendre LexIA si tu connais seulement Next.js, Prisma et les bases

---

## 📖 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Comment ça marche ?](#comment-ça-marche)
3. [C'est quoi ChromaDB ?](#cest-quoi-chromadb)
4. [Architecture du projet](#architecture-du-projet)
5. [Installation et setup](#installation-et-setup)
6. [Lancer le scraping](#lancer-le-scraping)
7. [Comment Next.js utilise les données](#comment-nextjs-utilise-les-données)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Vue d'ensemble

**LexIA** est un assistant juridique IA pour la Côte d'Ivoire qui :
1. **Scrape** les sites officiels ivoiriens (lois, codes, etc.)
2. **Stocke** les données dans PostgreSQL (Prisma) + ChromaDB
3. **Répond** aux questions avec Groq en utilisant ces données

### Le flow simple

```
┌─────────────┐
│  Utilisateur│
│   pose une  │
│   question  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────┐
│     Next.js API (/api/chat) │
│  1. Cherche docs pertinents │
│  2. Envoie à Groq + contexte│
│  3. Retourne réponse+sources│
└───────────┬─────────────────┘
            │
            ├──────────────┬──────────────┐
            ▼              ▼              ▼
      ┌──────────┐   ┌──────────┐   ┌──────────┐
      │PostgreSQL│   │ChromaDB  │   │  Groq    │
      │ (Prisma) │   │(Vecteurs)│   │  (IA)    │
      └──────────┘   └──────────┘   └──────────┘
            ▲              ▲
            │              │
            └──────┬───────┘
                   │
         ┌─────────────────────┐
         │  Python Scraper     │
         │  (Lance 1x/jour)    │
         └─────────────────────┘
```

---

## 🤔 Comment ça marche ?

### Partie 1 : Le scraping (Python)

Le script Python `scraper_simple.py` fait ça :

```python
# 1. Va sur les sites officiels
sites = ["jo.gouv.ci", "cepici.ci", "dgi.gouv.ci"]

# 2. Extrait les articles de loi
articles = extraire_articles(sites)

# 3. Sauvegarde dans 2 endroits
PostgreSQL.save(articles)   # → Pour historique/metadata
ChromaDB.save(articles)     # → Pour recherche intelligente
```

**Pourquoi 2 endroits ?**
- **PostgreSQL** (Prisma) : Stockage classique, historique
- **ChromaDB** : Moteur de recherche intelligent (expliqué plus bas)

### Partie 2 : L'API Next.js

Quand un user pose une question :

```typescript
// app/api/chat/route.ts

export async function POST(request) {
  const { question } = await request.json();

  // 1️⃣ CHERCHE les docs pertinents dans ChromaDB
  const docs = await chromaDB.search(question); // Top 5 articles

  // 2️⃣ CONSTRUIT le contexte pour l'IA
  const context = docs.map(d => d.content).join('\n');

  // 3️⃣ ENVOIE à Groq
  const response = await groq.chat({
    messages: [
      { role: 'system', content: 'Tu es LexIA...' },
      { role: 'system', content: `Documents: ${context}` },
      { role: 'user', content: question }
    ]
  });

  // 4️⃣ RETOURNE la réponse + sources
  return { answer: response, sources: docs };
}
```

---

## 🔍 C'est quoi ChromaDB ?

**ChromaDB = Google mais pour tes documents juridiques**

### Le problème sans ChromaDB

```
User: "Quel est le régime fiscal des startups ?"

❌ Recherche SQL classique:
SELECT * FROM documents
WHERE content LIKE '%régime%'
   OR content LIKE '%fiscal%'
   OR content LIKE '%startup%'

→ Trouve 1000 résultats non pertinents
→ L'IA est perdue avec trop d'infos
→ Répond n'importe quoi
```

### La solution avec ChromaDB

```
User: "Quel est le régime fiscal des startups ?"

✅ ChromaDB comprend le SENS:
→ Trouve les 5 articles LES PLUS pertinents:
  1. Code Investissement Art.25 (exonérations)
  2. Loi fiscale startups 2023
  3. Décret avantages jeunes entreprises

→ L'IA lit SEULEMENT ces 5 articles
→ Répond avec précision et sources
```

### Comment ChromaDB fait ça ?

ChromaDB transforme le texte en **vecteurs** (nombres) :

```
"Créer une SARL" → [0.2, 0.8, 0.1, 0.5, ...]
"Fonder une société" → [0.21, 0.79, 0.12, 0.48, ...]
                        ↑ Très similaire !

"Régime fiscal" → [0.9, 0.1, 0.7, 0.2, ...]
                   ↑ Complètement différent
```

Il trouve les textes avec des vecteurs **proches** = sens similaire.

**En gros : ChromaDB comprend que "SARL" et "société" parlent de la même chose, même sans mot-clé exact.**

---

## 🏗️ Architecture du projet

### Next.js (Frontend + API) - Ce que tu connais déjà

```
app/
├── page.tsx              → Dashboard React
├── api/
│   └── chat/
│       └── route.ts      → API qui répond aux questions
└── historique/
    └── page.tsx          → Page historique (à créer)

prisma/
└── schema.prisma         → Models : User, Conversation, LegalDocument
```

### Python (Scraping) - Nouveau pour toi

```
scraper/
├── scraper_simple.py     → Script principal
│   ├─ scrape_sites()     → Va chercher les lois
│   ├─ save_to_prisma()   → Sauvegarde PostgreSQL
│   └─ save_to_chroma()   → Sauvegarde ChromaDB
│
├── chromadb_setup.py     → Initialise ChromaDB
├── requirements.txt      → Comme package.json mais Python
└── .env.example          → Variables d'environnement
```

### ChromaDB (Base vectorielle) - Nouvelle tech

```
data/
└── chroma_db/            → Fichiers générés automatiquement
    ├── index/            → Index des vecteurs
    └── data/             → Données
```

**Tu n'as JAMAIS à toucher ces fichiers** - ChromaDB gère tout.

---

## 🚀 Installation et setup

### 1. Vérifier que Python est installé

```bash
python --version
# Doit afficher : Python 3.10 ou plus
```

Si pas installé :
- **macOS** : `brew install python`
- **Windows** : Télécharge sur python.org
- **Linux** : `sudo apt install python3`

### 2. Installer les dépendances Python

```bash
cd scraper
pip install -r requirements.txt
```

**C'est comme `npm install` mais pour Python.**

### 3. Configurer le `.env`

Tu as déjà `DATABASE_URL` dans ton `.env` Next.js ? Parfait !

Vérifie juste que c'est bien là :

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/lexia"
GROQ_API_KEY="gsk_..."
```

Le script Python va utiliser les **mêmes** variables.

### 4. Créer les tables Prisma (si pas déjà fait)

```bash
npx prisma db push
```

---

## 🕷️ Lancer le scraping

### Première fois

```bash
cd scraper
python scraper_simple.py
```

**Tu vas voir :**

```
✅ Connecté à PostgreSQL (Prisma)
✅ ChromaDB initialisé

📥 Scraping journal_officiel...
  ✓ Loi n°2024-123 relative aux sociétés
  ✓ Décret n°2024-456 portant création

📥 Scraping cepici...
  ✓ Guide création entreprise
  ✓ Procédures investissement

💾 Sauvegarde PostgreSQL...
  ✓ 25 documents sauvegardés

🔢 Sauvegarde ChromaDB...
  ✓ 25 vecteurs générés et indexés

🎉 TERMINÉ - 25 documents scrapés
```

### Vérifier dans Prisma

```bash
npx prisma studio
```

Va sur la table `LegalDocument` → Tu dois voir tes 25 documents !

### Scraping automatique (optionnel)

Pour scraper tous les jours automatiquement :

**macOS/Linux** :
```bash
# Ouvrir crontab
crontab -e

# Ajouter cette ligne (scrape tous les jours à 2h du matin)
0 2 * * * cd /chemin/vers/ton/projet/scraper && python scraper_simple.py
```

**Windows** : Utilise le Planificateur de tâches

---

## 🔗 Comment Next.js utilise les données

### Dans ton API route : `app/api/chat/route.ts`

```typescript
import { ChromaClient } from 'chromadb';

// 🔗 Connexion à ChromaDB (données scrapées)
const client = new ChromaClient({
  path: './data/chroma_db'
});

export async function POST(request: NextRequest) {
  const { question } = await request.json();

  // 1️⃣ RECHERCHE dans ChromaDB
  const collection = await client.getCollection({
    name: 'lexia_legal_docs'
  });

  const results = await collection.query({
    queryTexts: [question],
    nResults: 5  // Top 5 docs pertinents
  });

  // 2️⃣ CONTEXTE pour Groq
  const context = results.documents[0]
    .map((doc, i) => {
      const meta = results.metadatas[0][i];
      return `SOURCE: ${meta.title}\n${doc}`;
    })
    .join('\n\n---\n\n');

  // 3️⃣ GROQ génère la réponse
  const messages = [
    { role: 'system', content: LEXIA_SYSTEM_PROMPT },
    { role: 'system', content: `Documents:\n${context}` },
    { role: 'user', content: question }
  ];

  const response = await groq.chat.completions.create({
    messages,
    model: 'llama-3.3-70b-versatile'
  });

  // 4️⃣ RETOURNE avec sources
  return NextResponse.json({
    answer: response.choices[0].message.content,
    sources: results.metadatas[0].map(m => ({
      title: m.title,
      url: m.url
    }))
  });
}
```

### Installer ChromaDB pour Next.js

```bash
npm install chromadb
```

---

## 🧪 Tester le système complet

### Test 1 : Vérifier ChromaDB

```bash
cd scraper
python chromadb_setup.py
```

Doit afficher :
```
✅ ChromaDB opérationnel
📊 Documents indexés : 25
```

### Test 2 : Tester l'API Next.js

Lance ton serveur :
```bash
npm run dev
```

Test avec curl :
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Comment créer une SARL en Côte d'Ivoire ?\"}"
```

Tu devrais recevoir une réponse avec sources !

### Test 3 : Tester le Dashboard

Va sur `http://localhost:3000`

Pose une question dans l'interface → Tu dois voir :
- La question s'affiche
- Loading avec les 3 points
- Réponse de LexIA avec sources

---

## 🔧 Troubleshooting

### Erreur : "No module named 'chromadb'"

**Solution :**
```bash
cd scraper
pip install chromadb
```

### Erreur : "Could not connect to database"

**Solution :**
Vérifie que PostgreSQL tourne :
```bash
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Démarre PostgreSQL via Services ou pgAdmin
```

### ChromaDB : "Collection not found"

**Solution :**
Relance le scraper pour créer la collection :
```bash
python scraper_simple.py
```

### API Next.js : "chromadb is not defined"

**Solution :**
Installe chromadb pour Node.js :
```bash
npm install chromadb
```

### Le scraper trouve 0 documents

**Raison :** Les sélecteurs CSS ne matchent pas la structure du site.

**Solution :**
1. Ouvre le site dans le navigateur
2. Inspecte l'élément (F12)
3. Trouve les vrais sélecteurs CSS
4. Modifie `scraper_simple.py` ligne 45

Exemple :
```python
# Au lieu de
articles = soup.find_all('article')

# Utilise ce que tu trouves dans l'inspecteur
articles = soup.select('div.legal-document')
```

---

## 📚 Ressources pour apprendre

### Si tu veux comprendre Python

- [Python en 10 min](https://learnxinyminutes.com/docs/python/)
- C'est comme JavaScript mais avec des `:` au lieu de `{}`

### Si tu veux comprendre ChromaDB

- [ChromaDB Docs](https://docs.trychroma.com/)
- Pense à ça comme Algolia mais pour la recherche sémantique

### Si tu veux améliorer le scraping

- [BeautifulSoup Docs](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- C'est comme `document.querySelector()` en Python

---

## 🎯 Prochaines étapes

### V1 (Actuel)
✅ Scraping de base
✅ Stockage PostgreSQL
✅ ChromaDB pour recherche
✅ API Next.js fonctionnelle

### V2 (À venir)
- [ ] Scraper plus de sources officielles
- [ ] Page historique des conversations
- [ ] Export des réponses en PDF
- [ ] Authentification utilisateurs

### V3 (Futur)
- [ ] Scraping automatique quotidien
- [ ] Notifications nouvelles lois
- [ ] Abonnement premium
- [ ] App mobile

---

## 💡 Points clés à retenir

1. **Python scrape** → **Sauvegarde dans Prisma + ChromaDB**
2. **Next.js lit** → **ChromaDB trouve docs pertinents**
3. **Groq répond** → **Avec contexte des docs**
4. **Tu n'as pas besoin de tout comprendre** → Lance les scripts, ça marche !

---

## 🆘 Besoin d'aide ?

Si quelque chose ne marche pas :
1. Lis la section Troubleshooting ci-dessus
2. Check les logs Python : `python scraper_simple.py 2>&1 | tee scraper.log`
3. Check les logs Next.js dans la console

---

**Fait avec ❤️ pour la Côte d'Ivoire** 🇨🇮
