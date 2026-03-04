import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calculator } from 'lucide-react';
import { CalculatorConfig } from '../types';

interface CalculatorCardProps {
  calculator: CalculatorConfig;
}

export const CalculatorCard = React.memo(function CalculatorCard({ calculator }: CalculatorCardProps) {
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');

  const name = isHindi ? (calculator.name_hi || calculator.name) : calculator.name;
  const description = isHindi ? (calculator.metaDescription_hi || calculator.metaDescription) : calculator.metaDescription;
  const category = isHindi ? (calculator.category_hi || calculator.category) : calculator.category;

  return (
    <Link
      to={`${isHindi ? '/hi' : ''}/calculators/${calculator.slug}`}
      className="group p-6 bg-white border border-zinc-100 rounded-2xl hover:border-zinc-200 hover:shadow-xl hover:shadow-zinc-100 transition-all duration-300 flex flex-col h-full"
    >
      <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300">
        <Calculator className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-zinc-900 mb-2">{name}</h3>
      <p className="text-sm text-zinc-500 line-clamp-2 mb-4 flex-grow">
        {description}
      </p>
      <div className="flex items-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        {category}
      </div>
    </Link>
  );
});
