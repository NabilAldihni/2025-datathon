import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentAlertsPanel = ({ alerts, onViewAll, onDismiss }) => {
  const getSeverityColor = (severity) => {
    if (severity === 'critical') return 'text-error bg-error/10';
    if (severity === 'high') return 'text-warning bg-warning/10';
    return 'text-primary bg-primary/10';
  };

  const getSeverityIcon = (severity) => {
    if (severity === 'critical') return 'AlertOctagon';
    if (severity === 'high') return 'AlertTriangle';
    return 'Info';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="privacy-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Recent Alerts</h2>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {alerts?.map((alert) => (
          <div
            key={alert?.id}
            className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200"
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${getSeverityColor(alert?.severity)}`}>
                <Icon name={getSeverityIcon(alert?.severity)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm">{alert?.title}</p>
                  <button
                    onClick={() => onDismiss(alert?.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {alert?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground privacy-data-text">
                    {formatTime(alert?.timestamp)}
                  </span>
                  <span className="text-xs font-medium text-primary">
                    {alert?.service}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {alerts?.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <Icon name="CheckCircle2" size={48} color="var(--color-success)" className="mb-3" />
          <p className="text-sm font-medium mb-1">All Clear!</p>
          <p className="text-xs text-muted-foreground">No active privacy alerts</p>
        </div>
      )}
    </div>
  );
};

export default RecentAlertsPanel;