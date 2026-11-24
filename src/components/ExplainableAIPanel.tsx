import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Loader2,
  GitBranch,
  Lightbulb,
  Eye,
} from 'lucide-react';
import {
  FieldParcel,
  computeExplainableAiBreakdown,
  getFieldSoilMoisture30Days,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface ExplainableAIPanelProps {
  estateName: string;
  field: FieldParcel;
  lang: Lang;
  activeDateIndex: number;
  vraSavingsPct: number;
}

interface GeminiXaiAuditResult {
  summary: string;
  keyDrivers: string[];
  counterfactualAction: string;
  uncertaintyNote: string;
}

export default function ExplainableAIPanel({
  estateName,
  field,
  lang,
  activeDateIndex,
  vraSavingsPct,
}: ExplainableAIPanelProps) {
  const t = TRANSLATIONS[lang].workspace.explainableAi;
  const snap = field.snapshots[activeDateIndex] ?? field.snapshots[0];
  const moisture = useMemo(
    () => getFieldSoilMoisture30Days(field, activeDateIndex),
    [field, activeDateIndex]
  );

  const breakdown = useMemo(
    () => computeExplainableAiBreakdown(field, activeDateIndex, vraSavingsPct),
    [field, activeDateIndex, vraSavingsPct]
  );

  const chartData = useMemo(
    () =>
      breakdown.contributions.map((item) => ({
        id: item.id,
        name: item.label[lang],
        impact: item.impactPct,
        observedValue: item.observedValue,
        rationale: item.rationale[lang],
      })),
    [breakdown.contributions, lang]
  );

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<GeminiXaiAuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Clear stale audit results whenever parcel, satellite pass, or language changes
  useEffect(() => {
    setAuditResult(null);
    setAuditError(null);
  }, [field.id, activeDateIndex, lang]);

  const handleRunGeminiAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);

    try {
      const response = await fetch('/api/explain-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          telemetry: {
            estateName,
            fieldName: field.name[lang],
            crop: `${field.crop[lang]} (${field.variety})`,
            soilType: field.soilType[lang],
            date: snap.date,
            cloudCover: snap.cloudCover,
            meanNdvi: snap.meanNdvi,
            moisturePct: moisture.currentSurfacePct,
            moistureStatus: moisture.status,
            nitrogenKgHa: snap.nitrogenKgHa,
            phosphorusKgHa: snap.phosphorusKgHa,
            potassiumKgHa: snap.potassiumKgHa,
            windKmh: snap.windKmh,
            rainMm: snap.rainMm,
            sprayWindow: snap.sprayWindow,
            vraSavingsPct: Number(vraSavingsPct.toFixed(1)),
            decisionScore: breakdown.decisionScore,
            topContributors: breakdown.contributions.map((c) => ({
              label: c.label[lang],
              impactPct: c.impactPct,
            })),
          },
        }),
      });

      const payload = (await response.json()) as GeminiXaiAuditResult & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      setAuditResult({
        summary: payload.summary,
        keyDrivers: payload.keyDrivers,
        counterfactualAction: payload.counterfactualAction,
        uncertaintyNote: payload.uncertaintyNote,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      setAuditError(msg);
    } finally {
      setIsAuditing(false);
    }
  };

  const scoreTone =
    breakdown.decisionScore >= 75
      ? 'text-[#34D399]'
      : breakdown.decisionScore >= 52
      ? 'text-[#FDE68A]'
      : 'text-[#FCA5A5]';

  return (
    <div className="mt-5 bg-[#0B2219] border border-[#1E3F31] rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-[#1E3F31]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#34D399]">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>{t.eyebrow}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {t.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#9CB5A8] max-w-2xl">
            {t.subtitle}
          </p>
        </div>

        {/* Score, Confidence & Live Gemini Audit CTA */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="bg-[#0A1B14] border border-[#1B382B] rounded-xl px-3.5 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#83A193]">
              {t.decisionScoreLabel}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className={`font-mono text-xl font-bold tabular-nums ${scoreTone}`}>
                {breakdown.decisionScore}
              </span>
              <span className="font-mono text-xs text-[#6B8F7E] tabular-nums">/ 100</span>
              <span className="text-[11px] text-[#7D9B8D]">({t.baselineNote})</span>
            </div>
          </div>

          <div className="bg-[#0A1B14] border border-[#1B382B] rounded-xl px-3.5 py-2">
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#83A193]">
              {t.confidenceLabel}
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="font-mono text-xl font-bold text-white tabular-nums">
                {breakdown.confidencePct}%
              </span>
              <span className="text-[11px] text-[#7D9B8D] tabular-nums">
                {t.cloudCaveatLabel} {snap.cloudCover}%
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunGeminiAudit}
            disabled={isAuditing}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] disabled:opacity-60 disabled:cursor-wait rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAuditing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAuditing ? t.auditingButton : t.auditButton}</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid: Diverging Feature Attribution BarChart + Rule Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        {/* Left: SHAP-style Diverging Feature Attribution */}
        <div className="lg:col-span-7 bg-[#081912] border border-[#1B382B] rounded-xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C8DBD2]">
              {t.featureImpactTitle}
            </h4>
            <div className="flex items-center gap-4 text-[11px] text-[#9CB5A8]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                {t.positiveDriver}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" />
                {t.riskFactor}
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 24, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#183629" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[-20, 20]}
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={{ stroke: '#1E3F31' }}
                  tickLine={false}
                  tickFormatter={(v) => `${v > 0 ? `+${v}` : v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={136}
                  tick={{ fill: '#D1E3DA', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReferenceLine x={0} stroke="#4B7361" strokeWidth={1.5} />
                <Tooltip
                  cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0].payload as (typeof chartData)[number];
                    return (
                      <div className="bg-[#06130E] border border-[#244E3D] rounded-lg px-3 py-2.5 shadow-xl max-w-xs">
                        <div className="flex items-center justify-between gap-3 text-xs font-semibold text-white">
                          <span>{row.name}</span>
                          <span
                            className={`font-mono tabular-nums ${
                              row.impact >= 0 ? 'text-[#34D399]' : 'text-[#FBBF24]'
                            }`}
                          >
                            {row.impact > 0 ? `+${row.impact}` : row.impact} pts
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-[#86EFAC] mt-1 tabular-nums">
                          {row.observedValue}
                        </div>
                        <p className="text-[11px] text-[#B8CEC3] mt-1 leading-relaxed">
                          {row.rationale}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="impact" radius={[4, 4, 4, 4]} barSize={18}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.id}
                      fill={
                        entry.impact >= 0
                          ? '#10B981'
                          : entry.impact <= -10
                          ? '#EF4444'
                          : '#F59E0B'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Triggered Decision Rule Trace & Recommended Action */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-4 flex-1">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C8DBD2] mb-3">
              <GitBranch className="w-3.5 h-3.5 text-[#34D399]" />
              <span>{t.ruleTraceTitle}</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {breakdown.rules.map((rule) => {
                const Icon =
                  rule.triggered === 'positive'
                    ? CheckCircle2
                    : rule.triggered === 'caution'
                    ? AlertTriangle
                    : ShieldAlert;
                const iconColor =
                  rule.triggered === 'positive'
                    ? 'text-[#34D399]'
                    : rule.triggered === 'caution'
                    ? 'text-[#FBBF24]'
                    : 'text-[#F87171]';

                return (
                  <div
                    key={rule.id}
                    className="bg-[#0B2219] border border-[#1A382B] rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconColor}`} />
                      <div className="min-w-0">
                        <div className="font-mono text-[11px] text-[#83A193] tabular-nums">
                          {rule.condition}
                        </div>
                        <p className="text-xs text-[#E4EFE9] mt-0.5 leading-snug">
                          {rule.outcome[lang]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0D2B1F] border border-[#23523D] rounded-xl px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[#86EFAC]">
              {t.recommendedActionLabel}
            </div>
            <p className="text-xs sm:text-sm font-medium text-white mt-1 leading-snug">
              {breakdown.recommendedAction[lang]}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Live Gemini XAI Causal Audit Result */}
      <div className="mt-5 bg-[#081912] border border-[#1B382B] rounded-xl p-4 sm:p-5">
        {auditError && (
          <div className="flex items-start gap-2.5 text-xs text-[#FCA5A5] bg-[#2D1418] border border-[#6E2931] rounded-lg px-3.5 py-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>{t.errorPrefix}</strong> {auditError}
            </span>
          </div>
        )}

        {!auditResult && !auditError && !isAuditing && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#9CB5A8]">
            <div className="flex items-start sm:items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5 sm:mt-0" />
              <span>{t.auditEmptyHint}</span>
            </div>
            <span className="font-mono text-[11px] text-[#6E9281] tabular-nums shrink-0">
              {field.name[lang]} · {snap.shortDate}
            </span>
          </div>
        )}

        {isAuditing && (
          <div className="flex items-center gap-2.5 text-xs text-[#86EFAC] py-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.auditingButton}</span>
          </div>
        )}

        {auditResult && !isAuditing && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-white leading-relaxed">{auditResult.summary}</p>
              <span className="text-[11px] font-mono text-[#6E9281] shrink-0">
                {t.modelAttributionNote}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#0B2219] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#34D399] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.causalDriversLabel}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#D5E6DD]">
                  {auditResult.keyDrivers.map((driver, idx) => (
                    <li key={idx} className="leading-snug flex items-start gap-1.5">
                      <span className="text-[#34D399] font-mono tabular-nums">{idx + 1}.</span>
                      <span>{driver}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0B2219] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#FDE68A] mb-2">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{t.counterfactualLabel}</span>
                </div>
                <p className="text-xs text-[#E8F1EC] leading-relaxed">
                  {auditResult.counterfactualAction}
                </p>
              </div>

              <div className="bg-[#0B2219] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94B0A3] mb-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{t.uncertaintyLabel}</span>
                </div>
                <p className="text-xs text-[#B8CEC3] leading-relaxed">
                  {auditResult.uncertaintyNote}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
