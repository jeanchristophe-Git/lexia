import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { checkUserQuotas } from '@/lib/quota-checker';
import { QuotaError } from '@/lib/limits';
import { prisma } from '@/lib/prisma';
import { searchRelevantDocuments } from '@/lib/embeddings';

// Initialiser Groq avec la clé API
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || ''
});

// Prompt système pour LexIA
const LEXIA_SYSTEM_PROMPT = `Tu es LexIA, assistant juridique IA spécialisé en droit ivoirien.

## Ton comportement

1. **Messages humains normaux (salutations, remerciements, etc.)** :
   - Réponds de manière naturelle et amicale
   - Pas besoin de chercher dans les sources juridiques
   - Exemple : "Bonjour" → "Bonjour ! Je suis LexIA, votre assistant juridique ivoirien. Comment puis-je vous aider aujourd'hui ?"

2. **Questions juridiques** :
   - Utilise UNIQUEMENT les documents fournis
   - Si pas de documents : "Je n'ai pas trouvé cette information dans mes sources officielles ivoiriennes. Cependant, je peux vous orienter..."
   - Cite toujours tes sources

## Format de réponse

- Réponse directe et précise
- Explications claires
- Conseils pratiques si pertinent

Réponds toujours en français de manière professionnelle et claire.`;

export async function POST(request: NextRequest) {
  try {
    const { question, session_id, user_id } = await request.json();

    // Validation
    if (!question || question.trim().length < 2) {
      return NextResponse.json(
        { error: 'Question trop courte' },
        { status: 400 }
      );
    }

    console.log(`\n[LEXIA] Nouvelle question: "${question}"`);

    // Vérifier les quotas
    let quotaStatus;
    try {
      quotaStatus = await checkUserQuotas(user_id || null, session_id || 'demo');
    } catch (error) {
      if (error instanceof QuotaError) {
        return NextResponse.json(
          {
            error: 'Quota dépassé',
            code: (error as any).code,
            limit: (error as any).limit,
            current: (error as any).current
          },
          { status: 429 }
        );
      }
      throw error;
    }

    // Détecter si c'est un message casual (salutation, remerciement, etc.)
    const casualKeywords = ['bonjour', 'salut', 'hello', 'hi', 'merci', 'thanks', 'ok', 'ça va', 'comment vas-tu', 'au revoir', 'bye'];
    const isCasual = casualKeywords.some(keyword => question.toLowerCase().includes(keyword)) && question.length < 50;

    let docs: any[] = [];
    let context = '';

    // Chercher dans la DB seulement si c'est une question juridique
    if (!isCasual) {
      console.log('[LEXIA] 🔍 Recherche dans la base de données...');
      docs = await searchRelevantDocuments(question, 5);
      console.log(`[LEXIA] ✅ ${docs.length} documents trouvés`);

      if (docs.length > 0) {
        context = docs
          .map((doc, i) => `
SOURCE ${i + 1}: ${doc.title} (${doc.category})
Contenu: ${doc.contentPreview}
---`)
          .join('\n');

        console.log('[LEXIA] 📝 Contexte construit avec', docs.length, 'sources');
      }
    } else {
      console.log('[LEXIA] 💬 Message casual détecté, pas de recherche DB');
    }

    // GROQ GÉNÈRE LA RÉPONSE
    console.log('[LEXIA] 🤖 Envoi à Groq...');

    const messages: any[] = [
      { role: 'system', content: LEXIA_SYSTEM_PROMPT }
    ];

    // Ajouter le contexte seulement si on a des documents
    if (context) {
      messages.push({
        role: 'system',
        content: `Documents juridiques officiels pour cette question:\n\n${context}`
      });
    }

    messages.push({ role: 'user', content: question });

    const response = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: isCasual ? 0.7 : 0.3,
      max_tokens: 2000
    });

    const answer = response.choices[0].message.content || '';

    console.log('[LEXIA] ✅ Réponse générée avec succès');

    // PRÉPARER LES SOURCES
    const sources = docs.map(doc => ({
      title: doc.title,
      url: doc.sourceUrl,
      category: doc.category,
      relevance_score: doc.similarity?.toFixed(2) || '0'
    }));

    // SAUVEGARDER DANS POSTGRESQL (si user_id existe)
    if (user_id && session_id) {
      try {
        await prisma.conversation.create({
          data: {
            userId: user_id,
            sessionId: session_id,
            question,
            answer,
            confidence: docs.length > 0 ? 0.85 : 0.5,
            sources: JSON.stringify(sources)
          }
        });
        console.log('[LEXIA] 💾 Conversation sauvegardée');
      } catch (error) {
        console.error('[LEXIA] ⚠️  Erreur sauvegarde conversation:', error);
        // Ne pas bloquer la réponse si la sauvegarde échoue
      }
    }

    // RETOURNER LA RÉPONSE
    return NextResponse.json({
      answer,
      sources,
      confidence: docs.length > 0 ? 0.85 : 0.5,
      session_id: session_id || `session_${Date.now()}`,
      conversation_id: `conv_${Date.now()}`,
      timestamp: new Date().toISOString(),
      quota: quotaStatus
    });

  } catch (error: any) {
    console.error('[LEXIA] ❌ Erreur:', error);

    return NextResponse.json(
      {
        error: 'Erreur système',
        details: error.message
      },
      { status: 500 }
    );
  }
}
