import React from 'react';
import { Badge } from './ui/badge';

const TrustBadge = ({ score, isVerified, size = "md", showScore = true }) => {
  const getBadgeColor = (score) => {
    if (score >= 90) return "bg-emerald-500 text-white";
    if (score >= 75) return "bg-blue-500 text-white";
    if (score >= 50) return "bg-slate-500 text-white";
    return "bg-orange-500 text-white";
  };

  const getBadgeIcon = (score) => {
    if (score >= 90) return "🌟";
    if (score >= 75) return "⭐";
    if (score >= 50) return "✓";
    return "⚠️";
  };

  const getBadgeText = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 50) return "Fair";
    return "Low";
  };

  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  return (
    <div className="flex items-center space-x-2">
      {isVerified && (
        <Badge className="bg-blue-500 text-white" title="Verified Account">
          ✓ Verified
        </Badge>
      )}
      
      {showScore && (
        <Badge 
          className={`${getBadgeColor(score)} ${sizes[size]}`}
          title={`Trust Score: ${score}/100`}
        >
          {getBadgeIcon(score)} {getBadgeText(score)}
        </Badge>
      )}
    </div>
  );
};

export default TrustBadge;
