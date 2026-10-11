import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTypingTest } from '../contexts/TypingTestContext';
import { useAuth } from '../contexts/AuthContext';
import { typingTestApi } from '../services/api';
import { cn } from '../utils/cn';
import { AppModal, Button, PageHeader } from '../components/common';

const page = 'max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-8 space-y-8';
const hero = 'text-center max-w-3xl mx-auto space-y-3';
const heroBadge = 'inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono text-xs text-slate-700';
const heroTitle = 'text-3xl sm:text-4xl font-headline font-bold tracking-tight text-slate-900';
const heroSubtitle = 'text-sm sm:text-base text-slate-600 font-body';
const heroSubtitleLg = 'text-base text-slate-600 max-w-2xl mx-auto font-body';
const metricRibbon = 'flex flex-wrap items-center justify-center gap-2 pt-1';
const metricItem = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 card-shadow text-xs';
const metricLabel = 'text-slate-500 font-medium';
const metricValue = 'font-mono font-bold text-slate-900';
const metricValueAccent = 'font-mono font-bold text-indigo-600';
const segmentContainer = 'flex items-center p-1 bg-white rounded-xl border border-slate-200 card-shadow';
const segmentIcon = 'font-mono text-xs text-slate-400 px-2 flex items-center';
const segmentItemBase = 'px-3 py-1 rounded-lg text-xs font-medium transition-all';
const segmentItemActive = 'bg-slate-900 text-white shadow-xs';
const segmentItemInactive = 'text-slate-600 hover:text-slate-900';
const segmentsRow = 'pt-3 flex flex-wrap items-center justify-center gap-2';
const testSection = 'max-w-7xl mx-auto w-full';
const testCard = 'bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden relative';
const testCardHeader = 'px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60';
const testCardTitle = 'font-headline text-sm font-bold text-slate-900';
const testStatusBar = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] bg-slate-100 text-slate-600 border border-slate-200';
const restartHint = 'hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono';
const restartButton = 'p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all active:rotate-180';
const hudGrid = 'grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 border-b border-slate-200';
const hudCell = 'bg-white p-4 flex flex-col justify-center';
const hudLabel = 'font-mono text-xs text-slate-500 font-medium tracking-wider';
const hudValue = 'font-mono text-3xl sm:text-4xl font-bold text-slate-900';
const hudBar = 'w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden';
const hudBarFill = 'bg-indigo-600 h-full rounded-full';
const typingArena = 'p-6 sm:p-10 bg-white select-none relative cursor-text';
const typingStream = 'font-type-test-stream-mobile sm:font-type-test-stream leading-relaxed tracking-wide transition-all';
const legendBar = 'mt-6 flex flex-wrap items-center justify-between pt-4 border-t border-dashed border-slate-200 text-xs text-slate-500 font-mono gap-2';
const inputArea = 'p-6 bg-slate-50 border-t border-slate-200';
const typingInput = 'w-full px-5 py-3.5 bg-white border border-slate-300 rounded-xl text-lg font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/10 transition-all subtle-shadow';
const startHint = 'text-xs font-mono text-indigo-600 hover:text-indigo-800 flex items-center gap-1';
const scoreCard = 'p-3 rounded-xl bg-slate-50 border border-slate-200 text-center';
const scoreLabel = 'font-mono text-[10px] text-slate-500 uppercase';
const scoreValue = 'font-mono text-xl font-bold mt-0.5';
const meterTrack = 'w-full bg-slate-200 h-1.5 rounded-full overflow-hidden';
const meterFill = 'h-full rounded-full';
const authPrompt = 'p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 mb-5';
const ctaSection = 'max-w-7xl mx-auto w-full text-center pt-2';
const ctaCard = 'p-4 rounded-xl bg-slate-100 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-left';
const ctaLink = 'px-4 py-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-xs font-semibold text-slate-900 transition-all shrink-0 card-shadow';
const statusDot = 'w-2 h-2 rounded-full';

function Home() {
  const {
    text,
    typedText,
    errors,
    startTime,
    isCompleted,
    isStarted,
    wpm,
    accuracy,
    duration,
    mode,
    difficulty,
    startTest,
    resetTest,
    handleKeyPress,
    setDuration,
    setMode,
    setDifficulty,
    getCharacterClass,
  } = useTypingTest();

  const { user, isAuthenticated } = useAuth();
  const [now, setNow] = useState(() => Date.now());
  const [isResultDismissed, setIsResultDismissed] = useState(false);
  const submittedTestRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isStarted || isCompleted) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [isStarted, isCompleted]);

  useEffect(() => {
    if (!isCompleted) submittedTestRef.current = null;
    if (!isCompleted) setIsResultDismissed(false);
  }, [isCompleted]);

  useEffect(() => {
    if (!isCompleted || !isAuthenticated || !user || submittedTestRef.current === text) return;
    submittedTestRef.current = text;
    void typingTestApi.submitResult({
      userId: user.id,
      wpm,
      accuracy,
      errors,
      totalCharacters: typedText.length,
      correctCharacters: Math.max(typedText.length - errors, 0),
      duration,
      mode: `${duration}s / ${mode}`,
      text,
    });
  }, [accuracy, duration, errors, isAuthenticated, isCompleted, mode, text, typedText.length, user, wpm]);

  const timeElapsed = startTime ? Math.floor((now - startTime) / 1000) : 0;
  const timeRemaining = Math.max(0, duration - timeElapsed);
  const timeProgress = (timeElapsed / duration) * 100;
  const completedSeconds = startTime ? Math.max(1, Math.round(((Date.now()) - startTime) / 1000)) : duration;

  const statusDotColor = isCompleted ? 'bg-emerald-500' : isStarted ? 'bg-indigo-500' : 'bg-slate-400';
  const statusLabel = isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Ready';

  return (
    <div className={page}>
      <section className={hero}>
        {isAuthenticated && user ? (
          <PageHeader
            badgeText="Zero Latency Engine • Pure Mechanical Flow"
            title={<span className="inline-flex items-center justify-center gap-2">Welcome back, {user.username} 👋</span>}
            subtitle="Ready for another typing test? Push your cadence to new heights."
          >
            <div className={metricRibbon}>
              <div className={metricItem}>
                <span className={metricLabel}>Current Best:</span>
                <span className={metricValue}>{user.bestWpm || 0} WPM</span>
              </div>
              <div className={metricItem}>
                <span className={metricLabel}>Average:</span>
                <span className={metricValue}>{user.averageWpm || 0} WPM</span>
              </div>
              <div className={metricItem}>
                <span className={metricLabel}>Accuracy:</span>
                <span className={metricValueAccent}>{user.averageAccuracy || 0}%</span>
              </div>
            </div>
          </PageHeader>
        ) : (
          <PageHeader
            badgeText="Zero Latency Engine • Pure Mechanical Flow"
            title="Improve Your Typing. One Test at a Time."
            subtitle="Practice typing, improve your speed, and track your performance. No account required. Start practicing instantly."
          />
        )}

        <div className={segmentsRow}>
          <div className={segmentContainer}>
            <span className={segmentIcon}>
              <span className="material-symbols-outlined text-[15px]">timer</span>
            </span>
            {[15, 30, 60].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(segmentItemBase, 'font-mono', duration === d ? segmentItemActive : segmentItemInactive)}
              >
                {d}s
              </button>
            ))}
            <button type="button" onClick={() => setDuration(120)} className={cn(segmentItemBase, 'font-mono', segmentItemInactive)}>
              Custom
            </button>
          </div>

          <div className={segmentContainer}>
            <span className={segmentIcon}>
              <span className="material-symbols-outlined text-[15px]">tune</span>
            </span>
            {(['easy', 'medium', 'hard'] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={cn(segmentItemBase, 'capitalize', difficulty === d ? segmentItemActive : segmentItemInactive)}
              >
                {d}
              </button>
            ))}
          </div>

          <div className={segmentContainer}>
            <span className={segmentIcon}>
              <span className="material-symbols-outlined text-[15px]">article</span>
            </span>
            {(['words', 'quotes', 'code'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={cn(segmentItemBase, 'capitalize', mode === m ? segmentItemActive : segmentItemInactive)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={testSection}>
        <div className={testCard}>
          <div className={testCardHeader}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-600 text-[20px]">keyboard</span>
                <span className={testCardTitle}>Typing Test</span>
              </div>
              <span className={testStatusBar}>
                <span className={cn(statusDot, statusDotColor)}></span>
                {statusLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className={restartHint}>
                <kbd className="px-2 py-0.5 bg-slate-100 rounded tactile-keycap border border-slate-300 text-[10px] text-slate-700">Tab + Enter</kbd>
                <span>to restart</span>
              </div>
              <button
                type="button"
                onClick={resetTest}
                aria-label="Restart test"
                className={restartButton}
                title="Restart Test (Tab + Enter)"
              >
                <span className="material-symbols-outlined text-[20px]">replay</span>
              </button>
            </div>
          </div>

          <div className={hudGrid}>
            <div className={hudCell}>
              <span className={hudLabel}>TIME</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={hudValue}>
                  {timeRemaining}
                  <span className="text-sm font-normal text-slate-500">s</span>
                </span>
              </div>
              <div className={hudBar}>
                <div
                  className={cn(hudBarFill, 'transition-all duration-300')}
                  style={{ width: `${Math.max(0, 100 - timeProgress)}%` }}
                ></div>
              </div>
            </div>

            <div className={hudCell}>
              <div className="flex items-center justify-between">
                <span className={hudLabel}>WPM</span>
                {isStarted && (
                  <span className="text-[10px] font-mono text-indigo-600 flex items-center">
                    <span className="material-symbols-outlined text-[12px]">trending_up</span> live
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={hudValue}>{wpm}</span>
              </div>
              <div className="h-3 w-full mt-1.5">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0 16 Q 20 18, 35 10 T 70 8 T 100 4" fill="none" stroke="#4648d4" strokeLinecap="round" strokeWidth="2"></path>
                </svg>
              </div>
            </div>

            <div className={hudCell}>
              <span className={hudLabel}>ACCURACY</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-indigo-600">
                  {accuracy}
                  <span className="text-sm font-normal text-slate-500">%</span>
                </span>
              </div>
              <div className={hudBar}>
                <div className={hudBarFill} style={{ width: `${accuracy}%` }}></div>
              </div>
            </div>

            <div className={hudCell}>
              <span className={hudLabel}>ERRORS</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-mono text-3xl sm:text-4xl font-bold text-rose-600">{errors}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-2">Target &lt; 2%</span>
            </div>
          </div>

          <div className={typingArena}>
            <div className={typingStream}>
              {text.split('').map((char, index) => (
                <span key={index} className={getCharacterClass(index)}>
                  {char}
                </span>
              ))}
            </div>

            <div className={legendBar}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Emerald: Correct</span>
                <span className="text-slate-300">|</span>
                <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                <span>Rose: Error</span>
                <span className="text-slate-300">|</span>
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>Cyan: Active Caret</span>
              </div>
              <div className="flex items-center gap-1.5">
                <kbd className="px-1.5 py-0.5 bg-slate-100 rounded tactile-keycap border border-slate-300 text-[10px]">Esc</kbd>
                <span>to pause</span>
              </div>
            </div>
          </div>

          <div className={inputArea}>
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Start typing here..."
                aria-label="Typing input"
                className={typingInput}
                disabled={isCompleted}
                value={typedText}
                readOnly
                onKeyDown={(e) => {
                  if (e.key === 'Tab') return;
                  e.preventDefault();
                  handleKeyPress(e.key);
                }}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <span className="material-symbols-outlined text-[20px]">keyboard</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-center gap-4 text-center">
              {!isStarted && (
                <button
                  type="button"
                  onClick={startTest}
                  className={startHint}
                >
                  <span className="material-symbols-outlined text-[14px]">play_arrow</span> Click here or start typing to begin
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <AppModal isOpen={isCompleted && !isResultDismissed} onClose={() => setIsResultDismissed(true)} title="Great Job!" icon="🎉">
        <p className="-mt-3 mb-5 text-xs text-slate-500">Test session completed with fluid cadence.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
          <Score label="Speed" value={<>{wpm} <span className="text-[10px] font-normal">WPM</span></>} />
          <Score label="Accuracy" value={`${accuracy}%`} tone="text-indigo-600" />
          <Score label="Errors" value={errors} tone="text-rose-600" />
          <Score label="Time" value={`${completedSeconds}s`} />
        </div>
        <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 mb-5">
          <Meter label="Speed Target (Pro Benchmark: 80 WPM)" value={`${Math.min(100, Math.round((wpm / 80) * 100))}%`} percent={Math.min(100, Math.round((wpm / 80) * 100))} />
          <Meter label="Accuracy & Rhythm Stability" value={`${accuracy}%`} percent={accuracy} indigo />
        </div>
        {!isAuthenticated && (
          <div className={authPrompt}>
            <p className="text-xs font-semibold text-slate-900">Want to track your progress?</p>
            <p className="text-xs text-slate-600 mt-0.5">Create a free account to automatically save your typing history and rhythm charts.</p>
            <div className="flex items-center gap-2 mt-2.5">
              <Link to="/signup" onClick={() => setIsResultDismissed(true)} className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-medium">Create Account</Link>
              <Link to="/login" onClick={() => setIsResultDismissed(true)} className="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 text-xs font-medium">Login</Link>
            </div>
          </div>
        )}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <Link to="/statistics" onClick={() => setIsResultDismissed(true)} className="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-300 text-center text-xs font-semibold text-slate-700 hover:bg-slate-100">View Statistics</Link>
          <Button className="w-full sm:w-auto" onClick={resetTest} icon={<span className="material-symbols-outlined text-[16px]">replay</span>}>Try Again</Button>
        </div>
      </AppModal>

      <section className={ctaSection}>
        <div className={ctaCard}>
          <div>
            <h4 className="font-headline font-semibold text-sm text-slate-900">Looking for deep trends and analytics?</h4>
            <p className="text-xs text-slate-600">Explore comprehensive speed charts, accuracy heatmaps, and test logs on your dedicated telemetry page.</p>
          </div>
          <Link
            to="/statistics"
            className={ctaLink}
          >
            Open Statistics Page →
          </Link>
        </div>
      </section>
    </div>
  );
}

function Score({ label, value, tone = 'text-slate-900' }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className={scoreCard}>
      <span className={scoreLabel}>{label}</span>
      <p className={cn(scoreValue, tone)}>{value}</p>
    </div>
  );
}

function Meter({ label, value, percent, indigo = false }: { label: string; value: string; percent: number; indigo?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-600">{label}</span>
        <span className={cn('font-mono font-bold', indigo ? 'text-indigo-600' : 'text-slate-900')}>{value}</span>
      </div>
      <div className={meterTrack}>
        <div className={cn(meterFill, indigo ? 'bg-indigo-600' : 'bg-slate-900')} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default Home;
