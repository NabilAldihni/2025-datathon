import React from 'react';
import Icon from '../../../components/AppIcon';

const PrivacyScoreCard = ({ title, value, trend, trendValue, icon, riskLevel }) => {
  const getRiskColor = () => {
    if (riskLevel === 'low') return 'text-success';
    if (riskLevel === 'medium') return 'text-warning';
    if (riskLevel === 'high') return 'text-error';
    return 'text-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (riskLevel === 'low') {
      return trend === 'up' ? 'text-success' : 'text-error';
    }
    return trend === 'up' ? 'text-error' : 'text-success';
  };

  return (
    <div className="privacy-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name={icon} size={20} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <h3 className={`text-2xl font-semibold ${getRiskColor()}`}>{value}</h3>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Icon name={getTrendIcon()} size={16} className={getTrendColor()} />
        <span className={`text-sm ${getTrendColor()}`}>{trendValue}</span>
        <span className="text-sm text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
};

export default PrivacyScoreCard;