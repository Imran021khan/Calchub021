import React from 'react';
import { useLocation } from 'react-router-dom';
import { FAQItem } from '../types';

interface FAQSectionProps {
  faqs: FAQItem[];
}

export function FAQSection({ faqs }: FAQSectionProps) {
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');

  return (
    <section className="mt-12 pt-12 border-t border-zinc-100">
      <h2 className="text-2xl font-bold text-zinc-900 mb-8">
        {isHindi ? "अक्सर पूछे जाने वाले प्रश्न" : "Frequently Asked Questions"}
      </h2>
      <div className="grid gap-6 md:grid-cols-2">
        {faqs.map((faq, index) => (
          <div key={index} className="p-6 bg-zinc-50 rounded-2xl">
            <h3 className="font-bold text-zinc-900 mb-2">
              {isHindi ? (faq.q_hi || faq.q) : faq.q}
            </h3>
            <p className="text-zinc-600 text-sm leading-relaxed">
              {isHindi ? (faq.a_hi || faq.a) : faq.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
