# 🔐 Guide du Dashboard Admin LexIA

> Dashboard privé pour gérer et monitorer l'application LexIA

---

## 🎯 Accès au Dashboard

### 1. URL secrète
```
http://localhost:3000/sys-internal/auth
```

**🚨 IMPORTANT** : Cette URL est **privée** et **masquée**. Ne la partage JAMAIS publiquement.

### 2. Clé d'accès
Ta clé d'accès admin (définie dans `.env`) :
```
lexia-admin-x7k9m2p5-2024
```

**Pour production** : Change cette clé dans `.env` :
```env
ADMIN_ACCESS_KEY=ton-super-secret-unique-2024
```

### 3. Connexion

1. **Visite** : `http://localhost:3000/sys-internal/auth`
2. **Entre la clé** : `lexia-admin-x7k9m2p5-2024`
3. **Connecté !** : Tu es redirigé vers `/sys-internal/dashboard`

**Sécurité** :
- ✅ Token JWT signé (HttpOnly cookie)
- ✅ Session 24h automatique
- ✅ Middleware qui protège toutes les routes `/sys-internal/*`
- ✅ Déconnexion automatique après 24h

---

## 📊 Sections du Dashboard

### 1. **Vue d'ensemble** (`/sys-internal/dashboard`)

**Ce que tu vois :**
- 📊 Stats principales (documents, questions, visites, taux de succès)
- 📈 Graphique des 7 derniers jours
- 🕐 Activité récente en temps réel
- 📍 Top sources juridiques utilisées
- 🔌 État des services (ChromaDB, Groq, PostgreSQL)

**Actions rapides :**
- 🔄 Lancer le scraping
- 📊 Exporter les données
- 🧹 Nettoyer le cache

### 2. **ChromaDB Explorer** (`/sys-internal/dashboard/chromadb`)

**Fonctionnalités :**
- 📚 Liste de tous les documents vectoriels
- 🔍 **Recherche vectorielle en live** (comme dans l'app)
- 📊 Stats : total docs, sources, embeddings
- 📂 Répartition par source (jo.gouv.ci, cepici.ci, etc.)
- 🎯 Scores de similarité pour chaque résultat

**Utilisation :**
```
1. Entre une question : "Comment créer une SARL ?"
2. Clique "Rechercher"
3. Vois les 10 documents les + pertinents
4. Check le score de similarité (0-100%)
```

**Exemples de recherches :**
- "créer entreprise CI"
- "salaire minimum ivoirien"
- "déclaration TVA Côte d'Ivoire"
- "licenciement abusif sanctions"

### 3. **Analytics** (`/sys-internal/dashboard/analytics`)

**Métriques disponibles :**
- 📊 Visites (7j, 30j, total)
- 💬 Questions posées (top 10)
- 📚 Sources juridiques utilisées
- 📈 Tendances hebdomadaires
- ⚡ Performances (ChromaDB, Groq, PostgreSQL)
- 📑 Catégories de questions

**Insights :**
- Top questions → Améliorer ces réponses
- Sources populaires → Scraper + souvent
- Tendances → Adapter le contenu

### 4. **Gestion Système** (`/sys-internal/dashboard/system`)

**Monitoring :**
- 🔌 État des services (online/offline/degraded)
- 🔍 Statut du scraper (dernière exéc, durée, docs ajoutés)
- 📝 Logs système (24h)
- 💾 Utilisation ressources (CPU, RAM, disque)

**Actions disponibles :**
- 🚀 Lancer scraping manuel
- 🧹 Nettoyer cache
- 📊 Exporter données CSV
- 🗑️ Supprimer docs obsolètes

**Variables d'environnement :**
- Voir les clés (masquées pour sécurité)
- Vérifier configuration

### 5. **Base de données** (`/sys-internal/dashboard/database`)

**TODO : À implémenter**
- 📋 Conversations Prisma
- 👥 Utilisateurs actifs
- 🗄️ Export SQL
- 🔍 Recherche full-text

### 6. **Logs** (`/sys-internal/dashboard/logs`)

**TODO : À implémenter**
- 📝 Logs en temps réel
- 🔍 Filtrer par niveau (INFO, WARN, ERROR)
- 📅 Historique 7/30 jours
- 📥 Export logs

---

## 🔒 Sécurité

### Comment ça fonctionne ?

#### 1. Authentification (JWT)
```typescript
// Tu entres la clé d'accès
accessKey = "lexia-admin-x7k9m2p5-2024"

// Serveur vérifie
if (accessKey === process.env.ADMIN_ACCESS_KEY) {
  // Génère JWT
  token = jwt.sign({ isAdmin: true }, SECRET_KEY, { expiresIn: '24h' })

  // Stocke dans cookie HttpOnly
  res.cookie('admin_session', token, { httpOnly: true })
}
```

#### 2. Middleware de protection
```typescript
// Middleware.ts protège toutes les routes /sys-internal/*
if (!cookie.admin_session || !isValidJWT(cookie.admin_session)) {
  redirect('/sys-internal/auth')
}
```

#### 3. Vérification API routes
```typescript
// Chaque API route admin vérifie
const session = await getAdminSession()
if (!session) return 401
```

### Bonnes pratiques

✅ **À faire :**
- Changer `ADMIN_ACCESS_KEY` en production
- Utiliser un `ADMIN_SECRET_KEY` complexe
- Activer HTTPS en production
- Logger les accès admin
- Limiter les tentatives de connexion

❌ **Ne JAMAIS faire :**
- Commit `.env` dans Git
- Partager la clé d'accès
- Utiliser HTTP en production
- Laisser les clés par défaut

---

## 🚀 Déploiement

### Production (Vercel/VPS)

#### 1. Variables d'environnement
```env
# .env.production
DATABASE_URL=postgresql://user:pass@host:5432/lexia
GROQ_API_KEY=gsk_your_real_key
CHROMA_HOST=https://chroma.your-domain.com
ADMIN_SECRET_KEY=ultra-long-random-key-here-256-bits
ADMIN_ACCESS_KEY=your-super-secret-access-2024
```

#### 2. Générer des clés sécurisées
```bash
# Secret key (256 bits)
openssl rand -base64 32

# Access key (128 bits)
openssl rand -hex 16
```

#### 3. Configuration Vercel
```bash
vercel env add ADMIN_ACCESS_KEY
# Entre ta clé secrète
# Sélectionne Production

vercel env add ADMIN_SECRET_KEY
# Entre ton secret JWT
```

#### 4. Route masquée
Pour plus de sécurité, renomme `/sys-internal` :
```typescript
// Rename folder:
/sys-internal → /x-monitor-v2
/sys-internal → /analytics-private
/sys-internal → /[ton-nom-custom]
```

---

## 🛠️ Customisation

### Changer la route secrète

1. **Renommer le dossier** :
```
src/app/sys-internal → src/app/mon-admin-secret
```

2. **Mettre à jour le middleware** :
```typescript
// middleware.ts
if (pathname.startsWith('/mon-admin-secret')) { ... }
```

3. **Mettre à jour les liens** :
```typescript
// Sidebar.tsx, etc.
href: '/mon-admin-secret/dashboard'
```

### Ajouter une nouvelle section

1. **Créer la page** :
```typescript
// src/app/sys-internal/dashboard/ma-section/page.tsx
export default function MaSection() {
  return <div>Ma nouvelle section</div>
}
```

2. **Ajouter au menu** :
```typescript
// components/admin/Sidebar.tsx
{
  icon: '🎨',
  label: 'Ma Section',
  href: '/sys-internal/dashboard/ma-section'
}
```

### Ajouter des stats personnalisées

```typescript
// app/api/admin/stats/custom/route.ts
export async function GET() {
  const session = await getAdminSession()
  if (!session) return 401

  const customStats = await prisma.customMetric.findMany()
  return NextResponse.json(customStats)
}
```

---

## 📚 API Routes Admin

Toutes les routes nécessitent une session admin valide.

### Auth
- `POST /api/admin/auth` - Connexion
- `DELETE /api/admin/auth` - Déconnexion

### ChromaDB
- `GET /api/admin/chromadb/list` - Liste documents
- `GET /api/admin/chromadb/stats` - Statistiques
- `POST /api/admin/chromadb/search` - Recherche vectorielle

### Système (à implémenter)
- `POST /api/admin/system/scraper/run` - Lancer scraping
- `DELETE /api/admin/system/cache/clear` - Nettoyer cache
- `GET /api/admin/system/logs` - Récupérer logs
- `GET /api/admin/system/status` - État services

### Analytics (à implémenter)
- `GET /api/admin/analytics/visits` - Visites
- `GET /api/admin/analytics/questions` - Top questions
- `GET /api/admin/analytics/sources` - Sources utilisées

---

## 🐛 Troubleshooting

### "Non autorisé" après connexion
```bash
# Vérifier le cookie
Developer Tools → Application → Cookies → admin_session

# Si absent, vérifier .env
ADMIN_ACCESS_KEY=lexia-admin-x7k9m2p5-2024
```

### Middleware redirige en boucle
```typescript
// middleware.ts - Vérifier l'exception pour /auth
if (pathname === '/sys-internal/auth') {
  return NextResponse.next() // ← Important !
}
```

### ChromaDB vide dans le dashboard
```bash
# Vérifier ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Lancer le scraper
cd scrapers && python scraper_simple.py
```

### JWT invalide
```bash
# Régénérer le secret
openssl rand -base64 32

# Mettre à jour .env
ADMIN_SECRET_KEY=nouveau_secret

# Redémarrer Next.js
npm run dev
```

---

## 📊 Roadmap Features

### Phase 1 (actuel) ✅
- [x] Auth JWT + Cookie sécurisé
- [x] Dashboard overview
- [x] ChromaDB explorer
- [x] Analytics basiques
- [x] Monitoring système

### Phase 2 (à venir)
- [ ] Base de données Prisma explorer
- [ ] Logs en temps réel (WebSocket)
- [ ] Notifications (nouveaux docs, erreurs)
- [ ] Export automatique (CSV, JSON)
- [ ] Multi-admin (plusieurs users)

### Phase 3 (avancé)
- [ ] 2FA (authentification à deux facteurs)
- [ ] Permissions granulaires (read-only, admin)
- [ ] Audit trail (qui a fait quoi)
- [ ] Alertes automatiques (Slack, Email)
- [ ] Dark mode

---

## 💡 Astuces Pro

### 1. Accès rapide
Créer un bookmark :
```
Nom: LexIA Admin
URL: http://localhost:3000/sys-internal/auth?key=lexia-admin-x7k9m2p5-2024
```

### 2. Multi-environnements
```env
# .env.development
ADMIN_ACCESS_KEY=dev-key-simple

# .env.production
ADMIN_ACCESS_KEY=ultra-secret-prod-key-2024
```

### 3. Monitoring externe
Intégrer avec :
- **Sentry** (erreurs)
- **LogRocket** (session replay)
- **Datadog** (métriques)
- **Plausible** (analytics privacy-first)

### 4. Automatisation
```bash
# Scraper automatique toutes les 6h
crontab -e
0 */6 * * * curl -X POST http://localhost:3000/api/admin/system/scraper/run \
  -H "Cookie: admin_session=ton_jwt"
```

---

## 📞 Support

### Besoin d'aide ?
- 📖 Docs complètes : `GUIDE_LEXIA.md`
- 🔍 ChromaDB : `CHROMADB_EXPLIQUE.md`
- 💡 Vision projet : `POURQUOI_LEXIA.md`

### Problème technique ?
1. Check les logs (`/sys-internal/dashboard/system`)
2. Vérifier `.env` (toutes les clés présentes ?)
3. Redémarrer les services (ChromaDB, Next.js)

---

**Dashboard créé pour LexIA 🇨🇮 | Sécurisé par JWT | Open Source**
