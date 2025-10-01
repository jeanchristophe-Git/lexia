# Assistant Juridique CI - Frontend

Interface web pour un assistant IA juridique spécialisé dans la législation de Côte d'Ivoire, avec un design identique à ChatGPT.

## 🚀 Fonctionnalités

- **Interface ChatGPT** : Design identique avec sidebar collapsible et messages en temps réel
- **Spécialisé CI** : Questions/réponses sur le droit ivoirien uniquement
- **Sources juridiques** : Références vers CIVILII et Journal Officiel
- **Responsive** : Interface adaptée mobile/desktop
- **État persistant** : Sauvegarde automatique des conversations

## 🛠 Stack Technique

- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** avec couleurs ChatGPT
- **Shadcn/ui** pour les composants
- **Zustand** pour la gestion d'état
- **Framer Motion** pour les animations

## 📁 Structure du projet

```
src/
├── app/
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Chat interface
│   └── globals.css       # Styles globaux
├── components/
│   ├── ui/               # Composants shadcn
│   ├── chat/             # Interface de chat
│   ├── layout/           # Header/Sidebar
│   └── legal/            # Composants juridiques
├── store/
│   └── chatStore.ts      # État Zustand
├── types/
│   └── index.ts          # Types TypeScript
└── lib/
    ├── utils.ts          # Utilitaires
    └── mockData.ts       # Données de démonstration
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

```bash
# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build de production
npm run build
npm start
```

## 💼 Fonctionnalités juridiques

### Questions supportées
- Création d'entreprises (SARL, SA, etc.)
- Droit du travail (SMIG, contrats)
- Commerce et licences
- Droit de la famille
- Procédures administratives

### Sources légales
- Constitution de Côte d'Ivoire (2016)
- Code de Commerce
- Code du Travail
- Codes sectoriels
- Décrets et ordonnances

## 🔗 Intégration Backend

Interface prête pour l'intégration avec une API NestJS :

```typescript
// Endpoints attendus
POST /api/chat          # Envoyer question
GET  /api/conversations # Historique
GET  /api/sources/:id   # Détails source
```

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

## 🌍 Déploiement

Optimisé pour déploiement sur Vercel, Netlify, Railway ou serveur VPS avec Docker.

---

**Note importante** : Cette interface est un MVP avec des données mockées. L'intégration avec une vraie base de données juridique et une IA spécialisée est nécessaire pour la production.
