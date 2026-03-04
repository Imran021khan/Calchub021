import React from 'react';
import { ExternalLink, CreditCard, Landmark, TrendingUp, ArrowRight } from 'lucide-react';

type CTACategory = 'loan' | 'credit-card' | 'investment';

interface AffiliateCTAProps {
  category: CTACategory;
  isHindi?: boolean;
}

const ctaData = {
  loan: {
    icon: <Landmark className="w-5 h-5" />,
    title: "Best Personal Loan Offers",
    title_hi: "सर्वश्रेष्ठ व्यक्तिगत ऋण ऑफ़र",
    description: "Compare low-interest rates from top lenders and save thousands.",
    description_hi: "शीर्ष ऋणदाताओं से कम ब्याज दरों की तुलना करें और हजारों बचाएं।",
    buttonText: "Check Rates",
    buttonText_hi: "दरें जांचें",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    btnColor: "bg-emerald-600 hover:bg-emerald-700",
  },
  'credit-card': {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Top Credit Card Deals",
    title_hi: "टॉप क्रेडिट कार्ड सौदे",
    description: "Get up to 5% cashback and welcome bonuses on your daily spends.",
    description_hi: "अपने दैनिक खर्चों पर 5% तक कैशबैक और स्वागत बोनस प्राप्त करें।",
    buttonText: "View Cards",
    buttonText_hi: "कार्ड देखें",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    btnColor: "bg-blue-600 hover:bg-blue-700",
  },
  investment: {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Start Investing Today",
    title_hi: "आज ही निवेश शुरू करें",
    description: "Open a free demat account and start your wealth-building journey.",
    description_hi: "एक मुफ्त डीमैट खाता खोलें और अपनी धन-निर्माण यात्रा शुरू करें।",
    buttonText: "Get Started",
    buttonText_hi: "शुरू करें",
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    btnColor: "bg-indigo-600 hover:bg-indigo-700",
  }
};

export function AffiliateCTA({ category, isHindi = false }: AffiliateCTAProps) {
  const data = ctaData[category];

  return (
    <div className={`p-6 rounded-2xl border ${data.color} flex flex-col space-y-4 my-6 shadow-sm`}>
      <div className="flex items-center space-y-0 space-x-3">
        <div className={`p-2.5 rounded-xl bg-white shadow-sm`}>
          {data.icon}
        </div>
        <h3 className="font-bold text-lg leading-tight">
          {isHindi ? data.title_hi : data.title}
        </h3>
      </div>
      <p className="text-sm opacity-90 leading-relaxed">
        {isHindi ? data.description_hi : data.description}
      </p>
      <button className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm flex items-center justify-center space-x-2 transition-all active:scale-95 ${data.btnColor}`}>
        <span>{isHindi ? data.buttonText_hi : data.buttonText}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
      <div className="flex items-center justify-center space-x-1 text-[10px] opacity-60 font-medium uppercase tracking-wider">
        <ExternalLink className="w-3 h-3" />
        <span>Sponsored Partner</span>
      </div>
    </div>
  );
}
