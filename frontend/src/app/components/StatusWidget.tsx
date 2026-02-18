import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatusWidgetProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  onClick?: () => void;
}

export function StatusWidget({ icon, label, count, color, onClick }: StatusWidgetProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all text-left w-full group"
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-600 truncate">{label}</p>
        <p className="text-xl text-gray-900 group-hover:text-[#4F46E5] transition-colors">
          {count}
        </p>
      </div>
    </button>
  );
}
