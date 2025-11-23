import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './AppIcon';

const PrivacyTabs = ({ alertCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: 'Dashboard',
      path: '/privacy-dashboard-overview',
      icon: 'LayoutDashboard',
      tooltip: 'Privacy monitoring overview'
    },
    {
      label: 'Leaderboard',
      path: '/privacy-leaderboard',
      icon: 'TrendingUp',
      tooltip: 'Service comparison and rankings'
    },
    {
      label: 'Preferences',
      path: '/privacy-preferences',
      icon: 'Settings',
      tooltip: 'Privacy configuration and controls'
    }
  ];

  const isActive = (path) => location?.pathname === path;

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="privacy-tabs">
      <div className="privacy-tabs-container">
        <div className="privacy-tabs-list">
          {tabs?.map((tab) => (
            <button
              key={tab?.path}
              className={`privacy-tab ${isActive(tab?.path) ? 'active' : ''}`}
              onClick={() => handleTabClick(tab?.path)}
              title={tab?.tooltip}
              aria-label={tab?.label}
              aria-current={isActive(tab?.path) ? 'page' : undefined}
            >
              <Icon name={tab?.icon} size={20} />
              <span className="privacy-tab-label">{tab?.label}</span>
              {tab?.path === '/privacy-dashboard-overview' && alertCount > 0 && (
                <span className="privacy-tab-badge">{alertCount}</span>
              )}
              <span className="privacy-tab-indicator" />
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PrivacyTabs;