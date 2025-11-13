'use client';

import { useState, useEffect } from 'react';
import {
  SparklesIcon,
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  BoltIcon,
  LightBulbIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
} from '@heroicons/react/24/outline';
import JAYIAssistant from '@/lib/ai/jayi-assistant';

interface AIInsight {
  type: 'optimization' | 'monetization' | 'growth' | 'ministry';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export default function AIAssistantDashboard() {
  const [assistant] = useState(new JAYIAssistant());
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [contentSuggestions, setContentSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('insights');

  useEffect(() => {
    loadAIData();
  }, []);

  const loadAIData = async () => {
    try {
      setIsLoading(true);
      
      // Simulate loading AI insights
      const [performance, suggestions] = await Promise.all([
        assistant.getPerformanceInsights('creator-123'),
        assistant.getContentSuggestions('creator-123')
      ]);

      setPerformanceData(performance);
      setContentSuggestions(suggestions);
      
      // Generate AI insights
      const aiInsights: AIInsight[] = [
        {
          type: 'optimization',
          title: 'Peak Engagement Window Detected',
          description: 'Your audience is 34% more active between 7-9 PM. Consider scheduling premium content during this window.',
          impact: 'high',
          actionable: true
        },
        {
          type: 'monetization',
          title: 'Revenue Opportunity: Premium Tier',
          description: 'Based on engagement patterns, introducing a $9.99 premium tier could increase monthly revenue by 28%.',
          impact: 'high',
          actionable: true
        },
        {
          type: 'growth',
          title: 'Collaboration Opportunity',
          description: 'Audience overlap analysis suggests partnering with @FaithTechCreator could boost followers by 15%.',
          impact: 'medium',
          actionable: true
        },
        {
          type: 'ministry',
          title: 'Community Engagement Rising',
          description: 'Prayer request posts show 45% higher engagement. Consider weekly prayer circles.',
          impact: 'high',
          actionable: true
        }
      ];

      setInsights(aiInsights);
    } catch (error) {
      console.error('Failed to load AI data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <BoltIcon className="w-5 h-5" />;
      case 'monetization': return <CurrencyDollarIcon className="w-5 h-5" />;
      case 'growth': return <TrendingUpIcon className="w-5 h-5" />;
      case 'ministry': return <SparklesIcon className="w-5 h-5" />;
      default: return <LightBulbIcon className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
            <div className="h-6 bg-gray-300 rounded w-48"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">JAY-I AI Assistant</h2>
            <p className="text-purple-100">Your Personal Creator Intelligence System</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'insights', name: 'AI Insights', icon: SparklesIcon },
            { id: 'performance', name: 'Performance', icon: ChartBarIcon },
            { id: 'suggestions', name: 'Content Ideas', icon: LightBulbIcon },
            { id: 'monetization', name: 'Revenue', icon: CurrencyDollarIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'insights' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
              <button
                onClick={loadAIData}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh Insights
              </button>
            </div>
            
            {insights.map((insight, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 text-purple-600">
                    {getTypeIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{insight.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{insight.description}</p>
                    {insight.actionable && (
                      <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Take Action →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && performanceData && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <UsersIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Total Views</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {performanceData.overview.total_views.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Engagement</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {performanceData.overview.total_engagement.toLocaleString()}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Revenue</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mt-1">
                  ${performanceData.overview.revenue_generated.toFixed(2)}
                </p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TrendingUpIcon className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">New Followers</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  +{performanceData.overview.new_followers}
                </p>
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {performanceData.ai_recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <SparklesIcon className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Content Suggestions</h3>
            
            {contentSuggestions.map((suggestion, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{suggestion.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {suggestion.type.toUpperCase()}
                      </span>
                      <span>Best time: {suggestion.best_time}</span>
                      <span>Predicted engagement: {suggestion.predicted_engagement}%</span>
                    </div>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors ml-4">
                    Create
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'monetization' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Optimization</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Recommended Pricing</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Basic Subscription</span>
                    <span className="font-medium text-green-600">$4.99/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Premium Subscription</span>
                    <span className="font-medium text-green-600">$9.99/month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">VIP Subscription</span>
                    <span className="font-medium text-green-600">$19.99/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Growth Projections</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Month</span>
                    <span className="font-medium text-purple-600">+18% revenue</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Quarter</span>
                    <span className="font-medium text-purple-600">+62% revenue</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Next Year</span>
                    <span className="font-medium text-purple-600">+280% revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}