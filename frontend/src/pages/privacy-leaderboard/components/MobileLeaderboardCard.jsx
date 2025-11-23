import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const MobileLeaderboardCard = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'var(--color-success)' };
    if (trend < 0) return { name: 'TrendingDown', color: 'var(--color-error)' };
    return { name: 'Minus', color: 'var(--color-muted-foreground)' };
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden mb-4">
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-muted-foreground">#{service?.rank}</div>
            <Image 
              src={service?.logo} 
              alt={service?.logoAlt}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <div className="font-semibold text-foreground">{service?.name}</div>
              <div className="text-sm text-muted-foreground">{service?.category}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Icon 
              name={getTrendIcon(service?.trend)?.name} 
              size={20} 
              color={getTrendIcon(service?.trend)?.color}
            />
            {service?.rankChange !== 0 && (
              <span className={`text-xs font-medium ${service?.rankChange > 0 ? 'text-success' : 'text-error'}`}>
                {service?.rankChange > 0 ? '+' : ''}{service?.rankChange}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Privacy Score</div>
            <div className={`text-2xl font-bold ${getRiskColor(service?.privacyScore)}`}>
              {service?.privacyScore}
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full ${service?.privacyScore >= 80 ? 'bg-success' : service?.privacyScore >= 60 ? 'bg-warning' : 'bg-error'}`}
                style={{ width: `${service?.privacyScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Violations</div>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-lg font-bold ${
              service?.violations === 0 ? 'bg-success/10 text-success' : 
              service?.violations <= 2 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
            }`}>
              {service?.violations}
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Data Sharing</span>
              <span className="text-sm font-medium text-foreground">{service?.dataSharing}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${service?.dataSharing <= 30 ? 'bg-success' : service?.dataSharing <= 60 ? 'bg-warning' : 'bg-error'}`}
                style={{ width: `${service?.dataSharing}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-muted-foreground">Policy Clarity</span>
              <span className="text-sm font-medium text-foreground">{service?.policyClarity}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{ width: `${service?.policyClarity}%` }}
              />
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          fullWidth
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>
      {isExpanded && (
        <div className="border-t border-border p-4 bg-muted/20">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
                Violation Categories
              </h4>
              <ul className="space-y-2">
                {service?.violationDetails?.map((violation, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Icon name="Circle" size={8} className="mt-1.5" />
                    <span className="text-muted-foreground">{violation}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="FileText" size={16} color="var(--color-primary)" />
                Recent Policy Changes
              </h4>
              <ul className="space-y-2">
                {service?.recentChanges?.map((change, idx) => (
                  <li key={idx} className="text-sm">
                    <div className="font-medium text-foreground">{change?.date}</div>
                    <div className="text-muted-foreground">{change?.description}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Icon name="Users" size={16} color="var(--color-accent)" />
                User Impact
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Data Collection</span>
                    <span className="text-sm font-medium text-foreground">{service?.userImpact?.dataCollection}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-error" style={{ width: `${service?.userImpact?.dataCollection}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Third-party Sharing</span>
                    <span className="text-sm font-medium text-foreground">{service?.userImpact?.thirdPartySharing}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${service?.userImpact?.thirdPartySharing}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">User Control</span>
                    <span className="text-sm font-medium text-foreground">{service?.userImpact?.userControl}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${service?.userImpact?.userControl}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileLeaderboardCard;