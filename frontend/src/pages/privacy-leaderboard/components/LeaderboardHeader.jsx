import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LeaderboardHeader = ({ lastUpdated, totalServices, onExport }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(date);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Leaderboard</h1>
          <p className="text-muted-foreground">
            Comprehensive ranking of {totalServices} services based on privacy practices and data protection standards
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Updated: {formatDate(lastUpdated)}</span>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardHeader;