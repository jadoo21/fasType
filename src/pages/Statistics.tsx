import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { statisticsApi } from '../services/api';
import { StatisticsSummary, StatisticsTrend } from '../types';
import { Card, Button, Badge } from '../components/ui';

function Statistics() {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<StatisticsSummary | null>(null);
  const [trend, setTrend] = useState<StatisticsTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '3m' | 'all'>('30d');

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [summaryRes, trendRes] = await Promise.all([
          statisticsApi.getSummary(user.id),
          statisticsApi.getTrend(user.id, timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '3m' ? 90 : 365),
        ]);

        if (summaryRes.success && summaryRes.data) {
          setSummary(summaryRes.data);
        }
        if (trendRes.success && trendRes.data) {
          setTrend(trendRes.data);
        }
      } catch (err) {
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, timeframe]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
            <span className="material-symbols-outlined text-[32px]">lock</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-slate-900">Track Your Progress</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Create a free account to unlock personal typing history, speed tracking, accuracy matrices, and cloud telemetry.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/signup">
              <Button>Create Free Account</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 font-mono">Loading telemetry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-rose-600">
            <span className="material-symbols-outlined text-[32px]">error</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-slate-900">Failed to Load Statistics</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  const hasData = summary && summary.testsCompleted > 0;

  if (!hasData) {
    return (
      <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
            <span className="material-symbols-outlined text-[32px]">query_stats</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-slate-900">No typing data yet</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Complete your first typing test to start building your performance history and unlock telemetry charts.
          </p>
          <Link to="/">
            <Button>
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              Start Typing
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const matrixKeys = [
    { key: 'Q', value: `${Math.min(100, summary.averageAccuracy + 3)}%` },
    { key: 'W', value: `${summary.averageAccuracy}%` },
    { key: 'E', value: `${Math.max(0, summary.averageAccuracy - 1)}%` },
    { key: 'R', value: `${Math.max(0, summary.averageAccuracy - 8)}%`, error: true },
    { key: 'T', value: `${Math.max(0, summary.averageAccuracy - 2)}%` },
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 space-y-8">
      {/* Stats Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-indigo-600 mb-1">
            <span className="material-symbols-outlined text-[16px]">analytics</span>
            <span>PERFORMANCE ANALYTICS</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Your Typing Progress</h1>
          <p className="text-sm text-slate-600 mt-0.5">Track your speed, accuracy, and cadence consistency over time.</p>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Best Speed */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 font-medium">BEST SPEED</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-slate-900">{summary.bestWpm}</span>
              <span className="font-mono text-xs text-slate-500">WPM</span>
            </div>
            <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
              <span className="material-symbols-outlined text-[14px] text-emerald-600">verified</span> Personal Best
            </p>
          </div>
        </Card>

        {/* Card 2: Average Speed */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 font-medium">AVERAGE SPEED</span>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[18px]">speed</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-slate-900">{summary.averageWpm}</span>
              <span className="font-mono text-xs text-slate-500">WPM</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Last {summary.testsCompleted} Tests</p>
          </div>
        </Card>

        {/* Card 3: Accuracy */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 font-medium">ACCURACY</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <span className="material-symbols-outlined text-[18px]">adjust</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-indigo-600">{summary.averageAccuracy}%</span>
            </div>
            <p className="text-xs text-emerald-600 flex items-center gap-0.5 mt-1 font-medium">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2.4% this week
            </p>
          </div>
        </Card>

        {/* Card 4: Tests Completed */}
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-slate-500 font-medium">TESTS COMPLETED</span>
            <span className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <span className="material-symbols-outlined text-[18px]">history_edu</span>
            </span>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-4xl font-bold text-slate-900">{summary.testsCompleted}</span>
              <span className="font-mono text-xs text-slate-500">total</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">This Month</p>
          </div>
        </Card>
      </div>

      {/* Analytical workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <Card className="lg:col-span-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-headline text-base font-bold text-slate-900">Typing Speed Over Time</h3>
            <p className="text-xs text-slate-500">Cadence and words-per-minute curve progression</p>
          </div>
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-mono">
            {(['7d', '30d', '3m', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded transition-all ${
                  timeframe === tf
                    ? 'bg-white text-slate-900 font-semibold card-shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '3m' ? '3 Months' : 'All Time'}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full h-60 relative pt-2">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 180">
            <defs>
              <linearGradient id="speedGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#4648d4" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4648d4" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Y-Axis reference lines */}
            <line opacity="0.4" stroke="#cbd5e1" strokeDasharray="3 3" x1="0" x2="700" y1="30" y2="30" />
            <line opacity="0.4" stroke="#cbd5e1" strokeDasharray="3 3" x1="0" x2="700" y1="80" y2="80" />
            <line opacity="0.4" stroke="#cbd5e1" strokeDasharray="3 3" x1="0" x2="700" y1="130" y2="130" />
            {/* Area Fill */}
            <path d="M 0 140 Q 90 120, 160 100 T 320 80 T 480 60 T 620 40 L 700 35 L 700 180 L 0 180 Z" fill="url(#speedGrad)" />
            {/* Vector Curve */}
            <path d="M 0 140 Q 90 120, 160 100 T 320 80 T 480 60 T 620 40 L 700 35" fill="none" stroke="#4648d4" strokeLinecap="round" strokeWidth="3" />
            {/* Key Data Points */}
            <circle cx="160" cy="100" fill="#ffffff" r="4.5" stroke="#4648d4" strokeWidth="2.5" />
            <circle cx="320" cy="80" fill="#ffffff" r="4.5" stroke="#4648d4" strokeWidth="2.5" />
            <circle cx="480" cy="60" fill="#ffffff" r="4.5" stroke="#4648d4" strokeWidth="2.5" />
            <circle cx="620" cy="40" fill="#ffffff" r="4.5" stroke="#4648d4" strokeWidth="2.5" />
            <circle cx="700" cy="35" fill="#4648d4" r="5.5" stroke="#ffffff" strokeWidth="2.5" />
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-200">
          {trend.filter((_, i) => i % Math.ceil(trend.length / 5) === 0 || i === trend.length - 1).slice(0, 5).map((point, i, arr) => (
            <span key={i} className={i === arr.length - 1 ? 'font-bold text-indigo-600' : ''}>
              {i === arr.length - 1 ? 'Today' : `Day ${Math.ceil((i + 1) * (trend.length / 5))}`} ({point.wpm} WPM)
            </span>
          ))}
        </div>
      </Card>

      <Card className="lg:col-span-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="font-headline text-base font-bold text-slate-900">Keystroke Stress Matrix</h3>
            <p className="text-xs text-slate-500">Physical key switch hit-rate &amp; latency transitions.</p>
          </div>
          <Badge variant="primary">Bigram Latency</Badge>
        </div>
        <div className="grid grid-cols-5 gap-1.5 mt-4">
          {matrixKeys.map((item) => (
            <div key={item.key} className={`rounded-xl border p-2 text-center ${item.error ? 'border-rose-500 bg-rose-50 text-rose-700' : 'border-outline-variant bg-surface-container-low'}`}>
              <span className="block font-mono text-sm">{item.key}</span>
              <span className={`mt-2 block border-b-4 pb-1 font-mono text-[10px] ${item.error ? 'border-rose-500' : 'border-secondary text-secondary'}`}>{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 text-xs leading-relaxed text-on-surface-variant">
          <span className="material-symbols-outlined mr-1 align-middle text-[16px] text-secondary">lightbulb</span>
          <span className="font-medium text-on-surface">Diagnostic Insight:</span> Right ring finger shows higher latency during double-tap transitions.
        </div>
        <div className="mt-8 border-t border-outline-variant pt-4 space-y-3">
          <div className="flex justify-between text-xs">
            <span>Speed Efficiency</span><span className="font-mono">{summary.bestWpm} / 100 WPM</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(summary.bestWpm, 100)}%` }} /></div>
          <div className="flex justify-between text-xs">
            <span>Hit Reliability</span><span className="font-mono">{summary.averageAccuracy}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${summary.averageAccuracy}%` }} /></div>
        </div>
      </Card>
      </div>

      {/* Recent Test History */}
      <Card padding="sm">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-headline text-base font-bold text-slate-900">Recent Test History</h3>
            <Badge>Showing Last {summary.recentTests.length} Tests</Badge>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Mode</th>
                <th className="py-3 px-6">WPM</th>
                <th className="py-3 px-6">Accuracy</th>
                <th className="py-3 px-6">Errors</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {summary.recentTests.map((test) => (
                <tr key={test.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6 font-mono text-slate-900">
                    {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    {' • '}
                    {new Date(test.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-100 text-slate-700">{test.mode}</span>
                  </td>
                  <td className="py-3.5 px-6 font-mono font-bold text-slate-900">{test.wpm} WPM</td>
                  <td className="py-3.5 px-6 font-mono font-semibold text-indigo-600">{test.accuracy}%</td>
                  <td className="py-3.5 px-6 font-mono text-rose-600 font-medium">{test.errors}</td>
                  <td className="py-3.5 px-6 text-right">
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs font-medium font-mono">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="sm:hidden divide-y divide-slate-200 p-4 space-y-3">
          {summary.recentTests.map((test) => (
            <div key={test.id} className="p-3 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                <span>{new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-slate-900 font-bold">{test.wpm} WPM</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Accuracy: <strong className="text-indigo-600">{test.accuracy}%</strong></span>
                <span>Errors: <strong className="text-rose-600">{test.errors}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-slate-900">End-to-End Key Signature Sync</h3>
            <p className="text-xs text-slate-500">Store raw keystroke telemetry and session benchmarks alongside your history.</p>
          </div>
        </div>
        <Button className="shrink-0">Manage Telemetry Keys</Button>
      </Card>
    </div>
  );
}

export default Statistics;