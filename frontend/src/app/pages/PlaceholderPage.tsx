import React from 'react';
import { useLocation } from 'react-router';
import { Card, CardContent } from '../components/ui/Card';
import { FileQuestion } from 'lucide-react';

export function PlaceholderPage() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName = pathParts[pathParts.length - 1]?.replace(/-/g, ' ') || 'Page';
  const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900 mb-1">{formattedName}</h1>
        <p className="text-sm text-gray-600">This page is under development</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileQuestion className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg text-gray-900 mb-2">{formattedName}</h3>
          <p className="text-sm text-gray-600 text-center max-w-md">
            This module is currently under construction. Please check back later.
          </p>
          <p className="text-xs text-gray-400 mt-4">
            Path: {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
