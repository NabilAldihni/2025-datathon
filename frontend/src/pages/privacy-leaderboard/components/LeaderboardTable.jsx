import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LeaderboardTable = ({ services, sortColumn, sortDirection, onSort }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (serviceId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded?.has(serviceId)) {
      newExpanded?.delete(serviceId);
    } else {
      newExpanded?.add(serviceId);
    }
    setExpandedRows(newExpanded);
  };

  const getRiskColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getRowBgColor = (score) => {
    if (score >= 80) return 'bg-success/5';
    if (score <= 40) return 'bg-error/5';
    return '';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'var(--color-success)' };
    if (trend < 0) return { name: 'TrendingDown', color: 'var(--color-error)' };
    return { name: 'Minus', color: 'var(--color-muted-foreground)' };
  };

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return <Icon name="ChevronsUpDown" size={16} />;
    return sortDirection === 'asc' ? 
      <Icon name="ChevronUp" size={16} /> : 
      <Icon name="ChevronDown" size={16} />;
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('rank')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Rank {renderSortIcon('rank')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('service')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Service {renderSortIcon('service')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('privacyScore')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Privacy Score {renderSortIcon('privacyScore')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('violations')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Violations {renderSortIcon('violations')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('dataSharing')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Data Sharing {renderSortIcon('dataSharing')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                <button 
                  onClick={() => onSort('policyClarity')}
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  Policy Clarity {renderSortIcon('policyClarity')}
                </button>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Trend</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Details</th>
            </tr>
          </thead>
          <tbody>
            {services?.map((service) => (
              <React.Fragment key={service?.id}>
                <tr className={`border-b border-border hover:bg-muted/30 transition-colors ${getRowBgColor(service?.privacyScore)}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-muted-foreground">#{service?.rank}</span>
                      {service?.rankChange !== 0 && (
                        <span className={`text-xs font-medium ${service?.rankChange > 0 ? 'text-success' : 'text-error'}`}>
                          {service?.rankChange > 0 ? '+' : ''}{service?.rankChange}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={service?.logo} 
                        alt={service?.logoAlt}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-semibold text-foreground">{service?.name}</div>
                        <div className="text-sm text-muted-foreground">{service?.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl font-bold ${getRiskColor(service?.privacyScore)}`}>
                        {service?.privacyScore}
                      </span>
                      <div className="flex-1 max-w-[120px]">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${service?.privacyScore >= 80 ? 'bg-success' : service?.privacyScore >= 60 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${service?.privacyScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                      service?.violations === 0 ? 'bg-success/10 text-success' : 
                      service?.violations <= 2 ? 'bg-warning/10 text-warning': 'bg-error/10 text-error'
                    }`}>
                      {service?.violations}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{service?.dataSharing}%</span>
                      <div className="flex-1 max-w-[100px]">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${service?.dataSharing <= 30 ? 'bg-success' : service?.dataSharing <= 60 ? 'bg-warning' : 'bg-error'}`}
                            style={{ width: `${service?.dataSharing}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{service?.policyClarity}%</span>
                      <div className="flex-1 max-w-[100px]">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${service?.policyClarity}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Icon 
                        name={getTrendIcon(service?.trend)?.name} 
                        size={20} 
                        color={getTrendIcon(service?.trend)?.color}
                      />
                      <span className="text-sm font-medium text-muted-foreground">
                        {Math.abs(service?.trend)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName={expandedRows?.has(service?.id) ? "ChevronUp" : "ChevronDown"}
                      onClick={() => toggleRowExpansion(service?.id)}
                    >
                      {expandedRows?.has(service?.id) ? 'Hide' : 'Show'}
                    </Button>
                  </td>
                </tr>
                {expandedRows?.has(service?.id) && (
                  <tr className="border-b border-border bg-muted/20">
                    <td colSpan="8" className="px-6 py-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
                            Violation Categories
                          </h4>
                          <ul className="space-y-2">
                            {service?.violationDetails?.map((violation, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <Icon name="Circle" size={8} className="mt-1.5" />
                                <span className="text-muted-foreground">{violation}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Icon name="FileText" size={16} color="var(--color-primary)" />
                            Recent Policy Changes
                          </h4>
                          <ul className="space-y-2">
                            {service?.recentChanges?.map((change, idx) => (
                              <li key={idx} className="text-sm">
                                <div className="font-medium text-foreground">{change?.date}</div>
                                <div className="text-muted-foreground">{change?.description}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                            <Icon name="Users" size={16} color="var(--color-accent)" />
                            User Impact Assessment
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">Data Collection</span>
                                <span className="text-sm font-medium text-foreground">{service?.userImpact?.dataCollection}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-error" style={{ width: `${service?.userImpact?.dataCollection}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">Third-party Sharing</span>
                                <span className="text-sm font-medium text-foreground">{service?.userImpact?.thirdPartySharing}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-warning" style={{ width: `${service?.userImpact?.thirdPartySharing}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">User Control</span>
                                <span className="text-sm font-medium text-foreground">{service?.userImpact?.userControl}%</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-success" style={{ width: `${service?.userImpact?.userControl}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;