import React from 'react';
import Icon from '../../../components/AppIcon';

const ChangeHistoryTimeline = ({ history }) => {
  const getChangeIcon = (type) => {
    switch (type) {
      case 'preference':
        return 'Sliders';
      case 'consent':
        return 'Shield';
      case 'bulk':
        return 'Layers';
      default:
        return 'Clock';
    }
  };

  const getChangeColor = (impact) => {
    switch (impact) {
      case 'positive':
        return 'var(--color-success)';
      case 'neutral':
        return 'var(--color-muted-foreground)';
      case 'negative':
        return 'var(--color-warning)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon name="History" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Change History</h2>
            <p className="text-sm text-muted-foreground">Track your preference modifications</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">{history?.length} changes</span>
      </div>
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
        
        <div className="space-y-6">
          {history?.map((change, index) => (
            <div key={change?.id} className="relative pl-12">
              <div 
                className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: getChangeColor(change?.impact) + '20' }}
              >
                <Icon 
                  name={getChangeIcon(change?.type)} 
                  size={14} 
                  color={getChangeColor(change?.impact)}
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-sm font-medium">{change?.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{change?.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {formatTimestamp(change?.timestamp)}
                  </span>
                </div>

                {change?.details && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground">Services Affected:</span>
                        <span className="ml-2 font-medium">{change?.details?.servicesAffected}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Privacy Impact:</span>
                        <span 
                          className="ml-2 font-medium"
                          style={{ color: getChangeColor(change?.impact) }}
                        >
                          {change?.details?.privacyImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {change?.outcome && (
                  <div className="mt-3 flex items-center gap-2 text-xs">
                    <Icon 
                      name={change?.outcome?.success ? 'CheckCircle2' : 'AlertCircle'} 
                      size={14} 
                      color={change?.outcome?.success ? 'var(--color-success)' : 'var(--color-warning)'}
                    />
                    <span className="text-muted-foreground">{change?.outcome?.message}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {history?.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Icon name="History" size={24} color="var(--color-muted-foreground)" />
          </div>
          <p className="text-sm text-muted-foreground">No changes recorded yet</p>
          <p className="text-xs text-muted-foreground mt-1">Your preference modifications will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ChangeHistoryTimeline;