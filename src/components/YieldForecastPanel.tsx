import { useEffect, useMemo, useState } from 'react';
import {
  ComposedChart,
  Bar,
  Cell,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Loader2,
  ShieldAlert,
  CheckCircle2,
  Truck,
  X,
  Wheat,
  Clock,
} from 'lucide-react';
import {
  FieldParcel,
  SEASON_DATES,
  computeYieldForecast,
  getFieldSoilMoisture30Days,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface YieldForecastPanelProps {
  estateName: string;
  field: FieldParcel;
  activeDateIndex: number;
  onChangeDateIndex: (idx: number) => void;
  lang: Lang;
  onClose: () => void;
}

interface GeminiYieldForecastResponse {
  executiveForecast: string;
  yieldRiskDrivers: string[];
  preHarvestActions: string[];
  harvestLogisticsNote: string;
}

function formatIdrCompact(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(2)} M`;
  }
  return `Rp ${Math.round(amount / 1_000_000).toLocaleString('id-ID')} jt`;
}

export function YieldForecastPanel({
  estateName,
  field,
  activeDateIndex,
  onChangeDateIndex,
  lang,
  onClose,
}: YieldForecastPanelProps) {
  const t = TRANSLATIONS[lang].workspace.yieldForecast;
  const activeSnap = field.snapshots[activeDateIndex] ?? field.snapshots[0];

  const report = useMemo(
    () => computeYieldForecast(field, activeDateIndex),
    [field, activeDateIndex]
  );
  const moisture = useMemo(
    () => getFieldSoilMoisture30Days(field, activeDateIndex),
    [field, activeDateIndex]
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<GeminiYieldForecastResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setAiResult(null);
    setAiError(null);
  }, [field.id, activeDateIndex, lang]);

  const handleRunGeminiForecast = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      const response = await fetch('/api/yield-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          payload: {
            estateName,
            fieldName: field.name[lang],
            crop: field.crop[lang],
            variety: field.variety,
            areaHa: field.areaHa,
            date: activeSnap.date,
            growthStage: activeSnap.growthStage[lang],
            meanNdvi: activeSnap.meanNdvi,
            biomassIndex: activeSnap.biomassIndex,
            moisturePct: moisture.currentSurfacePct,
            moistureStatus: moisture.status,
            forecastYieldTHa: report.forecastYieldTHa,
            forecastTotalTons: report.forecastTotalTons,
            forecastLowTons: report.forecastLowTons,
            forecastHighTons: report.forecastHighTons,
            histAvgTHa: report.histAvgTHa,
            deltaVsHistoryPct: report.deltaVsHistoryPct,
            confidencePct: report.confidencePct,
            daysToHarvest: report.daysToHarvest,
          },
        }),
      });

      const data = (await response.json()) as GeminiYieldForecastResponse & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      setAiResult({
        executiveForecast: data.executiveForecast,
        yieldRiskDrivers: data.yieldRiskDrivers,
        preHarvestActions: data.preHarvestActions,
        harvestLogisticsNote: data.harvestLogisticsNote,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      setAiError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Header Strip */}
      <div className="bg-[#10271E] border border-[#1E3F31] rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E3F31]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t.eyebrow}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#94B0A3]">
                {field.name[lang]} ({field.variety})
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              {t.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#9CB5A8] mt-1 max-w-3xl">{t.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRunGeminiForecast}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] disabled:opacity-60 disabled:cursor-wait rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isGenerating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isGenerating ? t.runningAiButton : t.runAiButton}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#17382B] hover:bg-[#1E4737] border border-[#2A5945] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.closeButton}</span>
            </button>
          </div>
        </div>

        {/* Pass Scrubber Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#9CB5A8]">
            <span>{t.passSelectorLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#86EFAC] tabular-nums">
              NDVI {activeSnap.meanNdvi.toFixed(2)} ({t.ndviWeightLabel}: ×
              {report.ndviMultiplier.toFixed(2)})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1 p-1 bg-[#0A1B14] border border-[#1B382B] rounded-lg">
            {SEASON_DATES.map((dateStr, idx) => {
              const active = idx === activeDateIndex;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => onChangeDateIndex(idx)}
                  className={`px-2.5 py-1 text-xs font-mono tabular-nums rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#0D9F58] text-white font-semibold'
                      : 'text-[#9CB5A8] hover:text-white hover:bg-[#163327]'
                  }`}
                >
                  {dateStr}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
          <div className="text-xs text-[#83A193]">{t.kpis.forecastVolume}</div>
          <div className="font-mono text-2xl font-bold text-[#34D399] tabular-nums mt-1">
            {report.forecastTotalTons.toLocaleString('id-ID')}{' '}
            <span className="text-sm font-normal text-[#9CB5A8]">ton</span>
          </div>
          <div className="text-[11px] font-mono text-[#9CB5A8] tabular-nums mt-1">
            {t.kpis.confidenceBand}: {report.forecastLowTons}–{report.forecastHighTons} t (
            {report.confidencePct}%)
          </div>
        </div>

        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
          <div className="text-xs text-[#83A193]">{t.kpis.yieldRate}</div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums mt-1">
            {report.forecastYieldTHa.toFixed(2)}{' '}
            <span className="text-sm font-normal text-[#9CB5A8]">t/ha</span>
          </div>
          <div
            className={`text-[11px] font-mono tabular-nums mt-1 ${
              report.deltaVsHistoryPct >= 0 ? 'text-[#34D399]' : 'text-[#FDE68A]'
            }`}
          >
            {report.deltaVsHistoryPct >= 0 ? '+' : ''}
            {report.deltaVsHistoryPct.toFixed(1)}% {t.kpis.vs4YrAvg} ({report.histAvgTHa} t/ha)
          </div>
        </div>

        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
          <div className="text-xs text-[#83A193]">{t.kpis.daysToHarvest}</div>
          <div className="font-mono text-2xl font-bold text-white tabular-nums mt-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#38BDF8] shrink-0" />
            <span>
              {report.daysToHarvest === 0
                ? t.kpis.readyNow
                : `${report.daysToHarvest} ${t.kpis.daysUnit}`}
            </span>
          </div>
          <div className="text-[11px] text-[#9CB5A8] mt-1">
            {activeSnap.growthStage[lang]}
          </div>
        </div>

        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
          <div className="text-xs text-[#83A193]">{t.kpis.grossValue}</div>
          <div className="font-mono text-2xl font-bold text-[#FDE68A] tabular-nums mt-1">
            {formatIdrCompact(report.estimatedGrossIdr)}
          </div>
          <div className="text-[11px] font-mono text-[#9CB5A8] tabular-nums mt-1">
            Rp {report.pricePerKgIdr.toLocaleString('id-ID')}/kg · {field.areaHa.toFixed(1)} ha
          </div>
        </div>
      </div>

      {/* Main Split: Historical vs 2026 Forecast ComposedChart & Zone Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7 bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Wheat className="w-4 h-4 text-[#10B981]" />
                <span>{t.chartTitle}</span>
              </h4>
              <p className="text-xs text-[#94B0A3] mt-0.5">{t.chartSubtitle}</p>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#C8DBD2]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                {t.yieldSeriesLabel}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
                {t.ndviSeriesLabel}
              </span>
            </div>
          </div>

          <div className="h-[250px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={report.yearlySeries}
                margin={{ top: 10, right: 10, left: -12, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#183629" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#D1E3DA', fontSize: 11 }}
                  axisLine={{ stroke: '#1E3F31' }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="yield"
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="ndvi"
                  orientation="right"
                  domain={[0, 1]}
                  tick={{ fill: '#38BDF8', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#06130E',
                    borderColor: '#244E3D',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F1F5F2',
                  }}
                />
                <Bar
                  yAxisId="yield"
                  dataKey="yieldTHa"
                  name={t.yieldSeriesLabel}
                  radius={[5, 5, 0, 0]}
                  barSize={32}
                >
                  {report.yearlySeries.map((pt) => (
                    <Cell
                      key={pt.year}
                      fill={pt.isForecast ? '#10B981' : '#2C6E54'}
                    />
                  ))}
                </Bar>
                <Line
                  yAxisId="ndvi"
                  type="monotone"
                  dataKey="meanPeakNdvi"
                  name={t.ndviSeriesLabel}
                  stroke="#38BDF8"
                  strokeWidth={2.4}
                  dot={{ r: 3.5, fill: '#38BDF8' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Management Zone Harvest Breakdown */}
        <div className="xl:col-span-5 bg-[#0B2219] border border-[#1E3F31] rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#1E3F31]">
            <h4 className="text-sm font-semibold text-white">{t.zoneTableTitle}</h4>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E3F31] bg-[#081912] text-xs text-[#9CB5A8]">
                  <th className="py-2.5 px-4 font-medium">{t.zoneCol}</th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.areaCol}</th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.rateCol}</th>
                  <th className="py-2.5 px-4 font-medium text-right">{t.volumeCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173428] text-xs">
                {report.zoneBreakdown.map((z) => (
                  <tr key={z.zoneId} className="hover:bg-[#0F2A1F]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-white">{z.label[lang]}</div>
                      <div className="text-[11px] font-mono text-[#83A193] tabular-nums mt-0.5">
                        {z.sharePct}%
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-[#C8DBD2] whitespace-nowrap">
                      {z.areaHa.toFixed(1)} ha
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-nums text-white whitespace-nowrap">
                      {z.projectedTHa.toFixed(2)} t/ha
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-[#34D399] whitespace-nowrap">
                      {z.projectedTons.toLocaleString('id-ID')} t
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Live Gemini Harvest Forecast Intelligence */}
      <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
          <Sparkles className="w-4 h-4 text-[#34D399]" />
          <span>{t.aiPanelTitle}</span>
        </div>

        {aiError && (
          <div className="flex items-start gap-2.5 text-xs text-[#FCA5A5] bg-[#2D1418] border border-[#6E2931] rounded-lg px-3.5 py-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>{t.aiErrorPrefix}</strong> {aiError}
            </span>
          </div>
        )}

        {!aiResult && !aiError && !isGenerating && (
          <p className="text-xs sm:text-sm text-[#9CB5A8] leading-relaxed">
            {t.aiEmptyHint}
          </p>
        )}

        {isGenerating && (
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#86EFAC] py-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.runningAiButton}</span>
          </div>
        )}

        {aiResult && !isGenerating && (
          <div className="space-y-4">
            <p className="text-sm text-white leading-relaxed">{aiResult.executiveForecast}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34D399] mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t.aiDriversLabel}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#D5E6DD]">
                  {aiResult.yieldRiskDrivers.map((d, idx) => (
                    <li key={idx} className="leading-snug flex items-start gap-1.5">
                      <span className="font-mono text-[#34D399] tabular-nums">{idx + 1}.</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.aiActionsLabel}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#D5E6DD]">
                  {aiResult.preHarvestActions.map((act, idx) => (
                    <li key={idx} className="leading-snug flex items-start gap-1.5">
                      <span className="font-mono text-[#FDE68A] tabular-nums">{idx + 1}.</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] mb-2">
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t.aiLogisticsLabel}</span>
                </div>
                <p className="text-xs text-[#D5E6DD] leading-relaxed">
                  {aiResult.harvestLogisticsNote}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
