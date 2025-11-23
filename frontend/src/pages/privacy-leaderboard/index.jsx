import React, { useState, useEffect } from 'react';
import PrivacyHeader from '../../components/PrivacyHeader';
import PrivacyTabs from '../../components/PrivacyTabs';
import PrivacyAlertNotification from '../../components/PrivacyAlertNotification';
import LeaderboardHeader from './components/LeaderboardHeader';
import LeaderboardFilters from './components/LeaderboardFilters';
import LeaderboardTable from './components/LeaderboardTable';
import LeaderboardSummary from './components/LeaderboardSummary';
import MobileLeaderboardCard from './components/MobileLeaderboardCard';

const PrivacyLeaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRankingMethod, setSelectedRankingMethod] = useState('privacy-score');
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('current');
  const [sortColumn, setSortColumn] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isMobile, setIsMobile] = useState(false);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mockServices = [
  {
    id: 1,
    rank: 1,
    rankChange: 2,
    name: "Signal",
    category: "Messaging Apps",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_13edfbd11-1763924327976.png",
    logoAlt: "Signal messaging app logo with blue shield icon on white background representing secure encrypted communication",
    privacyScore: 95,
    violations: 0,
    dataSharing: 5,
    policyClarity: 92,
    trend: 3,
    violationDetails: [
    "No significant privacy violations detected",
    "End-to-end encryption by default",
    "Minimal metadata collection"],

    recentChanges: [
    { date: "Nov 15, 2025", description: "Enhanced encryption protocols" },
    { date: "Oct 28, 2025", description: "Updated data retention policy" }],

    userImpact: {
      dataCollection: 10,
      thirdPartySharing: 0,
      userControl: 95
    }
  },
  {
    id: 2,
    rank: 2,
    rankChange: 0,
    name: "ProtonMail",
    category: "Email Services",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1179e5762-1763924327714.png",
    logoAlt: "ProtonMail secure email service logo with purple shield and envelope icon representing encrypted email communication",
    privacyScore: 93,
    violations: 0,
    dataSharing: 8,
    policyClarity: 89,
    trend: 1,
    violationDetails: [
    "Zero-access encryption implemented",
    "Swiss privacy laws compliance",
    "No third-party tracking"],

    recentChanges: [
    { date: "Nov 10, 2025", description: "Added calendar encryption" },
    { date: "Oct 22, 2025", description: "Improved transparency report" }],

    userImpact: {
      dataCollection: 15,
      thirdPartySharing: 5,
      userControl: 90
    }
  },
  {
    id: 3,
    rank: 3,
    rankChange: -1,
    name: "DuckDuckGo",
    category: "Productivity Tools",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_11aff244e-1763924328893.png",
    logoAlt: "DuckDuckGo search engine logo with orange duck mascot on blue background representing privacy-focused web search",
    privacyScore: 91,
    violations: 0,
    dataSharing: 10,
    policyClarity: 88,
    trend: -2,
    violationDetails: [
    "No search history tracking",
    "Anonymous browsing by default",
    "Blocks third-party trackers"],

    recentChanges: [
    { date: "Nov 18, 2025", description: "Enhanced tracker blocking" },
    { date: "Nov 5, 2025", description: "Updated privacy dashboard" }],

    userImpact: {
      dataCollection: 12,
      thirdPartySharing: 8,
      userControl: 88
    }
  },
  {
    id: 4,
    rank: 4,
    rankChange: 1,
    name: "Brave Browser",
    category: "Productivity Tools",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1a1284781-1763924327675.png",
    logoAlt: "Brave web browser logo with orange lion icon on dark background representing privacy-focused browsing experience",
    privacyScore: 88,
    violations: 1,
    dataSharing: 15,
    policyClarity: 85,
    trend: 2,
    violationDetails: [
    "Minor telemetry data collection",
    "Built-in ad blocking",
    "Cryptocurrency integration concerns"],

    recentChanges: [
    { date: "Nov 12, 2025", description: "Reduced telemetry collection" },
    { date: "Oct 30, 2025", description: "Improved cookie controls" }],

    userImpact: {
      dataCollection: 20,
      thirdPartySharing: 12,
      userControl: 85
    }
  },
  {
    id: 5,
    rank: 5,
    rankChange: -2,
    name: "Telegram",
    category: "Messaging Apps",
    logo: "https://images.unsplash.com/photo-1636743094110-5e153f93ad7e",
    logoAlt: "Telegram messaging app logo with white paper plane icon on blue gradient background representing cloud-based messaging",
    privacyScore: 78,
    violations: 2,
    dataSharing: 25,
    policyClarity: 75,
    trend: -5,
    violationDetails: [
    "Cloud storage of messages by default",
    "Phone number requirement",
    "Limited end-to-end encryption"],

    recentChanges: [
    { date: "Nov 8, 2025", description: "Added secret chat improvements" },
    { date: "Oct 25, 2025", description: "Updated data retention policy" }],

    userImpact: {
      dataCollection: 35,
      thirdPartySharing: 20,
      userControl: 70
    }
  },
  {
    id: 6,
    rank: 6,
    rankChange: 0,
    name: "Apple iCloud",
    category: "Cloud Storage",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1cb301de1-1763924330432.png",
    logoAlt: "Apple iCloud service logo with white cloud icon on blue gradient background representing cloud storage and sync",
    privacyScore: 72,
    violations: 3,
    dataSharing: 30,
    policyClarity: 70,
    trend: 0,
    violationDetails: [
    "Government data requests compliance",
    "Photo scanning controversy",
    "Limited encryption for some data types"],

    recentChanges: [
    { date: "Nov 14, 2025", description: "Enhanced Advanced Data Protection" },
    { date: "Oct 20, 2025", description: "Updated transparency report" }],

    userImpact: {
      dataCollection: 40,
      thirdPartySharing: 25,
      userControl: 65
    }
  },
  {
    id: 7,
    rank: 7,
    rankChange: 3,
    name: "WhatsApp",
    category: "Messaging Apps",
    logo: "https://images.unsplash.com/photo-1683918048247-5eb60b733e42",
    logoAlt: "WhatsApp messaging app logo with green phone icon in speech bubble representing instant messaging communication",
    privacyScore: 65,
    violations: 4,
    dataSharing: 45,
    policyClarity: 62,
    trend: 4,
    violationDetails: [
    "Metadata sharing with Facebook",
    "Phone number requirement",
    "Business account data collection",
    "Cross-platform data sharing"],

    recentChanges: [
    { date: "Nov 16, 2025", description: "Clarified Meta data sharing" },
    { date: "Nov 2, 2025", description: "Updated business privacy policy" }],

    userImpact: {
      dataCollection: 55,
      thirdPartySharing: 40,
      userControl: 55
    }
  },
  {
    id: 8,
    rank: 8,
    rankChange: -1,
    name: "Google Drive",
    category: "Cloud Storage",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1fc2eacba-1763924326379.png",
    logoAlt: "Google Drive cloud storage logo with triangular multicolor icon representing file storage and collaboration platform",
    privacyScore: 58,
    violations: 5,
    dataSharing: 55,
    policyClarity: 58,
    trend: -3,
    violationDetails: [
    "Extensive data collection for advertising",
    "Content scanning for policy violations",
    "Third-party app access concerns",
    "Cross-service data sharing",
    "AI training data usage"],

    recentChanges: [
    { date: "Nov 11, 2025", description: "Updated AI data usage policy" },
    { date: "Oct 28, 2025", description: "Modified content scanning rules" }],

    userImpact: {
      dataCollection: 70,
      thirdPartySharing: 50,
      userControl: 45
    }
  },
  {
    id: 9,
    rank: 9,
    rankChange: -2,
    name: "Facebook",
    category: "Social Media",
    logo: "https://images.unsplash.com/photo-1662947852092-417aa4cd699b",
    logoAlt: "Facebook social media logo with white lowercase f on blue square background representing social networking platform",
    privacyScore: 42,
    violations: 8,
    dataSharing: 75,
    policyClarity: 45,
    trend: -6,
    violationDetails: [
    "Extensive third-party data sharing",
    "Tracking across non-Facebook sites",
    "Facial recognition concerns",
    "Political advertising transparency issues",
    "Data breach history",
    "Shadow profile creation",
    "Cross-platform tracking",
    "AI training without explicit consent"],

    recentChanges: [
    { date: "Nov 9, 2025", description: "Updated ad targeting policies" },
    { date: "Oct 18, 2025", description: "Modified data retention rules" }],

    userImpact: {
      dataCollection: 85,
      thirdPartySharing: 70,
      userControl: 30
    }
  },
  {
    id: 10,
    rank: 10,
    rankChange: 0,
    name: "TikTok",
    category: "Social Media",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_107f25fba-1763924327815.png",
    logoAlt: "TikTok social media app logo with black musical note icon on gradient pink and blue background representing short video platform",
    privacyScore: 38,
    violations: 10,
    dataSharing: 82,
    policyClarity: 40,
    trend: -1,
    violationDetails: [
    "Extensive device data collection",
    "Biometric data harvesting",
    "Location tracking concerns",
    "Clipboard access issues",
    "Third-party SDK data sharing",
    "Government access concerns",
    "Minor protection inadequacies",
    "Cross-border data transfers",
    "Algorithmic manipulation",
    "Undisclosed data retention"],

    recentChanges: [
    { date: "Nov 13, 2025", description: "Updated data localization policy" },
    { date: "Oct 15, 2025", description: "Modified minor protection rules" }],

    userImpact: {
      dataCollection: 90,
      thirdPartySharing: 78,
      userControl: 25
    }
  }];


  const summaryData = {
    categoryAverages: [
    { name: "Messaging Apps", avgScore: 79 },
    { name: "Email Services", avgScore: 93 },
    { name: "Cloud Storage", avgScore: 65 },
    { name: "Social Media", avgScore: 40 },
    { name: "Productivity Tools", avgScore: 89 }],

    industryBenchmarks: [
    { metric: "Average Privacy Score", value: "68", unit: "points", description: "Industry-wide average" },
    { metric: "Data Sharing Rate", value: "42", unit: "%", description: "Third-party sharing average" },
    { metric: "Policy Clarity", value: "65", unit: "%", description: "Readability score average" },
    { metric: "Violation Rate", value: "3.8", unit: "per service", description: "Average violations detected" }],

    trendingUp: [
    { name: "Signal", change: 3 },
    { name: "WhatsApp", change: 4 },
    { name: "Brave Browser", change: 2 }],

    trendingDown: [
    { name: "Facebook", change: -6 },
    { name: "Telegram", change: -5 },
    { name: "Google Drive", change: -3 }]

  };

  const [services, setServices] = useState(mockServices);
  const lastUpdated = new Date('2025-11-23T18:53:43');

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }

    const sorted = [...services]?.sort((a, b) => {
      let aVal = a?.[column];
      let bVal = b?.[column];

      if (column === 'service') {
        aVal = a?.name;
        bVal = b?.name;
      }

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' ?
        aVal?.localeCompare(bVal) :
        bVal?.localeCompare(aVal);
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setServices(sorted);
  };

  const handleFilterReset = () => {
    setSelectedCategory('all');
    setSelectedRankingMethod('privacy-score');
    setSelectedTimePeriod('current');
    setServices(mockServices);
  };

  const handleExport = () => {
    const exportAlert = {
      id: Date.now(),
      type: 'success',
      title: 'Export Started',
      message: 'Your privacy leaderboard report is being generated. Download will begin shortly.',
      timestamp: new Date()
    };
    setAlerts([exportAlert, ...alerts]);

    setTimeout(() => {
      setAlerts((prev) => prev?.filter((a) => a?.id !== exportAlert?.id));
    }, 5000);
  };

  useEffect(() => {
    let filtered = [...mockServices];

    if (selectedCategory !== 'all') {
      const categoryMap = {
        'social-media': 'Social Media',
        'cloud-storage': 'Cloud Storage',
        'email': 'Email Services',
        'messaging': 'Messaging Apps',
        'productivity': 'Productivity Tools'
      };
      filtered = filtered?.filter((s) => s?.category === categoryMap?.[selectedCategory]);
    }

    setServices(filtered);
  }, [selectedCategory, selectedRankingMethod, selectedTimePeriod]);

  return (
    <div className="min-h-screen bg-background">
      <PrivacyHeader />
      <PrivacyTabs alertCount={0} />
      <PrivacyAlertNotification alerts={alerts} />
      <main className="main-content">
        <div className="max-w-[1600px] mx-auto">
          <LeaderboardHeader
            lastUpdated={lastUpdated}
            totalServices={mockServices?.length}
            onExport={handleExport} />


          <LeaderboardFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedRankingMethod={selectedRankingMethod}
            onRankingMethodChange={setSelectedRankingMethod}
            selectedTimePeriod={selectedTimePeriod}
            onTimePeriodChange={setSelectedTimePeriod}
            onReset={handleFilterReset} />


          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8">
              {isMobile ?
              <div>
                  {services?.map((service) =>
                <MobileLeaderboardCard key={service?.id} service={service} />
                )}
                </div> :

              <LeaderboardTable
                services={services}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort} />

              }
            </div>

            <div className="lg:col-span-4">
              <LeaderboardSummary summaryData={summaryData} />
            </div>
          </div>
        </div>
      </main>
    </div>);

};

export default PrivacyLeaderboard;