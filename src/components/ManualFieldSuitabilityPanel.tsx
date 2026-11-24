import { FormEvent, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Sprout,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Loader2,
  X,
  Wrench,
  Calendar,
  Repeat,
} from 'lucide-react';
import {
  IrrigationTypeKey,
  MANUAL_INPUT_PRESETS,
  ManualFieldInput,
  SoilTypeKey,
  evaluateCropSuitability,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface ManualFieldSuitabilityPanelProps {
  lang: Lang;
  onClose: () => void;
}

interface GeminiSuitabilityAdvice {
  bestCropVerdict: string;
  plantingCalendarNote: string;
  soilRemediationSteps: string[];
  intercroppingOption: string;
}

export function ManualFieldSuitabilityPanel({
  lang,
  onClose,
}: ManualFieldSuitabilityPanelProps) {
  const t = TRANSLATIONS[lang].workspace.manualInput;

  const [formInput, setFormInput] = useState<ManualFieldInput>(
    () => MANUAL_INPUT_PRESETS[0].data
  );
  const [activePresetId, setActivePresetId] = useState<string>(MANUAL_INPUT_PRESETS[0].id);

  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<GeminiSuitabilityAdvice | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const report = useMemo(() => evaluateCropSuitability(formInput), [formInput]);
  const topCrop = report.rankedCrops[0];

  const chartData = useMemo(
    () =>
      report.rankedCrops.map((c) => ({
        cropId: c.cropId,
        name: c.cropName[lang],
        score: c.scorePct,
        suitabilityClass: c.suitabilityClass,
        varietyHint: c.varietyHint,
        limiting: c.limitingFactor[lang],
      })),
    [report.rankedCrops, lang]
  );

  const updateField = <K extends keyof ManualFieldInput>(
    key: K,
    value: ManualFieldInput[K]
  ) => {
    setActivePresetId('custom');
    setFormInput((prev) => ({ ...prev, [key]: value }));
  };

  const handleLoadPreset = (presetId: string) => {
    const found = MANUAL_INPUT_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePresetId(presetId);
    setFormInput({ ...found.data });
    setAiAdvice(null);
    setAiError(null);
  };

  const handleAnalyzeWithAi = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsAnalyzingAi(true);
    setAiError(null);

    try {
      const response = await fetch('/api/crop-suitability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          input: {
            ...formInput,
            soilType: t.soilOptions[formInput.soilType],
            irrigation: t.irrigationOptions[formInput.irrigation],
          },
          rankedCrops: report.rankedCrops.map((c) => ({
            cropName: c.cropName[lang],
            score: c.scorePct,
            status:
              c.suitabilityClass === 'S1'
                ? t.classes.s1
                : c.suitabilityClass === 'S2'
                ? t.classes.s2
                : t.classes.s3,
          })),
        }),
      });

      const payload = (await response.json()) as GeminiSuitabilityAdvice & {
        error?: string;
      };
      if (!response.ok) {
        throw new Error(payload.error || `HTTP ${response.status}`);
      }

      setAiAdvice({
        bestCropVerdict: payload.bestCropVerdict,
        plantingCalendarNote: payload.plantingCalendarNote,
        soilRemediationSteps: payload.soilRemediationSteps,
        intercroppingOption: payload.intercroppingOption,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Request failed';
      setAiError(msg);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const soilHealthLabel =
    report.overallSoilHealth === 'Optimal'
      ? t.healthStates.optimal
      : report.overallSoilHealth === 'Needs Conditioning'
      ? t.healthStates.conditioning
      : t.healthStates.alert;

  const SoilHealthIcon =
    report.overallSoilHealth === 'Optimal'
      ? CheckCircle2
      : report.overallSoilHealth === 'Needs Conditioning'
      ? AlertTriangle
      : ShieldAlert;

  const soilHealthColor =
    report.overallSoilHealth === 'Optimal'
      ? 'text-[#34D399]'
      : report.overallSoilHealth === 'Needs Conditioning'
      ? 'text-[#FDE68A]'
      : 'text-[#FCA5A5]';

  return (
    <div className="mt-5 flex flex-col gap-5">
      {/* Header Strip & Presets */}
      <div className="bg-[#10271E] border border-[#1E3F31] rounded-xl p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E3F31]">
          <div>
            <div className="text-xs font-medium text-[#34D399]">{t.eyebrow}</div>
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

        {/* Sample Farmer Field Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-medium text-[#9CB5A8] mr-1">{t.presetsLabel}</span>
          {MANUAL_INPUT_PRESETS.map((preset) => {
            const active = activePresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#0D9F58] text-white border-[#10B981]'
                    : 'bg-[#0A1B14] text-[#C8DBD2] border-[#1E3F31] hover:border-[#34D399]'
                }`}
              >
                {preset.label[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Left Manual Survey Form | Right Land Suitability Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Farmer Manual Input Form */}
        <form
          onSubmit={handleAnalyzeWithAi}
          className="lg:col-span-5 bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#1A382B]">
            <h4 className="text-sm font-semibold text-white">{t.formTitle}</h4>
            <span className="font-mono text-xs text-[#86EFAC] tabular-nums">
              {formInput.areaHa.toFixed(1)} ha
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="manual-field-name"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.fieldNameLabel}
              </label>
              <input
                id="manual-field-name"
                type="text"
                value={formInput.fieldName}
                onChange={(e) => updateField('fieldName', e.target.value)}
                required
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label
                htmlFor="manual-area-ha"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.areaHaLabel}
              </label>
              <input
                id="manual-area-ha"
                type="number"
                step={0.1}
                min={0.1}
                max={5000}
                value={formInput.areaHa}
                onChange={(e) => updateField('areaHa', Math.max(0.1, Number(e.target.value) || 0.1))}
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="manual-soil-type"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.soilTypeLabel}
              </label>
              <select
                id="manual-soil-type"
                value={formInput.soilType}
                onChange={(e) => updateField('soilType', e.target.value as SoilTypeKey)}
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white cursor-pointer"
              >
                {(Object.keys(t.soilOptions) as SoilTypeKey[]).map((key) => (
                  <option key={key} value={key}>
                    {t.soilOptions[key]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="manual-irrigation"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.irrigationLabel}
              </label>
              <select
                id="manual-irrigation"
                value={formInput.irrigation}
                onChange={(e) =>
                  updateField('irrigation', e.target.value as IrrigationTypeKey)
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white cursor-pointer"
              >
                {(Object.keys(t.irrigationOptions) as IrrigationTypeKey[]).map((key) => (
                  <option key={key} value={key}>
                    {t.irrigationOptions[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label
                htmlFor="manual-ph"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.phLabel}
              </label>
              <input
                id="manual-ph"
                type="number"
                step={0.1}
                min={3.5}
                max={8.5}
                value={formInput.ph}
                onChange={(e) =>
                  updateField(
                    'ph',
                    Math.max(3.5, Math.min(8.5, Number(e.target.value) || 5.5))
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>

            <div>
              <label
                htmlFor="manual-moisture"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.moistureLabel}
              </label>
              <input
                id="manual-moisture"
                type="number"
                step={1}
                min={10}
                max={85}
                value={formInput.moisturePct}
                onChange={(e) =>
                  updateField(
                    'moisturePct',
                    Math.max(10, Math.min(85, Number(e.target.value) || 40))
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>

            <div>
              <label
                htmlFor="manual-elevation"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.elevationLabel}
              </label>
              <input
                id="manual-elevation"
                type="number"
                step={10}
                min={0}
                max={2500}
                value={formInput.elevationM}
                onChange={(e) =>
                  updateField(
                    'elevationM',
                    Math.max(0, Math.min(2500, Number(e.target.value) || 0))
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>

            <div>
              <label
                htmlFor="manual-rainfall"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.rainfallLabel}
              </label>
              <input
                id="manual-rainfall"
                type="number"
                step={10}
                min={30}
                max={500}
                value={formInput.rainfallMmMonth}
                onChange={(e) =>
                  updateField(
                    'rainfallMmMonth',
                    Math.max(30, Math.min(500, Number(e.target.value) || 150))
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>

            <div>
              <label
                htmlFor="manual-temp"
                className="block text-xs font-medium text-[#C8DBD2] mb-1"
              >
                {t.tempLabel}
              </label>
              <input
                id="manual-temp"
                type="number"
                step={1}
                min={12}
                max={38}
                value={formInput.tempC}
                onChange={(e) =>
                  updateField(
                    'tempC',
                    Math.max(12, Math.min(38, Number(e.target.value) || 27))
                  )
                }
                className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
              />
            </div>
          </div>

          {/* NPK Inputs */}
          <div className="pt-2 border-t border-[#1A382B]">
            <div className="text-xs font-medium text-[#9CB5A8] mb-2">
              {t.npkSectionLabel}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="manual-n"
                  className="block text-[11px] font-mono text-[#83A193] mb-1"
                >
                  Nitrogen (N)
                </label>
                <input
                  id="manual-n"
                  type="number"
                  min={10}
                  max={250}
                  value={formInput.nitrogenKgHa}
                  onChange={(e) =>
                    updateField('nitrogenKgHa', Math.max(10, Number(e.target.value) || 10))
                  }
                  className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="manual-p"
                  className="block text-[11px] font-mono text-[#83A193] mb-1"
                >
                  Fosfor (P)
                </label>
                <input
                  id="manual-p"
                  type="number"
                  min={5}
                  max={150}
                  value={formInput.phosphorusKgHa}
                  onChange={(e) =>
                    updateField('phosphorusKgHa', Math.max(5, Number(e.target.value) || 5))
                  }
                  className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="manual-k"
                  className="block text-[11px] font-mono text-[#83A193] mb-1"
                >
                  Kalium (K)
                </label>
                <input
                  id="manual-k"
                  type="number"
                  min={20}
                  max={300}
                  value={formInput.potassiumKgHa}
                  onChange={(e) =>
                    updateField('potassiumKgHa', Math.max(20, Number(e.target.value) || 20))
                  }
                  className="w-full bg-[#081912] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-sm font-mono tabular-nums text-white"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isAnalyzingAi}
            className="mt-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] disabled:opacity-60 disabled:cursor-wait rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAnalyzingAi ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isAnalyzingAi ? t.analyzingButton : t.analyzeButton}</span>
          </button>
        </form>

        {/* Right: Land Suitability Scoring Dashboard & Gemini Plan */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Summary KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-xs text-[#83A193]">{t.topMatchLabel}</div>
              <div className="flex items-baseline justify-between gap-2 mt-1">
                <span className="text-lg font-bold text-white flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{topCrop.cropName[lang]}</span>
                </span>
                <span className="font-mono text-lg font-bold text-[#34D399] tabular-nums">
                  {topCrop.scorePct}%
                </span>
              </div>
              <div className="text-xs text-[#9CB5A8] mt-1 font-mono tabular-nums">
                {topCrop.varietyHint} · {topCrop.estimatedYieldTHa}
              </div>
            </div>

            <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-4">
              <div className="text-xs text-[#83A193]">{t.soilHealthLabel}</div>
              <div className={`flex items-center gap-2 text-base font-bold mt-1 ${soilHealthColor}`}>
                <SoilHealthIcon className="w-4 h-4 shrink-0" />
                <span>{soilHealthLabel}</span>
              </div>
              <div className="text-xs text-[#9CB5A8] mt-1 font-mono tabular-nums">
                pH {formInput.ph.toFixed(1)} · {formInput.moisturePct}% · {formInput.elevationM} mdpl
              </div>
            </div>
          </div>

          {/* Crop Suitability Horizontal BarChart */}
          <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h4 className="text-sm font-semibold text-white">{t.suitabilityChartTitle}</h4>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#9CB5A8]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" />
                  {t.classes.s1}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#38BDF8]" />
                  {t.classes.s2}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" />
                  {t.classes.s3}
                </span>
              </div>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 8, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#183629" horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: '#83A193', fontSize: 11 }}
                    axisLine={{ stroke: '#1E3F31' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={165}
                    tick={{ fill: '#D1E3DA', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as (typeof chartData)[number];
                      return (
                        <div className="bg-[#06130E] border border-[#244E3D] rounded-lg px-3 py-2.5 shadow-xl max-w-xs">
                          <div className="flex items-center justify-between gap-3 text-xs font-semibold text-white">
                            <span>{row.name}</span>
                            <span className="font-mono tabular-nums text-[#34D399]">
                              {row.score}% ({row.suitabilityClass})
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-[#86EFAC] mt-1">
                            {row.varietyHint}
                          </div>
                          <p className="text-[11px] text-[#B8CEC3] mt-1 leading-relaxed">
                            {row.limiting}
                          </p>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.cropId}
                        fill={
                          entry.suitabilityClass === 'S1'
                            ? '#10B981'
                            : entry.suitabilityClass === 'S2'
                            ? '#38BDF8'
                            : '#F59E0B'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pre-Planting Soil Amendments */}
          <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-[#34D399]" />
              <span>{t.amendmentsTitle}</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#D1E3DA]">
              {report.soilAmendments.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-[#081912] border border-[#173428] rounded-lg px-3.5 py-2.5 leading-relaxed"
                >
                  {item[lang]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Top Ranked Suitability Table */}
      <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1E3F31] flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">{t.cropTableTitle}</h4>
          <span className="font-mono text-xs text-[#83A193]">{formInput.fieldName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E3F31] bg-[#081912] text-xs text-[#9CB5A8]">
                <th className="py-3 px-5 font-medium">{t.cropCol}</th>
                <th className="py-3 px-4 font-medium">{t.classCol}</th>
                <th className="py-3 px-4 font-medium text-right">{t.scoreCol}</th>
                <th className="py-3 px-4 font-medium text-right whitespace-nowrap">
                  {t.yieldCol}
                </th>
                <th className="py-3 px-5 font-medium">{t.notesCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#173428] text-xs">
              {report.rankedCrops.map((crop) => {
                const statusText =
                  crop.suitabilityClass === 'S1'
                    ? t.classes.s1
                    : crop.suitabilityClass === 'S2'
                    ? t.classes.s2
                    : t.classes.s3;
                const statusColor =
                  crop.suitabilityClass === 'S1'
                    ? 'text-[#34D399]'
                    : crop.suitabilityClass === 'S2'
                    ? 'text-[#38BDF8]'
                    : 'text-[#FBBF24]';
                const Icon =
                  crop.suitabilityClass === 'S1'
                    ? CheckCircle2
                    : crop.suitabilityClass === 'S2'
                    ? Sprout
                    : AlertTriangle;

                return (
                  <tr key={crop.cropId} className="hover:bg-[#0F2A1F]/60 transition-colors">
                    <td className="py-3 px-5">
                      <div className="font-semibold text-white">{crop.cropName[lang]}</div>
                      <div className="text-[11px] font-mono text-[#83A193] mt-0.5">
                        {crop.varietyHint}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 font-medium ${statusColor}`}>
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{statusText}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-white">
                      {crop.scorePct}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono tabular-nums text-[#C8DBD2] whitespace-nowrap">
                      {crop.estimatedYieldTHa}
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-[#E4EFE9] leading-snug">
                        {crop.limitingFactor[lang]}
                      </div>
                      <div className="text-[11px] text-[#86EFAC] mt-0.5">
                        {crop.fertilizerFocus[lang]}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Gemini AI Agronomic Planting Verdict */}
      <div className="bg-[#0B2219] border border-[#1E3F31] rounded-xl p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
          <Sparkles className="w-4 h-4 text-[#34D399]" />
          <span>{t.aiVerdictTitle}</span>
        </div>

        {aiError && (
          <div className="flex items-start gap-2.5 text-xs text-[#FCA5A5] bg-[#2D1418] border border-[#6E2931] rounded-lg px-3.5 py-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              <strong>{t.aiErrorPrefix}</strong> {aiError}
            </span>
          </div>
        )}

        {!aiAdvice && !aiError && !isAnalyzingAi && (
          <p className="text-xs sm:text-sm text-[#9CB5A8] leading-relaxed">
            {t.aiVerdictEmpty}
          </p>
        )}

        {isAnalyzingAi && (
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-[#86EFAC] py-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t.analyzingButton}</span>
          </div>
        )}

        {aiAdvice && !isAnalyzingAi && (
          <div className="space-y-4">
            <p className="text-sm text-white leading-relaxed">{aiAdvice.bestCropVerdict}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#34D399] mb-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t.aiCalendarLabel}</span>
                </div>
                <p className="text-xs text-[#D5E6DD] leading-relaxed">
                  {aiAdvice.plantingCalendarNote}
                </p>
              </div>

              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#FDE68A] mb-1.5">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{t.aiStepsLabel}</span>
                </div>
                <ul className="space-y-1 text-xs text-[#D5E6DD]">
                  {aiAdvice.soilRemediationSteps.map((step, i) => (
                    <li key={i} className="leading-snug flex items-start gap-1.5">
                      <span className="font-mono text-[#FDE68A] tabular-nums">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#081912] border border-[#1A382B] rounded-lg p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#38BDF8] mb-1.5">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{t.aiIntercropLabel}</span>
                </div>
                <p className="text-xs text-[#D5E6DD] leading-relaxed">
                  {aiAdvice.intercroppingOption}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
