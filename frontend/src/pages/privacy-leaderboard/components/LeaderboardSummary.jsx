import React from 'react';
import Icon from '../../../components/AppIcon';

const LeaderboardSummary = ({ summaryData }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          Category Averages
        </h3>
        <div className="space-y-4">
          {summaryData?.categoryAverages?.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{category?.name}</span>
                <span className="text-sm font-bold text-primary">{category?.avgScore}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary"
                  style={{ width: `${category?.avgScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} color="var(--color-accent)" />
          Industry Benchmarks
        </h3>
        <div className="space-y-4">
          {summaryData?.industryBenchmarks?.map((benchmark, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <div className="text-sm font-medium text-foreground">{benchmark?.metric}</div>
                <div className="text-xs text-muted-foreground">{benchmark?.description}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">{benchmark?.value}</div>
                <div className="text-xs text-muted-foreground">{benchmark?.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} color="var(--color-success)" />
          Trending Services
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-success mb-2">Moving Up</h4>
            <div className="space-y-2">
              {summaryData?.trendingUp?.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-success/5 rounded-lg">
                  <span className="text-sm text-foreground">{service?.name}</span>
                  <span className="text-sm font-medium text-success">+{service?.change}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-error mb-2">Moving Down</h4>
            <div className="space-y-2">
              {summaryData?.trendingDown?.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-error/5 rounded-lg">
                  <span className="text-sm text-foreground">{service?.name}</span>
                  <span className="text-sm font-medium text-error">{service?.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Filter" size={20} color="var(--color-secondary)" />
          Advanced Filters
        </h3>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium text-foreground">Company Size</span>
            <Icon name="ChevronRight" size={16} />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium text-foreground">Geographic Region</span>
            <Icon name="ChevronRight" size={16} />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
            <span className="text-sm font-medium text-foreground">Compliance Status</span>
            <Icon name="ChevronRight" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSummary;