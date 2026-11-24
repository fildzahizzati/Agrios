import { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { FieldParcel } from '../data/platformData';
import { TRANSLATIONS, type Lang } from '../data/i18n';

interface SoilNutrientChartProps {
  field: FieldParcel;
  lang: Lang;
  activeDateIndex: number;
  onSelectDateIndex?: (idx: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey?: string;
    name?: string;
    value?: number;
    color?: string;
  }>;
  label?: string;
  unit: string;
}

function NpkTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-[#081711] border border-[#244A3A] rounded-lg px-3 py-2.5 shadow-xl text-xs">
      <div className="font-mono font-semibold text-white mb-1.5 pb-1 border-b border-[#1E3F31]">
        {label}
      </div>
      <div className="flex flex-col gap-1">
        {payload.map((entry) => (
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
              {entry.value} {unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SoilNutrientChart({
  field,
  lang,
  activeDateIndex,
  onSelectDateIndex,
}: SoilNutrientChartProps) {
  const t = TRANSLATIONS[lang].workspace.soilNpk;
  const [visibleSeries, setVisibleSeries] = useState({
    n: true,
    p: true,
    k: true,
  });

  const activeSnap = field.snapshots[activeDateIndex];
  const firstSnap = field.snapshots[0];
  const lastSnap = field.snapshots[field.snapshots.length - 1];

  const chartData = field.snapshots.map((snap, idx) => ({
    index: idx,
    shortDate: snap.shortDate,
    growthStage: snap.growthStage[lang],
    nitrogenKgHa: snap.nitrogenKgHa,
    phosphorusKgHa: snap.phosphorusKgHa,
    potassiumKgHa: snap.potassiumKgHa,
  }));

  const toggleSeries = (key: 'n' | 'p' | 'k') => {
    setVisibleSeries((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next.n && !next.p && !next.k) {
        return prev; // Keep at least one series visible
      }
      return next;
    });
  };

  const formatDelta = (startVal: number, endVal: number) => {
    const delta = endVal - startVal;
    const prefix = delta > 0 ? '+' : '';
    return `${prefix}${delta} ${t.unit}`;
  };

  return (
    <div
      aria-label={t.title}
      className="mt-5 bg-[#10271E] border border-[#1E3F31] rounded-xl p-5 sm:p-6"
    >
      {/* Header & Interactive Nutrient Toggles */}
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
          <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
            {t.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#94B0A3] mt-0.5">{t.subtitle}</p>
        </div>

        {/* Interactive Nutrient Series Filter Buttons with Current Pass Metrics */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => toggleSeries('n')}
            aria-pressed={visibleSeries.n}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.n
                ? 'bg-[#0A1B14] border-[#10B981]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" />
            <span>{t.nitrogen}</span>
            <span className="font-mono font-semibold tabular-nums text-[#86EFAC]">
              {activeSnap.nitrogenKgHa} {t.unit}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('p')}
            aria-pressed={visibleSeries.p}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.p
                ? 'bg-[#0A1B14] border-[#38BDF8]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#38BDF8]" />
            <span>{t.phosphorus}</span>
            <span className="font-mono font-semibold tabular-nums text-[#7DD3FC]">
              {activeSnap.phosphorusKgHa} {t.unit}
            </span>
          </button>

          <button
            type="button"
            onClick={() => toggleSeries('k')}
            aria-pressed={visibleSeries.k}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              visibleSeries.k
                ? 'bg-[#0A1B14] border-[#F59E0B]/60 text-white'
                : 'bg-[#0A1B14]/40 border-[#1B382B] text-[#6E8B7D]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" />
            <span>{t.potassium}</span>
            <span className="font-mono font-semibold tabular-nums text-[#FDE68A]">
              {activeSnap.potassiumKgHa} {t.unit}
            </span>
          </button>
        </div>
      </div>

      {/* Recharts Multi-Series Nutrient Chart */}
      <div className="mt-4 w-full h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 14, right: 16, left: 0, bottom: 4 }}
            onClick={(state) => {
              if (
                onSelectDateIndex &&
                state &&
                typeof state.activeTooltipIndex === 'number'
              ) {
                onSelectDateIndex(state.activeTooltipIndex);
              }
            }}
          >
            <defs>
              <linearGradient id="npkGradN" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="npkGradP" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="npkGradK" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E3F31" vertical={false} />

            <XAxis
              dataKey="shortDate"
              stroke="#83A193"
              tick={{ fill: '#94B0A3', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={{ stroke: '#1E3F31' }}
              tickLine={false}
            />

            <YAxis
              stroke="#83A193"
              tick={{ fill: '#94B0A3', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              width={46}
              unit=" kg"
            />

            <Tooltip content={<NpkTooltip unit={t.unit} />} />

            <ReferenceLine
              x={activeSnap.shortDate}
              stroke="#A7F3D0"
              strokeDasharray="4 4"
              strokeOpacity={0.65}
              label={{
                value: `${t.activePass}: ${activeSnap.shortDate}`,
                position: 'insideTopRight',
                fill: '#A7F3D0',
                fontSize: 10,
                fontFamily: 'JetBrains Mono, monospace',
              }}
            />

            {visibleSeries.k && (
              <Area
                type="monotone"
                dataKey="potassiumKgHa"
                name={t.potassium}
                stroke="#F59E0B"
                strokeWidth={2.2}
                fill="url(#npkGradK)"
                activeDot={{ r: 5, fill: '#F59E0B', stroke: '#0B1F17', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.n && (
              <Area
                type="monotone"
                dataKey="nitrogenKgHa"
                name={t.nitrogen}
                stroke="#10B981"
                strokeWidth={2.4}
                fill="url(#npkGradN)"
                activeDot={{ r: 5, fill: '#10B981', stroke: '#0B1F17', strokeWidth: 2 }}
              />
            )}

            {visibleSeries.p && (
              <Area
                type="monotone"
                dataKey="phosphorusKgHa"
                name={t.phosphorus}
                stroke="#38BDF8"
                strokeWidth={2.2}
                fill="url(#npkGradP)"
                activeDot={{ r: 5, fill: '#38BDF8', stroke: '#0B1F17', strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Seasonal Nutrient Drawdown Footer */}
      <div className="mt-3 pt-3 border-t border-[#1E3F31] flex flex-wrap items-center justify-between gap-3 text-xs font-mono tabular-nums text-[#94B0A3]">
        <span>
          {t.seasonalUptake} ({firstSnap.shortDate} → {lastSnap.shortDate})
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <span>
            N:{' '}
            <span className="text-[#86EFAC]">
              {formatDelta(firstSnap.nitrogenKgHa, lastSnap.nitrogenKgHa)}
            </span>
          </span>
          <span>
            P:{' '}
            <span className="text-[#7DD3FC]">
              {formatDelta(firstSnap.phosphorusKgHa, lastSnap.phosphorusKgHa)}
            </span>
          </span>
          <span>
            K:{' '}
            <span className="text-[#FDE68A]">
              {formatDelta(firstSnap.potassiumKgHa, lastSnap.potassiumKgHa)}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
