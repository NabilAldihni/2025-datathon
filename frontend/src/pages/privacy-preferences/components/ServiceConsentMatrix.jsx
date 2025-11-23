import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ServiceConsentMatrix = ({ 
  services, 
  onConsentChange,
  userPreferences 
}) => {
  const [expandedService, setExpandedService] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const dataCategories = [
    { 
      id: 'personalInfo', 
      label: 'Personal Info', 
      icon: 'User',
      description: 'Name, email, phone, address'
    },
    { 
      id: 'behavioralData', 
      label: 'Behavioral Data', 
      icon: 'Activity',
      description: 'Usage patterns, preferences, interactions'
    },
    { 
      id: 'communicationContent', 
      label: 'Communication Content', 
      icon: 'MessageSquare',
      description: 'Messages, emails, call logs'
    }
  ];

  const getAlignmentStatus = (service) => {
    const misalignments = service?.categories?.filter(cat => {
      const userPref = userPreferences?.[cat?.id];
      return cat?.enabled !== userPref;
    })?.length;

    if (misalignments === 0) return { status: 'aligned', color: 'var(--color-success)', label: 'Aligned' };
    if (misalignments <= 1) return { status: 'partial', color: 'var(--color-warning)', label: 'Partial' };
    return { status: 'misaligned', color: 'var(--color-error)', label: 'Misaligned' };
  };

  const getRecommendedChanges = (service) => {
    return service?.categories?.filter(cat => {
      const userPref = userPreferences?.[cat?.id];
      return cat?.enabled !== userPref;
    });
  };

  const toggleServiceSelection = (serviceId) => {
    setSelectedServices(prev => 
      prev?.includes(serviceId) 
        ? prev?.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const applyBulkChanges = () => {
    selectedServices?.forEach(serviceId => {
      const service = services?.find(s => s?.id === serviceId);
      const changes = getRecommendedChanges(service);
      changes?.forEach(change => {
        onConsentChange(serviceId, change?.id, userPreferences?.[change?.id]);
      });
    });
    setSelectedServices([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Service Consent Matrix</h2>
          <p className="text-sm text-muted-foreground">Manage data sharing permissions per service</p>
        </div>
        {selectedServices?.length > 0 && (
          <Button
            variant="default"
            iconName="Check"
            iconPosition="left"
            onClick={applyBulkChanges}
          >
            Apply to {selectedServices?.length} Services
          </Button>
        )}
      </div>
      <div className="space-y-3">
        {services?.map((service) => {
          const alignment = getAlignmentStatus(service);
          const recommendations = getRecommendedChanges(service);
          const isExpanded = expandedService === service?.id;

          return (
            <div 
              key={service?.id}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedServices?.includes(service?.id)}
                    onChange={() => toggleServiceSelection(service?.id)}
                    className="w-4 h-4 rounded border-border"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{service?.name}</h3>
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-md"
                        style={{ 
                          backgroundColor: alignment?.color + '20',
                          color: alignment?.color 
                        }}
                      >
                        {alignment?.label}
                      </span>
                      {recommendations?.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {recommendations?.length} change{recommendations?.length > 1 ? 's' : ''} recommended
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Shield" size={12} />
                        Privacy Score: {service?.privacyScore}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        Last updated: {service?.lastUpdated}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
                    onClick={() => setExpandedService(isExpanded ? null : service?.id)}
                  />
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border space-y-3">
                    {dataCategories?.map((category) => {
                      const categoryData = service?.categories?.find(c => c?.id === category?.id);
                      const isRecommended = recommendations?.some(r => r?.id === category?.id);
                      const recommendedState = userPreferences?.[category?.id];

                      return (
                        <div 
                          key={category?.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            isRecommended ? 'bg-warning/5 border border-warning/20' : 'bg-muted/30'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center">
                              <Icon name={category?.icon} size={16} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{category?.label}</span>
                                {isRecommended && (
                                  <span className="text-xs text-warning flex items-center gap-1">
                                    <Icon name="AlertCircle" size={12} />
                                    Change recommended
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{category?.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {isRecommended && (
                              <div className="text-xs text-muted-foreground">
                                Suggest: {recommendedState ? 'Enable' : 'Disable'}
                              </div>
                            )}
                            <button
                              onClick={() => onConsentChange(service?.id, category?.id, !categoryData?.enabled)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                categoryData?.enabled ? 'bg-primary' : 'bg-muted'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  categoryData?.enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {recommendations?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">Projected Impact:</span>
                            <span className="text-success ml-2">
                              +{service?.projectedImprovement} privacy score
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            iconName="Check"
                            iconPosition="left"
                            onClick={() => {
                              recommendations?.forEach(rec => {
                                onConsentChange(service?.id, rec?.id, userPreferences?.[rec?.id]);
                              });
                            }}
                          >
                            Apply Changes
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceConsentMatrix;