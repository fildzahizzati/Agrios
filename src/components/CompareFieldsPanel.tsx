import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import {
  ArrowLeftRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Droplets,
  Leaf,
  FlaskConical,
} from 'lucide-react';
import {
  ESTATE_MAPS,
  EstateMapId,
  FieldParcel,
  SEASON_DATES,
  getFieldSoilMoisture30Days,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface ParcelOption {
  estateId: EstateMapId;
  estateName: Record<Lang, string>;
  field: FieldParcel;
}

interface CompareFieldsPanelProps {
  lang: Lang;
  activeDateIndex: number;
  onChangeDateIndex: (idx: number) => void;
  primaryFieldId: string;
  vraRatesByField: Record<string, { high: number; medium: number; low: number }>;
  onClose: () => void;
}

function formatSigned(val: number, decimals: number, unit = ''): string {
  if (Math.abs(val) < Math.pow(10, -decimals) / 2) {
    return `0${decimals > 0 ? `.${'0'.repeat(decimals)}` : ''}${unit}`;
  }
  const sign = val > 0 ? '+' : '−';
  return `${sign}${Math.abs(val).toFixed(decimals)}${unit}`;
}

export function CompareFieldsPanel({
  lang,
  activeDateIndex,
  onChangeDateIndex,
  primaryFieldId,
  vraRatesByField,
  onClose,
}: CompareFieldsPanelProps) {
  const w = TRANSLATIONS[lang].workspace;
  const t = w.compareFields;

  const allOptions = useMemo<ParcelOption[]>(() => {
    const list: ParcelOption[] = [];
    for (const estate of ESTATE_MAPS) {
      for (const field of estate.parcels) {
        list.push({
          estateId: estate.id,
          estateName: estate.shortName,
          field,
        });
      }
    }
    return list;
  }, []);

  const [fieldAId, setFieldAId] = useState<string>(primaryFieldId);
  const [fieldBId, setFieldBId] = useState<string>(() => {
    const second = allOptions.find((o) => o.field.id !== primaryFieldId);
    return second ? second.field.id : primaryFieldId;
  });

  // Sync Field A when user clicks a different parcel before entering compare mode
  useEffect(() => {
    setFieldAId(primaryFieldId);
  }, [primaryFieldId]);

  const optionA = useMemo(
    () => allOptions.find((o) => o.field.id === fieldAId) ?? allOptions[0],
    [allOptions, fieldAId]
  );
  const optionB = useMemo(
    () => allOptions.find((o) => o.field.id === fieldBId) ?? allOptions[1] ?? allOptions[0],
    [allOptions, fieldBId]
  );

  const fieldA = optionA.field;
  const fieldB = optionB.field;

  const snapA = fieldA.snapshots[activeDateIndex] ?? fieldA.snapshots[0];
  const snapB = fieldB.snapshots[activeDateIndex] ?? fieldB.snapshots[0];

  const moistureA = useMemo(
    () => getFieldSoilMoisture30Days(fieldA, activeDateIndex),
    [fieldA, activeDateIndex]
  );
  const moistureB = useMemo(
    () => getFieldSoilMoisture30Days(fieldB, activeDateIndex),
    [fieldB, activeDateIndex]
  );

  const calcVraSavingsPct = (field: FieldParcel) => {
    const rates = vraRatesByField[field.id] ?? {
      high: field.zones[0].defaultRateKgHa,
      medium: field.zones[1].defaultRateKgHa,
      low: field.zones[2].defaultRateKgHa,
    };
    const vraKg =
      field.zones[0].areaHa * rates.high +
      field.zones[1].areaHa * rates.medium +
      field.zones[2].areaHa * rates.low;
    const flatKg = field.areaHa * field.uniformRateKgHa;
    return ((flatKg - vraKg) / flatKg) * 100;
  };

  const vraSavingsA = calcVraSavingsPct(fieldA);
  const vraSavingsB = calcVraSavingsPct(fieldB);

  const ndviChartData = useMemo(
    () =>
      SEASON_DATES.map((dateLabel, idx) => ({
        dateLabel,
        ndviA: Number((fieldA.snapshots[idx]?.meanNdvi ?? 0).toFixed(2)),
        ndviB: Number((fieldB.snapshots[idx]?.meanNdvi ?? 0).toFixed(2)),
      })),
    [fieldA, fieldB]
  );

  const npkChartData = useMemo(
    () => [
      {
        nutrient: w.soilNpk.nitrogen,
        valA: snapA.nitrogenKgHa,
        valB: snapB.nitrogenKgHa,
      },
      {
        nutrient: w.soilNpk.phosphorus,
        valA: snapA.phosphorusKgHa,
        valB: snapB.phosphorusKgHa,
      },
      {
        nutrient: w.soilNpk.potassium,
        valA: snapA.potassiumKgHa,
        valB: snapB.potassiumKgHa,
      },
    ],
    [snapA, snapB, w.soilNpk]
  );

  const moistureOverlayData = useMemo(
    () =>
      moistureA.days.map((ptA, idx) => ({
        dateLabel: ptA.dateLabel,
        surfaceA: ptA.surfaceMoisturePct,
        surfaceB: moistureB.days[idx]?.surfaceMoisturePct ?? 0,
      })),
    [moistureA, moistureB]
  );

  const handleSwap = () => {
    setFieldAId(fieldBId);
    setFieldBId(fieldAId);
  };

  const renderSprayBadge = (
    sprayWindow: 'Optimal' | 'Marginal' | 'Hold',
    windKmh: number,
    rainMm: number
  ) => {
    const Icon =
      sprayWindow === 'Optimal'
        ? CheckCircle2
        : sprayWindow === 'Marginal'
        ? AlertTriangle
        : XCircle;
    const textColor =
      sprayWindow === 'Optimal'
        ? 'text-[#34D399]'
        : sprayWindow === 'Marginal'
        ? 'text-[#FDE68A]'
        : 'text-[#FCA5A5]';
    const label =
      sprayWindow === 'Optimal'
        ? w.sprayStatus.optimal
        : sprayWindow === 'Marginal'
        ? w.sprayStatus.marginal
        : w.sprayStatus.hold;

    return (
      <div className="flex flex-col items-end gap-0.5">
        <span className={`inline-flex items-center gap-1.5 font-medium ${textColor}`}>
          <Icon className="w-3.5 h-3.5 shrink-0" />
          <span>{label}</span>
        </span>
        <span className="font-mono text-[11px] text-[#94B0A3] tabular-nums">
          {windKmh} km/h · {rainMm} mm
        </span>
      </div>
    );
  };

  const renderMoistureStatus = (status: 'Optimal' | 'Low Moisture' | 'Saturated') => {
    if (status === 'Optimal') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-[#34D399]">
          <CheckCircle2 className="w-3 h-3 shrink-0" />
          <span>{w.soilMoisture.statusOptimal}</span>
        </span>
      );
    }
    if (status === 'Low Moisture') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] text-[#FDE68A]">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          <span>{w.soilMoisture.statusLow}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] text-[#38BDF8]">
        <Droplets className="w-3 h-3 shrink-0" />
        <span>{w.soilMoisture.statusSaturated}</span>
      </span>
    );
  };

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Control Strip: Parcel A vs B Selectors, Date Pass, Close */}
      <div className="bg-[#10271E] border border-[#1E3F31] rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E3F31]">
          <div>
            <div className="text-xs font-medium text-[#34D399]">
              {t.eyebrow}
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              {t.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#9CB5A8] mt-1 max-w-3xl">
              {t.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 self-start lg:self-auto px-3.5 py-2 text-xs font-semibold text-white bg-[#17382B] hover:bg-[#1E4737] border border-[#2A5945] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>{t.closeButton}</span>
          </button>
        </div>

        {/* Dual Field Pickers + Swap */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-end pt-4">
          <div className="lg:col-span-5">
            <label
              htmlFor="compare-parcel-a"
              className="flex items-center gap-2 text-xs font-semibold text-[#34D399] mb-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              <span>{t.parcelALabel}</span>
              <span className="text-[#7D9B8D] font-normal">· {optionA.estateName[lang]}</span>
            </label>
            <select
              id="compare-parcel-a"
              value={fieldAId}
              onChange={(e) => setFieldAId(e.target.value)}
              className="w-full bg-[#0A1B14] border border-[#244D3C] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer"
            >
              {ESTATE_MAPS.map((estate) => (
                <optgroup key={estate.id} label={estate.shortName[lang]}>
                  {estate.parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name[lang]} · {p.crop[lang]} ({p.areaHa.toFixed(1)} ha)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              aria-label={t.swapButton}
              title={t.swapButton}
              className="inline-flex items-center justify-center gap-1.5 w-full lg:w-auto px-3 py-2.5 text-xs font-medium text-[#D1E3DA] bg-[#0D2119] hover:bg-[#17382B] border border-[#244D3C] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4 text-[#34D399]" />
              <span className="lg:hidden">{t.swapButton}</span>
            </button>
          </div>

          <div className="lg:col-span-5">
            <label
              htmlFor="compare-parcel-b"
              className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8] mb-1.5"
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              <span>{t.parcelBLabel}</span>
              <span className="text-[#7D9B8D] font-normal">· {optionB.estateName[lang]}</span>
            </label>
            <select
              id="compare-parcel-b"
              value={fieldBId}
              onChange={(e) => setFieldBId(e.target.value)}
              className="w-full bg-[#0A1B14] border border-[#244D3C] focus:border-[#38BDF8] focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer"
            >
              {ESTATE_MAPS.map((estate) => (
                <optgroup key={estate.id} label={estate.shortName[lang]}>
                  {estate.parcels.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name[lang]} · {p.crop[lang]} ({p.areaHa.toFixed(1)} ha)
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {/* Satellite Pass Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#1A382B]">
          <span className="text-xs font-medium text-[#9CB5A8]">{t.satellitePassLabel}</span>
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

        {fieldA.id === fieldB.id && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[#FDE68A] bg-[#2D2512] border border-[#5B491E] rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{t.sameParcelNotice}</span>
          </div>
        )}
      </div>

      {/* Comparative Telemetry Matrix Table */}
      <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1E3F31] flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-white">{t.matrixTitle}</h4>
          <span className="font-mono text-xs text-[#83A193] tabular-nums">
            {SEASON_DATES[activeDateIndex]}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E3F31] bg-[#081912] text-xs text-[#9CB5A8]">
                <th className="py-3 px-5 font-medium">{t.metricCol}</th>
                <th className="py-3 px-4 font-semibold text-right text-[#34D399] whitespace-nowrap">
                  {fieldA.name[lang]}
                </th>
                <th className="py-3 px-4 font-semibold text-right text-[#38BDF8] whitespace-nowrap">
                  {fieldB.name[lang]}
                </th>
                <th className="py-3 px-5 font-medium text-right whitespace-nowrap">
                  {t.deltaCol}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173428] text-xs sm:text-sm">
              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.cropSoil}</td>
                <td className="py-2.5 px-4 text-right text-white">
                  {fieldA.crop[lang]} · <span className="text-[#9CB5A8]">{fieldA.soilType[lang]}</span>
                </td>
                <td className="py-2.5 px-4 text-right text-white">
                  {fieldB.crop[lang]} · <span className="text-[#9CB5A8]">{fieldB.soilType[lang]}</span>
                </td>
                <td className="py-2.5 px-5 text-right font-mono text-[#7D9B8D]">—</td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.growthStage}</td>
                <td className="py-2.5 px-4 text-right text-white">
                  {snapA.growthStage[lang]}
                </td>
                <td className="py-2.5 px-4 text-right text-white">
                  {snapB.growthStage[lang]}
                </td>
                <td className="py-2.5 px-5 text-right font-mono text-[#7D9B8D]">—</td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.areaHa}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {fieldA.areaHa.toFixed(1)} ha
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {fieldB.areaHa.toFixed(1)} ha
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(fieldA.areaHa - fieldB.areaHa, 1, ' ha')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.ndviMean}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white font-semibold">
                  {snapA.meanNdvi.toFixed(2)}{' '}
                  <span className="text-[11px] font-normal text-[#83A193]">
                    ({snapA.minNdvi.toFixed(2)}–{snapA.maxNdvi.toFixed(2)})
                  </span>
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white font-semibold">
                  {snapB.meanNdvi.toFixed(2)}{' '}
                  <span className="text-[11px] font-normal text-[#83A193]">
                    ({snapB.minNdvi.toFixed(2)}–{snapB.maxNdvi.toFixed(2)})
                  </span>
                </td>
                <td
                  className={`py-2.5 px-5 text-right font-mono tabular-nums font-semibold ${
                    snapA.meanNdvi - snapB.meanNdvi >= 0 ? 'text-[#34D399]' : 'text-[#FDE68A]'
                  }`}
                >
                  {formatSigned(snapA.meanNdvi - snapB.meanNdvi, 2)}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.biomass}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapA.biomassIndex.toFixed(1)} t/ha
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapB.biomassIndex.toFixed(1)} t/ha
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(snapA.biomassIndex - snapB.biomassIndex, 1, ' t/ha')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.surfaceMoisture}</td>
                <td className="py-2.5 px-4 text-right">
                  <div className="font-mono tabular-nums text-white font-semibold">
                    {moistureA.currentSurfacePct.toFixed(1)}%
                  </div>
                  <div className="flex justify-end mt-0.5">
                    {renderMoistureStatus(moistureA.status)}
                  </div>
                </td>
                <td className="py-2.5 px-4 text-right">
                  <div className="font-mono tabular-nums text-white font-semibold">
                    {moistureB.currentSurfacePct.toFixed(1)}%
                  </div>
                  <div className="flex justify-end mt-0.5">
                    {renderMoistureStatus(moistureB.status)}
                  </div>
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(
                    moistureA.currentSurfacePct - moistureB.currentSurfacePct,
                    1,
                    '%'
                  )}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.meanMoisture30d}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {moistureA.avg30dSurfacePct.toFixed(1)}%
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {moistureB.avg30dSurfacePct.toFixed(1)}%
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(
                    moistureA.avg30dSurfacePct - moistureB.avg30dSurfacePct,
                    1,
                    '%'
                  )}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.nitrogen}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapA.nitrogenKgHa} kg/ha
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapB.nitrogenKgHa} kg/ha
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(snapA.nitrogenKgHa - snapB.nitrogenKgHa, 0, ' kg/ha')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.phosphorus}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapA.phosphorusKgHa} kg/ha
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapB.phosphorusKgHa} kg/ha
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(snapA.phosphorusKgHa - snapB.phosphorusKgHa, 0, ' kg/ha')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.potassium}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapA.potassiumKgHa} kg/ha
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-white">
                  {snapB.potassiumKgHa} kg/ha
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(snapA.potassiumKgHa - snapB.potassiumKgHa, 0, ' kg/ha')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.sprayWeather}</td>
                <td className="py-2.5 px-4 text-right">
                  {renderSprayBadge(snapA.sprayWindow, snapA.windKmh, snapA.rainMm)}
                </td>
                <td className="py-2.5 px-4 text-right">
                  {renderSprayBadge(snapB.sprayWindow, snapB.windKmh, snapB.rainMm)}
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(snapA.windKmh - snapB.windKmh, 0, ' km/h')}
                </td>
              </tr>

              <tr className="hover:bg-[#0F2A1F]/60 transition-colors">
                <td className="py-2.5 px-5 text-[#C8DBD2]">{t.metrics.vraDelta}</td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#86EFAC]">
                  {vraSavingsA >= 0
                    ? `−${vraSavingsA.toFixed(1)}%`
                    : `+${Math.abs(vraSavingsA).toFixed(1)}%`}
                </td>
                <td className="py-2.5 px-4 text-right font-mono tabular-nums text-[#7DD3FC]">
                  {vraSavingsB >= 0
                    ? `−${vraSavingsB.toFixed(1)}%`
                    : `+${Math.abs(vraSavingsB).toFixed(1)}%`}
                </td>
                <td className="py-2.5 px-5 text-right font-mono tabular-nums text-[#C8DBD2]">
                  {formatSigned(vraSavingsA - vraSavingsB, 1, '%')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparative Recharts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* 1. Seasonal NDVI Trajectory */}
        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#10B981]" />
                <span>{t.charts.ndviTitle}</span>
              </h4>
              <p className="text-xs text-[#94B0A3] mt-0.5">{t.charts.ndviSubtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#C8DBD2] mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              {fieldA.name[lang]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              {fieldB.name[lang]}
            </span>
          </div>

          <div className="h-[220px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ndviChartData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#183629" />
                <XAxis
                  dataKey="dateLabel"
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={{ stroke: '#1E3F31' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 1]}
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <ReferenceLine
                  x={SEASON_DATES[activeDateIndex]}
                  stroke="#4B7361"
                  strokeDasharray="4 4"
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
                <Line
                  type="monotone"
                  dataKey="ndviA"
                  name={fieldA.name[lang]}
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#10B981' }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="ndviB"
                  name={fieldB.name[lang]}
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#38BDF8' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Soil Moisture 30-Day Comparison */}
        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-[#38BDF8]" />
              <span>{t.charts.moistureTitle}</span>
            </h4>
            <p className="text-xs text-[#94B0A3] mt-0.5">{t.charts.moistureSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#C8DBD2] mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              {fieldA.name[lang]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              {fieldB.name[lang]}
            </span>
          </div>

          <div className="h-[220px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={moistureOverlayData}
                margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#183629" />
                <XAxis
                  dataKey="dateLabel"
                  interval={6}
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={{ stroke: '#1E3F31' }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 85]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => `${Number(value ?? 0).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: '#06130E',
                    borderColor: '#244E3D',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F1F5F2',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="surfaceA"
                  name={fieldA.name[lang]}
                  stroke="#10B981"
                  strokeWidth={2.2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="surfaceB"
                  name={fieldB.name[lang]}
                  stroke="#38BDF8"
                  strokeWidth={2.2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. NPK Soil Nutrient Comparison */}
        <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-[#F59E0B]" />
              <span>{t.charts.npkTitle}</span>
            </h4>
            <p className="text-xs text-[#94B0A3] mt-0.5">{t.charts.npkSubtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#C8DBD2] mb-2">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
              {fieldA.name[lang]}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
              {fieldB.name[lang]}
            </span>
          </div>

          <div className="h-[220px] w-full mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={npkChartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#183629" vertical={false} />
                <XAxis
                  dataKey="nutrient"
                  tick={{ fill: '#C8DBD2', fontSize: 11 }}
                  axisLine={{ stroke: '#1E3F31' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#83A193', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => `${Number(value ?? 0)} kg/ha`}
                  contentStyle={{
                    backgroundColor: '#06130E',
                    borderColor: '#244E3D',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#F1F5F2',
                  }}
                />
                <Bar
                  dataKey="valA"
                  name={fieldA.name[lang]}
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="valB"
                  name={fieldB.name[lang]}
                  fill="#38BDF8"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
