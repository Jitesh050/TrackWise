
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";

interface FeatureCardProps {
  title: string;
  features: string[];
  onAddCard: () => void;
  variant?: 'passenger' | 'admin';
}

const FeatureCard = ({ title, features, onAddCard, variant = 'passenger' }: FeatureCardProps) => {
  const cardBg = variant === 'admin' ? 'bg-white' : 'bg-white';
  const headerBg = variant === 'admin' ? 'bg-gray-50' : 'bg-gray-50';

  return (
    <Card className={`${cardBg} border-gray-200 text-gray-900 w-80 shadow-sm`}>
      <CardHeader className={`${headerBg} rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">{title}</CardTitle>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            <MoreHorizontal size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
          >
            {feature}
          </div>
        ))}
        <Button
          onClick={onAddCard}
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-gray-800 hover:bg-gray-100 mt-4"
        >
          <Plus size={16} className="mr-2" />
          Add a card
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
