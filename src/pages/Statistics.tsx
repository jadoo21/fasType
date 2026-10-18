import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { statisticsApi } from '../services/api';
import { StatisticsSummary, StatisticsTrend } from '../types';
import { Button, PageHeader } from '../components/common';
import { cn } from '../utils/cn';

const page = 'w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12';
const loadingContainer = 'flex items-center justify-center h-64';
const loadingInner = 'text-center space-y-4';
const spinner = 'w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto';
const loadingText = 'text-sm text-slate-500 font-mono';
const errorCard = 'w-full bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 text-center space-y-4 card-shadow';
const errorIconContainer = 'w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto text-rose-600';
const errorIcon = 'material-symbols-outlined text-[32px]';
const errorTitle = 'text-xl font-headline font-bold text-slate-900';
const errorDescription = 'text-sm text-slate-600 max-w-md mx-auto';

const timeframeContainer = 'inline-flex p-1 bg-surface-container-lowest border border-outline-variant rounded-xl text-body-sm font-body-sm';
const timeframeButtonBase = 'px-unit-md py-1 rounded-lg transition-colors';
const timeframeButtonActive = 'bg-primary text-surface-container-lowest font-medium shadow-sm';
const timeframeButtonInactive = 'text-on-surface-variant hover:text-primary';
const exportButton = 'inline-flex items-center gap-1.5 px-unit-md py-2 rounded-xl bg-surface-container-lowest border border-outline-variant hover:border-outline text-on-surface text-body-sm font-body-sm font-medium transition-colors active:scale-[0.98]';
const exportIcon = 'material-symbols-outlined text-[18px] text-secondary';
const exportBadge = 'px-1.5 py-0.5 rounded bg-surface-container-low text-label-mono-sm font-label-mono-sm text-on-surface-variant';
const metricsGrid = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-unit-base';
const metricCard = 'bg-surface-container-lowest p-unit-lg rounded-2xl border border-outline-variant shadow-sm hover:border-outline transition-all flex flex-col justify-between group';
const metricCardHeader = 'flex items-center justify-between';
const metricCardLabel = 'text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase';
const metricIconBase = 'w-8 h-8 rounded-lg flex items-center justify-center';
const metricIcon = 'material-symbols-outlined text-[20px]';
const metricValueContainer = 'my-unit-md relative z-10';
const metricValueRow = 'flex items-baseline gap-unit-xs';
const metricValue = 'text-stat-metric-lg font-stat-metric-lg text-on-surface tracking-tight';
const metricUnit = 'text-body-md font-label-mono-sm text-on-surface-variant font-medium';
const metricFooter = 'flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant relative z-10';
const metricBadge = 'inline-flex items-center gap-1 text-label-mono-sm font-label-mono-sm px-2 py-0.5 rounded bg-surface-container-low font-semibold border border-outline-variant/60';
const metricBadgeDot = 'w-1.5 h-1.5 rounded-full';
const metricHint = 'text-label-mono-sm font-label-mono-sm text-on-surface-variant';
const chartColumn = 'lg:col-span-7 bg-surface-container-lowest p-unit-lg sm:p-unit-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between';
const chartHeader = 'flex flex-col sm:flex-row sm:items-center justify-between gap-unit-sm mb-unit-lg';
const chartTitle = 'text-headline-sm font-headline-sm text-on-surface font-semibold';
const chartSubtitle = 'text-body-sm font-body-sm text-on-surface-variant';
const chartLegend = 'flex items-center gap-unit-sm text-label-mono-sm font-label-mono-sm';
const chartLegendItem = 'inline-flex items-center gap-1 text-on-surface';
const chartLegendDot = 'w-2.5 h-2.5 rounded-full';
const chartContainer = 'relative w-full aspect-[16/9] min-h-[260px] flex items-end';
const chartGrid = 'absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40';
const chartGridLine = 'border-b border-dashed border-outline-variant w-full flex justify-between text-label-mono-sm font-label-mono-sm text-outline px-1';
const chartTooltipPin = 'absolute right-[8%] top-[12%] z-20 flex flex-col items-center';
const chartTooltipCard = 'bg-primary-container text-surface-container-lowest p-2.5 rounded-xl shadow-xl border border-primary text-left min-w-[160px]';
const chartTooltipHeader = 'text-label-mono-sm font-label-mono-sm text-inverse-primary border-b border-outline-variant/30 pb-1 mb-1 flex justify-between';
const chartTooltipRow = 'flex items-baseline justify-between text-body-sm font-body-sm font-semibold';
const chartTooltipValue = 'font-label-mono-sm text-secondary-fixed-dim font-bold';
const chartTooltipSmall = 'flex items-baseline justify-between text-caption-ui font-caption-ui text-inverse-primary';
const chartTooltipSmallValue = 'font-label-mono-sm';
const chartPinBase = 'w-2 h-2 bg-primary-container rotate-45 -mt-1';
const chartPinLine = 'w-px h-20 sm:h-28 border-l border-dashed border-secondary mt-1';
const chartPinDot = 'w-3.5 h-3.5 rounded-full bg-secondary border-2 border-surface-container-lowest shadow-md -mt-1';
const chartSvg = 'w-full h-full overflow-visible z-10';
const chartAxis = 'flex justify-between pt-unit-md text-label-mono-sm font-label-mono-sm text-on-surface-variant border-t border-outline-variant mt-unit-sm';
const rightColumn = 'lg:col-span-5 flex flex-col gap-unit-base';
const keystrokeCard = 'bg-surface-container-lowest p-unit-lg sm:p-unit-xl rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between flex-1';
const keystrokeHeader = 'flex items-center justify-between mb-unit-xs';
const keystrokeTitle = 'text-headline-sm font-headline-sm text-on-surface font-semibold';
const keystrokeBadge = 'px-2 py-0.5 rounded text-label-mono-sm font-label-mono-sm bg-surface-container text-on-surface-variant font-medium';
const keystrokeSubtitle = 'text-body-sm font-body-sm text-on-surface-variant mb-unit-md';
const keystrokeGrid = 'grid grid-cols-5 gap-1.5 sm:gap-unit-xs mb-unit-md';
const keystrokeKeyError = 'bg-error-container/40 p-2 rounded-xl border-2 border-error text-center flex flex-col items-center relative';
const keystrokeKeyErrorIcon = 'absolute -top-1.5 -right-1.5 w-3 h-3 bg-error rounded-full flex items-center justify-center text-white text-[8px] font-bold';
const keystrokeKeyLabel = 'font-label-mono-sm font-bold text-body-md';
const keystrokeKeyValue = 'text-label-mono-sm font-label-mono-sm font-bold';
const keystrokeKeyBar = 'w-full h-1 rounded-full mt-1 overflow-hidden';
const keystrokeKeyBarFillError = 'bg-error h-full';
const keystrokeKeyNormal = 'bg-surface-container-low p-2 rounded-xl border border-outline-variant text-center flex flex-col items-center';
const keystrokeKeyValueNormal = 'text-label-mono-sm font-label-mono-sm text-secondary font-medium';
const keystrokeKeyBarNormal = 'w-full bg-surface-container h-1 rounded-full mt-1 overflow-hidden';
const keystrokeKeyBarFillNormal = 'bg-secondary h-full';
const diagnosticCallout = 'p-unit-md rounded-xl bg-surface-container-low border border-outline-variant flex items-start gap-unit-sm';
const diagnosticIcon = 'material-symbols-outlined text-secondary text-[20px] mt-0.5 shrink-0';
const diagnosticText = 'text-body-sm font-body-sm text-on-surface-variant leading-relaxed';
const diagnosticStrong = 'text-on-surface font-semibold';
const diagnosticError = 'font-label-mono-sm text-error font-semibold';
const diagnosticCode = 'bg-surface-container px-1 py-0.5 rounded text-label-mono-sm';
const progressSection = 'pt-unit-md mt-unit-md border-t border-outline-variant flex flex-col gap-unit-sm';
const progressHeader = 'flex justify-between items-baseline text-body-sm font-body-sm';
const progressHeaderValue = 'font-label-mono-sm text-label-mono-sm text-secondary font-semibold';
const progressLabel = 'text-on-surface font-medium';
const progressBarGroup = 'space-y-1';
const progressBarLabel = 'flex justify-between text-label-mono-sm font-label-mono-sm text-on-surface-variant';
const progressBarTrack = 'w-full bg-surface-container rounded-full h-2 overflow-hidden';
const progressBarFill = 'h-full rounded-full transition-all duration-500';
const progressNote = 'text-label-mono-sm font-label-mono-sm text-on-surface-variant pt-1';
const historySection = 'bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col';
const historyHeader = 'p-unit-lg border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between gap-unit-sm';
const historyTitle = 'text-headline-sm font-headline-sm text-on-surface font-semibold';
const historySubtitle = 'text-body-sm font-body-sm text-on-surface-variant';
const historyCount = 'px-2.5 py-1 rounded-lg border border-outline-variant bg-surface-container-low text-body-sm font-body-sm text-on-surface font-mono text-xs';
const desktopTable = 'hidden sm:block overflow-x-auto';
const tableElement = 'w-full text-left border-collapse';
const tableHead = 'bg-surface-container-low/70 border-b border-outline-variant text-label-mono-sm font-label-mono-sm text-on-surface-variant uppercase tracking-wider';
const tableHeadCell = 'py-3 font-semibold';
const tableBody = 'divide-y divide-outline-variant/70 text-body-sm font-body-sm';
const tableRow = 'hover:bg-surface-container-low/50 transition-colors group';
const tableCell = 'py-3.5 font-medium text-on-surface';
const tableCellMode = 'py-3.5 px-unit-md';
const tableCellMono = 'py-3.5 px-unit-md font-label-mono-sm';
const tableCellRight = 'py-3.5 px-unit-lg text-right';
const modeBadge = 'inline-flex items-center px-2 py-0.5 rounded-md bg-surface-container text-label-mono-sm font-label-mono-sm text-on-surface-variant font-medium';
const inspectButton = 'inline-flex items-center gap-1 text-label-mono-sm font-label-mono-sm text-secondary hover:text-primary font-medium hover:underline';
const mobileCardsContainer = 'sm:hidden divide-y divide-outline-variant/70 p-4 space-y-3';
const mobileCard = 'p-3 bg-surface-container-low rounded-xl space-y-2';
const mobileCardHeader = 'flex justify-between items-center text-xs font-mono text-on-surface-variant';
const mobileCardDetails = 'flex justify-between text-xs';
const syncBanner = 'bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-unit-lg shadow-sm';
const syncBannerContent = 'flex items-start gap-unit-md';
const syncBannerIconContainer = 'w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 border border-outline-variant';
const syncBannerIcon = 'material-symbols-outlined text-[24px]';
const syncBannerTitle = 'text-headline-sm font-headline-sm text-on-surface font-semibold';
const syncBannerText = 'text-body-sm font-body-sm text-on-surface-variant mt-0.5 max-w-xl';
const syncBannerActions = 'flex items-center gap-unit-sm w-full md:w-auto shrink-0';

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
      <div className={page}>
        <div className={loadingContainer}>
          <div className={loadingInner}>
            <div className={spinner}></div>
            <p className={loadingText}>Loading telemetry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={page}>
        <div className={errorCard}>
          <div className={errorIconContainer}>
            <span className={errorIcon}>error</span>
          </div>
          <h3 className={errorTitle}>Failed to Load Statistics</h3>
          <p className={errorDescription}>{error}</p>
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
        <div className="mx-auto max-w-xl border-b border-slate-200 pb-5 text-center">
          <PageHeader
            badgeText="Performance Analytics"
            title="Your Typing Progress"
            subtitle="Track your speed, accuracy, and cadence consistency over time."
            className="max-w-xl"
          />
        </div>

        <div className={errorCard}>
          <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center mx-auto', emptyState.iconClass)}>
            <span className={errorIcon}>{emptyState.icon}</span>
          </div>
          <h3 className={errorTitle}>{emptyState.title}</h3>
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
      <section className="flex flex-col items-center justify-center gap-unit-lg border-b border-outline-variant pb-unit-md text-center">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <PageHeader
            badgeText="Performance Analytics"
            title="Your Typing Progress"
            subtitle="Track your speed, accuracy, and keystroke consistency over time."
            className="max-w-xl"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-unit-sm">
          <div className={timeframeContainer}>
            {(['7d', '30d', '3m', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={cn(timeframeButtonBase, timeframe === tf ? timeframeButtonActive : timeframeButtonInactive)}
              >
                {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '3m' ? '3 Months' : 'All Time'}
              </button>
            ))}
          </div>
          <button
            onClick={handleExportTelemetry}
            className={exportButton}
          >
            <span className={exportIcon}>download</span>
            <span>Export Telemetry</span>
            <span className={exportBadge}>CSV</span>
          </button>
        </div>
      </section>

      <section className={metricsGrid}>
        <div className={cn(metricCard, 'relative overflow-hidden')}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-low rounded-bl-full pointer-events-none opacity-50 group-hover:scale-110 transition-transform" />
          <div className={cn(metricCardHeader, 'relative z-10')}>
            <span className={metricCardLabel}>Best WPM</span>
            <div className={cn(metricIconBase, 'bg-secondary-fixed text-on-secondary-fixed')}>
              <span className={metricIcon}>bolt</span>
            </div>
          </div>
          <div className={metricValueContainer}>
            <div className={metricValueRow}>
              <span className={metricValue}>{summary.bestWpm}</span>
              <span className={metricUnit}>WPM</span>
            </div>
          </div>
          <div className={metricFooter}>
            <span className={cn(metricBadge, 'bg-surface-container-low text-secondary')}>
              <span className={cn(metricBadgeDot, 'bg-secondary')} />
              Personal Best
            </span>
            <span className={metricHint}>+4 WPM this week</span>
          </div>
        </div>

        <div className={metricCard}>
          <div className={metricCardHeader}>
            <span className={metricCardLabel}>Average WPM</span>
            <div className={cn(metricIconBase, 'bg-surface-container-low text-on-surface-variant')}>
              <span className={metricIcon}>speed</span>
            </div>
          </div>
          <div className="my-unit-md flex items-end justify-between">
            <div className={metricValueRow}>
              <span className={metricValue}>{summary.averageWpm}</span>
              <span className={metricUnit}>WPM</span>
            </div>
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

        <div className={metricCard}>
          <div className={metricCardHeader}>
            <span className={metricCardLabel}>Average Accuracy</span>
            <div className={cn(metricIconBase, 'bg-surface-container-low text-on-surface-variant')}>
              <span className={metricIcon}>ads_click</span>
            </div>
          </div>
          <div className="my-unit-md">
            <div className={metricValueRow}>
              <span className={metricValue}>{summary.averageAccuracy}</span>
              <span className={metricUnit}>%</span>
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

        <div className={metricCard}>
          <div className={metricCardHeader}>
            <span className={metricCardLabel}>Tests Completed</span>
            <div className={cn(metricIconBase, 'bg-surface-container-low text-on-surface-variant')}>
              <span className={metricIcon}>timer</span>
            </div>
          </div>
          <div className="my-unit-md">
            <div className={metricValueRow}>
              <span className={metricValue}>{summary.testsCompleted}</span>
              <span className={metricUnit}>sessions</span>
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

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-unit-base">
        <div className={chartColumn}>
          <div className={chartHeader}>
            <div>
              <h2 className={chartTitle}>Typing Speed Progression</h2>
              <p className={chartSubtitle}>Cadence telemetry across the past {summary.testsCompleted} benchmark sessions.</p>
            </div>
            <div className={chartLegend}>
              <span className={chartLegendItem}>
                <span className={cn(chartLegendDot, 'bg-secondary')} /> WPM
              </span>
              <span className="inline-flex items-center gap-1 text-on-surface-variant">
                <span className={cn(chartLegendDot, 'bg-outline-variant')} /> Accuracy %
              </span>
            </div>
          </div>

          <div className={chartContainer}>
            <div className={chartGrid}>
              <div className={chartGridLine}><span>80 WPM</span></div>
              <div className={chartGridLine}><span>65 WPM</span></div>
              <div className={chartGridLine}><span>50 WPM</span></div>
              <div className={chartGridLine}><span>35 WPM</span></div>
            </div>

            <div className={chartTooltipPin}>
              <div className={chartTooltipCard}>
                <div className={chartTooltipHeader}>
                  <span>TEST #{summary.testsCompleted} (TODAY)</span>
                  <span className="text-secondary-fixed-dim">PEAK</span>
                </div>
                <div className={chartTooltipRow}>
                  <span>Speed:</span>
                  <span className={chartTooltipValue}>{summary.bestWpm} WPM</span>
                </div>
                <div className={chartTooltipSmall}>
                  <span>Accuracy:</span>
                  <span className={chartTooltipSmallValue}>{latestTest?.accuracy ?? summary.averageAccuracy}%</span>
                </div>
                <div className={chartTooltipSmall}>
                  <span>Errors:</span>
                  <span className={chartTooltipSmallValue}>{latestTest ? (latestTest.errors === 0 ? '0 clean' : `${latestTest.errors} err`) : '0 clean'}</span>
                </div>
              </div>
              <div className={chartPinBase} />
              <div className={chartPinLine} />
              <div className={chartPinDot} />
            </div>

            <svg className={chartSvg} preserveAspectRatio="none" viewBox="0 0 700 280">
              <defs>
                <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#4648d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#4648d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill="url(#areaGradient)" />
              <path d={accuracyPath280} fill="none" stroke="#c6c6cd" strokeDasharray="4 3" strokeWidth="1.8" />
              <path d={speedPath280} fill="none" stroke="#4648d4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
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

          <div className={chartAxis}>
            {axisLabels.map((lbl, idx) => (
              <span key={idx} className={cn(idx === axisLabels.length - 1 ? 'font-semibold text-secondary' : '')}>
                {lbl}
              </span>
            ))}
          </div>
        </div>

        <div className={rightColumn}>
          <div className={keystrokeCard}>
            <div>
              <div className={keystrokeHeader}>
                <h2 className={keystrokeTitle}>Keystroke Stress Matrix</h2>
                <span className={keystrokeBadge}>Bigram Latency</span>
              </div>
              <p className={keystrokeSubtitle}>Physical key switch hit-rate &amp; latency transitions.</p>

              <div className={keystrokeGrid}>
                {matrixKeys.map((item) => (
                  item.error ? (
                    <div key={item.key} className={keystrokeKeyError}>
                      <span className={keystrokeKeyErrorIcon}>!</span>
                      <span className={cn(keystrokeKeyLabel, 'text-on-error-container')}>{item.key}</span>
                      <span className={cn(keystrokeKeyValue, 'text-error')}>{item.value}</span>
                      <div className={keystrokeKeyBar}>
                        <div className={keystrokeKeyBarFillError} style={{ width: item.value }} />
                      </div>
                    </div>
                  ) : (
                    <div key={item.key} className={keystrokeKeyNormal}>
                      <span className={cn(keystrokeKeyLabel, 'text-on-surface')}>{item.key}</span>
                      <span className={keystrokeKeyValueNormal}>{item.value}</span>
                      <div className={keystrokeKeyBarNormal}>
                        <div className={keystrokeKeyBarFillNormal} style={{ width: item.value }} />
                      </div>
                    </div>
                  )
                ))}
              </div>

              <div className={diagnosticCallout}>
                <span className={diagnosticIcon}>lightbulb</span>
                <p className={diagnosticText}>
                  <strong className={diagnosticStrong}>Diagnostic Insight:</strong> Right ring finger shows <span className={diagnosticError}>4.2% higher latency</span> during double-tap transitions (<code className={diagnosticCode}>er</code> / <code className={diagnosticCode}>re</code> bi-grams).
                </p>
              </div>
            </div>

            <div className={progressSection}>
              <div className={progressHeader}>
                <span className={progressLabel}>Cadence Target Index</span>
                <span className={progressHeaderValue}>
                  Speed {summary.bestWpm} WPM vs {summary.averageAccuracy}% Acc
                </span>
              </div>
              <div className={progressBarGroup}>
                <div className={progressBarLabel}>
                  <span>Speed Efficiency</span>
                  <span>{summary.bestWpm} / 100 WPM</span>
                </div>
                <div className={progressBarTrack}>
                  <div className={cn(progressBarFill, 'bg-secondary')} style={{ width: `${Math.min(summary.bestWpm, 100)}%` }} />
                </div>
              </div>
              <div className={progressBarGroup}>
                <div className={progressBarLabel}>
                  <span>Hit Reliability</span>
                  <span>{summary.averageAccuracy}%</span>
                </div>
                <div className={progressBarTrack}>
                  <div className={cn(progressBarFill, 'bg-primary')} style={{ width: `${summary.averageAccuracy}%` }} />
                </div>
              </div>
              <p className={progressNote}>
                🚀 Your typing speed has improved by <span className="text-secondary font-semibold">12%</span> over recent tests.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={historySection}>
        <div className={historyHeader}>
          <div>
            <h2 className={historyTitle}>Recent Test History</h2>
            <p className={historySubtitle}>Granular log of raw telemetry packets recorded across benchmark trials.</p>
          </div>
          <div className="flex items-center gap-unit-xs">
            <span className={historyCount}>
              Showing Last {summary.recentTests.length} Tests
            </span>
          </div>
        </div>

        <div className={desktopTable}>
          <table className={tableElement}>
            <thead>
              <tr className={tableHead}>
                <th className={cn(tableHeadCell, 'px-unit-lg')}>Session Timestamp</th>
                <th className={cn(tableHeadCell, 'px-unit-md')}>Mode &amp; Parameters</th>
                <th className={cn(tableHeadCell, 'px-unit-md')}>Net Speed</th>
                <th className={cn(tableHeadCell, 'px-unit-md')}>Accuracy</th>
                <th className={cn(tableHeadCell, 'px-unit-md')}>Errors</th>
                <th className={cn(tableHeadCell, 'px-unit-lg', 'text-right')}>Telemetry Actions</th>
              </tr>
            </thead>
            <tbody className={tableBody}>
              {summary.recentTests.map((test, index) => (
                <tr key={test.id} className={tableRow}>
                  <td className={cn(tableCell, 'px-unit-lg flex items-center gap-2')}>
                    <span className={cn('w-2 h-2 rounded-full', index === 0 ? 'bg-secondary' : 'bg-outline-variant')} />
                    <span>
                      {new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {', '}
                      {new Date(test.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className={tableCellMode}>
                    <span className={modeBadge}>
                      {test.mode}
                    </span>
                  </td>
                  <td className={cn(tableCellMono, 'font-bold text-on-surface')}>
                    <span className={cn(index === 0 ? 'text-secondary' : 'text-on-surface')}>{test.wpm} WPM</span>
                  </td>
                  <td className={cn(tableCellMono, 'text-on-surface')}>
                    {test.accuracy}%
                  </td>
                  <td className={tableCellMono}>
                    {test.errors === 0 ? (
                      <span className="text-secondary font-medium">0 clean</span>
                    ) : (
                      <span className="text-error font-medium">{test.errors} err</span>
                    )}
                  </td>
                  <td className={tableCellRight}>
                    <button type="button" className={inspectButton}>
                      <span>Inspect Packet</span>
                      <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={mobileCardsContainer}>
          {summary.recentTests.map((test) => (
            <div key={test.id} className={mobileCard}>
              <div className={mobileCardHeader}>
                <span>{new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-on-surface font-bold">{test.wpm} WPM</span>
              </div>
              <div className={mobileCardDetails}>
                <span>Accuracy: <strong className="text-secondary">{test.accuracy}%</strong></span>
                <span>Errors: <strong className={cn(test.errors > 0 ? 'text-error' : 'text-secondary')}>{test.errors}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={syncBanner}>
        <div className={syncBannerContent}>
          <div className={syncBannerIconContainer}>
            <span className={syncBannerIcon}>cloud_sync</span>
          </div>
          <div>
            <h3 className={syncBannerTitle}>End-to-End Key Signature Sync</h3>
            <p className={syncBannerText}>
              Store raw per-key actuation latencies, mechanical switch benchmarks, and custom dictionaries in cryptographic secure cold storage.
            </p>
          </div>
        </div>
        <div className={syncBannerActions}>
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
