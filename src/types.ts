export interface CalculatorInput {
  name: string;
  label: string;
  label_hi?: string;
  type: 'number' | 'text' | 'date';
  placeholder: string;
  placeholder_hi?: string;
}

export interface FAQItem {
  q: string;
  a: string;
  q_hi?: string;
  a_hi?: string;
}

export interface CalculatorConfig {
  name: string;
  name_hi?: string;
  slug: string;
  category: string;
  category_hi?: string;
  formula: string;
  inputs: CalculatorInput[];
  seoTitle: string;
  seoTitle_hi?: string;
  metaDescription: string;
  metaDescription_hi?: string;
  faq: FAQItem[];
  longContent?: string;
  longContent_hi?: string;
  showAmortization?: boolean;
  hasChart?: boolean;
}
