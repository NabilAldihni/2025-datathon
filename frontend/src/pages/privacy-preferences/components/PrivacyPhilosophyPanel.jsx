import React from 'react';
import Icon from '../../../components/AppIcon';

const PrivacyPhilosophyPanel = ({ 
  preferences, 
  onPreferenceChange,
  impactMetrics 
}) => {
  const philosophyControls = [
    {
      id: 'dataSharing',
      label: 'Data Sharing Tolerance',
      description: 'How comfortable are you with sharing your data?',
      icon: 'Share2',
      min: 0,
      max: 100,
      value: preferences?.dataSharing,
      levels: [
        { value: 0, label: 'Minimal', color: 'var(--color-success)' },
        { value: 33, label: 'Selective', color: 'var(--color-warning)' },
        { value: 66, label: 'Moderate', color: 'var(--color-accent)' },
        { value: 100, label: 'Open', color: 'var(--color-error)' }
      ]
    },
    {
      id: 'aiTraining',
      label: 'AI Training Consent',
      description: 'Allow your data to be used for AI model training?',
      icon: 'Brain',
      min: 0,
      max: 100,
      value: preferences?.aiTraining,
      levels: [
        { value: 0, label: 'Never', color: 'var(--color-success)' },
        { value: 33, label: 'Anonymous Only', color: 'var(--color-warning)' },
        { value: 66, label: 'Opt-in', color: 'var(--color-accent)' },
        { value: 100, label: 'Always', color: 'var(--color-error)' }
      ]
    },
    {
      id: 'thirdParty',
      label: 'Third-Party Sharing',
      description: 'Comfort level with data shared to external partners',
      icon: 'Users',
      min: 0,
      max: 100,
      value: preferences?.thirdParty,
      levels: [
        { value: 0, label: 'Block All', color: 'var(--color-success)' },
        { value: 33, label: 'Essential Only', color: 'var(--color-warning)' },
        { value: 66, label: 'Trusted Partners', color: 'var(--color-accent)' },
        { value: 100, label: 'Allow All', color: 'var(--color-error)' }
      ]
    }
  ];

  const getCurrentLevel = (control) => {
    const value = control?.value;
    if (value <= 25) return control?.levels?.[0];
    if (value <= 50) return control?.levels?.[1];
    if (value <= 75) return control?.levels?.[2];
    return control?.levels?.[3];
  };

  const getSliderBackground = (value) => {
    const percentage = value;
    if (percentage <= 25) return 'linear-gradient(to right, var(--color-success) 0%, var(--color-success) ' + percentage + '%, var(--color-muted) ' + percentage + '%)';
    if (percentage <= 50) return 'linear-gradient(to right, var(--color-warning) 0%, var(--color-warning) ' + percentage + '%, var(--color-muted) ' + percentage + '%)';
    if (percentage <= 75) return 'linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ' + percentage + '%, var(--color-muted) ' + percentage + '%)';
    return 'linear-gradient(to right, var(--color-error) 0%, var(--color-error) ' + percentage + '%, var(--color-muted) ' + percentage + '%)';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Sliders" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Privacy Philosophy</h2>
          <p className="text-sm text-muted-foreground">Configure your privacy preferences</p>
        </div>
      </div>
      <div className="space-y-8">
        {philosophyControls?.map((control) => {
          const currentLevel = getCurrentLevel(control);
          return (
            <div key={control?.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <Icon name={control?.icon} size={16} color="var(--color-foreground)" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium">{control?.label}</label>
                    <span 
                      className="text-xs font-medium px-2 py-1 rounded-md"
                      style={{ 
                        backgroundColor: currentLevel?.color + '20',
                        color: currentLevel?.color 
                      }}
                    >
                      {currentLevel?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{control?.description}</p>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min={control?.min}
                      max={control?.max}
                      value={control?.value}
                      onChange={(e) => onPreferenceChange(control?.id, parseInt(e?.target?.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: getSliderBackground(control?.value)
                      }}
                    />
                    <div className="flex justify-between mt-2">
                      {control?.levels?.map((level, idx) => (
                        <button
                          key={idx}
                          onClick={() => onPreferenceChange(control?.id, level?.value)}
                          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {level?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Impact Preview</span>
          <Icon name="TrendingUp" size={16} color="var(--color-primary)" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Privacy Score</div>
            <div className="text-2xl font-semibold text-success">
              {impactMetrics?.privacyScore}
              <span className="text-sm text-muted-foreground ml-1">/100</span>
            </div>
            <div className="text-xs text-success mt-1 flex items-center gap-1">
              <Icon name="ArrowUp" size={12} />
              +{impactMetrics?.scoreImprovement}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-xs text-muted-foreground mb-1">Services Affected</div>
            <div className="text-2xl font-semibold">
              {impactMetrics?.affectedServices}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {impactMetrics?.changesRequired} changes needed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPhilosophyPanel;