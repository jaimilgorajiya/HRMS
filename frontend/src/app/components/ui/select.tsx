import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent transition-all ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
