import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ServiceGridCard = ({ service, onClick }) => {
  const getComplianceColor = (status) => {
    if (status === 'compliant') return 'text-success bg-success/10';
    if (status === 'warning') return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const getComplianceIcon = (status) => {
    if (status === 'compliant') return 'CheckCircle2';
    if (status === 'warning') return 'AlertTriangle';
    return 'XCircle';
  };

  const getRiskBadgeColor = (score) => {
    if (score >= 80) return 'bg-error text-error-foreground';
    if (score >= 50) return 'bg-warning text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  return (
    <button
      onClick={() => onClick(service)}
      className="privacy-card hover:shadow-privacy-elevated transition-all duration-200 text-left w-full"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={service?.logo}
            alt={service?.logoAlt}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-sm truncate">{service?.name}</h3>
            <span className={`px-2 py-1 rounded text-xs font-medium privacy-data-text ${getRiskBadgeColor(service?.privacyScore)}`}>
              {service?.privacyScore}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{service?.category}</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Compliance Status</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${getComplianceColor(service?.complianceStatus)}`}>
            <Icon name={getComplianceIcon(service?.complianceStatus)} size={12} />
            <span className="text-xs font-medium capitalize">{service?.complianceStatus}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Data Points Tracked</span>
          <span className="text-xs font-medium privacy-data-text">{service?.dataPoints}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Last Policy Update</span>
          <span className="text-xs font-medium privacy-data-text">{service?.lastPolicyUpdate}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Active Violations</span>
          <span className={`text-xs font-medium ${service?.violations > 0 ? 'text-error' : 'text-success'}`}>
            {service?.violations}
          </span>
        </div>
      </div>
    </button>
  );
};

export default ServiceGridCard;