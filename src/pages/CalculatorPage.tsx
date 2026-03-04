import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowLeft, Info, Table, PieChart as PieChartIcon, Copy, Check, TrendingUp } from 'lucide-react';
import Markdown from 'react-markdown';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Breadcrumb } from '../components/Breadcrumb';
import { CalculatorForm } from '../components/CalculatorForm';
import { FAQSection } from '../components/FAQSection';
import calculatorsData from '../data/calculators.json';
import { CalculatorConfig } from '../types';
import { getCalculatorInsights } from '../services/geminiService';
import { formatCurrency, formatNumber, calculateAmortization } from '../utils/utils';
import { AdUnit } from '../components/AdUnit';
import { AffiliateCTA } from '../components/AffiliateCTA';

const calculators = calculatorsData as CalculatorConfig[];

const COLORS = ['#18181b', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export function CalculatorPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');
  
  const [result, setResult] = useState<number | null>(null);
  const [amortization, setAmortization] = useState<any[] | null>(null);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [copied, setCopied] = useState(false);
  
  const isMounted = useRef(true);
  const calculator = useMemo(() => calculators.find((c) => c.slug === slug), [slug]);

  const t = {
    notFound: isHindi ? "कैलकुलेटर नहीं मिला" : "Calculator Not Found",
    notFoundDesc: isHindi ? "जिस कैलकुलेटर को आप ढूंढ रहे हैं वह मौजूद नहीं है या उसे हटा दिया गया है।" : "The calculator you are looking for doesn't exist or has been moved.",
    backHome: isHindi ? "होम पर वापस जाएं" : "Back to Home",
    calculatedResult: isHindi ? "परिकलित परिणाम" : "Calculated Result",
    aiAnalyzing: isHindi ? "AI आपके डेटा का विश्लेषण कर रहा है..." : "AI is analyzing your data...",
    aiInsight: isHindi ? "AI वित्तीय अंतर्दृष्टि" : "AI Financial Insight",
    visualBreakdown: isHindi ? "दृश्य विवरण" : "Visual Breakdown",
    amortizationSchedule: isHindi ? "परिशोधन अनुसूची" : "Amortization Schedule",
    month: isHindi ? "महीना" : "Month",
    payment: isHindi ? "भुगतान" : "Payment",
    principal: isHindi ? "मूलधन" : "Principal",
    interest: isHindi ? "ब्याज" : "Interest",
    balance: isHindi ? "शेष राशि" : "Balance",
    showingFirst: isHindi ? "दिखा रहा है पहले 12 महीने कुल {total} भुगतान में से।" : "Showing first 12 months of {total} total payments.",
    expertGuide: isHindi ? "विशेषज्ञ गाइड" : "Expert Guide",
    expertDesc: isHindi ? "हमारा {name} 99.9% सटीकता सुनिश्चित करने के लिए वित्तीय विशेषज्ञों द्वारा सत्यापित है। अपने दीर्घकालिक वित्तीय प्रक्षेपवक्र को समझने के लिए विज़ुअल चार्ट का उपयोग करें।" : "Our {name} is verified by financial experts to ensure 99.9% accuracy. Use the visual charts to understand your long-term financial trajectory.",
    relatedTools: isHindi ? "संबंधित टूल" : "Related Tools",
    popularTools: isHindi ? "लोकप्रिय उपकरण" : "Popular Tools",
    invalidInputs: isHindi ? "कृपया सभी क्षेत्रों के लिए मान्य इनपुट प्रदान करें।" : "Please provide valid inputs for all fields.",
    invalidResult: isHindi ? "गणना के परिणामस्वरूप अमान्य मान प्राप्त हुआ। कृपया अपने इनपुट की जाँच करें।" : "The calculation resulted in an invalid value. Please check your inputs.",
    calcError: isHindi ? "गणना में त्रुटि हुई। कृपया अपने इनपुट की जाँच करें।" : "There was an error in the calculation. Please check your inputs."
  };

  useEffect(() => {
    isMounted.current = true;
    setResult(null);
    setAmortization(null);
    setInsights(null);
    setLoadingInsights(false);
    setInputValues({});
    return () => {
      isMounted.current = false;
    };
  }, [slug]);

  const relatedCalculators = useMemo(() => {
    if (!calculator) return [];
    return calculators
      .filter((c) => c.category === calculator.category && c.slug !== calculator.slug)
      .slice(0, 3);
  }, [calculator]);

  const popularCalculators = useMemo(() => {
    return calculators
      .filter((c) => c.slug !== slug)
      .slice(0, 6);
  }, [slug]);

  if (!calculator) {
    return (
      <div className="text-center py-20 space-y-6">
        <h1 className="text-4xl font-bold">{t.notFound}</h1>
        <p className="text-zinc-500">{t.notFoundDesc}</p>
        <Link to={isHindi ? "/hi" : "/"} className="inline-flex items-center text-zinc-900 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t.backHome}
        </Link>
      </div>
    );
  }

  const name = isHindi ? (calculator.name_hi || calculator.name) : calculator.name;
  const description = isHindi ? (calculator.metaDescription_hi || calculator.metaDescription) : calculator.metaDescription;
  const category = isHindi ? (calculator.category_hi || calculator.category) : calculator.category;
  const seoTitle = isHindi ? (calculator.seoTitle_hi || calculator.seoTitle) : calculator.seoTitle;
  const longContent = isHindi ? (calculator.longContent_hi || calculator.longContent) : calculator.longContent;

  const handleCalculate = async (values: Record<string, any>) => {
    if (loadingInsights) return;
    setInputValues(values);

    try {
      const keys = Object.keys(values);
      const args = keys.map(k => values[k]);
      
      if (args.some(v => v === undefined || v === null || (typeof v === 'number' && isNaN(v)))) {
        alert(t.invalidInputs);
        return;
      }

      const formulaFunc = new Function(...keys, `return ${calculator.formula}`);
      const calculatedResult = formulaFunc(...args);
      
      if (typeof calculatedResult !== 'number' || isNaN(calculatedResult) || !isFinite(calculatedResult)) {
        setResult(null);
        alert(t.invalidResult);
        return;
      }

      if (!isMounted.current) return;
      setResult(calculatedResult);

      if (calculator.showAmortization) {
        const principal = values.loanAmount || values.principal;
        const rate = values.rate;
        const years = values.years;
        if (principal && rate && years) {
          const { schedule } = calculateAmortization(principal, rate, years);
          setAmortization(schedule);
        }
      } else {
        setAmortization(null);
      }

      setInsights(null);
      setLoadingInsights(true);

      const aiInsights = await getCalculatorInsights(calculator.name, { ...values, result: calculatedResult });
      
      if (isMounted.current) {
        setInsights(aiInsights);
        setLoadingInsights(false);
      }
    } catch (error) {
      console.error("Calculation error:", error);
      if (isMounted.current) {
        alert(t.calcError);
        setLoadingInsights(false);
      }
    }
  };

  const formattedResult = useMemo(() => {
    if (result === null) return null;
    if (calculator.category === 'Finance') return formatCurrency(result);
    return formatNumber(result);
  }, [result, calculator.category]);

  const copyToClipboard = () => {
    if (formattedResult) {
      navigator.clipboard.writeText(formattedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const chartData = useMemo(() => {
    if (result === null || !calculator.hasChart) return null;
    
    if (calculator.showAmortization && amortization) {
      const totalInterest = amortization.reduce((sum, item) => sum + item.interest, 0);
      const principal = inputValues.loanAmount || inputValues.principal || 0;
      return [
        { name: isHindi ? 'मूलधन' : 'Principal', value: principal },
        { name: isHindi ? 'कुल ब्याज' : 'Total Interest', value: totalInterest },
      ];
    }
    
    return [
      { name: isHindi ? 'परिणाम' : 'Result', value: result },
      { name: isHindi ? 'आधार' : 'Base', value: (inputValues.loanAmount || inputValues.principal || 0) },
    ];
  }, [result, calculator, amortization, inputValues, isHindi]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "applicationCategory": "Calculator",
    "operatingSystem": "All",
    "mainEntity": {
      "@type": "Question",
      "name": isHindi ? (calculator.faq[0]?.q_hi || calculator.faq[0]?.q) : calculator.faq[0]?.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": isHindi ? (calculator.faq[0]?.a_hi || calculator.faq[0]?.a) : calculator.faq[0]?.a
      }
    }
  };

  // Split long content to insert ad in the middle
  const contentSections = longContent ? longContent.split('\n\n') : [];
  const midIndex = Math.floor(contentSections.length / 2);
  const firstHalf = contentSections.slice(0, midIndex).join('\n\n');
  const secondHalf = contentSections.slice(midIndex).join('\n\n');

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={isHindi ? `https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/hi/calculators/${slug}` : `https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/calculators/${slug}`} />
        <link rel="alternate" hrefLang="en" href={`https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/calculators/${slug}`} />
        <link rel="alternate" hrefLang="hi" href={`https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/hi/calculators/${slug}`} />
        <link rel="alternate" hrefLang="x-default" href={`https://ais-dev-rtm7msahoxro4cx3gws5fw-152777609293.asia-southeast1.run.app/calculators/${slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Breadcrumb items={[{ label: category, path: isHindi ? '/hi' : '/' }, { label: name }]} />

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-12">
          <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-100/50">
            <h1 className="text-4xl font-black text-zinc-900 mb-2 tracking-tight">{name}</h1>
            <p className="text-zinc-500 mb-8 text-lg">{description}</p>
            
            <AdUnit format="horizontal" slot="after-h1" className="mb-8" />

            <CalculatorForm config={calculator} onCalculate={handleCalculate} />
          </section>

          <AnimatePresence>
            {result !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <section className="bg-zinc-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-zinc-200 overflow-hidden relative">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{t.calculatedResult}</h2>
                      <button 
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        title="Copy result"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-6xl md:text-7xl font-black mb-8 tracking-tighter">
                      {formattedResult}
                    </div>

                    {loadingInsights ? (
                      <div className="flex items-center space-x-3 text-zinc-500 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">{t.aiAnalyzing}</span>
                      </div>
                    ) : insights ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10"
                      >
                        <div className="flex items-center space-x-2 text-emerald-400 mb-3">
                          <Sparkles className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-[0.15em]">{t.aiInsight}</span>
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-300 font-medium">{insights}</p>
                      </motion.div>
                    ) : null}
                  </div>
                </section>

                <AdUnit format="horizontal" slot="after-result" />

                {/* Affiliate CTAs for Finance Category */}
                {calculator.category === 'Finance' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <AffiliateCTA category="loan" isHindi={isHindi} />
                    <AffiliateCTA category="credit-card" isHindi={isHindi} />
                  </div>
                )}

                {calculator.hasChart && chartData && (
                  <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm">
                    <div className="flex items-center space-x-2 mb-8">
                      <PieChartIcon className="w-5 h-5 text-zinc-900" />
                      <h3 className="text-xl font-bold">{t.visualBreakdown}</h3>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                )}

                {calculator.showAmortization && amortization && (
                  <section className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
                    <div className="flex items-center space-x-2 mb-8">
                      <Table className="w-5 h-5 text-zinc-900" />
                      <h3 className="text-xl font-bold">{t.amortizationSchedule}</h3>
                    </div>
                    <div className="overflow-x-auto -mx-8 px-8">
                      <table className="w-full text-sm text-left">
                        <thead>
                          <tr className="text-zinc-400 uppercase tracking-widest text-[10px] font-black border-b border-zinc-100">
                            <th className="pb-4 font-black">{t.month}</th>
                            <th className="pb-4 font-black">{t.payment}</th>
                            <th className="pb-4 font-black">{t.principal}</th>
                            <th className="pb-4 font-black">{t.interest}</th>
                            <th className="pb-4 font-black">{t.balance}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-50">
                          {amortization.slice(0, 12).map((row) => (
                            <tr key={row.month} className="group hover:bg-zinc-50 transition-colors">
                              <td className="py-4 font-bold text-zinc-900">{row.month}</td>
                              <td className="py-4 text-zinc-600">{formatCurrency(row.payment)}</td>
                              <td className="py-4 text-emerald-600 font-medium">{formatCurrency(row.principal)}</td>
                              <td className="py-4 text-amber-600 font-medium">{formatCurrency(row.interest)}</td>
                              <td className="py-4 font-bold text-zinc-900">{formatCurrency(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {amortization.length > 12 && (
                        <div className="mt-6 text-center">
                          <p className="text-xs text-zinc-400 italic">{t.showingFirst.replace('{total}', amortization.length.toString())}</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {longContent && (
            <section className="prose prose-zinc max-w-none bg-white p-10 rounded-[2.5rem] border border-zinc-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-black tracking-tight m-0">{t.expertGuide}</h2>
              </div>
              <div className="markdown-body">
                <Markdown>{firstHalf}</Markdown>
                <AdUnit format="rectangle" slot="mid-content" label="Sponsored Content" className="my-12" />
                <Markdown>{secondHalf}</Markdown>
              </div>
            </section>
          )}

          <FAQSection faqs={calculator.faq} />
        </div>

        {/* Sidebar Column */}
        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <AdUnit format="vertical" slot="sidebar-top" />
            
            <AffiliateCTA category="investment" isHindi={isHindi} />

            <div className="bg-white p-8 rounded-[2.5rem] border border-zinc-100 shadow-sm space-y-6">
              <h3 className="font-black text-xl text-zinc-900 tracking-tight">{t.popularTools}</h3>
              <div className="grid gap-4">
                {popularCalculators.map((calc) => (
                  <Link
                    key={calc.slug}
                    to={`${isHindi ? '/hi' : ''}/calculators/${calc.slug}`}
                    className="flex items-center space-x-3 group p-2 -m-2 rounded-2xl hover:bg-zinc-50 transition-all"
                  >
                    <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">{isHindi ? (calc.name_hi || calc.name) : calc.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-wider">{isHindi ? (calc.category_hi || calc.category) : calc.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <AdUnit format="rectangle" slot="sidebar-bottom" />
          </div>
        </aside>
      </div>
    </div>
  );
}
