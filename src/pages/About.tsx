import { Link } from 'react-router-dom';
import { Button, PageHeader } from '../components/common';

function About() {
  const pillars = [
    {
      number: '01',
      title: 'Practice',
      description: 'Carefully curated text corpora spanning technical code syntax, literary prose, and high-frequency n-grams designed to challenge muscle memory.',
      icon: 'keyboard',
      footer: 'Dynamic corpora',
      footerIcon: 'terminal',
    },
    {
      number: '02',
      title: 'Measure',
      description: 'Sub-millisecond input capture tracking raw WPM, net accuracy, hesitation pauses, and keystroke burst speeds.',
      icon: 'timer',
      footer: '<1ms telemetry',
      footerIcon: 'speed',
    },
    {
      number: '03',
      title: 'Improve',
      description: 'Target weak finger transitions and difficult character clusters with algorithmic exercise adaptation.',
      icon: 'tune',
      footer: 'Adaptive clusters',
      footerIcon: 'auto_graph',
    },
    {
      number: '04',
      title: 'Track',
      description: 'Exportable session telemetry, benchmark percentiles against global typists, and long-term consistency metrics.',
      icon: 'query_stats',
      footer: 'JSON & CSV export',
      footerIcon: 'download',
    },
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-12 space-y-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl text-center">
        <PageHeader
          badgeText="Engineered for Flow • Zero Latency"
          title={
            <>
              Typing faster is only part of the journey. <br className="hidden sm:inline" />
              <span className="text-on-surface-variant font-medium">Improving consistently is what matters.</span>
            </>
          }
          subtitle="fasType is a modern typing practice and performance platform designed to help developers, writers, and competitive typists unlock fluid cognitive throughput through focused practice and meaningful feedback."
          className="mb-unit-xl"
        />

        <div className="flex flex-wrap items-center justify-center gap-unit-base">
          <Link to="/">
            <Button icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}>
              Start a Typing Test
            </Button>
          </Link>
          <a href="#methodology">
            <Button variant="secondary">
              Explore Methodology
              <kbd className="font-label-mono-sm text-label-mono-sm px-unit-xs py-0.5 rounded bg-surface-container text-on-surface-variant border border-outline-variant ml-2">M</kbd>
            </Button>
          </a>
        </div>
      </section>

      {/* Four Core Pillars */}
      <section id="methodology">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-unit-xl pb-unit-sm border-b border-outline-variant">
          <div>
            <span className="text-label-mono-sm font-label-mono-sm text-secondary uppercase tracking-wider font-semibold">Core Framework</span>
            <h2 className="text-headline-lg font-headline-lg text-primary mt-unit-xs">The Four Core Pillars</h2>
          </div>
          <p className="text-body-sm font-body-sm text-on-surface-variant max-w-md mt-unit-sm md:mt-0">
            A disciplined system rooted in kinetic rhythm, motor learning heuristics, and sub-millisecond telemetry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-unit-base">
          {pillars.map((pillar) => (
            <div key={pillar.number} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-unit-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-unit-base group-hover:bg-primary group-hover:text-on-primary transition-colors duration-150 border border-outline-variant">
                  <span className="material-symbols-outlined text-[22px]">{pillar.icon}</span>
                </div>
                <div className="flex items-center gap-unit-xs mb-unit-xs">
                  <span className="text-label-mono-sm font-label-mono-sm text-outline font-semibold">{pillar.number}</span>
                  <h3 className="text-headline-sm font-headline-sm text-primary">{pillar.title}</h3>
                </div>
                <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </div>
              <div className="pt-unit-base mt-unit-base border-t border-outline-variant flex items-center justify-between text-label-mono-sm font-label-mono-sm text-outline">
                <span>{pillar.footer}</span>
                <span className="material-symbols-outlined text-[16px]">{pillar.footerIcon}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Philosophy */}
      <section>
        <div className="bg-primary-container text-inverse-on-surface rounded-2xl border border-on-surface-variant p-unit-xl md:p-unit-2xl shadow-sm">
          <div className="max-w-2xl mb-unit-2xl">
            <div className="flex items-center gap-unit-xs mb-unit-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary-container"></span>
              <span className="font-label-mono-sm text-label-mono-sm text-inverse-primary uppercase tracking-wider">Product Philosophy</span>
            </div>
            <h2 className="text-headline-lg font-headline-lg text-on-secondary mb-unit-sm">Built for Progress</h2>
            <p className="text-body-md font-body-md text-inverse-primary leading-relaxed">
              Most typing platforms treat words like games. We build an instrument for deep craft. Every design decision protects attention and kinetic rhythm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-unit-xl border-t border-on-surface-variant/40 pt-unit-xl">
            {/* Tenet 1 */}
            <div className="space-y-unit-sm">
              <div className="flex items-center gap-unit-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest/10 border border-inverse-primary/20 flex items-center justify-center text-inverse-primary">
                  <span className="material-symbols-outlined text-[18px]">block</span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-on-secondary">1. Zero Bloat</h3>
              </div>
              <p className="text-body-sm font-body-sm text-inverse-primary leading-relaxed">
                No invasive ads, zero tracking scripts, pure mechanical feel. Your browser renders nothing between your keystroke and the display pipeline.
              </p>
            </div>

            {/* Tenet 2 */}
            <div className="space-y-unit-sm">
              <div className="flex items-center gap-unit-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest/10 border border-inverse-primary/20 flex items-center justify-center text-inverse-primary">
                  <span className="material-symbols-outlined text-[18px]">keyboard</span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-on-secondary">2. Instant Keyboard First</h3>
              </div>
              <p className="text-body-sm font-body-sm text-inverse-primary leading-relaxed">
                Everything navigable via <kbd className="px-1.5 py-0.5 rounded bg-inverse-surface text-inverse-on-surface border border-outline-variant font-label-mono-sm text-[10px]">Tab</kbd>, <kbd className="px-1.5 py-0.5 rounded bg-inverse-surface text-inverse-on-surface border border-outline-variant font-label-mono-sm text-[10px]">Esc</kbd>, and <kbd className="px-1.5 py-0.5 rounded bg-inverse-surface text-inverse-on-surface border border-outline-variant font-label-mono-sm text-[10px]">Enter</kbd> shortcuts. Never touch the mouse during training.
              </p>
            </div>

            {/* Tenet 3 */}
            <div className="space-y-unit-sm">
              <div className="flex items-center gap-unit-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container-highest/10 border border-inverse-primary/20 flex items-center justify-center text-inverse-primary">
                  <span className="material-symbols-outlined text-[18px]">dataset</span>
                </div>
                <h3 className="text-headline-sm font-headline-sm text-on-secondary">3. Open Telemetry</h3>
              </div>
              <p className="text-body-sm font-body-sm text-inverse-primary leading-relaxed">
                Your data belongs to you — export anytime in JSON/CSV. Analyze historical trendlines in external data science notebooks without lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Spec Strip */}
      <section>
        <div className="border border-outline-variant rounded-xl bg-surface-container-lowest px-unit-lg py-unit-md flex flex-wrap items-center justify-center md:justify-between gap-unit-sm text-on-surface-variant font-label-mono-sm text-label-mono-sm">
          <div className="flex items-center gap-unit-xs">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>ENGINEERING SPECIFICATIONS</span>
          </div>
          <div className="text-center font-medium text-on-surface">
            Sub-1ms DOM response <span className="mx-2 text-outline-variant">•</span> Powered by modern browser Web APIs <span className="mx-2 text-outline-variant">•</span> 100% accessible keyboard navigation
          </div>
          <div className="flex items-center gap-unit-xs text-outline">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>v2.4.0</span>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-unit-3xl">
        <div className="bg-surface-container rounded-2xl border border-outline-variant p-unit-xl md:p-unit-2xl flex flex-col md:flex-row items-center justify-between gap-unit-xl">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-headline-lg font-headline-lg text-primary mb-unit-xs">Ready to elevate your typing speed?</h3>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Start practicing instantly with no account required. Uncluttered mechanics await your fingers.
            </p>
          </div>
          <Link to="/">
            <Button icon={<span className="material-symbols-outlined text-[18px]">keyboard_double_arrow_right</span>}>
              Start Typing
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default About;
