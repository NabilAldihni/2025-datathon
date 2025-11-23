import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AutoSyncIndicator = ({ syncStatus, lastSync, pendingChanges }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  useEffect(() => {
    if (syncStatus === 'syncing') {
      const interval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setSyncProgress(0);
    }
  }, [syncStatus]);

  const getSyncStatusConfig = () => {
    switch (syncStatus) {
      case 'synced':
        return {
          icon: 'CheckCircle2',
          color: 'var(--color-success)',
          label: 'All Changes Applied',
          description: 'Your preferences are synced across all services'
        };
      case 'syncing':
        return {
          icon: 'RefreshCw',
          color: 'var(--color-warning)',
          label: 'Syncing Changes',
          description: `Applying changes to ${pendingChanges} service${pendingChanges > 1 ? 's' : ''}...`
        };
      case 'pending':
        return {
          icon: 'Clock',
          color: 'var(--color-accent)',
          label: 'Changes Pending',
          description: `${pendingChanges} change${pendingChanges > 1 ? 's' : ''} waiting to be applied`
        };
      case 'error':
        return {
          icon: 'AlertCircle',
          color: 'var(--color-error)',
          label: 'Sync Failed',
          description: 'Some changes could not be applied. Click to retry.'
        };
      default:
        return {
          icon: 'Circle',
          color: 'var(--color-muted-foreground)',
          label: 'Unknown Status',
          description: 'Unable to determine sync status'
        };
    }
  };

  const config = getSyncStatusConfig();

  const formatLastSync = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date?.toLocaleString();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[105]">
      <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-muted/50 transition-colors"
        >
          <Icon 
            name={config?.icon} 
            size={20} 
            color={config?.color}
            className={syncStatus === 'syncing' ? 'animate-spin' : ''}
          />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">{config?.label}</div>
            <div className="text-xs text-muted-foreground">
              Last sync: {formatLastSync(lastSync)}
            </div>
          </div>
          <Icon 
            name={isExpanded ? 'ChevronDown' : 'ChevronUp'} 
            size={16}
            color="var(--color-muted-foreground)"
          />
        </button>

        {syncStatus === 'syncing' && (
          <div className="h-1 bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-200"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        )}

        {isExpanded && (
          <div className="border-t border-border p-4 space-y-3">
            <p className="text-xs text-muted-foreground">{config?.description}</p>

            {syncStatus === 'pending' && (
              <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                <Icon name="Play" size={14} />
                Apply Changes Now
              </button>
            )}

            {syncStatus === 'error' && (
              <button className="w-full px-3 py-2 bg-error text-error-foreground rounded-md text-sm font-medium hover:bg-error/90 transition-colors flex items-center justify-center gap-2">
                <Icon name="RefreshCw" size={14} />
                Retry Sync
              </button>
            )}

            {syncStatus === 'synced' && (
              <div className="flex items-center gap-2 text-xs text-success">
                <Icon name="CheckCircle2" size={14} />
                <span>All preferences successfully applied</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoSyncIndicator;