import React, { useState, useEffect } from 'react';
import PrivacyHeader from '@/components/PrivacyHeader';
import PrivacyTabs from '@/components/PrivacyTabs';
import PrivacyAlertNotification from '@/components/PrivacyAlertNotification';
import ServiceConnectionStatus from '@/components/ServiceConnectionStatus';
import PrivacyScoreCard from './components/PrivacyScoreCard';
import PrivacyRiskHeatmap from './components/PrivacyRiskHeatmap';
import RecentAlertsPanel from './components/RecentAlertsPanel';
import ServiceGridCard from './components/ServiceGridCard';
import DashboardControls from './components/DashboardControls';
import facebookLogo from '@/assets/facebook.png';
import googleLogo from '@/assets/google.png';
import instagramLogo from '@/assets/instagram.svg';
import twitterLogo from '@/assets/twitter.png';
import linkedinLogo from '@/assets/linkedin.png';
import amazonLogo from '@/assets/amazon.png';
import netflixLogo from '@/assets/netflix.png';
import spotifyLogo from '@/assets/spotify.png';

const PrivacyDashboardOverview = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lastScan] = useState(new Date(Date.now() - 300000));

  const kpiMetrics = [
  {
    title: "Overall Privacy Score",
    value: "72/100",
    trend: "up",
    trendValue: "+5 points",
    icon: "Shield",
    riskLevel: "medium"
  },
  {
    title: "Services Monitored",
    value: "24",
    trend: "up",
    trendValue: "+3 services",
    icon: "Link",
    riskLevel: "low"
  },
  {
    title: "Active Violations",
    value: "8",
    trend: "down",
    trendValue: "-2 violations",
    icon: "AlertTriangle",
    riskLevel: "high"
  },
  {
    title: "Data Sharing Risk",
    value: "High",
    trend: "up",
    trendValue: "+12% exposure",
    icon: "Share2",
    riskLevel: "high"
  }];


  const heatmapServices = [
  {
    id: 1,
    name: "Facebook",
    icon: facebookLogo,
    riskScore: 85,
    dataExposure: "high",
    dataPoints: 342,
    violations: 12,
    lastUpdate: "2 days ago"
  },
  {
    id: 2,
    name: "Google",
    icon: googleLogo,
    riskScore: 68,
    dataExposure: "medium",
    dataPoints: 256,
    violations: 5,
    lastUpdate: "1 week ago"
  },
  {
    id: 3,
    name: "Instagram",
    icon: instagramLogo,
    riskScore: 82,
    dataExposure: "high",
    dataPoints: 298,
    violations: 9,
    lastUpdate: "3 days ago"
  },
  {
    id: 4,
    name: "Twitter",
    icon: "Twitter",
    riskScore: 75,
    dataExposure: "medium",
    dataPoints: 187,
    violations: 6,
    lastUpdate: "5 days ago"
  },
  {
    id: 5,
    name: "LinkedIn",
    icon: "Linkedin",
    riskScore: 45,
    dataExposure: "low",
    dataPoints: 124,
    violations: 2,
    lastUpdate: "1 day ago"
  },
  {
    id: 6,
    name: "Amazon",
    icon: "ShoppingCart",
    riskScore: 72,
    dataExposure: "medium",
    dataPoints: 215,
    violations: 7,
    lastUpdate: "4 days ago"
  },
  {
    id: 7,
    name: "Netflix",
    icon: "Tv",
    riskScore: 38,
    dataExposure: "low",
    dataPoints: 98,
    violations: 1,
    lastUpdate: "2 weeks ago"
  },
  {
    id: 8,
    name: "Spotify",
    icon: "Music",
    riskScore: 52,
    dataExposure: "medium",
    dataPoints: 156,
    violations: 3,
    lastUpdate: "1 week ago"
  }];


  const recentAlerts = [
  {
    id: 1,
    severity: "critical",
    title: "Privacy Policy Updated",
    description: "Facebook updated their data sharing policy. 15 new third-party partners added.",
    service: "Facebook",
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: 2,
    severity: "high",
    title: "New Data Collection Detected",
    description: "Instagram now collects biometric data including facial recognition patterns.",
    service: "Instagram",
    timestamp: new Date(Date.now() - 7200000)
  },
  {
    id: 3,
    severity: "medium",
    title: "Terms of Service Change",
    description: "Google updated their AI training data usage terms. Your content may be used for model training.",
    service: "Google",
    timestamp: new Date(Date.now() - 14400000)
  },
  {
    id: 4,
    severity: "high",
    title: "Data Breach Notification",
    description: "Twitter reported unauthorized access to user email addresses. 2.3M accounts affected.",
    service: "Twitter",
    timestamp: new Date(Date.now() - 21600000)
  },
  {
    id: 5,
    severity: "critical",
    title: "Compliance Violation",
    description: "Amazon found in violation of GDPR data retention policies. Investigation ongoing.",
    service: "Amazon",
    timestamp: new Date(Date.now() - 28800000)
  }];


  const connectedServices = [
  {
    id: 1,
    name: "Facebook",
    category: "Social Media",
    logo: facebookLogo,
    logoAlt: "Facebook logo with white F letter on blue square background representing social media platform",
    privacyScore: 15,
    complianceStatus: "non-compliant",
    dataPoints: 342,
    lastPolicyUpdate: "11/15/2025",
    violations: 12
  },
  {
    id: 2,
    name: "Google",
    category: "Email & Cloud",
    logo: googleLogo,
    logoAlt: "Google logo with colorful G letter on white background representing search and cloud services",
    privacyScore: 32,
    complianceStatus: "warning",
    dataPoints: 256,
    lastPolicyUpdate: "11/16/2025",
    violations: 5
  },
  {
    id: 3,
    name: "Instagram",
    category: "Social Media",
    logo: instagramLogo,
    logoAlt: "Instagram logo with gradient camera icon on white background representing photo sharing platform",
    privacyScore: 18,
    complianceStatus: "non-compliant",
    dataPoints: 298,
    lastPolicyUpdate: "11/20/2025",
    violations: 9
  },
  {
    id: 4,
    name: "Twitter",
    category: "Social Media",
    logo: twitterLogo,
    logoAlt: "Twitter logo with blue bird icon on white background representing microblogging platform",
    privacyScore: 25,
    complianceStatus: "warning",
    dataPoints: 187,
    lastPolicyUpdate: "11/18/2025",
    violations: 6
  },
  {
    id: 5,
    name: "LinkedIn",
    category: "Professional Network",
    logo: linkedinLogo,
    logoAlt: "LinkedIn logo with white in letters on blue square background representing professional networking",
    privacyScore: 55,
    complianceStatus: "compliant",
    dataPoints: 124,
    lastPolicyUpdate: "11/22/2025",
    violations: 2
  },
  {
    id: 6,
    name: "Amazon",
    category: "E-commerce",
    logo: amazonLogo,
    logoAlt: "Amazon logo with black text and orange arrow on white background representing online shopping",
    privacyScore: 28,
    complianceStatus: "warning",
    dataPoints: 215,
    lastPolicyUpdate: "11/19/2025",
    violations: 7
  },
  {
    id: 7,
    name: "Netflix",
    category: "Entertainment",
    logo: netflixLogo,
    logoAlt: "Netflix logo with red N letter on black background representing streaming service",
    privacyScore: 62,
    complianceStatus: "compliant",
    dataPoints: 98,
    lastPolicyUpdate: "11/08/2025",
    violations: 1
  },
  {
    id: 8,
    name: "Spotify",
    category: "Music Streaming",
    logo: spotifyLogo,
    logoAlt: "Spotify logo with green circle and sound waves on black background representing music streaming",
    privacyScore: 48,
    complianceStatus: "warning",
    dataPoints: 156,
    lastPolicyUpdate: "11/16/2025",
    violations: 3
  }];


  const connectionStatuses = [
  { id: 1, name: "Facebook", status: "connected", lastSync: "2 min ago" },
  { id: 2, name: "Google", status: "syncing", lastSync: "Syncing..." },
  { id: 3, name: "Instagram", status: "connected", lastSync: "5 min ago" },
  { id: 4, name: "Twitter", status: "error", lastSync: "Failed" },
  { id: 5, name: "LinkedIn", status: "connected", lastSync: "1 min ago" }];


  useEffect(() => {
    const initialNotifications = [
    {
      id: 1,
      type: "warning",
      title: "Policy Update Detected",
      message: "Facebook has updated their privacy policy. Review recommended.",
      timestamp: new Date()
    }];

    setNotifications(initialNotifications);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const newNotification = {
        id: Date.now(),
        type: "success",
        title: "Scan Complete",
        message: "Privacy dashboard updated with latest data.",
        timestamp: new Date()
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 2000);
  };

  const handleServiceClick = (service) => {
    const notification = {
      id: Date.now(),
      type: "info",
      title: `${service?.name} Details`,
      message: `Viewing detailed privacy analysis for ${service?.name}`,
      timestamp: new Date()
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  const handleDismissAlert = (alertId) => {
    console.log('Dismissed alert:', alertId);
  };

  const handleViewAllAlerts = () => {
    const notification = {
      id: Date.now(),
      type: "info",
      title: "All Alerts",
      message: "Viewing complete alert history",
      timestamp: new Date()
    };
    setNotifications((prev) => [notification, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <PrivacyHeader />
      <PrivacyTabs alertCount={recentAlerts?.length} />
      <PrivacyAlertNotification alerts={notifications} />
      <ServiceConnectionStatus services={connectionStatuses} />
      <main className="main-content">
        <DashboardControls
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          selectedSeverity={selectedSeverity}
          onSeverityChange={setSelectedSeverity}
          lastScan={lastScan}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing} />


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {kpiMetrics?.map((metric, index) =>
          <PrivacyScoreCard key={index} {...metric} />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="lg:col-span-8">
            <PrivacyRiskHeatmap
              services={heatmapServices}
              onServiceClick={handleServiceClick} />

          </div>

          <div className="lg:col-span-4">
            <RecentAlertsPanel
              alerts={recentAlerts}
              onViewAll={handleViewAllAlerts}
              onDismiss={handleDismissAlert} />

          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Connected Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {connectedServices?.map((service) =>
            <ServiceGridCard
              key={service?.id}
              service={service}
              onClick={handleServiceClick} />

            )}
          </div>
        </div>
      </main>
    </div>);

};

export default PrivacyDashboardOverview;