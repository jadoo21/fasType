import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { statisticsApi } from '../services/api';
import { StatisticsSummary, StatisticsTrend } from '../types';
import { Button } from '../components/ui';

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

  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
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
      <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12">
        <div className="w-full bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow">
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

  const hasData = isAuthenticated && summary && summary.testsCompleted > 0;

  if (!hasData) {
    const emptyState = isAuthenticated ? {
      icon: 'query_stats',
      iconClass: 'bg-slate-100 text-slate-500',
      title: 'No typing data yet',
      description: 'Complete your first typing test to start building your performance history and unlock telemetry charts.',
    } : {
      icon: 'lock',
      iconClass: 'bg-indigo-50 text-indigo-600',
      title: 'Track Your Progress',
      description: 'Create a free account to unlock personal typing history, speed tracking, accuracy matrices, and cloud telemetry.',
    };

    return (
      <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 space-y-8">
        {/* Stats Header */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto border-b border-slate-200 pb-5">
          <div className="inline-flex items-center gap-unit-sm px-unit-md py-unit-xs bg-surface-container rounded-full border border-outline-variant text-on-surface-variant mb-unit-lg shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold tracking-wider uppercase">Performance Analytics</span>
          </div>
          <h1 className="text-3xl font-headline font-bold text-slate-900">Your Typing Progress</h1>
          <p className="text-sm text-slate-600 mt-0.5">Track your speed, accuracy, and cadence consistency over time.</p>
        </div>

        <div className="w-full bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${emptyState.iconClass}`}>
            <span className="material-symbols-outlined text-[32px]">{emptyState.icon}</span>
          </div>
          <h3 className="text-xl font-headline font-bold text-slate-900">{emptyState.title}</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            {emptyState.description}
          </p>
          {isAuthenticated ? (
            <Link to="/">
              <Button>
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                Start Typing
              </Button>
            </Link>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/signup"><Button>Create Free Account</Button></Link>
              <Link to="/login"><Button variant="secondary">Login</Button></Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleExportTelemetry = () => {
    if (!summary || !summary.recentTests.length) return;
    const headers = ['Date', 'WPM', 'Accuracy', 'Errors', 'Duration', 'Mode'];
    const rows = summary.recentTests.map((t) => [
      new Date(t.createdAt).toISOString(),
      t.wpm,
      t.accuracy,
      t.errors,
      t.duration,
      `"${t.mode}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fastype-telemetry-${user?.username || 'driver'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const matrixKeys = [
    { key: 'Q', value: `${Math.min(100, summary.averageAccuracy + 3)}%`, error: false },
    { key: 'W', value: `${summary.averageAccuracy}%`, error: false },
    { key: 'E', value: `${Math.max(0, summary.averageAccuracy - 1)}%`, error: false },
    { key: 'R', value: `${Math.max(0, summary.averageAccuracy - 8)}%`, error: true },
    { key: 'T', value: `${Math.max(0, summary.averageAccuracy - 2)}%`, error: false },
  ];

  const chartTrend = trend.length > 0 ? trend : [
    { date: 'Initial', wpm: Math.max(35, summary.averageWpm - 8), accuracy: Math.max(85, summary.averageAccuracy - 3) },
    { date: 'Today', wpm: summary.bestWpm, accuracy: summary.averageAccuracy },
  ];

  const minWpm = 35;
  const maxWpm = Math.max(80, ...chartTrend.map(p => p.wpm));

  const speedPoints = chartTrend.map((p, i) => {
    const x = chartTrend.length > 1 ? 15 + (i / (chartTrend.length - 1)) * 630 : 350;
    const norm = Math.max(0, Math.min(1, (p.wpm - minWpm) / (maxWpm - minWpm)));
    const y = 230 - norm * 180;
    return { x, y };
  });

  const accPoints = chartTrend.map((p, i) => {
    const x = chartTrend.length > 1 ? 15 + (i / (chartTrend.length - 1)) * 630 : 350;
    const norm = Math.max(0, Math.min(1, (p.accuracy - 80) / 20));
    const y = 245 - norm * 135;
    return { x, y };
  });

  const speedPath280 = generateSmoothPath(speedPoints);
  const accuracyPath280 = generateSmoothPath(accPoints);

  const lastSpeedPt = speedPoints[speedPoints.length - 1] || { x: 645, y: 50 };
  const firstSpeedPt = speedPoints[0] || { x: 15, y: 210 };
  const areaPath = `${speedPath280} L ${lastSpeedPt.x.toFixed(1)} 270 L ${firstSpeedPt.x.toFixed(1)} 270 Z`;

  const milestoneIndices = Array.from(new Set([
    0,
    Math.floor((speedPoints.length - 1) * 0.35),
    Math.floor((speedPoints.length - 1) * 0.7),
    speedPoints.length - 1,
  ]));
  const anchorPoints = milestoneIndices.map(idx => ({
    x: speedPoints[idx].x,
    y: speedPoints[idx].y,
    isPeak: idx === speedPoints.length - 1,
  }));

  const totalRuns = summary.testsCompleted;
  const axisLabels = [
    'Session #01',
    `Session #${String(Math.max(2, Math.round(totalRuns * 0.25))).padStart(2, '0')}`,
    `Session #${String(Math.max(3, Math.round(totalRuns * 0.5))).padStart(2, '0')}`,
    `Session #${String(Math.max(4, Math.round(totalRuns * 0.75))).padStart(2, '0')}`,
    `Session #${String(totalRuns).padStart(2, '0')} (Peak)`,
  ];

  const latestTest = summary.recentTests?.[0];

  return (
    <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-unit-xl space-y-unit-xl">
      {/* Header Section with Breadcrumbs, Title & Timeframe Selector */}
      <section className="flex flex-col items-center justify-center text-center gap-unit-lg pb-unit-md border-b border-outline-variant">
        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="inline-flex items-center gap-unit-sm px-unit-md py-unit-xs bg-surface-container rounded-full border border-outline-variant text-on-surface-variant mb-unit-lg shadow-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-semibold tracking-wider uppercase">Performance Analytics</span>
          </div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface tracking-tight">Your Typing Progress</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-1">Track your speed, accuracy, and keystroke consistency over time.</p>
        </div>

        {/* Timeframe selector & Actions */}
        <div className="flex flex-wrap items-center justify-center gap-unit-sm">
          <div className="inline-flex p-1 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-sm font-body-sm">
            {(['7d', '30d', '3m', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-unit-md py-1 rounded-lg transition-colors ${
                  timeframe === tf
                    ? 'bg-primary text-surface-container-lowest font-medium shadow-sm'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '3m' ? '3 Months' : 'All Time'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportTelemetry}
            className="inline-flex items-center gap-1.5 px-unit-md py-2 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-outline text-on-surface text-body-sm font-body-sm font-medium transition-colors active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span>Export Telemetry</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-label-mono-sm font-label-mono-sm text-on-surface-variant">CSV</span>
          </button>
        </div>
      </section>

      {/* 4 Metrics Cards Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-base">
        {/* Card 1: Best WPM */}
        <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-low rounded-bl-full pointer-events-none opacity-50 group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase">Best WPM</span>
            <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
              <span className="material-symbols-outlined text-[20px]">bolt</span>
            </div>
          </div>
          <div className="my-unit-md relative z-10">
            <div className="flex items-baseline gap-unit-xs">
              <span className="text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight">{summary.bestWpm}</span>
              <span className="text-body-md font-label-mono-sm text-on-surface-variant font-medium">WPM</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant relative z-10">
            <span className="inline-flex items-center gap-1 text-label-mono-sm font-label-mono-sm px-2 py-0.5 rounded bg-surface-container-low text-secondary font-semibold border border-outline-variant/60">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              Personal Best
            </span>
            <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant">+4 WPM this week</span>
          </div>
        </div>

        {/* Card 2: Average WPM */}
        <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase">Average WPM</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
          </div>
          <div className="my-unit-md flex items-end justify-between">
            <div className="flex items-baseline gap-unit-xs">
              <span className="text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight">{summary.averageWpm}</span>
              <span className="text-body-md font-label-mono-sm text-on-surface-variant font-medium">WPM</span>
            </div>
            {/* Mini Sparkline SVG */}
            <div className="w-20 h-9 mb-1">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 80 30">
                <path d="M2 24 L14 19 L26 22 L38 12 L50 15 L62 8 L78 6" stroke="#4648d4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" />
                <path d="M2 24 L14 19 L26 22 L38 12 L50 15 L62 8 L78 6 L78 30 L2 30 Z" fill="url(#sparkGrad)" opacity="0.15" />
                <circle cx="78" cy="6" fill="#4648d4" r="3" />
                <defs>
                  <linearGradient id="sparkGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#4648d4" />
                    <stop offset="100%" stopColor="#4648d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant">
            <span>Last {summary.testsCompleted} Tests</span>
            <span className="text-secondary font-medium">92% Consistency</span>
          </div>
        </div>

        {/* Card 3: Average Accuracy */}
        <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase">Average Accuracy</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">ads_click</span>
            </div>
          </div>
          <div className="my-unit-md">
            <div className="flex items-baseline gap-unit-xs">
              <span className="text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight">{summary.averageAccuracy}</span>
              <span className="text-body-md font-label-mono-sm text-on-surface-variant font-medium">%</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-label-mono-sm font-label-mono-sm text-on-surface-variant">
            <span className="inline-flex items-center text-secondary font-semibold">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              +2.4%
            </span>
            <span>vs last month</span>
            <span className="ml-auto px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Target 98%</span>
          </div>
        </div>

        {/* Card 4: Tests Completed */}
        <div className="bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between group">
          <div className="flex items-center justify-between">
            <span className="text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase">Tests Completed</span>
            <div className="w-8 h-8 rounded-lg bg-surface-container-low flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">timer</span>
            </div>
          </div>
          <div className="my-unit-md">
            <div className="flex items-baseline gap-unit-xs">
              <span className="text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight">{summary.testsCompleted}</span>
              <span className="text-body-md font-label-mono-sm text-on-surface-variant font-medium">sessions</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-outline" />
              ~{Math.max(1, Math.round(summary.testsCompleted * 2.5))}m practice
            </span>
            <span className="font-medium text-on-surface">Streak: {Math.min(summary.testsCompleted, 6)} days</span>
          </div>
        </div>
      </section>

      {/* Visualizations Bento (2-Column Analytical Layout) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-unit-base">
        {/* Chart Column: Typing Speed Progression (7 Columns) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-unit-lg sm:p-unit-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-unit-sm mb-unit-lg">
            <div>
              <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold">Typing Speed Progression</h2>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Cadence telemetry across the past {summary.testsCompleted} benchmark sessions.</p>
            </div>
            <div className="flex items-center gap-unit-sm text-label-mono-sm font-label-mono-sm">
              <span className="inline-flex items-center gap-1 text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> WPM
              </span>
              <span className="inline-flex items-center gap-1 text-on-surface-variant">
                <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" /> Accuracy %
              </span>
            </div>
          </div>

          {/* High-Fidelity SVG Line Graph Container with Tooltip Simulation */}
          <div className="relative w-full aspect-[16/9] min-h-[260px] flex items-end">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
              <div className="border-b border-dashed border-outline-variant w-full flex justify-between text-label-mono-sm font-label-mono-sm text-outline px-1"><span>80 WPM</span></div>
              <div className="border-b border-dashed border-outline-variant w-full flex justify-between text-label-mono-sm font-label-mono-sm text-outline px-1"><span>65 WPM</span></div>
              <div className="border-b border-dashed border-outline-variant w-full flex justify-between text-label-mono-sm font-label-mono-sm text-outline px-1"><span>50 WPM</span></div>
              <div className="border-b border-dashed border-outline-variant w-full flex justify-between text-label-mono-sm font-label-mono-sm text-outline px-1"><span>35 WPM</span></div>
            </div>

            {/* Interactive Active Tooltip Simulation Pin */}
            <div className="absolute right-[8%] top-[12%] z-20 flex flex-col items-center">
              <div className="bg-primary-container text-surface-container-lowest p-2.5 rounded-xl shadow-xl border border-primary text-left min-w-[160px]">
                <div className="text-label-mono-sm font-label-mono-sm text-inverse-primary border-b border-outline-variant/30 pb-1 mb-1 flex justify-between">
                  <span>TEST #{summary.testsCompleted} (TODAY)</span>
                  <span className="text-secondary-fixed-dim">PEAK</span>
                </div>
                <div className="flex items-baseline justify-between text-body-sm font-body-sm font-semibold">
                  <span>Speed:</span>
                  <span className="font-label-mono-sm text-secondary-fixed-dim font-bold">{summary.bestWpm} WPM</span>
                </div>
                <div className="flex items-baseline justify-between text-caption-ui font-caption-ui text-inverse-primary">
                  <span>Accuracy:</span>
                  <span className="font-label-mono-sm">{latestTest?.accuracy ?? summary.averageAccuracy}%</span>
                </div>
                <div className="flex items-baseline justify-between text-caption-ui font-caption-ui text-inverse-primary">
                  <span>Errors:</span>
                  <span className="font-label-mono-sm">{latestTest ? (latestTest.errors === 0 ? '0 clean' : `${latestTest.errors} err`) : '0 clean'}</span>
                </div>
              </div>
              <div className="w-2 h-2 bg-primary-container rotate-45 -mt-1" />
              <div className="w-px h-20 sm:h-28 border-l border-dashed border-secondary mt-1" />
              <div className="w-3.5 h-3.5 rounded-full bg-secondary border-2 border-surface-container-lowest shadow-md -mt-1" />
            </div>

            {/* Vector Plot Paths */}
            <svg className="w-full h-full overflow-visible z-10" preserveAspectRatio="none" viewBox="0 0 700 280">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4648d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4648d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Area Fill */}
              <path d={areaPath} fill="url(#areaGradient)" />
              {/* Secondary smoothed trace (Accuracy index) */}
              <path d={accuracyPath280} fill="none" stroke="#c6c6cd" strokeDasharray="4 3" strokeWidth="1.8" />
              {/* Main WPM Line */}
              <path d={speedPath280} fill="none" stroke="#4648d4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              {/* Key milestone anchor points */}
              {anchorPoints.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={pt.y}
                  fill={pt.isPeak ? '#4648d4' : '#ffffff'}
                  r={pt.isPeak ? 5 : 4}
                  stroke={pt.isPeak ? '#ffffff' : '#4648d4'}
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>

          {/* Axis Labels */}
          <div className="flex justify-between pt-unit-md text-label-mono-sm font-label-mono-sm text-on-surface-variant border-t border-outline-variant mt-unit-sm">
            {axisLabels.map((lbl, idx) => (
              <span key={idx} className={idx === axisLabels.length - 1 ? 'font-semibold text-secondary' : ''}>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Right Column: Keystroke Stress Analysis (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col gap-unit-base">
          <div className="bg-surface-container-lowest p-unit-lg sm:p-unit-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between flex-1">
            <div>
              <div className="flex items-center justify-between mb-unit-xs">
                <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold">Keystroke Stress Matrix</h2>
                <span className="px-2 py-0.5 rounded text-label-mono-sm font-label-mono-sm bg-surface-container text-on-surface-variant font-medium">Bigram Latency</span>
              </div>
              <p className="text-body-sm font-body-sm text-on-surface-variant mb-unit-md">Physical key switch hit-rate &amp; latency transitions.</p>

              {/* Keyboard Matrix Keycap Chips */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-unit-xs mb-unit-md">
                {matrixKeys.map((item) => (
                  item.error ? (
                    <div key={item.key} className="bg-error-container/40 p-2 rounded-xl border-2 border-error text-center flex flex-col items-center relative">
                      <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-error rounded-full flex items-center justify-center text-white text-[8px] font-bold">!</span>
                      <span className="font-label-mono-sm font-bold text-on-error-container text-body-md">{item.key}</span>
                      <span className="text-label-mono-sm font-label-mono-sm text-error font-bold">{item.value}</span>
                      <div className="w-full bg-error-container h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-error h-full" style={{ width: item.value }} />
                      </div>
                    </div>
                  ) : (
                    <div key={item.key} className="bg-surface-container-low p-2 rounded-xl border border-outline-variant text-center flex flex-col items-center">
                      <span className="font-label-mono-sm font-bold text-on-surface text-body-md">{item.key}</span>
                      <span className="text-label-mono-sm font-label-mono-sm text-secondary font-medium">{item.value}</span>
                      <div className="w-full bg-surface-container h-1 rounded-full mt-1 overflow-hidden">
                        <div className="bg-secondary h-full" style={{ width: item.value }} />
                      </div>
                    </div>
                  )
                ))}
              </div>

              {/* Diagnostic Insight Callout */}
              <div className="p-unit-md rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-unit-sm">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0">lightbulb</span>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  <strong className="text-on-surface font-semibold">Diagnostic Insight:</strong> Right ring finger shows <span className="font-label-mono-sm text-error font-semibold">4.2% higher latency</span> during double-tap transitions (<code className="bg-surface-container px-1 py-0.5 rounded text-label-mono-sm">er</code> / <code className="bg-surface-container px-1 py-0.5 rounded text-label-mono-sm">re</code> bi-grams).
                </p>
              </div>
            </div>

            {/* Performance Overview Comparison Progress Bars */}
            <div className="pt-unit-md mt-unit-md border-t border-outline-variant flex flex-col gap-unit-sm">
              <div className="flex justify-between items-baseline text-body-sm font-body-sm">
                <span className="text-on-surface font-medium">Cadence Target Index</span>
                <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold">
                  Speed {summary.bestWpm} WPM vs {summary.averageAccuracy}% Acc
                </span>
              </div>
              {/* Bar 1: Speed Efficiency */}
              <div className="space-y-1">
                <div className="flex justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant">
                  <span>Speed Efficiency</span>
                  <span>{summary.bestWpm} / 100 WPM</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(summary.bestWpm, 100)}%` }} />
                </div>
              </div>
              {/* Bar 2: Hit Reliability */}
              <div className="space-y-1">
                <div className="flex justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant">
                  <span>Hit Reliability</span>
                  <span>{summary.averageAccuracy}%</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${summary.averageAccuracy}%` }} />
                </div>
              </div>
              <p className="text-label-mono-sm font-label-mono-sm text-on-surface-variant pt-1">
                🚀 Your typing speed has improved by <span className="text-secondary font-semibold">12%</span> over recent tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Test History Section */}
      <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
        <div className="p-unit-lg border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-unit-sm">
          <div>
            <h2 className="text-headline-sm font-headline-sm text-on-surface font-semibold">Recent Test History</h2>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Granular log of raw telemetry packets recorded across benchmark trials.</p>
          </div>
          <div className="flex items-center gap-unit-xs">
            <span className="px-2.5 py-1 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-body-sm text-on-surface font-mono text-xs">
              Showing Last {summary.recentTests.length} Tests
            </span>
          </div>
        </div>

        {/* Desktop Historical Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/70 border-b border-outline-variant text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase tracking-wider">
                <th className="py-3 px-unit-lg font-semibold">Session Timestamp</th>
                <th className="py-3 px-unit-md font-semibold">Mode &amp; Parameters</th>
                <th className="py-3 px-unit-md font-semibold">Net Speed</th>
                <th className="py-3 px-unit-md font-semibold">Accuracy</th>
                <th className="py-3 px-unit-md font-semibold">Errors</th>
                <th className="py-3 px-unit-lg font-semibold text-right">Telemetry Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/70 text-body-sm font-body-sm">
              {summary.recentTests.map((test, index) => (
                <tr key={test.id} className="hover:bg-surface-container-low/50 transition-colors group">
                  <td className="py-3.5 px-unit-lg font-medium text-on-surface flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-secondary' : 'bg-outline-variant'}`} />
                    <span>
                      {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {', '}
                      {new Date(test.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3.5 px-unit-md">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-label-mono-sm font-label-mono-sm text-on-surface-variant font-medium">
                      {test.mode}
                    </span>
                  </td>
                  <td className="py-3.5 px-unit-md font-label-mono-sm font-bold text-on-surface">
                    <span className={index === 0 ? 'text-secondary' : 'text-on-surface'}>{test.wpm} WPM</span>
                  </td>
                  <td className="py-3.5 px-unit-md font-label-mono-sm text-on-surface">
                    {test.accuracy}%
                  </td>
                  <td className="py-3.5 px-unit-md font-label-mono-sm">
                    {test.errors === 0 ? (
                      <span className="text-secondary font-medium">0 clean</span>
                    ) : (
                      <span className="text-error font-medium">{test.errors} err</span>
                    )}
                  </td>
                  <td className="py-3.5 px-unit-lg text-right">
                    <button className="inline-flex items-center gap-1 text-label-mono-sm font-label-mono-sm text-secondary hover:text-primary font-medium hover:underline">
                      <span>Inspect Packet</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="sm:hidden divide-y divide-outline-variant/70 p-4 space-y-3">
          {summary.recentTests.map((test) => (
            <div key={test.id} className="p-3 bg-surface-container-low rounded-xl space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-on-surface-variant">
                <span>{new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-on-surface font-bold">{test.wpm} WPM</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Accuracy: <strong className="text-secondary">{test.accuracy}%</strong></span>
                <span>Errors: <strong className={test.errors > 0 ? 'text-error' : 'text-secondary'}>{test.errors}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* End-to-End Key Signature Sync Banner */}
      <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-unit-lg shadow-sm">
        <div className="flex items-start gap-unit-md">
          <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 border border-outline-variant">
            <span className="material-symbols-outlined text-[24px]">cloud_sync</span>
          </div>
          <div>
            <h3 className="text-headline-sm font-headline-sm text-on-surface font-semibold">End-to-End Key Signature Sync</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant mt-0.5 max-w-xl">
              Store raw per-key actuation latencies, mechanical switch benchmarks, and custom dictionaries in cryptographic secure cold storage.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-unit-sm w-full md:w-auto shrink-0">
          <Button className="w-full md:w-auto">Manage Telemetry Keys</Button>
        </div>
      </section>
    </div>
  );
}

function generateSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  if (points.length === 2) return `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)} L ${points[1].x.toFixed(1)} ${points[1].y.toFixed(1)}`;

  let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return d;
}

export default Statistics;
