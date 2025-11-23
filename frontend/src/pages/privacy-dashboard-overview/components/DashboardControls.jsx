import React from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const DashboardControls = ({ 
  selectedFilter, 
  onFilterChange, 
  selectedSeverity, 
  onSeverityChange,
  lastScan,
  onRefresh,
  isRefreshing
}) => {
  const filterOptions = [
    { value: 'all', label: 'All Services' },
    { value: 'social', label: 'Social Media' },
    { value: 'email', label: 'Email Services' },
    { value: 'cloud', label: 'Cloud Storage' },
    { value: 'productivity', label: 'Productivity' },
    { value: 'entertainment', label: 'Entertainment' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'critical', label: 'Critical Only' },
    { value: 'high', label: 'High & Above' },
    { value: 'medium', label: 'Medium & Above' }
  ];

  const formatLastScan = (date) => {
    const now = new Date();
    const scanDate = new Date(date);
    const diff = Math.floor((now - scanDate) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return scanDate?.toLocaleDateString();
  };

  return (
    <div className="privacy-card mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={onFilterChange}
            placeholder="Filter services"
            className="w-full sm:w-48"
          />

          <Select
            options={severityOptions}
            value={selectedSeverity}
            onChange={onSeverityChange}
            placeholder="Filter by severity"
            className="w-full sm:w-48"
          />
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span className="privacy-data-text">Last scan: {formatLastScan(lastScan)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
            loading={isRefreshing}
            disabled={isRefreshing}
          >
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;