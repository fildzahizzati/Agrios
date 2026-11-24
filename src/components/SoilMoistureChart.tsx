import { useMemo, useState } from 'react';
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AlertTriangle, CheckCircle2, Droplets } from 'lucide-react';
import {
  getFieldSoilMoisture30Days,
  type FieldParcel,
  type SoilMoisturePoint,
} from '../data/platformData';
import { TRANSLATIONS, type Lang } from '../data/i18n';

interface SoilMoistureChartProps {
  field: FieldParcel;
  lang: Lang;
  activeDateIndex: number;
}

interface MoistureTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number;
    color?: string;
    payload?: SoilMoisturePoint;
  }>;
  label?: string;
}

function MoistureTooltip({ active, payload, label }: MoistureTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[#081711] border border-[#244A3A] rounded-lg px-3 py-2.5 shadow-xl text-xs">
      <div className="font-mono font-semibold text-white mb-1.5 pb-1 border-b border-[#1E3F31]">
        {label}
      </div>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => {
          const isRain = entry.dataKey === 'rainfallMm';
          return (
            <div
              key={String(entry.dataKey)}
              className="flex items-center justify-between gap-4 font-mono tabular-nums"
            >
              <span className="flex items-center gap-1.5 text-[#C8DBD2]">
                <span
                  className="w-2 h-2 rounded-xs shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-semibold text-white">
                {entry.value} {isRain ? 'mm' : '%'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function SoilMoistureChart({
  field,
  lang,
  activeDateIndex,
}: SoilMoistureChartProps) {
  const t = TRANSLATIONS[lang].workspace.soilMoisture;
  const [visibleSeries, setVisibleSeries] = useState({
    surface: true,
    rootZone: true,
    rainfall: true,
  });

  const series = useMemo(
    () => getFieldSoilMoisture30Days(field, activeDateIndex),
    [field, activeDateIndex]
  );

  const activeSnap = field.snapshots[activeDateIndex] ?? field.snapshots[0];
  const firstDay = series.days[0];
  const lastDay = series.days[series.days.length - 1];

  // Keep at least one moisture curve active
  const toggleMoistureSeries = (key: 'surface' | 'rootZone') => {
    setVisibleSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.surface && !next.rootZone) {
        return prev;
      }
      return next;
    });
  };

  const toggleRainfall = () => {
    setVisibleSeries((prev) => ({ ...prev, rainfall: !prev.rainfall }));
  };

  const yDomainMax = Math.min(
    100,
    Math.ceil(Math.max(series.fieldCapacityPct + 12, series.max30dSurfacePct + 8) / 10) * 10
  );

  const deltaPrefix = series.delta30dPct > 0 ? '+' : '';

  return (
    <div
      aria-label={t.title}
      className="mt-5 bg-[#10271E] border border-[#1E3F31] rounded-xl p-5 sm:p-6"
    >
      {/* Header & Interactive Depth / Rainfall Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E3F31]">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#94B0A3]">
            <span className="font-semibold text-[#86EFAC]">{field.name[lang]}</span>
            <span aria-hidden="true">·</span>
            <span>{field.crop[lang]}</span>
            <span aria-hidden="true">·</span>
            <span>
              {t.soilProfile}: {field.soilType[lang]}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-1">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {t.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
              {series.status === 'Optimal' && (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  <span className="text-[#86EFAC]">{t.statusOptimal}</span>
                </>
              )}
              {series.status === 'Low Moisture' && (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span className="text-[#FDE68A]">{t.statusLow}</span>
                </>
              )}
              {series.status === 'Saturated' && (
                <>
                  <Droplets className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span className="text-[#7DD3FC]">{t.statusSaturated}</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#94B0A3] mt-0.5">{t.subtitle}</p>
        </div>

        {/* Interactive Series Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleMoistureSeries('surface')}
            aria-pressed={visibleSeries.surface}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.surface
                ? 'bg-[#0A1B14] border-[#38BDF8]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8]" />
            <span>{t.surfaceLabel}</span>
            <span className="font-mono font-semibold tabular-nums text-[#7DD3FC]">
              {series.currentSurfacePct}%
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleMoistureSeries('rootZone')}
            aria-pressed={visibleSeries.rootZone}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.rootZone
                ? 'bg-[#0A1B14] border-[#10B981]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
            <span>{t.rootZoneLabel}</span>
            <span className="font-mono font-semibold tabular-nums text-[#86EFAC]">
              {series.currentRootZonePct}%
            </span>
          </button>

          <button
            type="button"
            onClick={toggleRainfall}
            aria-pressed={visibleSeries.rainfall}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.rainfall
                ? 'bg-[#0A1B14] border-[#60A5FA]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#60A5FA]/70" />
            <span>{t.rainfallLabel}</span>
          </button>
        </div>
      </div>

      {/* Recharts 30-Day Soil Moisture Chart */}
      <div className="mt-4 w-full h-[265px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={series.days}
            margin={{ top: 16, right: 16, left: 0, bottom: 4 }}
          >
            <defs>
              <linearGradient id="moistureGradSurface" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="moistureGradRoot" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E3F31" vertical={false} />

            <XAxis
              dataKey="dateLabel"
              interval={4}
              stroke="#83A193"
              tick={{ fill: '#94B0A3', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#1E3F31' }}
              tickLine={false}
            />

            <YAxis
              yAxisId="moisture"
              domain={[0, yDomainMax]}
              stroke="#83A193"
              tick={{ fill: '#94B0A3', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={44}
              unit="%"
            />

            <YAxis
              yAxisId="rain"
              orientation="right"
              domain={[0, 32]}
              hide
            />

            <Tooltip content={<MoistureTooltip />} />

            {/* Agronomic Optimal Soil Moisture Band */}
            <ReferenceArea
              yAxisId="moisture"
              y1={series.stressThresholdPct}
              y2={series.fieldCapacityPct}
              fill="#10B981"
              fillOpacity={0.08}
            />

            <ReferenceLine
              yAxisId="moisture"
              y={series.fieldCapacityPct}
              stroke="#38BDF8"
              strokeDasharray="4 4"
              strokeOpacity={0.55}
              label={{
                value: `${t.fieldCapacity}: ${series.fieldCapacityPct}%`,
                position: 'insideTopRight',
                fill: '#7DD3FC',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />

            <ReferenceLine
              yAxisId="moisture"
              y={series.stressThresholdPct}
              stroke="#F59E0B"
              strokeDasharray="4 4"
              strokeOpacity={0.65}
              label={{
                value: `${t.stressThreshold}: ${series.stressThresholdPct}%`,
                position: 'insideBottomRight',
                fill: '#FDE68A',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />

            {visibleSeries.rainfall && (
              <Bar
                yAxisId="rain"
                dataKey="rainfallMm"
                name={t.rainfallLabel}
                fill="#60A5FA"
                fillOpacity={0.35}
                radius={[2, 2, 0, 0]}
                barSize={8}
              />
            )}

            {visibleSeries.rootZone && (
              <Area
                yAxisId="moisture"
                type="monotone"
                dataKey="rootZoneMoisturePct"
                name={t.rootZoneLabel}
                stroke="#10B981"
                strokeWidth={2.2}
                fill="url(#moistureGradRoot)"
                activeDot={{ r: 5, fill: '#10B981', stroke: '#0B1F17', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.surface && (
              <Area
                yAxisId="moisture"
                type="monotone"
                dataKey="surfaceMoisturePct"
                name={t.surfaceLabel}
                stroke="#38BDF8"
                strokeWidth={2.4}
                fill="url(#moistureGradSurface)"
                activeDot={{ r: 5, fill: '#38BDF8', stroke: '#0B1F17', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 30-Day Soil Moisture Summary Footer */}
      <div className="mt-3 pt-3 border-t border-[#1E3F31] flex flex-wrap items-center justify-between gap-3 text-xs font-mono tabular-nums text-[#94B0A3]">
        <span>
          {t.windowEnding} {activeSnap.shortDate} ({firstDay.dateLabel} → {lastDay.dateLabel})
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <span>
            {t.avg30d}:{' '}
            <span className="text-white font-semibold">{series.avg30dSurfacePct}%</span>
          </span>
          <span>
            {t.range30d}:{' '}
            <span className="text-[#7DD3FC]">
              {series.min30dSurfacePct}%–{series.max30dSurfacePct}%
            </span>
          </span>
          <span>
            {t.netChange30d}:{' '}
            <span
              className={
                series.delta30dPct >= 0 ? 'text-[#86EFAC]' : 'text-[#FDE68A]'
              }
            >
              {deltaPrefix}
              {series.delta30dPct}%
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
