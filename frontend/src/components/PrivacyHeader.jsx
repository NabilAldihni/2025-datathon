import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from './AppIcon';
import Button from './ui/Button';
import logo from '@/assets/icon.png';

const PrivacyHeader = () => {
  const navigate = useNavigate();
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const syncInterval = setInterval(() => {
      setLastSync(new Date());
    }, 60000);

    return () => clearInterval(syncInterval);
  }, []);

  const formatLastSync = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date?.toLocaleDateString();
  };

  const handleLogoClick = () => {
    navigate('/privacy-dashboard-overview');
  };

  return (
    <header className="privacy-header">
      <div className="privacy-header-container">
        <div className="privacy-header-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <div className="privacy-header-logo-icon">
            <img src={logo} alt="Logo" />
          </div>
          <span className="privacy-header-logo-text">Aegis</span>
        </div>

        <div className="privacy-header-actions">
          <div className="privacy-header-sync-status">
            <span className={`privacy-header-sync-indicator ${syncStatus}`} />
            <span>{formatLastSync(lastSync)}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            iconName="Bell"
            iconSize={20}
            onClick={() => {}}
          />

          <Button
            variant="ghost"
            size="icon"
            iconName="Settings"
            iconSize={20}
            onClick={() => navigate('/privacy-preferences')}
          />

          <Button
            variant="outline"
            iconName="User"
            iconPosition="left"
            iconSize={18}
            onClick={() => {}}
          >
            Account
          </Button>
        </div>
      </div>
    </header>
  );
};

export default PrivacyHeader;