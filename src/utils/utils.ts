import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function calculateAmortization(principal: number, annualRate: number, years: number) {
  const monthlyRate = annualRate / 12 / 100;
  const numberOfPayments = years * 12;
  const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  let balance = principal;
  const schedule = [];

  for (let i = 1; i <= numberOfPayments; i++) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance -= principalPaid;

    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: principalPaid,
      interest: interest,
      balance: Math.max(0, balance),
    });
  }

  return { monthlyPayment, schedule };
}
