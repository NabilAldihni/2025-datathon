import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PrivacyRiskHeatmap = ({ services, onServiceClick }) => {
  const [hoveredService, setHoveredService] = useState(null);

  const getRiskColor = (riskLevel) => {
    if (riskLevel >= 80) return 'bg-error/20 border-error hover:bg-error/30';
    if (riskLevel >= 50) return 'bg-warning/20 border-warning hover:bg-warning/30';
    return 'bg-success/20 border-success hover:bg-success/30';
  };

  const getRiskSize = (dataExposure) => {
    if (dataExposure === 'high') return 'col-span-2 row-span-2';
    if (dataExposure === 'medium') return 'col-span-2 row-span-1';
    return 'col-span-1 row-span-1';
  };

  return (
    <div className="privacy-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Privacy Risk Heatmap</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success/20 border border-success" />
            <span className="text-xs text-muted-foreground">Low Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning/20 border border-warning" />
            <span className="text-xs text-muted-foreground">Medium Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-error/20 border border-error" />
            <span className="text-xs text-muted-foreground">High Risk</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 auto-rows-[120px]">
        {services?.map((service) => (
          <button
            key={service?.id}
            className={`${getRiskSize(service?.dataExposure)} ${getRiskColor(service?.riskScore)} border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer relative group`}
            onClick={() => onServiceClick(service)}
            onMouseEnter={() => setHoveredService(service?.id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-start justify-between">
                <Icon name={service?.icon} size={24} />
                <span className="text-xs font-medium privacy-data-text">
                  {service?.riskScore}%
                </span>
              </div>
              
              <div>
                <p className="font-medium text-sm text-left">{service?.name}</p>
                <p className="text-xs text-muted-foreground text-left">
                  {service?.dataPoints} data points
                </p>
              </div>
            </div>

            {hoveredService === service?.id && (
              <div className="absolute inset-0 bg-card/95 rounded-lg p-3 flex flex-col justify-center border-2 border-primary">
                <p className="text-xs font-medium mb-2">{service?.name}</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risk Score:</span>
                    <span className="font-medium">{service?.riskScore}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Violations:</span>
                    <span className="font-medium">{service?.violations}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Last Updated:</span>
                    <span className="font-medium">{service?.lastUpdate}</span>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrivacyRiskHeatmap;