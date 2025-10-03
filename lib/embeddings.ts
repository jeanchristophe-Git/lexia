/**
 * Module d'embeddings pour LexIA
 * Approche simplifiée : utiliser la recherche texte directement en SQL
 * Les embeddings sont générés côté Python uniquement
 */

import { prisma } from './prisma';

export interface SearchResult {
  id: string;
  title: string;
  contentPreview: string;
  sourceUrl: string | null;
  category: string;
  similarity: number;
}

/**
 * Recherche de documents pertinents
 * Utilise une recherche textuelle simple + pgvector si disponible
 */
export async function searchRelevantDocuments(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    // Normaliser la query
    const normalizedQuery = query.toLowerCase().trim();
    const keywords = normalizedQuery.split(' ').filter(w => w.length > 3);

    console.log(`[SEARCH] Query: "${query}"`);
    console.log(`[SEARCH] Keywords: ${keywords.join(', ')}`);

    // Recherche textuelle simple
    // En production, utilisez pgvector avec embeddings complets
    const results: any = await prisma.$queryRawUnsafe(`
      SELECT
        id,
        title,
        "contentPreview",
        "sourceUrl",
        category,
        CASE
          WHEN LOWER("contentPreview") LIKE $1 THEN 1.0
          WHEN LOWER(title) LIKE $1 THEN 0.9
          WHEN LOWER("contentPreview") LIKE $2 THEN 0.7
          WHEN LOWER(title) LIKE $2 THEN 0.6
          ELSE 0.5
        END as similarity
      FROM "LegalDocument"
      WHERE
        LOWER("contentPreview") LIKE $1 OR
        LOWER(title) LIKE $1 OR
        LOWER("contentPreview") LIKE $2 OR
        LOWER(title) LIKE $2
      ORDER BY similarity DESC
      LIMIT $3
    `, `%${normalizedQuery}%`, `%${keywords[0] || ''}%`, limit);

    console.log(`[SEARCH] Found ${results.length} documents`);

    return results.map((r: any) => ({
      id: r.id,
      title: r.title,
      contentPreview: r.contentPreview,
      sourceUrl: r.sourceUrl,
      category: r.category,
      similarity: parseFloat(r.similarity) || 0.5
    }));

  } catch (error) {
    console.error('[SEARCH ERROR]', error);
    return [];
  }
}

/**
 * Recherche avec pgvector (quand embeddings sont disponibles)
 * Cette fonction sera activée après avoir run le scraper Python
 */
export async function searchWithPgvector(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  // TODO: Implémenter après installation réussie de @xenova/transformers
  // Pour l'instant, fallback sur recherche textuelle
  return searchRelevantDocuments(query, limit);
}
