import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  color: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  icon: Icon,
  trend,
  description,
}) => (
  <Card className={`border-${color}-200 border transition-transform transform hover:scale-105 shadow-lg rounded-lg overflow-hidden`}>
    <CardContent className={`p-0 m-0 pr-6 bg-${color}-50`}>
      <div className={`flex items-center w-54 h-36 justify-between bg-${color}-50`}>
        {/* Icon Container */}
        <div className="flex items-center justify-center w-28 h-36 rounded-md bg-gradient-to-br from-cyan-500 to-cyan-800 text-white shadow-md">
          <Icon className="w-8 h-8" />
        </div>

        {/* Text Container */}
        <div className="text-right">
          <p className="text-base font-semibold text-gray-600">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          
          {/* Trend Indicator */}
          {trend !== undefined && (
            <p
              className={`text-sm font-medium mt-1 ${
                trend > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}%
            </p>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
