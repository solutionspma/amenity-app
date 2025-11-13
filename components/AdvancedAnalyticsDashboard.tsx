'use client';

import { useState, useEffect } from 'react';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface AnalyticsData {
  overview: {
    total_revenue: number;
    revenue_change: number;
    total_followers: number;
    follower_change: number;
    total_views: number;
    view_change: number;
    engagement_rate: number;
    engagement_change: number;
  };
  revenue_breakdown: {
    subscriptions: number;
    tips: number;
    pay_per_view: number;
    merchandise: number;
    sponsorships: number;
  };
  audience_demographics: {
    age_groups: Record<string, number>;
    locations: Record<string, number>;
    device_types: Record<string, number>;
  };
  content_performance: Array<{
    id: string;
    title: string;
    type: string;
    views: number;
    engagement: number;
    revenue: number;
    date: string;
  }>;
  growth_predictions: {
    next_month: { followers: string; revenue: string; };
    next_quarter: { followers: string; revenue: string; };
    next_year: { followers: string; revenue: string; };
  };
}

export default function AdvancedAnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: AnalyticsData = {
      overview: {
        total_revenue: 8750.50,
        revenue_change: 23.5,
        total_followers: 12890,
        follower_change: 15.2,
        total_views: 245780,
        view_change: 18.7,
        engagement_rate: 12.3,
        engagement_change: 5.8
      },
      revenue_breakdown: {
        subscriptions: 5250.00,
        tips: 1850.00,
        pay_per_view: 980.50,
        merchandise: 520.00,
        sponsorships: 150.00
      },
      audience_demographics: {
        age_groups: {
          '18-24': 28,
          '25-34': 35,
          '35-44': 22,
          '45-54': 12,
          '55+': 3
        },
        locations: {
          'United States': 45,
          'Canada': 18,
          'United Kingdom': 12,
          'Australia': 8,
          'Germany': 6,
          'Other': 11
        },
        device_types: {
          'Mobile': 68,
          'Desktop': 25,
          'Tablet': 5,
          'TV': 2
        }
      },
      content_performance: [
        {
          id: '1',
          title: 'Sunday Morning Worship',
          type: 'Live Stream',
          views: 15420,
          engagement: 94.2,
          revenue: 485.50,
          date: '2025-11-10'
        },
        {
          id: '2',
          title: 'Tech Tips: Creator Tools',
          type: 'Video',
          views: 12890,
          engagement: 87.3,
          revenue: 234.75,
          date: '2025-11-09'
        },
        {
          id: '3',
          title: 'Community Q&A Session',
          type: 'Live',
          views: 9850,
          engagement: 91.8,
          revenue: 378.25,
          date: '2025-11-08'
        }
      ],
      growth_predictions: {
        next_month: { followers: '+18%', revenue: '+25%' },
        next_quarter: { followers: '+65%', revenue: '+85%' },
        next_year: { followers: '+280%', revenue: '+420%' }
      }
    };
    
    setAnalyticsData(mockData);
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <ArrowUpIcon className="w-4 h-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="w-4 h-4 text-red-500" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analyticsData.overview.total_revenue)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.revenue_change)}
            <span className={`ml-1 text-sm font-medium ${getChangeColor(analyticsData.overview.revenue_change)}`}>
              {Math.abs(analyticsData.overview.revenue_change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.total_followers)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.follower_change)}
            <span className={`ml-1 text-sm font-medium ${getChangeColor(analyticsData.overview.follower_change)}`}>
              {Math.abs(analyticsData.overview.follower_change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analyticsData.overview.total_views)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <EyeIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.view_change)}
            <span className={`ml-1 text-sm font-medium ${getChangeColor(analyticsData.overview.view_change)}`}>
              {Math.abs(analyticsData.overview.view_change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last period</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.engagement_rate}%
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <HeartIcon className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {getChangeIcon(analyticsData.overview.engagement_change)}
            <span className={`ml-1 text-sm font-medium ${getChangeColor(analyticsData.overview.engagement_change)}`}>
              {Math.abs(analyticsData.overview.engagement_change)}%
            </span>
            <span className="text-sm text-gray-500 ml-1">from last period</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Revenue Breakdown</h3>
          
          <div className="space-y-4">
            {Object.entries(analyticsData.revenue_breakdown).map(([source, amount]) => {
              const percentage = (amount / analyticsData.overview.total_revenue) * 100;
              return (
                <div key={source}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {source.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Growth Predictions */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-purple-900 mb-6 flex items-center">
            <TrendingUpIcon className="w-5 h-5 mr-2" />
            AI Growth Predictions
          </h3>
          
          <div className="space-y-4">
            {Object.entries(analyticsData.growth_predictions).map(([period, predictions]) => (
              <div key={period} className="bg-white bg-opacity-60 rounded-lg p-4">
                <h4 className="font-medium text-purple-900 mb-2 capitalize">
                  {period.replace('_', ' ')}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-purple-700">Followers</p>
                    <p className="text-lg font-bold text-purple-900">{predictions.followers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Revenue</p>
                    <p className="text-lg font-bold text-purple-900">{predictions.revenue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Top Content Performance</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.content_performance.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {content.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(content.views)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {content.engagement}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(content.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(content.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(analyticsData.audience_demographics).map(([category, data]) => (
          <div key={category} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
              {category.replace('_', ' ')}
            </h3>
            <div className="space-y-3">
              {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{key}</span>
                  <div className="flex items-center">
                    <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}