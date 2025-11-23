import React, { useState, useEffect } from 'react';
import PrivacyHeader from '../../components/PrivacyHeader';
import PrivacyTabs from '../../components/PrivacyTabs';
import PrivacyAlertNotification from '../../components/PrivacyAlertNotification';
import PrivacyPhilosophyPanel from './components/PrivacyPhilosophyPanel';
import ImpactVisualization from './components/ImpactVisualization';
import ChangeHistoryTimeline from './components/ChangeHistoryTimeline';
import AutoSyncIndicator from './components/AutoSyncIndicator';

const PrivacyPreferences = () => {
  const [userPreferences, setUserPreferences] = useState({
    dataSharing: 25,
    aiTraining: 15,
    thirdParty: 20,
    personalInfo: false,
    behavioralData: false,
    communicationContent: false
  });

  const [services, setServices] = useState([
    {
      id: 'gmail',
      name: 'Gmail',
      privacyScore: 68,
      lastUpdated: '2 days ago',
      projectedImprovement: 12,
      categories: [
        { id: 'personalInfo', enabled: true },
        { id: 'behavioralData', enabled: true },
        { id: 'communicationContent', enabled: true }
      ]
    },
    {
      id: 'facebook',
      name: 'Facebook',
      privacyScore: 45,
      lastUpdated: '1 week ago',
      projectedImprovement: 18,
      categories: [
        { id: 'personalInfo', enabled: true },
        { id: 'behavioralData', enabled: true },
        { id: 'communicationContent', enabled: false }
      ]
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      privacyScore: 72,
      lastUpdated: '3 days ago',
      projectedImprovement: 8,
      categories: [
        { id: 'personalInfo', enabled: true },
        { id: 'behavioralData', enabled: false },
        { id: 'communicationContent', enabled: false }
      ]
    },
    {
      id: 'twitter',
      name: 'Twitter',
      privacyScore: 58,
      lastUpdated: '5 days ago',
      projectedImprovement: 15,
      categories: [
        { id: 'personalInfo', enabled: true },
        { id: 'behavioralData', enabled: true },
        { id: 'communicationContent', enabled: true }
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      privacyScore: 52,
      lastUpdated: '1 week ago',
      projectedImprovement: 16,
      categories: [
        { id: 'personalInfo', enabled: true },
        { id: 'behavioralData', enabled: true },
        { id: 'communicationContent', enabled: false }
      ]
    }
  ]);

  const [changeHistory, setChangeHistory] = useState([
    {
      id: 'ch1',
      type: 'preference',
      title: 'Data Sharing Tolerance Updated',
      description: 'Changed from Moderate to Selective level',
      timestamp: new Date(Date.now() - 3600000),
      impact: 'positive',
      details: {
        servicesAffected: 5,
        privacyImpact: '+12 points'
      },
      outcome: {
        success: true,
        message: 'Successfully applied to all services'
      }
    },
    {
      id: 'ch2',
      type: 'consent',
      title: 'Gmail Behavioral Data Disabled',
      description: 'Disabled behavioral data collection for Gmail',
      timestamp: new Date(Date.now() - 7200000),
      impact: 'positive',
      details: {
        servicesAffected: 1,
        privacyImpact: '+8 points'
      },
      outcome: {
        success: true,
        message: 'Change applied successfully'
      }
    },
    {
      id: 'ch3',
      type: 'bulk',
      title: 'Bulk Privacy Update',
      description: 'Applied recommended changes to 3 services',
      timestamp: new Date(Date.now() - 86400000),
      impact: 'positive',
      details: {
        servicesAffected: 3,
        privacyImpact: '+24 points'
      },
      outcome: {
        success: true,
        message: 'All changes applied successfully'
      }
    },
    {
      id: 'ch4',
      type: 'preference',
      title: 'AI Training Consent Reduced',
      description: 'Changed from Opt-in to Anonymous Only',
      timestamp: new Date(Date.now() - 172800000),
      impact: 'positive',
      details: {
        servicesAffected: 5,
        privacyImpact: '+15 points'
      },
      outcome: {
        success: false,
        message: 'Failed to apply to 2 services - retry available'
      }
    }
  ]);

  const [alerts, setAlerts] = useState([]);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSync, setLastSync] = useState(new Date());
  const [pendingChanges, setPendingChanges] = useState(0);

  const impactMetrics = {
    privacyScore: 78,
    scoreImprovement: 15,
    affectedServices: 5,
    changesRequired: 12
  };

  const impactData = {
    currentScore: 63,
    projectedScore: 78
  };

  const tradeoffs = [
    {
      id: 'tf1',
      service: 'Gmail',
      icon: 'Mail',
      impact: 'Low Impact',
      impactColor: 'var(--color-success)',
      description: 'Smart reply and categorization may be less accurate',
      privacyGain: '+8 privacy points',
      functionalityLoss: 'Reduced AI features'
    },
    {
      id: 'tf2',
      service: 'Facebook',
      icon: 'Users',
      impact: 'Medium Impact',
      impactColor: 'var(--color-warning)',
      description: 'Friend suggestions and content recommendations affected',
      privacyGain: '+18 privacy points',
      functionalityLoss: 'Less personalized feed'
    },
    {
      id: 'tf3',
      service: 'LinkedIn',
      icon: 'Briefcase',
      impact: 'Low Impact',
      impactColor: 'var(--color-success)',
      description: 'Job recommendations may be less targeted',
      privacyGain: '+8 privacy points',
      functionalityLoss: 'Generic job matches'
    }
  ];

  const handlePreferenceChange = (preferenceId, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [preferenceId]: value
    }));

    setSyncStatus('pending');
    setPendingChanges(prev => prev + 1);

    setAlerts(prev => [...prev, {
      id: Date.now(),
      type: 'success',
      title: 'Preference Updated',
      message: `${preferenceId} has been changed. Changes will be applied to all services.`,
      timestamp: new Date()
    }]);

    setTimeout(() => {
      setSyncStatus('syncing');
      setTimeout(() => {
        setSyncStatus('synced');
        setLastSync(new Date());
        setPendingChanges(0);
        
        const newChange = {
          id: `ch${Date.now()}`,
          type: 'preference',
          title: `${preferenceId} Updated`,
          description: `Changed ${preferenceId} preference value`,
          timestamp: new Date(),
          impact: 'positive',
          details: {
            servicesAffected: services?.length,
            privacyImpact: '+' + Math.floor(Math.random() * 10 + 5) + ' points'
          },
          outcome: {
            success: true,
            message: 'Successfully applied to all services'
          }
        };
        setChangeHistory(prev => [newChange, ...prev]);
      }, 2000);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(prev => prev?.slice(0, 3));
    }, 5000);
    return () => clearTimeout(timer);
  }, [alerts]);

  return (
    <div className="min-h-screen bg-background">
      <PrivacyHeader />
      <PrivacyTabs alertCount={pendingChanges} />
      <PrivacyAlertNotification alerts={alerts} />
      <AutoSyncIndicator 
        syncStatus={syncStatus}
        lastSync={lastSync}
        pendingChanges={pendingChanges}
      />

      <main className="main-content">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Preferences</h1>
            <p className="text-muted-foreground">
              Configure your privacy philosophy and manage data sharing consent across all services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            <div className="lg:col-span-12">
              <PrivacyPhilosophyPanel
                preferences={userPreferences}
                onPreferenceChange={handlePreferenceChange}
                impactMetrics={impactMetrics}
              />
            </div>
          </div>

          <div className="mb-6">
            <ImpactVisualization
              impactData={impactData}
              tradeoffs={tradeoffs}
            />
          </div>

          <div>
            <ChangeHistoryTimeline history={changeHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPreferences;