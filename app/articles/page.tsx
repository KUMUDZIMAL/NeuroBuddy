"use client"

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import Link from 'next/link';

interface Article {
  headline: string;
  url: string;
  description?: string;
  '@type'?: string;
}

const transformNHSUrl = (apiUrl: string): string => {
  return apiUrl
    .replace('api.service.nhs.uk/nhs-website-content', 'www.nhs.uk')
    .replace('/#', '#');
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/articles');
        if (!response.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        
        if (data.hasPart && Array.isArray(data.hasPart)) {
          setArticles(data.hasPart);
        } else {
          setArticles([]);
        }
      } catch (err) {
        setError('Failed to load articles. Please try again later.');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-b from-violet-50 to-white" />
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="fixed inset-0 bg-gradient-to-b from-violet-50 to-white" />
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <p className="text-red-500 font-outfitRegular">{error}</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="relative z-10">
          <div className="absolute inset-0">
            <div className="absolute w-96 h-96 bg-blue-400/30 rounded-full blur-3xl -top-20 -left-20"></div>
            <div className="absolute w-96 h-96 bg-purple-400/30 rounded-full blur-3xl top-40 left-60"></div>
            <div className="absolute w-80 h-80 bg-orange-300/30 rounded-full blur-3xl top-0 right-60"></div>
          </div>
          <h1 className="text-4xl font-valueSerif text-slate-800 mb-8">Mental Health Resources</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles
              .filter(article => article.url)
              .map((article, index) => (
              <Link 
                href={transformNHSUrl(article.url)}
                key={index}
                target="_blank"
                rel="noopener noreferrer"
                className="h-full"
              >
                <Card className="p-6 h-full bg-white/80 backdrop-blur-sm 
                  border border-violet-100/50 
                  hover:bg-white/95 hover:border-violet-300 hover:shadow-lg hover:scale-[1.02]
                  transition-all duration-300 ease-out">
                  <div className="flex flex-col h-full">
                    <h2 className="text-xl font-outfitRegular text-slate-800 mb-2">{article.headline}</h2>
                    {article.description && (
                      <p className="text-slate-600 font-outfitRegular flex-grow">{article.description}</p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
