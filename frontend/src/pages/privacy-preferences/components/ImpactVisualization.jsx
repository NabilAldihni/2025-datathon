import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';

const ImpactVisualization = ({ impactData, tradeoffs }) => {
  const scoreData = [
    { name: 'Current', score: impactData?.currentScore, color: 'var(--color-warning)' },
    { name: 'Projected', score: impactData?.projectedScore, color: 'var(--color-success)' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium">{payload?.[0]?.payload?.name}</p>
          <p className="text-lg font-semibold text-primary">{payload?.[0]?.value}/100</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Impact Visualization</h2>
          <p className="text-sm text-muted-foreground">See how changes affect your privacy</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium mb-4">Privacy Score Impact</h3>
          <div className="h-64" aria-label="Privacy Score Comparison Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="var(--color-muted-foreground)"
                  style={{ fontSize: '12px' }}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                  {scoreData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }} />
              <span className="text-xs text-muted-foreground">Current: {impactData?.currentScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--color-success)' }} />
              <span className="text-xs text-muted-foreground">Projected: {impactData?.projectedScore}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-4">Service Functionality Trade-offs</h3>
          <div className="space-y-3">
            {tradeoffs?.map((tradeoff) => (
              <div 
                key={tradeoff?.id}
                className="bg-muted/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: tradeoff?.impactColor + '20' }}
                  >
                    <Icon 
                      name={tradeoff?.icon} 
                      size={16} 
                      color={tradeoff?.impactColor}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{tradeoff?.service}</span>
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-md"
                        style={{ 
                          backgroundColor: tradeoff?.impactColor + '20',
                          color: tradeoff?.impactColor 
                        }}
                      >
                        {tradeoff?.impact}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{tradeoff?.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1 text-success">
                        <Icon name="Plus" size={12} />
                        {tradeoff?.privacyGain}
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Icon name="Minus" size={12} />
                        {tradeoff?.functionalityLoss}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Understanding Trade-offs</p>
                <p>Stricter privacy settings may limit some service features. Review each change to find your optimal balance between privacy and functionality.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactVisualization;