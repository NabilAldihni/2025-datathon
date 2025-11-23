import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';

const ServiceConnectionStatus = ({ services = [] }) => {
  const [expandedServices, setExpandedServices] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    total: 0,
    connected: 0,
    syncing: 0,
    error: 0
  });

  useEffect(() => {
    const stats = services?.reduce((acc, service) => {
      acc.total++;
      if (service?.status === 'connected') acc.connected++;
      if (service?.status === 'syncing') acc.syncing++;
      if (service?.status === 'error') acc.error++;
      return acc;
    }, { total: 0, connected: 0, syncing: 0, error: 0 });

    setConnectionStats(stats);
  }, [services]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'var(--color-success)';
      case 'syncing':
        return 'var(--color-warning)';
      case 'error':
        return 'var(--color-error)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle2';
      case 'syncing':
        return 'RefreshCw';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const toggleExpanded = () => {
    setExpandedServices(!expandedServices);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[105]">
      <div className="bg-card border border-border rounded-lg shadow-privacy-elevated">
        <button
          onClick={toggleExpanded}
          className="flex items-center gap-3 px-4 py-3 w-full hover:bg-muted/50 transition-colors duration-200 rounded-lg"
        >
          <Icon name="Link" size={20} color="var(--color-primary)" />
          <div className="flex-1 text-left">
            <div className="text-sm font-medium">
              {connectionStats?.connected}/{connectionStats?.total} Services
            </div>
            <div className="text-xs text-muted-foreground">
              {connectionStats?.syncing > 0 && `${connectionStats?.syncing} syncing`}
              {connectionStats?.error > 0 && ` • ${connectionStats?.error} errors`}
            </div>
          </div>
          <Icon 
            name={expandedServices ? 'ChevronDown' : 'ChevronUp'} 
            size={16} 
          />
        </button>

        {expandedServices && (
          <div className="border-t border-border max-h-64 overflow-y-auto">
            {services?.map((service) => (
              <div
                key={service?.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 transition-colors duration-200"
              >
                <Icon
                  name={getStatusIcon(service?.status)}
                  size={16}
                  color={getStatusColor(service?.status)}
                  className={service?.status === 'syncing' ? 'animate-spin' : ''}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{service?.name}</div>
                  <div className="text-xs text-muted-foreground font-data">
                    {service?.lastSync}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceConnectionStatus;