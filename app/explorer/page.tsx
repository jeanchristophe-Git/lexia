'use client';

import { useState } from 'react';
import { Search, Book, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ExplorerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Toutes les catégories', count: 156 },
    { id: 'commercial', name: 'Droit commercial', count: 45 },
    { id: 'travail', name: 'Droit du travail', count: 38 },
    { id: 'famille', name: 'Droit de la famille', count: 29 },
    { id: 'penal', name: 'Droit pénal', count: 22 },
    { id: 'civil', name: 'Droit civil', count: 22 }
  ];

  const mockLaws = [
    {
      id: '1',
      title: 'Code de Commerce Ivoirien',
      category: 'commercial',
      country: 'ci',
      year: 2023,
      articles: 450,
      description: 'Réglementation complète du commerce et des sociétés en Côte d\'Ivoire'
    },
    {
      id: '2',
      title: 'Code du Travail - Loi N°2015-532',
      category: 'travail',
      country: 'ci',
      year: 2015,
      articles: 328,
      description: 'Relations de travail, protection des travailleurs, salaire minimum'
    },
    {
      id: '3',
      title: 'Code de la Famille Camerounais',
      category: 'famille',
      country: 'cm',
      year: 2022,
      articles: 245,
      description: 'Mariage, divorce, filiation, succession au Cameroun'
    }
  ];

  return (
    <div className="h-screen flex flex-col bg-chat-bg">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-chat-text mb-2">
              Explorer la base légale
            </h1>
            <p className="text-chat-muted">
              Recherchez et consultez les textes de loi des pays africains
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-chat-border p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-chat-muted" />
                <input
                  type="text"
                  placeholder="Rechercher dans les textes de loi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-chat-border rounded-lg focus:border-juridique-primary focus:outline-none focus:ring-1 focus:ring-juridique-primary"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-chat-muted" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-chat-border rounded-lg px-3 py-2 focus:border-juridique-primary focus:outline-none focus:ring-1 focus:ring-juridique-primary"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid lg:grid-cols-3 gap-6">
            {mockLaws.map((law) => (
              <div key={law.id} className="bg-white rounded-lg border border-chat-border p-6 hover:border-juridique-primary transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Book className="h-5 w-5 text-juridique-primary" />
                    <span className="text-sm font-medium text-juridique-primary uppercase">
                      {law.country}
                    </span>
                  </div>
                  <span className="text-sm text-chat-muted">
                    {law.year}
                  </span>
                </div>

                <h3 className="font-semibold text-chat-text mb-2">
                  {law.title}
                </h3>

                <p className="text-sm text-chat-muted mb-4">
                  {law.description}
                </p>

                <div className="flex items-center justify-between text-xs text-chat-muted">
                  <span>{law.articles} articles</span>
                  <button className="text-juridique-primary hover:underline">
                    Consulter →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {mockLaws.length === 0 && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 mx-auto text-chat-muted mb-4" />
              <h3 className="text-lg font-medium text-chat-text mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-chat-muted">
                Essayez de modifier votre recherche ou vos filtres
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}