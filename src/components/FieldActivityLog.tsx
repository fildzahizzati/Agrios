import { FormEvent, useEffect, useMemo, useState } from 'react';
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
  CalendarCheck,
  Sprout,
  Droplets,
  FlaskConical,
  Bug,
  Plus,
  Trash2,
  RotateCcw,
  ClipboardCheck,
} from 'lucide-react';
import {
  ActivityType,
  FieldActivityEntry,
  FieldParcel,
  INITIAL_FIELD_ACTIVITIES,
} from '../data/platformData';
import { Lang, TRANSLATIONS } from '../data/i18n';

interface FieldActivityLogProps {
  field: FieldParcel;
  estateName: string;
  lang: Lang;
}

const STORAGE_KEY = 'agrios_custom_field_activities_v1';

function formatIdr(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

export function FieldActivityLog({ field, estateName, lang }: FieldActivityLogProps) {
  const t = TRANSLATIONS[lang].workspace.activityLog;

  const [customEntries, setCustomEntries] = useState<FieldActivityEntry[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customEntries));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [customEntries]);

  const [filterType, setFilterType] = useState<'all' | ActivityType>('all');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // Manual Entry Form State
  const [entryType, setEntryType] = useState<ActivityType>('irrigation');
  const [entryDate, setEntryDate] = useState<string>('2026-04-02');
  const [entryMaterial, setEntryMaterial] = useState<string>('');
  const [entryQuantity, setEntryQuantity] = useState<string>('');
  const [entryCost, setEntryCost] = useState<string>('350000');
  const [entryOperator, setEntryOperator] = useState<string>('Kelompok Tani');
  const [entryImpact, setEntryImpact] = useState<string>('5.5');
  const [entryNote, setEntryNote] = useState<string>('');

  const fieldEntries = useMemo(() => {
    const merged = [
      ...customEntries.filter((e) => e.fieldId === field.id),
      ...INITIAL_FIELD_ACTIVITIES.filter((e) => e.fieldId === field.id),
    ];
    return merged.sort((a, b) => b.date.localeCompare(a.date));
  }, [customEntries, field.id]);

  const filteredEntries = useMemo(() => {
    if (filterType === 'all') return fieldEntries;
    return fieldEntries.filter((e) => e.type === filterType);
  }, [fieldEntries, filterType]);

  const metrics = useMemo(() => {
    const latestPlanting = fieldEntries.find((e) => e.type === 'planting')?.date ?? null;
    const irrigationCount = fieldEntries.filter((e) => e.type === 'irrigation').length;
    const pesticideCount = fieldEntries.filter((e) => e.type === 'pesticide').length;
    const totalSpendPerHa = fieldEntries.reduce((sum, e) => sum + e.costPerHaIdr, 0);
    const avgImpact =
      fieldEntries.length > 0
        ? fieldEntries.reduce((sum, e) => sum + e.vigorImpactPct, 0) / fieldEntries.length
        : 0;

    return {
      totalOps: fieldEntries.length,
      latestPlanting,
      irrigationCount,
      pesticideCount,
      totalSpendPerHa,
      avgImpact,
    };
  }, [fieldEntries]);

  const chartData = useMemo(() => {
    return [...fieldEntries]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((entry) => ({
        id: entry.id,
        label: `${entry.date.slice(5)} · ${t.types[entry.type]}`,
        shortDate: entry.date.slice(5),
        type: entry.type,
        typeName: t.types[entry.type],
        impact: entry.vigorImpactPct,
        material: entry.materialOrMethod,
      }));
  }, [fieldEntries, t.types]);

  const handleSaveEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!entryMaterial.trim() || !entryDate) return;

    const newEntry: FieldActivityEntry = {
      id: `user-${Date.now()}`,
      fieldId: field.id,
      date: entryDate,
      type: entryType,
      materialOrMethod: entryMaterial.trim(),
      quantityLabel: entryQuantity.trim() || '—',
      costPerHaIdr: Math.max(0, Number(entryCost) || 0),
      operator: entryOperator.trim() || 'Petani',
      vigorImpactPct: Number((Number(entryImpact) || 0).toFixed(1)),
      note: entryNote.trim() || '—',
      isUserEntry: true,
    };

    setCustomEntries((prev) => [newEntry, ...prev]);
    setEntryMaterial('');
    setEntryQuantity('');
    setEntryNote('');
    setIsFormOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    setCustomEntries((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetCustom = () => {
    setCustomEntries((prev) => prev.filter((item) => item.fieldId !== field.id));
  };

  const hasCustomForField = customEntries.some((item) => item.fieldId === field.id);

  const getTypeVisual = (type: ActivityType) => {
    if (type === 'planting') {
      return { Icon: Sprout, color: 'text-[#34D399]', barColor: '#10B981' };
    }
    if (type === 'irrigation') {
      return { Icon: Droplets, color: 'text-[#38BDF8]', barColor: '#38BDF8' };
    }
    if (type === 'fertilization') {
      return { Icon: FlaskConical, color: 'text-[#FBBF24]', barColor: '#F59E0B' };
    }
    return { Icon: Bug, color: 'text-[#F87171]', barColor: '#EF4444' };
  };

  const filterOptions: Array<{ key: 'all' | ActivityType; label: string }> = [
    { key: 'all', label: t.filterAll },
    { key: 'planting', label: t.types.planting },
    { key: 'irrigation', label: t.types.irrigation },
    { key: 'fertilization', label: t.types.fertilization },
    { key: 'pesticide', label: t.types.pesticide },
  ];

  return (
    <div className="mt-5 bg-[#0B2219] border border-[#1E3F31] rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#1E3F31]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#34D399]">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>{t.eyebrow}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#94B0A3]">
              {field.name[lang]} ({estateName})
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {t.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#9CB5A8] max-w-3xl">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {hasCustomForField && (
            <button
              type="button"
              onClick={handleResetCustom}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#C8DBD2] bg-[#081912] hover:bg-[#143326] border border-[#1E3F31] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.resetButton}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsFormOpen((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isFormOpen ? (
              <span>{t.cancelButton}</span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addButton.replace(/^\+\s*/, '')}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Historical Management KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-5">
        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.totalOps}</div>
          <div className="font-mono text-lg font-bold text-white tabular-nums mt-0.5">
            {metrics.totalOps}
          </div>
        </div>

        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.latestPlanting}</div>
          <div className="font-mono text-sm sm:text-base font-bold text-[#34D399] tabular-nums mt-1 flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
            <span>{metrics.latestPlanting ?? t.noPlantingYet}</span>
          </div>
        </div>

        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.irrigationCycles}</div>
          <div className="font-mono text-lg font-bold text-[#38BDF8] tabular-nums mt-0.5">
            {metrics.irrigationCount}
          </div>
        </div>

        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.pesticidePasses}</div>
          <div className="font-mono text-lg font-bold text-[#FDE68A] tabular-nums mt-0.5">
            {metrics.pesticideCount}
          </div>
        </div>

        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.avgImpact}</div>
          <div className="font-mono text-lg font-bold text-[#34D399] tabular-nums mt-0.5">
            +{metrics.avgImpact.toFixed(1)}%
          </div>
        </div>

        <div className="bg-[#081912] border border-[#1B382B] rounded-xl p-3">
          <div className="text-[11px] text-[#83A193]">{t.kpis.totalSpendHa}</div>
          <div className="font-mono text-sm sm:text-base font-bold text-white tabular-nums mt-1">
            {formatIdr(metrics.totalSpendPerHa)}
          </div>
        </div>
      </div>

      {/* Manual Entry Form (Collapsible) */}
      {isFormOpen && (
        <form
          onSubmit={handleSaveEntry}
          className="mt-5 bg-[#081912] border border-[#24523E] rounded-xl p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3.5"
        >
          <div className="md:col-span-3">
            <label
              htmlFor="activity-type-select"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.typeLabel}
            </label>
            <select
              id="activity-type-select"
              value={entryType}
              onChange={(e) => setEntryType(e.target.value as ActivityType)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white cursor-pointer"
            >
              <option value="planting">{t.types.planting}</option>
              <option value="irrigation">{t.types.irrigation}</option>
              <option value="fertilization">{t.types.fertilization}</option>
              <option value="pesticide">{t.types.pesticide}</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="activity-date-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.dateLabel}
            </label>
            <input
              id="activity-date-input"
              type="date"
              required
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-white"
            />
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="activity-material-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.materialLabel}
            </label>
            <input
              id="activity-material-input"
              type="text"
              required
              placeholder={t.form.materialPlaceholder}
              value={entryMaterial}
              onChange={(e) => setEntryMaterial(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-[#5F7E6F]"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="activity-quantity-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.quantityLabel}
            </label>
            <input
              id="activity-quantity-input"
              type="text"
              placeholder={t.form.quantityPlaceholder}
              value={entryQuantity}
              onChange={(e) => setEntryQuantity(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-white placeholder-[#5F7E6F]"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="activity-cost-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.costLabel}
            </label>
            <input
              id="activity-cost-input"
              type="number"
              min={0}
              step={10000}
              value={entryCost}
              onChange={(e) => setEntryCost(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm font-mono tabular-nums text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="activity-impact-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.impactLabel}
            </label>
            <input
              id="activity-impact-input"
              type="number"
              step={0.5}
              min={-15}
              max={25}
              value={entryImpact}
              onChange={(e) => setEntryImpact(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm font-mono tabular-nums text-white"
            />
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="activity-operator-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.operatorLabel}
            </label>
            <input
              id="activity-operator-input"
              type="text"
              value={entryOperator}
              onChange={(e) => setEntryOperator(e.target.value)}
              className="w-full bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white"
            />
          </div>

          <div className="md:col-span-4 flex flex-col justify-end">
            <label
              htmlFor="activity-note-input"
              className="block text-xs font-medium text-[#C8DBD2] mb-1"
            >
              {t.form.noteLabel}
            </label>
            <div className="flex gap-2">
              <input
                id="activity-note-input"
                type="text"
                placeholder={t.form.notePlaceholder}
                value={entryNote}
                onChange={(e) => setEntryNote(e.target.value)}
                className="flex-1 min-w-0 bg-[#0B2219] border border-[#224838] focus:border-[#10B981] focus:outline-none rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-[#5F7E6F]"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {t.saveButton}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Filter Tabs + Split Table & Performance Chart */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter Field Activities"
          className="flex flex-wrap items-center gap-1 p-1 bg-[#081912] border border-[#1B382B] rounded-lg"
        >
          {filterOptions.map((opt) => {
            const active = filterType === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setFilterType(opt.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-[#0D9F58] text-white font-semibold'
                    : 'text-[#B2C7BD] hover:text-white hover:bg-[#143326]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <span className="font-mono text-xs text-[#83A193] tabular-nums">
          {filteredEntries.length} / {fieldEntries.length}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 mt-4">
        {/* Chronological Table */}
        <div className="xl:col-span-8 bg-[#081912] border border-[#1B382B] rounded-xl overflow-hidden">
          {filteredEntries.length === 0 ? (
            <div className="p-8 text-center text-xs sm:text-sm text-[#83A193]">
              {t.emptyState}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1B382B] bg-[#06130E] text-[11px] font-medium text-[#83A193]">
                    <th className="py-2.5 px-4 whitespace-nowrap">{t.tableHeaders.date}</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">{t.tableHeaders.activity}</th>
                    <th className="py-2.5 px-3">{t.tableHeaders.material}</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">
                      {t.tableHeaders.dosage}
                    </th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">
                      {t.tableHeaders.cost}
                    </th>
                    <th className="py-2.5 px-4 text-right whitespace-nowrap">
                      {t.tableHeaders.impact}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#152E23] text-xs">
                  {filteredEntries.map((entry) => {
                    const vis = getTypeVisual(entry.type);
                    const TypeIcon = vis.Icon;
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-[#0D251B]/70 transition-colors align-top"
                      >
                        <td className="py-3 px-4 font-mono tabular-nums text-[#C8DBD2] whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 font-medium ${vis.color}`}
                          >
                            <TypeIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.types[entry.type]}</span>
                          </span>
                          <div className="text-[11px] text-[#7D9B8D] mt-0.5">
                            {entry.operator}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-white font-medium leading-snug">
                            {entry.materialOrMethod}
                            {entry.isUserEntry && (
                              <span className="ml-2 text-[10px] font-mono text-[#86EFAC]">
                                · {t.customTag}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#94B0A3] mt-0.5 leading-snug">
                            {entry.note}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-[#D1E3DA] whitespace-nowrap">
                          {entry.quantityLabel}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-[#D1E3DA] whitespace-nowrap">
                          {formatIdr(entry.costPerHaIdr)}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span
                              className={`font-mono tabular-nums font-semibold ${
                                entry.vigorImpactPct >= 0
                                  ? 'text-[#34D399]'
                                  : 'text-[#FCA5A5]'
                              }`}
                            >
                              {entry.vigorImpactPct >= 0 ? '+' : ''}
                              {entry.vigorImpactPct.toFixed(1)}%
                            </span>
                            {entry.isUserEntry && (
                              <button
                                type="button"
                                onClick={() => handleDeleteEntry(entry.id)}
                                aria-label={t.deleteLabel}
                                title={t.deleteLabel}
                                className="text-[#7D9B8D] hover:text-[#FCA5A5] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Historical Management Performance Recharts BarChart */}
        <div className="xl:col-span-4 bg-[#081912] border border-[#1B382B] rounded-xl p-4 flex flex-col">
          <div className="mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C8DBD2]">
              {t.chartTitle}
            </h4>
            <p className="text-[11px] text-[#83A193] mt-0.5">{t.chartSubtitle}</p>
          </div>

          <div className="h-[220px] w-full mt-auto">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[#7D9B8D]">
                {t.emptyState}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#183629" vertical={false} />
                  <XAxis
                    dataKey="shortDate"
                    tick={{ fill: '#83A193', fontSize: 11 }}
                    axisLine={{ stroke: '#1E3F31' }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `+${v}%`}
                    tick={{ fill: '#83A193', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }}
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const row = payload[0].payload as (typeof chartData)[number];
                      return (
                        <div className="bg-[#06130E] border border-[#244E3D] rounded-lg px-3 py-2 shadow-xl max-w-xs">
                          <div className="text-xs font-semibold text-white">
                            {row.typeName}
                          </div>
                          <div className="text-[11px] text-[#9CB5A8] mt-0.5">
                            {row.material}
                          </div>
                          <div className="text-[11px] font-mono text-[#34D399] tabular-nums mt-1">
                            {row.impact >= 0 ? `+${row.impact}` : row.impact}% Vigor
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="impact" radius={[4, 4, 0, 0]} barSize={22}>
                    {chartData.map((entry) => (
                      <Cell key={entry.id} fill={getTypeVisual(entry.type).barColor} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
