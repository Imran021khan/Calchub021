import React, { useState, useMemo, useTransition } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { CalculatorCard } from '../components/CalculatorCard';
import { SearchBar } from '../components/SearchBar';
import { AdUnit } from '../components/AdUnit';
import calculatorsData from '../data/calculators.json';
import { CalculatorConfig } from '../types';

const calculators = calculatorsData as CalculatorConfig[];

export function Home() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();

  const isHindi = location.pathname.startsWith('/hi');

  const t = {
    title: isHindi ? "कैलकुलेटर को <span class=\"text-zinc-400\">सरल</span> बनाया गया।" : "Calculators Made <span class=\"text-zinc-400\">Simple.</span>",
    subtitle: isHindi ? "वित्त, स्वास्थ्य और गणित के लिए 500+ सटीक टूल तक पहुंचें। गति और सटीकता के लिए निर्मित।" : "Access 500+ accurate tools for finance, health, and math. Built for speed and precision.",
    noResults: isHindi ? "कोई कैलकुलेटर नहीं मिला" : "No calculators found",
    noResultsDesc: isHindi ? "कुछ और खोजने का प्रयास करें जैसे \"BMI\" या \"Mortgage\"।" : "Try searching for something else like \"BMI\" or \"Mortgage\".",
    clearSearch: isHindi ? "खोज साफ़ करें" : "Clear search",
    tools: isHindi ? "टूल" : "Tools"
  };

  const handleSearch = (query: string) => {
    startTransition(() => {
      setSearchQuery(query);
    });
  };

  const filteredCalculators = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return calculators.filter(
      (c) => {
        const name = isHindi ? (c.name_hi || c.name) : c.name;
        const category = isHindi ? (c.category_hi || c.category) : c.category;
        const description = isHindi ? (c.metaDescription_hi || c.metaDescription) : c.metaDescription;
        return name.toLowerCase().includes(query) ||
               category.toLowerCase().includes(query) ||
               description.toLowerCase().includes(query);
      }
    );
  }, [searchQuery, isHindi]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(calculators.map((c) => isHindi ? (c.category_hi || c.category) : c.category)));
    return cats.sort();
  }, [isHindi]);

  return (
    <div className="space-y-12">
      <Helmet>
        <title>{isHindi ? "CalcHub - हर जरूरत के लिए मुफ्त ऑनलाइन कैलकुलेटर" : "CalcHub - Free Online Calculators for Every Need"}</title>
        <meta name="description" content={isHindi ? "वित्त, स्वास्थ्य, गणित और बहुत कुछ के लिए मुफ्त, तेज़ और सटीक ऑनलाइन कैलकुलेटर की एक विस्तृत श्रृंखला खोजें। SEO-अनुकूल और मोबाइल-अनुकूल।" : "Discover a wide range of free, fast, and accurate online calculators for finance, health, math, and more. SEO-optimized and mobile-friendly."} />
        <link rel="canonical" href={isHindi ? "https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/hi" : "https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/"} />
        <link rel="alternate" hrefLang="en" href="https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/" />
        <link rel="alternate" hrefLang="hi" href="https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/hi" />
        <link rel="alternate" hrefLang="x-default" href="https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/" />
      </Helmet>

      <section className="text-center space-y-6 py-12 md:py-20 bg-zinc-900 text-white rounded-[2rem] px-4 shadow-2xl shadow-zinc-200">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
          dangerouslySetInnerHTML={{ __html: t.title }}
        />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto"
        >
          {t.subtitle}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          <SearchBar onSearch={handleSearch} />
        </motion.div>
      </section>

      <AdUnit format="horizontal" slot="home-top" className="max-w-4xl mx-auto" />

      <div className={isPending ? 'opacity-50 transition-opacity' : ''}>
        {categories.map((category) => {
          const categoryCalculators = filteredCalculators.filter((c) => c.category === category);
          if (categoryCalculators.length === 0) return null;

          return (
            <section key={category} className="space-y-6 mb-12">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <h2 className="text-2xl font-bold text-zinc-900">{category}</h2>
                <span className="text-sm font-medium text-zinc-400">{categoryCalculators.length} {t.tools}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryCalculators.map((calc) => (
                  <CalculatorCard key={calc.slug} calculator={calc} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {filteredCalculators.length === 0 && (
        <div className="text-center py-20 space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="text-xl font-bold text-zinc-900">{t.noResults}</h3>
          <p className="text-zinc-500">{t.noResultsDesc}</p>
          <button
            onClick={() => handleSearch('')}
            className="text-zinc-900 font-bold underline underline-offset-4"
          >
            {t.clearSearch}
          </button>
        </div>
      )}
    </div>
  );
}
