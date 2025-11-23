import React from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const LeaderboardFilters = ({ 
  selectedCategory, 
  onCategoryChange,
  selectedRankingMethod,
  onRankingMethodChange,
  selectedTimePeriod,
  onTimePeriodChange,
  onReset
}) => {
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'social-media', label: 'Social Media' },
    { value: 'cloud-storage', label: 'Cloud Storage' },
    { value: 'email', label: 'Email Services' },
    { value: 'messaging', label: 'Messaging Apps' },
    { value: 'streaming', label: 'Streaming Services' },
    { value: 'productivity', label: 'Productivity Tools' },
    { value: 'e-commerce', label: 'E-Commerce' },
    { value: 'finance', label: 'Financial Services' }
  ];

  const rankingMethodOptions = [
    { value: 'privacy-score', label: 'Privacy Score' },
    { value: 'data-sharing', label: 'Data Sharing Practices' },
    { value: 'policy-clarity', label: 'Policy Clarity' },
    { value: 'violation-count', label: 'Violation Count' },
    { value: 'user-control', label: 'User Control Options' },
    { value: 'transparency', label: 'Transparency Rating' }
  ];

  const timePeriodOptions = [
    { value: 'current', label: 'Current Week' },
    { value: '1-month', label: 'Last Month' },
    { value: '3-months', label: 'Last 3 Months' },
    { value: '6-months', label: 'Last 6 Months' },
    { value: '1-year', label: 'Last Year' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filter & Sort</h2>
        <Button
          variant="ghost"
          size="sm"
          iconName="RotateCcw"
          iconPosition="left"
          onClick={onReset}
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={selectedCategory}
          onChange={onCategoryChange}
          searchable
        />

        <Select
          label="Ranking Method"
          options={rankingMethodOptions}
          value={selectedRankingMethod}
          onChange={onRankingMethodChange}
        />

        <Select
          label="Time Period"
          options={timePeriodOptions}
          value={selectedTimePeriod}
          onChange={onTimePeriodChange}
        />
      </div>
    </div>
  );
};

export default LeaderboardFilters;