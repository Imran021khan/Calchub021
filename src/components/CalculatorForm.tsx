import React from 'react';
import { useLocation } from 'react-router-dom';
import { CalculatorConfig } from '../types';

interface CalculatorFormProps {
  config: CalculatorConfig;
  onCalculate: (values: Record<string, any>) => void;
}

export function CalculatorForm({ config, onCalculate }: CalculatorFormProps) {
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Record<string, any> = {};
    config.inputs.forEach((input) => {
      const val = formData.get(input.name);
      values[input.name] = input.type === 'number' ? Number(val) : val;
    });
    onCalculate(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {config.inputs.map((input) => (
        <div key={input.name} className="space-y-1.5">
          <label htmlFor={input.name} className="block text-sm font-medium text-zinc-700">
            {isHindi ? (input.label_hi || input.label) : input.label}
          </label>
          <input
            type={input.type}
            name={input.name}
            id={input.name}
            required
            placeholder={isHindi ? (input.placeholder_hi || input.placeholder) : input.placeholder}
            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all text-zinc-900"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full py-3 px-4 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-800 active:scale-[0.98] transition-all shadow-lg shadow-zinc-200"
      >
        {isHindi ? "गणना करें" : "Calculate"}
      </button>
    </form>
  );
}
