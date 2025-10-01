import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';

// Initialiser Groq avec la clé API
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

// Initialiser Prisma
const prisma = new PrismaClient();

// Prompt système pour LexIA
const LEXIA_SYSTEM_PROMPT = `Tu es LexIA, assistant juridique IA spécialisé en droit ivoirien.

## Ton identité
- Nom : LexIA (Legal Intelligence Assistant)
- Spécialité : Législation ivoirienne complète
- Mission : Aider entrepreneurs et citoyens ivoiriens

## Tes compétences
- Maîtrise du droit ivoirien
- Explications claires en français
- Conseils pratiques pour entrepreneurs

## Comportement
- Professionnel et courtois
- Cite tes sources quand possible
- Si info manquante, dis-le clairement
- Rappelle de consulter un avocat pour cas complexes

## Format de réponse
1. Réponse directe (2-3 phrases)
2. Explications détaillées
3. Conseil pratique si nécessaire

Réponds toujours en français de manière claire et professionnelle.`;

// Fonction pour rechercher des documents pertinents
async function searchRelevantDocuments(query: string, limit: number = 5) {
  try {
    // Recherche simple par mots-clés dans le titre et contentPreview
    // TODO: Utiliser ChromaDB pour recherche vectorielle plus tard
    const keywords = query.toLowerCase().split(' ')
      .filter(word => word.length > 3)
      .slice(0, 5); // Top 5 mots-clés

    const documents = await prisma.legalDocument.findMany({
      where: {
        OR: keywords.map(keyword => ({
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { contentPreview: { contains: keyword, mode: 'insensitive' } },
            { category: { contains: keyword, mode: 'insensitive' } }
          ]
        }))
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    return documents;
  } catch (error) {
    console.error('Erreur recherche documents:', error);
    return [];
  }
}

// Fonction pour sauvegarder la conversation
async function saveConversation(data: {
  sessionId: string;
  question: string;
  answer: string;
  confidence: number;
  sources: any[];
}) {
  try {
    await prisma.conversation.create({
      data: {
        sessionId: data.sessionId,
        question: data.question,
        answer: data.answer,
        confidence: data.confidence,
        sources: JSON.stringify(data.sources)
      }
    });
  } catch (error) {
    console.error('Erreur sauvegarde conversation:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, session_id, conversation_history } = body;

    if (!question || question.trim().length < 10) {
      return NextResponse.json(
        { error: 'La question doit contenir au moins 10 caractères' },
        { status: 400 }
      );
    }

    // Vérifier si la clé API Groq est configurée
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({
        answer: `⚠️ **Configuration nécessaire**

Pour utiliser LexIA avec l'IA, vous devez :

1. Obtenir une clé API gratuite sur https://console.groq.com
2. Créer un fichier \`.env.local\` à la racine du projet
3. Ajouter : \`GROQ_API_KEY=votre_clé_ici\`
4. Redémarrer le serveur Next.js

**Votre question :** "${question}"

Pour l'instant, l'API fonctionne en mode simulé. Une fois configurée, vous aurez des réponses juridiques précises basées sur l'IA ! ✅`,
        sources: [],
        confidence: 0,
        session_id: session_id || 'demo',
        conversation_id: `demo_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    }

    // 1. RECHERCHER les documents pertinents dans la base de données
    console.log('[LexIA] Recherche de documents pour:', question);
    const relevantDocs = await searchRelevantDocuments(question, 3);
    console.log(`[LexIA] ${relevantDocs.length} documents trouvés`);

    // 2. CONSTRUIRE le contexte juridique pour l'IA
    let legalContext = '';
    if (relevantDocs.length > 0) {
      legalContext = '\n\n## DOCUMENTS JURIDIQUES PERTINENTS\n\n';
      relevantDocs.forEach((doc, idx) => {
        legalContext += `### Document ${idx + 1}: ${doc.title}\n`;
        legalContext += `Catégorie: ${doc.category}\n`;
        legalContext += `Contenu: ${doc.contentPreview}\n`;
        if (doc.sourceUrl) {
          legalContext += `Source: ${doc.sourceUrl}\n`;
        }
        legalContext += '\n---\n\n';
      });
      legalContext += '**Instructions:** Base ta réponse sur ces documents officiels. Cite les documents que tu utilises.';
    } else {
      legalContext = '\n\n**Note:** Aucun document spécifique trouvé. Réponds avec tes connaissances générales du droit ivoirien et recommande de consulter les sources officielles.';
    }

    // 3. CONSTRUIRE l'historique de conversation pour le contexte
    const messages: any[] = [
      {
        role: 'system',
        content: LEXIA_SYSTEM_PROMPT + legalContext
      }
    ];

    // Ajouter l'historique si présent (max 3 derniers échanges)
    if (conversation_history && Array.isArray(conversation_history)) {
      const recentHistory = conversation_history.slice(-3);
      recentHistory.forEach((msg: any) => {
        messages.push(
          { role: 'user', content: msg.question },
          { role: 'assistant', content: msg.answer }
        );
      });
    }

    // Ajouter la question actuelle
    messages.push({
      role: 'user',
      content: question
    });

    // 4. APPELER Groq AI avec le contexte enrichi
    console.log('[LexIA] Envoi à Groq...');
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000,
    });

    const answer = chatCompletion.choices[0]?.message?.content ||
      'Désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.';

    // 5. FORMATER les sources avec les vrais documents
    const sources = relevantDocs.map(doc => ({
      title: doc.title,
      category: doc.category,
      article: doc.articleNumber || 'Référence',
      url: doc.sourceUrl || 'https://www.gouv.ci',
      preview: doc.contentPreview?.substring(0, 150) + '...',
      relevance_score: 0.85
    }));

    // Calculer la confiance basée sur le nombre de documents trouvés
    const confidence = relevantDocs.length > 0 ? 0.85 : 0.5;

    const currentSessionId = session_id || `session_${Date.now()}`;
    const conversationId = `conv_${Date.now()}`;

    // 6. SAUVEGARDER la conversation dans la base de données
    await saveConversation({
      sessionId: currentSessionId,
      question,
      answer,
      confidence,
      sources
    });

    console.log('[LexIA] Réponse générée avec succès');

    return NextResponse.json({
      answer,
      sources,
      confidence,
      session_id: currentSessionId,
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
      documents_found: relevantDocs.length
    });

  } catch (error: any) {
    console.error('Erreur API Chat:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors du traitement de la requête',
        details: error.message
      },
      { status: 500 }
    );
  }
}

// GET pour vérifier le statut
export async function GET() {
  try {
    // Compter les documents dans la base
    const documentCount = await prisma.legalDocument.count();
    const conversationCount = await prisma.conversation.count();

    return NextResponse.json({
      status: 'operational',
      name: 'LexIA Chat API',
      version: '2.0.0',
      groq_configured: !!process.env.GROQ_API_KEY,
      database_connected: true,
      documents_count: documentCount,
      conversations_count: conversationCount,
      message: process.env.GROQ_API_KEY
        ? `API prête ! ${documentCount} documents juridiques disponibles ✅`
        : 'Configuration Groq nécessaire ⚠️'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      name: 'LexIA Chat API',
      version: '2.0.0',
      database_connected: false,
      error: 'Erreur de connexion à la base de données'
    }, { status: 500 });
  }
}
