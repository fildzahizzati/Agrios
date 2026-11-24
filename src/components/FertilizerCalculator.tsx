import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Calculator, RefreshCw, X, Package, CalendarClock, FlaskConical } from 'lucide-react';
import {
  CROP_VARIETY_PROFILES,
  FieldParcel,
  calculateFertilizerPrescription,
  matchVarietyProfileId,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface FertilizerCalculatorProps {
  field: FieldParcel;
  activeDateIndex: number;
  lang: Lang;
  onClose: () => void;
}

function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function FertilizerCalculator({
  field,
  activeDateIndex,
  lang,
  onClose,
}: FertilizerCalculatorProps) {
  const t = TRANSLATIONS[lang].workspace.fertilizerCalc;
  const activeSnap = field.snapshots[activeDateIndex] ?? field.snapshots[0];

  const [varietyId, setVarietyId] = useState<string>(() => matchVarietyProfileId(field));
  const [areaHa, setAreaHa] = useState<number>(() => field.areaHa);
  const [targetYieldTHa, setTargetYieldTHa] = useState<number>(() => {
    const prof =
      CROP_VARIETY_PROFILES.find((p) => p.varietyId === matchVarietyProfileId(field)) ??
      CROP_VARIETY_PROFILES[0];
    return prof.defaultTargetYieldTHa;
  });
  const [currentN, setCurrentN] = useState<number>(() => activeSnap.nitrogenKgHa);
  const [currentP, setCurrentP] = useState<number>(() => activeSnap.phosphorusKgHa);
  const [currentK, setCurrentK] = useState<number>(() => activeSnap.potassiumKgHa);

  const handleSyncFromParcel = () => {
    const matched = matchVarietyProfileId(field);
    const prof =
      CROP_VARIETY_PROFILES.find((p) => p.varietyId === matched) ?? CROP_VARIETY_PROFILES[0];
    setVarietyId(matched);
    setAreaHa(field.areaHa);
    setTargetYieldTHa(prof.defaultTargetYieldTHa);
    setCurrentN(activeSnap.nitrogenKgHa);
    setCurrentP(activeSnap.phosphorusKgHa);
    setCurrentK(activeSnap.potassiumKgHa);
  };

  useEffect(() => {
    handleSyncFromParcel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.id, activeDateIndex]);

  const handleVarietyChange = (nextVarietyId: string) => {
    setVarietyId(nextVarietyId);
    const prof =
      CROP_VARIETY_PROFILES.find((p) => p.varietyId === nextVarietyId) ??
      CROP_VARIETY_PROFILES[0];
    setTargetYieldTHa(prof.defaultTargetYieldTHa);
  };

  const result = useMemo(
    () =>
      calculateFertilizerPrescription({
        varietyId,
        areaHa,
        targetYieldTHa,
        currentNKgHa: currentN,
        currentPKgHa: currentP,
        currentKKgHa: currentK,
      }),
    [varietyId, areaHa, targetYieldTHa, currentN, currentP, currentK]
  );

  const chartData = useMemo(
    () =>
      result.nutrients.map((n) => ({
        name: n.label[lang],
        soil: n.soilAvailableKgHa,
        demand: n.cropDemandKgHa,
        add: n.recommendedAddKgHa,
      })),
    [result.nutrients, lang]
  );

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Header Bar */}
      <div className="bg-[#10271E] border border-[#1E3F31] rounded-xl p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.eyebrow}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#94B0A3]">
              {field.name[lang]} ({activeSnap.shortDate})
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
            onClick={handleSyncFromParcel}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#86EFAC] bg-[#0D9F58]/15 hover:bg-[#0D9F58]/25 border border-[#0D9F58]/40 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{t.syncParcelButton}</span>
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

      {/* Main Split: Left Inputs | Right Mass Balance Chart & Summary KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-5 bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A382B]">
            <h4 className="text-sm font-semibold text-white">{t.inputsTitle}</h4>
            <span className="text-[11px] text-[#7D9B8D]">{t.syncedHint}</span>
          </div>

          <div>
            <label
              htmlFor="calc-variety"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.varietyLabel}
            </label>
            <select
              id="calc-variety"
              value={varietyId}
              onChange={(e) => handleVarietyChange(e.target.value)}
              className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer"
            >
              {CROP_VARIETY_PROFILES.map((prof) => (
                <option key={prof.varietyId} value={prof.varietyId}>
                  {prof.cropGroup[lang]} — {prof.varietyLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="calc-area"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.areaLabel}
              </label>
              <input
                id="calc-area"
                type="number"
                step={0.5}
                min={0.1}
                max={5000}
                value={areaHa}
                onChange={(e) => setAreaHa(Math.max(0.1, Number(e.target.value) || 0.1))}
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>

            <div>
              <label
                htmlFor="calc-yield"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.targetYieldLabel}
              </label>
              <input
                id="calc-yield"
                type="number"
                step={result.profile.defaultTargetYieldTHa > 20 ? 2 : 0.2}
                min={result.profile.minYieldTHa}
                max={result.profile.maxYieldTHa}
                value={targetYieldTHa}
                onChange={(e) =>
                  setTargetYieldTHa(
                    Math.max(
                      result.profile.minYieldTHa,
                      Math.min(result.profile.maxYieldTHa, Number(e.target.value) || result.profile.minYieldTHa)
                    )
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#1A382B]">
            <div className="text-xs font-medium text-[#9CB5A8] mb-3">
              {t.currentNpkLabel}
            </div>

            <div className="space-y-3">
              <div className="bg-[#081912] border border-[#173428] rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#C8DBD2]">Nitrogen (N)</span>
                  <span className="font-mono tabular-nums text-[#34D399] font-semibold">
                    {currentN} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={220}
                  step={2}
                  aria-label="Soil Nitrogen kg/ha"
                  value={currentN}
                  onChange={(e) => setCurrentN(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

              <div className="bg-[#081912] border border-[#173428] rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#C8DBD2]">Fosfor (P)</span>
                  <span className="font-mono tabular-nums text-[#38BDF8] font-semibold">
                    {currentP} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  aria-label="Soil Phosphorus kg/ha"
                  value={currentP}
                  onChange={(e) => setCurrentP(Number(e.target.value))}
                  className="w-full accent-[#38BDF8] cursor-pointer"
                />
              </div>

              <div className="bg-[#081912] border border-[#173428] rounded-lg p-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#C8DBD2]">Kalium (K)</span>
                  <span className="font-mono tabular-nums text-[#FBBF24] font-semibold">
                    {currentK} kg/ha
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={240}
                  step={2}
                  aria-label="Soil Potassium kg/ha"
                  value={currentK}
                  onChange={(e) => setCurrentK(Number(e.target.value))}
                  className="w-full accent-[#F59E0B] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: KPI Strip + Recharts Nutrient Mass Balance */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-[11px] text-[#83A193]">{t.kpis.totalRate}</div>
              <div className="font-mono text-lg font-bold text-white tabular-nums mt-1">
                {result.totalRateKgHa} <span className="text-xs font-normal text-[#86EFAC]">kg/ha</span>
              </div>
            </div>

            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-[11px] text-[#83A193]">{t.kpis.totalBags}</div>
              <div className="font-mono text-lg font-bold text-[#34D399] tabular-nums mt-1">
                {result.totalSacks.toLocaleString('id-ID')}{' '}
                <span className="text-xs font-normal text-[#83A193]">{t.sacksUnit}</span>
              </div>
            </div>

            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-[11px] text-[#83A193]">{t.kpis.costPerHa}</div>
              <div className="font-mono text-sm sm:text-base font-bold text-white tabular-nums mt-1.5">
                {formatIdr(result.costPerHaIdr)}
              </div>
            </div>

            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-[11px] text-[#83A193]">{t.kpis.totalBudget}</div>
              <div className="font-mono text-sm sm:text-base font-bold text-[#FDE68A] tabular-nums mt-1.5">
                {formatIdr(result.totalCostIdr)}
              </div>
            </div>
          </div>

          <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-[#10B981]" />
                  <span>{t.chartTitle}</span>
                </h4>
                <p className="text-xs text-[#94B0A3] mt-0.5">{t.chartSubtitle}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#C8DBD2]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
                  {t.soilSeries}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#64748B]" />
                  {t.demandSeries}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                  {t.addSeries}
                </span>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#183629" vertical={false} />
                  <XAxis
                    dataKey="name"
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
                    dataKey="soil"
                    name={t.soilSeries}
                    fill="#38BDF8"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="demand"
                    name={t.demandSeries}
                    fill="#64748B"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="add"
                    name={t.addSeries}
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Commercial Fertilizer Product Breakdown + Split Application Schedule */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Commercial Fertilizer Table */}
        <div className="xl:col-span-7 bg-[#0B2219] border border-[#1E3F31] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1E3F31] flex items-center gap-2">
            <Package className="w-4 h-4 text-[#34D399]" />
            <h4 className="text-sm font-semibold text-white">{t.productsTitle}</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E3F31] bg-[#081912] text-xs text-[#9CB5A8]">
                  <th className="py-2.5 px-5 font-medium">{t.productCol}</th>
                  <th className="py-2.5 px-3 font-medium">{t.analysisCol}</th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.rateCol}</th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.totalCol}</th>
                  <th className="py-2.5 px-3 font-medium text-right">{t.sacksCol}</th>
                  <th className="py-2.5 px-5 font-medium text-right">{t.costCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173428] text-xs">
                {result.products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-[#0F2A1F]/60 transition-colors">
                    <td className="py-3 px-5 font-semibold text-white">{prod.name[lang]}</td>
                    <td className="py-3 px-3 font-mono text-[#86EFAC] whitespace-nowrap">
                      {prod.analysisLabel}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-white font-semibold whitespace-nowrap">
                      {prod.rateKgHa} kg/ha
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#C8DBD2] whitespace-nowrap">
                      {prod.totalKg.toLocaleString('id-ID')} kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-[#34D399] whitespace-nowrap">
                      {prod.sacks50Kg.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-5 text-right font-mono tabular-nums text-[#D1E3DA] whitespace-nowrap">
                      {formatIdr(prod.estimatedCostIdr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-Stage Split Schedule */}
        <div className="xl:col-span-5 bg-[#0B2219] border border-[#1E3F31] rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-[#1E3F31] flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-[#38BDF8]" />
            <h4 className="text-sm font-semibold text-white">{t.scheduleTitle}</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E3F31] bg-[#081912] text-xs text-[#9CB5A8]">
                  <th className="py-2.5 px-4 font-medium">{t.stageCol}</th>
                  <th className="py-2.5 px-2.5 font-medium text-right">Phonska</th>
                  <th className="py-2.5 px-2.5 font-medium text-right">Urea</th>
                  <th className="py-2.5 px-2.5 font-medium text-right">SP-36</th>
                  <th className="py-2.5 px-4 font-medium text-right">KCl</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#173428] text-xs">
                {result.splits.map((sp, i) => (
                  <tr key={i} className="hover:bg-[#0F2A1F]/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{sp.stage[lang]}</div>
                      <div className="text-[11px] font-mono text-[#83A193] mt-0.5">
                        {sp.window[lang]}
                      </div>
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-[#C8DBD2]">
                      {sp.phonskaKgHa}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-[#34D399]">
                      {sp.ureaKgHa}
                    </td>
                    <td className="py-3 px-2.5 text-right font-mono tabular-nums text-[#38BDF8]">
                      {sp.sp36KgHa}
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#FBBF24]">
                      {sp.kclKgHa}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
