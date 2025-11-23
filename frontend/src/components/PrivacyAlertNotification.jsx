import React, { useState, useEffect } from 'react';
import Icon from './AppIcon';
import Button from './ui/Button';

const PrivacyAlertNotification = ({ alerts = [] }) => {
  const [visibleAlerts, setVisibleAlerts] = useState([]);

  useEffect(() => {
    setVisibleAlerts(alerts);
  }, [alerts]);

  const handleDismiss = (alertId) => {
    setVisibleAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle2';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diff = Math.floor((now - alertDate) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return alertDate?.toLocaleTimeString();
  };

  if (visibleAlerts?.length === 0) return null;

  return (
    <div className="privacy-alert-container">
      {visibleAlerts?.map((alert) => (
        <div key={alert?.id} className={`privacy-alert ${alert?.type}`}>
          <div className="privacy-alert-header">
            <div className="privacy-alert-title">
              <Icon 
                name={getAlertIcon(alert?.type)} 
                size={18} 
                color={`var(--color-${alert?.type})`}
              />
              <span>{alert?.title}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              iconName="X"
              iconSize={16}
              onClick={() => handleDismiss(alert?.id)}
            />
          </div>
          <div className="privacy-alert-body">
            {alert?.message}
          </div>
          <div className="privacy-alert-timestamp">
            {formatTimestamp(alert?.timestamp)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrivacyAlertNotification;