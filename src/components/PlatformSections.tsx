import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sprout, Tractor } from 'lucide-react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

const HERO_IMG = '/src/assets/images/hero_precision_farm_1795541556320.jpg';
const SCOUTING_IMG = '/src/assets/images/scouting_agronomist_1795541557476.jpg';
const MACHINERY_IMG = '/src/assets/images/machinery_sprayer_1795541557853.jpg';

interface HeroProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  onLaunchMap: () => void;
}

export function HeroSection({ lang, onChangeLang, onLaunchMap }: HeroProps) {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const t = TRANSLATIONS[lang];

  return (
    <section className="pt-10 pb-16 lg:pt-14 lg:pb-20 bg-[#F8FAF8]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Narrative Column */}
          <div className="lg:col-span-6 flex flex-col justify-between py-2">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div className="flex items-center gap-2 text-xs font-medium text-[#475950]">
                  <span>{t.hero.kickerLeft}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.hero.kickerRight}</span>
                </div>

                {/* Bilingual Switcher (ID / EN) */}
                <div
                  role="group"
                  aria-label="Language Selector"
                  className="inline-flex items-center gap-0.5 p-0.5 bg-[#E9EFEA] border border-[#D4DFD8] rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() => onChangeLang('id')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      lang === 'id'
                        ? 'bg-white text-[#0F1F18] shadow-xs'
                        : 'text-[#475950] hover:text-[#0F1F18]'
                    }`}
                  >
                    ID
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeLang('en')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      lang === 'en'
                        ? 'bg-white text-[#0F1F18] shadow-xs'
                        : 'text-[#475950] hover:text-[#0F1F18]'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-[#0F1F18] max-w-2xl"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.65rem)',
                  lineHeight: 1.08,
                  textWrap: 'balance',
                }}
              >
                {t.hero.headline}
              </h1>

              <p className="mt-6 text-base sm:text-lg text-[#475950] leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={onLaunchMap}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#0D9F58] hover:bg-[#0A7D45] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9F58]"
                >
                  <span>{t.hero.ctaPrimary}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#request-demo"
                  className="text-sm font-semibold text-[#0F1F18] hover:text-[#0D9F58] underline underline-offset-4 decoration-[#C8D5CE] hover:decoration-[#0D9F58] transition-colors whitespace-nowrap shrink-0"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-[#E2E8E4] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#596D63]">
              <span>{t.hero.highlight1}</span>
              <span aria-hidden="true">·</span>
              <span>{t.hero.highlight2}</span>
              <span aria-hidden="true">·</span>
              <span>{t.hero.highlight3}</span>
            </div>
          </div>

          {/* Right Visual Carrier */}
          <div className="lg:col-span-6">
            <div className="relative w-full h-full min-h-[320px] lg:min-h-[440px] rounded-xl overflow-hidden border border-[#DCE5DF] bg-[#0B1F17]">
              {!heroImgFailed ? (
                <img
                  src={HERO_IMG}
                  alt="Aerial orthophoto of Indonesian agricultural blocks and crop fields"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgFailed(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0F2A1F] to-[#174030] text-[#C8DBD2] p-8">
                  <Sprout className="w-10 h-10 text-[#10B981] mb-3" />
                  <span className="font-display text-sm font-semibold">
                    {t.hero.captionFallback}
                  </span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07150F]/85 via-[#07150F]/45 to-transparent pointer-events-none"
              />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
                <div>
                  <div className="text-xs font-mono text-[#A7F3D0] tabular-nums">
                    6.4182° S, 107.7614° E · Subang, Jawa Barat
                  </div>
                  <div className="font-display text-sm font-semibold mt-0.5">
                    {t.hero.captionTitle}
                  </div>
                </div>
                <div className="font-mono text-xs tabular-nums text-[#E2EFE8]">
                  {t.hero.meanNdviLabel} 0.85
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Quantified Proof Strip */}
        <div className="mt-14 pt-8 border-t border-[#E2E8E4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.proofMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="font-display text-3xl font-bold tracking-tight text-[#0F1F18] tabular-nums">
                {metric.value}
              </div>
              <div className="mt-1 text-sm font-semibold text-[#0F1F18]">
                {metric.label}
              </div>
              <p className="mt-1 text-xs text-[#596D63] leading-relaxed">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CapabilitiesSection({ lang }: { lang: Lang }) {
  const [scoutImgFailed, setScoutImgFailed] = useState(false);
  const [machineryImgFailed, setMachineryImgFailed] = useState(false);
  const t = TRANSLATIONS[lang].capabilities;

  return (
    <section id="capabilities" className="py-20 bg-[#F8FAF8]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="max-w-2xl">
          <div className="text-xs font-medium text-[#0D9F58] mb-2">
            {t.eyebrow}
          </div>
          <h2
            className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F18]"
            style={{ textWrap: 'balance' }}
          >
            {t.title}
          </h2>
          <p className="mt-4 text-base text-[#475950] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 01. Marquee Capability */}
          <article className="lg:col-span-2 bg-white border border-[#E2E8E4] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs text-[#596D63]">
                <span>{t.cards.card1Tag}</span>
                <span className="font-mono tabular-nums">{t.cards.card1Metric}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F1F18] mt-3">
                {t.cards.card1Title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#475950] leading-relaxed max-w-2xl">
                {t.cards.card1Body}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E2E8E4]">
              {t.cards.card1Stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-lg font-semibold text-[#0F1F18] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#596D63] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </article>

          {/* 02. Agronomist Photo Card */}
          <article className="lg:col-span-1 bg-white border border-[#E2E8E4] rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-4/3 bg-[#E9EFEA] overflow-hidden">
              {!scoutImgFailed ? (
                <img
                  src={SCOUTING_IMG}
                  alt="Field agronomist inspecting crops with rugged field tablet"
                  referrerPolicy="no-referrer"
                  onError={() => setScoutImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#475950]">
                  <Sprout className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#596D63]">{t.cards.card2Tag}</div>
                <h3 className="font-display text-lg font-bold text-[#0F1F18] mt-2">
                  {t.cards.card2Title}
                </h3>
                <p className="mt-2 text-sm text-[#475950] leading-relaxed">
                  {t.cards.card2Body}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E2E8E4] text-xs font-mono text-[#596D63]">
                {t.cards.card2Foot}
              </div>
            </div>
          </article>

          {/* 03. Precision Machinery Photo Card */}
          <article className="lg:col-span-1 bg-white border border-[#E2E8E4] rounded-xl overflow-hidden flex flex-col">
            <div className="aspect-4/3 bg-[#E9EFEA] overflow-hidden">
              {!machineryImgFailed ? (
                <img
                  src={MACHINERY_IMG}
                  alt="Precision agricultural tractor with variable-rate spreader in green crop field"
                  referrerPolicy="no-referrer"
                  onError={() => setMachineryImgFailed(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#475950]">
                  <Tractor className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#596D63]">{t.cards.card3Tag}</div>
                <h3 className="font-display text-lg font-bold text-[#0F1F18] mt-2">
                  {t.cards.card3Title}
                </h3>
                <p className="mt-2 text-sm text-[#475950] leading-relaxed">
                  {t.cards.card3Body}
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-[#E2E8E4] text-xs font-mono text-[#596D63]">
                {t.cards.card3Foot}
              </div>
            </div>
          </article>

          {/* 04. Productivity Zones & Yield Trials */}
          <article className="lg:col-span-2 bg-white border border-[#E2E8E4] rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 text-xs text-[#596D63]">
                <span>{t.cards.card4Tag}</span>
                <span className="font-mono tabular-nums">{t.cards.card4Metric}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0F1F18] mt-3">
                {t.cards.card4Title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-[#475950] leading-relaxed max-w-2xl">
                {t.cards.card4Body}
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E2E8E4]">
              {t.cards.card4Stats.map((stat) => (
                <div key={stat.label}>
                  <div className="font-mono text-lg font-semibold text-[#0F1F18] tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#596D63] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

export function OutcomesSection({ lang }: { lang: Lang }) {
  const t = TRANSLATIONS[lang].outcomes;

  return (
    <section id="outcomes" className="py-20 bg-[#F1F5F2] border-y border-[#E2E8E4]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-[#0D9F58] mb-2">
              {t.eyebrow}
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F18]"
              style={{ textWrap: 'balance' }}
            >
              {t.title}
            </h2>
          </div>
          <a
            href="#interactive-platform"
            className="text-sm font-semibold text-[#0F1F18] hover:text-[#0D9F58] underline underline-offset-4 decoration-[#C8D5CE] whitespace-nowrap shrink-0"
          >
            {t.ctaLink}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {t.studies.map((study) => (
            <article
              key={study.organization}
              className="bg-white border border-[#DCE5DF] rounded-xl p-7 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#596D63]">
                  <span className="font-semibold text-[#0F1F18]">{study.organization}</span>
                  <span aria-hidden="true">·</span>
                  <span>{study.region}</span>
                </div>

                <div className="mt-4 font-display text-2xl font-bold text-[#0D9F58] tabular-nums">
                  {study.outcome}
                </div>

                <p className="mt-3 text-sm sm:text-base text-[#475950] leading-relaxed">
                  {study.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E2E8E4] text-xs font-medium text-[#0F1F18]">
                {study.person}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

interface PricingSectionProps {
  lang: Lang;
  onSelectPlan: (planName: string) => void;
}

export function PricingSection({ lang, onSelectPlan }: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const t = TRANSLATIONS[lang].pricing;

  return (
    <section id="pricing" className="py-20 bg-[#F8FAF8]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <div className="text-xs font-medium text-[#0D9F58] mb-2">
              {t.eyebrow}
            </div>
            <h2
              className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0F1F18]"
              style={{ textWrap: 'balance' }}
            >
              {t.title}
            </h2>
          </div>

          <div
            role="group"
            aria-label="Billing Cycle"
            className="inline-flex items-center gap-1 p-1 bg-[#E9EFEA] border border-[#DCE5DF] rounded-lg self-start"
          >
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-white text-[#0F1F18] shadow-xs'
                  : 'text-[#475950] hover:text-[#0F1F18]'
              }`}
            >
              {t.annualToggle}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-[#0F1F18] shadow-xs'
                  : 'text-[#475950] hover:text-[#0F1F18]'
              }`}
            >
              {t.monthlyToggle}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {t.tiers.map((tier) => {
            const displayPrice =
              billingCycle === 'annual' ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.id}
                className={`rounded-xl p-7 flex flex-col justify-between border ${
                  tier.featured
                    ? 'bg-[#0B1F17] text-white border-[#0D9F58]'
                    : 'bg-white text-[#0F1F18] border-[#E2E8E4]'
                }`}
              >
                <div>
                  <h3 className="font-display text-xl font-bold">{tier.name}</h3>
                  <p
                    className={`mt-1.5 text-xs leading-relaxed ${
                      tier.featured ? 'text-[#B2C7BD]' : 'text-[#596D63]'
                    }`}
                  >
                    {tier.audience}
                  </p>

                  <div className="mt-6 pb-6 border-b border-current/10 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-bold tracking-tight tabular-nums">
                      {displayPrice}
                    </span>
                    <span
                      className={`text-xs ${
                        tier.featured ? 'text-[#A7F3D0]' : 'text-[#596D63]'
                      }`}
                    >
                      {tier.cadenceNote}
                    </span>
                  </div>

                  <dl className="mt-6 flex flex-col gap-3.5">
                    {tier.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-baseline justify-between gap-4 text-xs"
                      >
                        <dt
                          className={
                            tier.featured ? 'text-[#C8DBD2]' : 'text-[#475950]'
                          }
                        >
                          {spec.label}
                        </dt>
                        <dd
                          className={`font-mono font-medium tabular-nums text-right shrink-0 ${
                            tier.featured ? 'text-white' : 'text-[#0F1F18]'
                          }`}
                        >
                          {spec.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(tier.name)}
                  className={`mt-8 w-full py-2.5 px-4 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                    tier.featured
                      ? 'bg-[#0D9F58] hover:bg-[#10B981] text-white'
                      : 'bg-[#0F1F18] hover:bg-[#0D9F58] text-white'
                  }`}
                >
                  {tier.ctaLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface DemoFormProps {
  lang: Lang;
  selectedPlan: string;
}

export function DemoRequestSection({ lang, selectedPlan }: DemoFormProps) {
  const t = TRANSLATIONS[lang].demo;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [hectares, setHectares] = useState('');
  const [workflow, setWorkflow] = useState(selectedPlan || 'Precision Pro');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (selectedPlan) {
      setWorkflow(selectedPlan);
    }
  }, [selectedPlan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!fullName.trim()) {
      setErrorMsg(t.errors.name);
      return;
    }
    if (!emailValid) {
      setErrorMsg(t.errors.email);
      return;
    }
    if (!hectares.trim() || Number(hectares) <= 0) {
      setErrorMsg(t.errors.hectares);
      return;
    }

    setErrorMsg(null);
    setSubmitted(true);
  };

  return (
    <section id="request-demo" className="py-20 bg-[#F1F5F2] border-t border-[#E2E8E4]">
      <div className="max-w-[1240px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <div className="text-xs font-medium text-[#0D9F58] mb-2">
              {t.eyebrow}
            </div>
            <h2
              className="font-display text-3xl font-bold tracking-tight text-[#0F1F18]"
              style={{ textWrap: 'balance' }}
            >
              {t.title}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#475950] leading-relaxed">
              {t.subtitle}
            </p>

            <div className="mt-8 pt-6 border-t border-[#DCE5DF] flex flex-col gap-3 text-xs text-[#475950]">
              <div>{t.coverage}</div>
              <div>{t.formats}</div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#DCE5DF] rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 flex flex-col items-start gap-3">
                <CheckCircle2 className="w-8 h-8 text-[#0D9F58]" />
                <h3 className="font-display text-xl font-bold text-[#0F1F18]">
                  {t.receivedTitle} {fullName}
                </h3>
                <p className="text-sm text-[#475950] leading-relaxed">
                  {t.receivedBodyPrefix} <span className="font-semibold">{workflow}</span> (
                  <span className="font-mono tabular-nums">{hectares} ha</span>){' '}
                  {t.receivedBodyMid} <span className="font-semibold">{email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setHectares('');
                  }}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-[#0F1F18] border border-[#DCE5DF] hover:border-[#0D9F58] rounded-lg cursor-pointer"
                >
                  {t.submitAnother}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              >
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="demo-name" className="text-xs font-semibold text-[#0F1F18]">
                    {t.fullNameLabel}
                  </label>
                  <input
                    id="demo-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className="px-3.5 py-2.5 text-sm bg-[#F8FAF8] border border-[#D4DFD8] rounded-lg text-[#0F1F18] focus:outline-none focus:border-[#0D9F58]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="demo-email" className="text-xs font-semibold text-[#0F1F18]">
                    {t.emailLabel}
                  </label>
                  <input
                    id="demo-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="px-3.5 py-2.5 text-sm bg-[#F8FAF8] border border-[#D4DFD8] rounded-lg text-[#0F1F18] focus:outline-none focus:border-[#0D9F58]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="demo-hectares" className="text-xs font-semibold text-[#0F1F18]">
                    {t.hectaresLabel}
                  </label>
                  <input
                    id="demo-hectares"
                    type="number"
                    min={1}
                    required
                    value={hectares}
                    onChange={(e) => setHectares(e.target.value)}
                    placeholder="1250"
                    className="px-3.5 py-2.5 text-sm font-mono tabular-nums bg-[#F8FAF8] border border-[#D4DFD8] rounded-lg text-[#0F1F18] focus:outline-none focus:border-[#0D9F58]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="demo-plan" className="text-xs font-semibold text-[#0F1F18]">
                    {t.planLabel}
                  </label>
                  <select
                    id="demo-plan"
                    value={workflow}
                    onChange={(e) => setWorkflow(e.target.value)}
                    className="px-3.5 py-2.5 text-sm bg-[#F8FAF8] border border-[#D4DFD8] rounded-lg text-[#0F1F18] focus:outline-none focus:border-[#0D9F58]"
                  >
                    {t.planOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="sm:col-span-2 text-xs font-medium text-[#B91C1C] bg-[#FEF2F2] border border-[#FECACA] rounded-lg px-3.5 py-2.5"
                  >
                    {errorMsg}
                  </div>
                )}

                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-4 pt-2">
                  <span className="text-xs text-[#596D63]">{t.noteFooter}</span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-[#0D9F58] hover:bg-[#0A7D45] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {t.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FooterProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
}

export function FooterSection({ lang, onChangeLang }: FooterProps) {
  const t = TRANSLATIONS[lang].footer;

  return (
    <footer className="bg-[#0B1F17] text-[#C8DBD2] py-12 border-t border-[#1A382B]">
      <div className="max-w-[1240px] mx-auto px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="font-display text-lg font-bold text-white">AgriOS</div>
          <p className="mt-1 text-xs text-[#83A193]">{t.tagline}</p>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="flex flex-wrap items-center gap-6 text-xs text-[#B2C7BD]"
        >
          <a href="#interactive-platform" className="hover:text-white transition-colors">
            {t.interactiveMap}
          </a>
          <a href="#capabilities" className="hover:text-white transition-colors">
            {t.capabilities}
          </a>
          <a href="#outcomes" className="hover:text-white transition-colors">
            {t.outcomes}
          </a>
          <a href="#pricing" className="hover:text-white transition-colors">
            {t.pricing}
          </a>
          <a href="#request-demo" className="hover:text-white transition-colors">
            {t.requestDemo}
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <div
            role="group"
            aria-label="Footer Language Switch"
            className="inline-flex items-center gap-0.5 p-0.5 bg-[#10271E] border border-[#1E3F31] rounded-md"
          >
            <button
              type="button"
              onClick={() => onChangeLang('id')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer ${
                lang === 'id' ? 'bg-[#0D9F58] text-white' : 'text-[#94B0A3] hover:text-white'
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer ${
                lang === 'en' ? 'bg-[#0D9F58] text-white' : 'text-[#94B0A3] hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
          <div className="text-xs text-[#83A193]">
            © {new Date().getFullYear()} {t.copyright}
          </div>
        </div>
      </div>
    </footer>
  );
}
