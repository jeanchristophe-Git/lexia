# 🇨🇮 LexIA - Assistant Juridique Côte d'Ivoire

Assistant IA juridique spécialisé dans la législation ivoirienne, combinant scraping de sources officielles, recherche vectorielle et IA pour répondre aux questions juridiques.

## 🎯 Vue d'ensemble

**LexIA** est un système complet qui :
1. **Scrape** les sites officiels ivoiriens (Journal Officiel, CEPICI, DGI)
2. **Stocke** les données dans PostgreSQL (Prisma) + Neon Vector (recherche vectorielle)
3. **Répond** aux questions avec Groq en utilisant le RAG (Retrieval-Augmented Generation)
4. **Interface** moderne type ChatGPT pour l'expérience utilisateur

### Le flow complet

```
Utilisateur → Next.js API → Neon Vector (recherche) → Groq (génération) → Réponse + Sources
                  ↓
            PostgreSQL (stockage)
                  ↑
         Python Scraper (automatisé)
```

## 🚀 Fonctionnalités

- **Interface ChatGPT** : Design moderne avec sidebar et messages en temps réel
- **RAG juridique** : Recherche vectorielle dans les textes de loi ivoiriens
- **Sources officielles** : Journal Officiel, CEPICI, DGI, codes juridiques
- **Scraping automatisé** : Mise à jour quotidienne des nouvelles lois
- **Responsive** : Interface adaptée mobile/desktop
- **Conversations persistantes** : Historique sauvegardé

## 🛠 Stack Technique

### Frontend
- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** + **Shadcn/ui**
- **Zustand** pour la gestion d'état
- **Framer Motion** pour les animations

### Backend & IA
- **Groq** (LLaMA 3.1 70B) pour la génération de réponses
- **Neon Vector (pgvector)** pour la recherche vectorielle (embeddings)
- **PostgreSQL** + **Prisma** pour le stockage structuré
- **Python** pour le scraping (BeautifulSoup/Selenium)

## 📁 Structure du projet

```
legit/
├── app/                          # Frontend Next.js
│   ├── api/chat/route.ts         # API route pour Groq + Neon Vector
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Interface chat
│
├── components/
│   ├── chat/                     # Composants chat
│   ├── layout/                   # Header/Sidebar
│   └── legal/                    # Composants juridiques
│
├── lib/
│   ├── vectordb.ts               # Client Neon Vector
│   └── groq.ts                   # Client Groq
│
├── prisma/
│   └── schema.prisma             # Modèles DB (LegalDocument, embeddings, etc.)
│
└── scraper/                      # Scripts Python
    ├── scraper_with_pgvector.py  # Scraper avec Neon Vector
    ├── requirements.txt          # Dépendances Python
    └── seed_data.py              # Initialisation données
```

## 🎨 Design System

### Couleurs (Style ChatGPT)
- **Primary**: #000000 (texte principal)
- **Secondary**: #6B7280 (texte secondaire)
- **Background**: #FFFFFF (fond principal)
- **Sidebar**: #F9FAFB (fond sidebar)
- **Border**: #D1D5DB (bordures)

### Typography
- **Titre**: Inter 24px bold
- **Sous-titre**: Inter 18px semibold
- **Texte**: Inter 14px regular
- **Code juridique**: JetBrains Mono 13px

## 🔧 Installation

### 1. Prérequis
```bash
# Installations nécessaires
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
```

### 2. Variables d'environnement
Créer `.env` à la racine :
```env
# Base de données Neon avec pgvector
DATABASE_URL="postgresql://user:password@localhost:5432/lexia"

# API Keys
GROQ_API_KEY="gsk_..."
```

### 3. Setup Backend
```bash
# Installer dépendances Node.js
npm install

# Setup Prisma
npx prisma generate
npx prisma db push

# Installer dépendances Python
cd scrapers
pip install -r requirements.txt
```

### 4. Premier scraping
```bash
cd scrapers
python scraper_simple.py
# Patiente 5-10 min pour le scraping initial
```

### 5. Lancer l'application
```bash
# Dev mode
npm run dev

# Production
npm run build
npm start
```

App disponible sur `http://localhost:3000`

## 💼 Fonctionnalités juridiques

### Questions supportées
- Création d'entreprises (SARL, SA, SAS, SUARL)
- Droit du travail (SMIG, contrats, licenciement)
- Commerce et licences (import/export, patentes)
- Fiscalité (TVA, IS, impôts, déclarations)
- Droit de la famille (mariage, héritage)
- Procédures administratives

### Sources scrapées
- **Journal Officiel** (jo.gouv.ci) - Lois et décrets
- **CEPICI** (cepici.ci) - Création d'entreprises
- **DGI** (dgi.gouv.ci) - Fiscalité
- **Codes juridiques** - Commerce, Travail, Famille
- **CIVILII** (si disponible) - Base légale complète

## 🔗 API Routes

### `/api/chat` (POST)
Endpoint principal pour les questions juridiques.

**Request:**
```json
{
  "question": "Comment créer une SARL en Côte d'Ivoire ?",
  "conversationId": "uuid-optional"
}
```

**Response:**
```json
{
  "answer": "Pour créer une SARL en CI, voici les étapes...",
  "sources": [
    {
      "title": "Code de Commerce - Art. 123",
      "url": "https://jo.gouv.ci/...",
      "snippet": "Les SARL sont constituées par..."
    }
  ],
  "conversationId": "uuid"
}
```

**Process interne:**
1. Neon Vector recherche les 5 documents les plus pertinents (pgvector)
2. Groq génère la réponse avec le contexte
3. Sauvegarde dans PostgreSQL via Prisma

## 📱 Responsive Design

- **Desktop**: Sidebar 280px + Chat central + Panel sources 320px
- **Tablet**: Sidebar overlay + Chat pleine largeur
- **Mobile**: Navigation bottom tabs + Drawer sidebar

## ⚖️ Disclaimers juridiques

- Information générale, pas de conseil personnalisé
- Recommandation de consulter un avocat CI
- Références aux sources officielles CIVILII
- Liens vers l'Ordre des Avocats de CI

## 🔐 Sécurité

- Headers de sécurité configurés
- Pas de stockage de données sensibles
- Validation TypeScript stricte
- Sanitisation des entrées utilisateur

## 📈 Performance

- Server Components Next.js 15
- Lazy loading des composants
- Optimisation des images
- Cache des conversations locales

## 🤖 Comment ça marche (RAG)

### 1. Scraping (Python)
```python
# Visite les sites officiels
articles = scraper.extraire("jo.gouv.ci")

# Sauvegarde PostgreSQL avec embeddings
prisma.legalDocument.create(articles)

# Les embeddings sont stockés directement dans PostgreSQL (pgvector)
```

### 2. Question utilisateur
```typescript
// Next.js API route - Recherche vectorielle avec pgvector
const results = await prisma.$queryRaw`
  SELECT * FROM legal_documents
  ORDER BY embedding <-> ${queryEmbedding}
  LIMIT 5
`

const response = await groq.chat({
  model: "llama-3.1-70b",
  messages: [
    { role: "system", content: "Tu es un assistant juridique CI..." },
    { role: "user", content: question + contexte }
  ]
})
```

## 🔄 Automatisation Scraping

### Setup cron (Linux/Mac)
```bash
# Éditer crontab
crontab -e

# Ajouter (scraping tous les jours à 2h du matin)
0 2 * * * cd /path/to/legit/scrapers && python scraper_simple.py >> ../data/logs/scraper.log 2>&1
```

### Windows Task Scheduler
```powershell
# Créer tâche planifiée
schtasks /create /tn "LexIA Scraper" /tr "C:\Python39\python.exe C:\legit\scrapers\scraper_simple.py" /sc daily /st 02:00
```

## 🐛 Troubleshooting

### Erreur Groq API
```bash
# Vérifier la clé
echo $GROQ_API_KEY

# Limites gratuites: 30 req/min, 6000 tokens/req
# Attendre 1 minute ou upgrade le plan
```

### Scraper bloqué
```python
# Ajouter user-agent + délais
headers = {'User-Agent': 'Mozilla/5.0...'}
time.sleep(2)  # Entre chaque requête
```

### Base de données vide
```bash
# Vérifier Prisma
npx prisma studio

# Relancer scraping
cd scrapers && python scraper_simple.py
```

## 🌍 Déploiement Production

### Option 1: VPS (Recommandé)
```bash
# Ubuntu 22.04 + Docker
docker compose up -d  # PostgreSQL + ChromaDB + Next.js
```

### Option 2: Vercel + Neon
- **Frontend**: Vercel (Next.js)
- **Database**: Neon PostgreSQL (avec pgvector activé)
- **Scraper**: GitHub Actions ou Cron Job VPS

## 📚 Ressources

- [Guide complet GUIDE_LEXIA.md](./GUIDE_LEXIA.md)
- [Neon PostgreSQL](https://neon.tech)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [Groq API](https://console.groq.com)
- [Prisma Docs](https://prisma.io/docs)

---

**Développé pour la Côte d'Ivoire 🇨🇮** | Données juridiques officielles | Open Source
