import React, { useEffect, useMemo, useState } from 'react';
import {
  CloudRain,
  Download,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Plus,
  ScanLine,
  Sprout,
  Wind,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  X,
  Sun,
  Cloud,
  CloudLightning,
  Globe,
  Columns2,
  ClipboardList,
  Calculator,
  TrendingUp,
} from 'lucide-react';
import {
  ESTATE_MAPS,
  EstateMapId,
  MapLayer,
  SEASON_DATES,
  ScoutingNote,
  getField7DayOutlook,
  getFieldSoilMoisture30Days,
  type ForecastDay,
} from '../data/platformData';
import { TRANSLATIONS, type Lang } from '../data/i18n';
import type { ActiveFieldContext } from './AgronomistChat';
import { SoilNutrientChart } from './SoilNutrientChart';
import { SoilMoistureChart } from './SoilMoistureChart';
import ExplainableAIPanel from './ExplainableAIPanel';
import { CompareFieldsPanel } from './CompareFieldsPanel';
import { ManualFieldSuitabilityPanel } from './ManualFieldSuitabilityPanel';
import { FieldActivityLog } from './FieldActivityLog';
import { FertilizerCalculator } from './FertilizerCalculator';
import { YieldForecastPanel } from './YieldForecastPanel';

interface InteractivePlatformProps {
  lang: Lang;
  onChangeLang: (lang: Lang) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onContextChange?: (ctx: ActiveFieldContext) => void;
  onOpenAgronomist?: () => void;
}

const MAX_SAFE_WIND_KMH = 12;
const MAX_SAFE_RAIN_MM = 0.5;

export function InteractivePlatform({
  lang,
  onChangeLang,
  isExpanded,
  onToggleExpand,
  onContextChange,
  onOpenAgronomist,
}: InteractivePlatformProps) {
  const t = TRANSLATIONS[lang].workspace;
  const [selectedEstateId, setSelectedEstateId] = useState<EstateMapId>('subang-jabar');
  const activeEstate = useMemo(
    () => ESTATE_MAPS.find((e) => e.id === selectedEstateId) ?? ESTATE_MAPS[0],
    [selectedEstateId]
  );
  const activeParcels = activeEstate.parcels;

  const [selectedFieldId, setSelectedFieldId] = useState<string>(ESTATE_MAPS[0].parcels[0].id);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('ndvi');
  const [dateIndex, setDateIndex] = useState<number>(3);
  const [isPlayingSeason, setIsPlayingSeason] = useState<boolean>(false);
  const [isScanningBoundaries, setIsScanningBoundaries] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  const [vraRatesByField, setVraRatesByField] = useState<
    Record<string, { high: number; medium: number; low: number }>
  >(() => {
    const initial: Record<string, { high: number; medium: number; low: number }> = {};
    for (const estate of ESTATE_MAPS) {
      for (const f of estate.parcels) {
        initial[f.id] = {
          high: f.zones[0].defaultRateKgHa,
          medium: f.zones[1].defaultRateKgHa,
          low: f.zones[2].defaultRateKgHa,
        };
      }
    }
    return initial;
  });

  const [scoutingNotesByEstate, setScoutingNotesByEstate] = useState<
    Record<EstateMapId, ScoutingNote[]>
  >(() => ({
    'subang-jabar': ESTATE_MAPS[0].initialScoutingNotes,
    'lampung-tengah': ESTATE_MAPS[1].initialScoutingNotes,
    'merauke-papua': ESTATE_MAPS[2].initialScoutingNotes,
  }));
  const scoutingNotes = scoutingNotesByEstate[activeEstate.id];

  const [selectedPinId, setSelectedPinId] = useState<string | null>(
    ESTATE_MAPS[0].initialScoutingNotes[0]?.id ?? null
  );
  const [isAddingPin, setIsAddingPin] = useState<boolean>(false);
  const [draftPinCoords, setDraftPinCoords] = useState<{ x: number; y: number } | null>(null);
  const [draftCategory, setDraftCategory] =
    useState<ScoutingNote['category']>('Weed Pressure');
  const [draftSeverity, setDraftSeverity] =
    useState<ScoutingNote['severity']>('Moderate');
  const [draftNoteText, setDraftNoteText] = useState<string>('');
  const [exportToast, setExportToast] = useState<string | null>(null);
  const [dismissedWarningKey, setDismissedWarningKey] = useState<string | null>(null);
  const [showForecastOverlay, setShowForecastOverlay] = useState<boolean>(true);
  const [selectedForecastDayIdx, setSelectedForecastDayIdx] = useState<number>(0);
  const [workspaceMode, setWorkspaceMode] = useState<'map' | 'compare' | 'manual' | 'calculator' | 'yield'>('map');

  const handleSelectEstate = (estateId: EstateMapId) => {
    if (estateId === selectedEstateId) return;
    const nextEstate = ESTATE_MAPS.find((e) => e.id === estateId) ?? ESTATE_MAPS[0];
    setSelectedEstateId(estateId);
    setSelectedFieldId(nextEstate.parcels[0].id);
    setSelectedPinId(scoutingNotesByEstate[estateId]?.[0]?.id ?? null);
    setIsAddingPin(false);
    setDraftPinCoords(null);
    setImgError(false);
  };

  const selectedField = useMemo(
    () => activeParcels.find((f) => f.id === selectedFieldId) || activeParcels[0],
    [activeParcels, selectedFieldId]
  );

  const activeSnapshot = selectedField.snapshots[dateIndex];
  const currentRates = vraRatesByField[selectedField.id];

  const outlook = useMemo(
    () => getField7DayOutlook(selectedField, dateIndex),
    [selectedField, dateIndex]
  );
  const activeForecastDay: ForecastDay =
    outlook.days[selectedForecastDayIdx] ?? outlook.days[0];

  const windExceeded = activeSnapshot.windKmh > MAX_SAFE_WIND_KMH;
  const rainExceeded = activeSnapshot.rainMm > MAX_SAFE_RAIN_MM;
  const isSprayUnsafe = windExceeded || rainExceeded;
  const isCriticalSprayHold =
    activeSnapshot.windKmh > 18 || activeSnapshot.rainMm > 3;
  const snapshotWarningKey = `${selectedField.id}:${activeSnapshot.date}`;
  const showSprayOverlay =
    isSprayUnsafe && dismissedWarningKey !== snapshotWarningKey;

  useEffect(() => {
    if (!isPlayingSeason) return;
    const timer = window.setInterval(() => {
      setDateIndex((prev) => (prev + 1) % SEASON_DATES.length);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [isPlayingSeason]);

  const handleRunBoundaryScan = () => {
    setActiveLayer('boundaries');
    setIsScanningBoundaries(true);
    window.setTimeout(() => {
      setIsScanningBoundaries(false);
    }, 1200);
  };

  const vraSummary = useMemo(() => {
    const zHigh = selectedField.zones[0];
    const zMed = selectedField.zones[1];
    const zLow = selectedField.zones[2];

    const vraTotalKg =
      zHigh.areaHa * currentRates.high +
      zMed.areaHa * currentRates.medium +
      zLow.areaHa * currentRates.low;
    const uniformTotalKg = selectedField.areaHa * selectedField.uniformRateKgHa;
    const diffKg = uniformTotalKg - vraTotalKg;
    const savingsPct = (diffKg / uniformTotalKg) * 100;

    return {
      vraTotalTons: vraTotalKg / 1000,
      uniformTotalTons: uniformTotalKg / 1000,
      diffKg,
      savingsPct,
    };
  }, [selectedField, currentRates]);

  useEffect(() => {
    if (!onContextChange) return;
    onContextChange({
      fieldName: selectedField.name[lang],
      crop: selectedField.crop[lang],
      variety: selectedField.variety,
      areaHa: selectedField.areaHa,
      soilType: selectedField.soilType[lang],
      date: activeSnapshot.date,
      meanNdvi: activeSnapshot.meanNdvi,
      minNdvi: activeSnapshot.minNdvi,
      maxNdvi: activeSnapshot.maxNdvi,
      growthStage: activeSnapshot.growthStage[lang],
      sprayWindow: activeSnapshot.sprayWindow,
      windKmh: activeSnapshot.windKmh,
      tempC: activeSnapshot.tempC,
      rainMm: activeSnapshot.rainMm,
      fertilizerProduct: selectedField.fertilizerProduct[lang],
      vraSavingsPct: vraSummary.savingsPct,
    });
  }, [selectedField, activeSnapshot, vraSummary.savingsPct, lang, onContextChange]);

  const handleRateChange = (zoneKey: 'high' | 'medium' | 'low', value: number) => {
    setVraRatesByField((prev) => ({
      ...prev,
      [selectedField.id]: {
        ...prev[selectedField.id],
        [zoneKey]: value,
      },
    }));
  };

  const handleExportGeoJSON = () => {
    const [lng, lat] = selectedField.centerGeo;
    const payload = {
      type: 'FeatureCollection',
      name: `${selectedField.name[lang].replace(/\s+/g, '_')}_VRA_Prescription`,
      properties: {
        region: activeEstate.regionLabel[lang],
        crop: selectedField.crop[lang],
        product: selectedField.fertilizerProduct[lang],
        totalAreaHa: selectedField.areaHa,
        totalAppliedTons: Number(vraSummary.vraTotalTons.toFixed(2)),
        generatedAt: new Date().toISOString().slice(0, 10),
      },
      features: selectedField.zones.map((zone, idx) => ({
        type: 'Feature',
        properties: {
          zone: zone.label[lang],
          areaHa: zone.areaHa,
          targetRateKgHa: currentRates[zone.id],
          unit: 'kg/ha',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [lng - 0.003 + idx * 0.001, lat - 0.002],
              [lng + 0.003 + idx * 0.001, lat - 0.002],
              [lng + 0.003 + idx * 0.001, lat + 0.002],
              [lng - 0.003 + idx * 0.001, lat + 0.002],
              [lng - 0.003 + idx * 0.001, lat - 0.002],
            ],
          ],
        },
      })),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/geo+json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agrios-${selectedField.id}-vra.geojson`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    setExportToast(`${t.exportedPrefix} ${selectedField.name[lang]}`);
    window.setTimeout(() => setExportToast(null), 3200);
  };

  const handleMapClickForPin = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isAddingPin) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 562);
    setDraftPinCoords({ x, y });
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftPinCoords || !draftNoteText.trim()) return;
    const noteText = draftNoteText.trim();
    const newPin: ScoutingNote = {
      id: `scout-${Date.now()}`,
      fieldId: selectedField.id,
      x: draftPinCoords.x,
      y: draftPinCoords.y,
      category: draftCategory,
      severity: draftSeverity,
      author: lang === 'id' ? 'Agronomis Lapangan' : 'Field Agronomist',
      date: activeSnapshot.shortDate,
      note: {
        en: noteText,
        id: noteText,
      },
    };
    setScoutingNotesByEstate((prev) => ({
      ...prev,
      [activeEstate.id]: [newPin, ...(prev[activeEstate.id] ?? [])],
    }));
    setSelectedPinId(newPin.id);
    setDraftPinCoords(null);
    setDraftNoteText('');
    setIsAddingPin(false);
  };

  const activePin = useMemo(
    () => scoutingNotes.find((p) => p.id === selectedPinId) || null,
    [scoutingNotes, selectedPinId]
  );

  const translateCategory = (cat: ScoutingNote['category']) => {
    if (cat === 'Weed Pressure') return t.categories.weed;
    if (cat === 'Nitrogen Deficiency') return t.categories.nitrogen;
    if (cat === 'Pest / Disease') return t.categories.pest;
    return t.categories.emergence;
  };

  const translateSeverity = (sev: ScoutingNote['severity']) => {
    if (sev === 'High') return t.severities.high;
    if (sev === 'Moderate') return t.severities.moderate;
    return t.severities.low;
  };

  const sparklinePoints = useMemo(() => {
    const width = 260;
    const height = 76;
    const padX = 10;
    const padY = 10;
    return selectedField.snapshots.map((snap, idx) => {
      const x =
        padX + (idx / (selectedField.snapshots.length - 1)) * (width - padX * 2);
      const y = height - padY - ((snap.meanNdvi - 0.1) / 0.85) * (height - padY * 2);
      return { x, y, snap };
    });
  }, [selectedField]);

  const sparklinePath = sparklinePoints
    .map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const layerTabs: { id: MapLayer; label: string }[] = [
    { id: 'boundaries', label: t.layers.boundaries },
    { id: 'ndvi', label: t.layers.ndvi },
    { id: 'ndmi', label: t.layers.ndmi },
    { id: 'ndre', label: t.layers.ndre },
    { id: 'zones', label: t.layers.zones },
    { id: 'vra', label: t.layers.vra },
    { id: 'scouting', label: t.layers.scouting },
  ];

  const totalFarmHa = activeParcels.reduce((sum, f) => sum + f.areaHa, 0);

  return (
    <section
      id="interactive-platform"
      aria-label="Interactive Precision Agriculture Workspace"
      className={
        isExpanded
          ? 'fixed inset-0 z-50 bg-[#0B1F17] text-[#F1F5F2] flex flex-col overflow-y-auto'
          : 'py-20 bg-[#0B1F17] text-[#F1F5F2] border-y border-[#1A382B]'
      }
    >
      <div
        className={
          isExpanded
            ? 'flex-1 flex flex-col max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-4 min-h-0'
            : 'max-w-[1240px] mx-auto px-6'
        }
      >
        {/* Workspace Header & Regional Map Switcher */}
        <div className="flex flex-col gap-4 pb-5 border-b border-[#1E3F31]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#94B0A3] font-mono tabular-nums">
                <span>{activeEstate.regionLabel[lang]}</span>
                <span aria-hidden="true">·</span>
                <span>{activeEstate.coordinatesLabel}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {activeParcels.length} {t.parcelsLabel}
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  {totalFarmHa.toFixed(1)} {t.totalHaLabel}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-[28px] font-bold tracking-tight text-white mt-1">
                {t.title}
              </h2>
            </div>

            {/* Regional Map Selector Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div
                role="group"
                aria-label={t.mapSelectorLabel}
                className="flex flex-wrap items-center gap-1 p-1 bg-[#112A20] border border-[#1E3F31] rounded-lg"
              >
                <span className="inline-flex items-center gap-1.5 px-2.5 text-[11px] font-medium text-[#94B0A3] whitespace-nowrap shrink-0">
                  <Globe className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{t.mapSelectorLabel}:</span>
                </span>
                {ESTATE_MAPS.map((estate) => {
                  const active = estate.id === activeEstate.id;
                  return (
                    <button
                      key={estate.id}
                      type="button"
                      onClick={() => handleSelectEstate(estate.id)}
                      aria-pressed={active}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#0D9F58] text-white font-semibold'
                          : 'text-[#C8DBD2] hover:text-white hover:bg-[#17362A]'
                      }`}
                    >
                      {estate.shortName[lang]}
                    </button>
                  );
                })}
              </div>

              {/* Workspace Language Switcher */}
              <div
                role="group"
                aria-label="Workspace Language"
                className="inline-flex items-center gap-0.5 p-1 bg-[#112A20] border border-[#1E3F31] rounded-lg"
              >
                <button
                  type="button"
                  onClick={() => onChangeLang('id')}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    lang === 'id' ? 'bg-[#0D9F58] text-white' : 'text-[#94B0A3] hover:text-white'
                  }`}
                >
                  ID
                </button>
                <button
                  type="button"
                  onClick={() => onChangeLang('en')}
                  className={`px-2 py-1 text-xs font-semibold rounded transition-colors cursor-pointer ${
                    lang === 'en' ? 'bg-[#0D9F58] text-white' : 'text-[#94B0A3] hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>

          {/* Spectral Layer Tabs & Analysis Expansion Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label="Map Data Layers"
              className="flex flex-wrap items-center gap-1 p-1 bg-[#112A20] border border-[#1E3F31] rounded-lg"
            >
              {layerTabs.map((tab) => {
                const isActive = activeLayer === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setWorkspaceMode('map');
                      setActiveLayer(tab.id);
                      if (tab.id !== 'scouting') setIsAddingPin(false);
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      workspaceMode === 'map' && isActive
                        ? 'bg-[#0D9F58] text-white'
                        : 'text-[#B2C7BD] hover:text-white hover:bg-[#17362A]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsPlayingSeason(false);
                  setWorkspaceMode((prev) => (prev === 'yield' ? 'map' : 'yield'));
                }}
                aria-pressed={workspaceMode === 'yield'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'yield'
                    ? 'bg-[#17382B] text-[#86EFAC] border-[#10B981] font-semibold'
                    : 'text-[#E2EFE8] bg-[#112A20] hover:bg-[#193D2F] border-[#244A3A]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t.yieldForecast.toggleButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlayingSeason(false);
                  setWorkspaceMode((prev) => (prev === 'calculator' ? 'map' : 'calculator'));
                }}
                aria-pressed={workspaceMode === 'calculator'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'calculator'
                    ? 'bg-[#17382B] text-[#86EFAC] border-[#10B981] font-semibold'
                    : 'text-[#E2EFE8] bg-[#112A20] hover:bg-[#193D2F] border-[#244A3A]'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>{t.fertilizerCalc.toggleButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlayingSeason(false);
                  setWorkspaceMode((prev) => (prev === 'manual' ? 'map' : 'manual'));
                }}
                aria-pressed={workspaceMode === 'manual'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'manual'
                    ? 'bg-[#17382B] text-[#86EFAC] border-[#10B981] font-semibold'
                    : 'text-[#E2EFE8] bg-[#112A20] hover:bg-[#193D2F] border-[#244A3A]'
                }`}
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>{t.manualInput.toggleButton}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPlayingSeason(false);
                  setWorkspaceMode((prev) => (prev === 'compare' ? 'map' : 'compare'));
                }}
                aria-pressed={workspaceMode === 'compare'}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  workspaceMode === 'compare'
                    ? 'bg-[#17382B] text-[#86EFAC] border-[#10B981] font-semibold'
                    : 'text-[#E2EFE8] bg-[#112A20] hover:bg-[#193D2F] border-[#244A3A]'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>{t.compareFields.toggleButton}</span>
              </button>

              {onOpenAgronomist && (
                <button
                  type="button"
                  onClick={onOpenAgronomist}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t.askAgronomist}</span>
                </button>
              )}

              <button
                type="button"
                onClick={onToggleExpand}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isExpanded
                    ? 'bg-[#17382B] text-[#86EFAC] border-[#10B981]'
                    : 'text-[#E2EFE8] bg-[#112A20] hover:bg-[#193D2F] border-[#244A3A]'
                }`}
                aria-label={isExpanded ? t.exitFullscreen : t.expandMap}
              >
                {isExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>{t.exitFullscreen}</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{t.expandMap}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {workspaceMode === 'compare' ? (
          <CompareFieldsPanel
            lang={lang}
            activeDateIndex={dateIndex}
            onChangeDateIndex={(idx) => {
              setIsPlayingSeason(false);
              setDateIndex(idx);
            }}
            primaryFieldId={selectedField.id}
            vraRatesByField={vraRatesByField}
            onClose={() => setWorkspaceMode('map')}
          />
        ) : workspaceMode === 'manual' ? (
          <ManualFieldSuitabilityPanel
            lang={lang}
            onClose={() => setWorkspaceMode('map')}
          />
        ) : workspaceMode === 'calculator' ? (
          <FertilizerCalculator
            field={selectedField}
            activeDateIndex={dateIndex}
            lang={lang}
            onClose={() => setWorkspaceMode('map')}
          />
        ) : workspaceMode === 'yield' ? (
          <YieldForecastPanel
            estateName={activeEstate.regionLabel[lang]}
            field={selectedField}
            activeDateIndex={dateIndex}
            onChangeDateIndex={(idx) => {
              setIsPlayingSeason(false);
              setDateIndex(idx);
            }}
            lang={lang}
            onClose={() => setWorkspaceMode('map')}
          />
        ) : (
          <>
        {/* Main 3-Column Platform Grid */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-5 pt-5 ${
            isExpanded ? 'flex-1 min-h-0' : ''
          }`}
        >
          {/* Left Rail */}
          <aside className="lg:col-span-3 flex flex-col gap-3 bg-[#10271E] border border-[#1E3F31] rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1E3F31]">
              <span className="text-xs font-semibold text-[#C8DBD2] tracking-wide">
                {t.monitoredFields}
              </span>
              <button
                type="button"
                onClick={handleRunBoundaryScan}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#86EFAC] bg-[#0D9F58]/15 hover:bg-[#0D9F58]/25 border border-[#0D9F58]/40 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ScanLine className="w-3.5 h-3.5" />
                <span>{isScanningBoundaries ? t.detecting : t.autoDetect}</span>
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto">
              {activeParcels.map((field) => {
                const snap = field.snapshots[dateIndex];
                const isSelected = field.id === selectedField.id;
                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setSelectedFieldId(field.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#17382B] border-[#10B981]'
                        : 'bg-[#0D2119] border-[#1B382B] hover:border-[#2E5C48]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-sm font-semibold text-white truncate">
                        {field.name[lang]}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-[#86EFAC] shrink-0">
                        {snap.meanNdvi.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-[#94B0A3]">
                      <span className="truncate">{field.crop[lang]}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums shrink-0">
                        {field.areaHa.toFixed(1)} ha
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-3 border-t border-[#1E3F31] text-xs text-[#94B0A3] leading-relaxed">
              {t.hints[activeLayer]}
            </div>
          </aside>

          {/* Center Viewport */}
          <div className="lg:col-span-6 flex flex-col gap-3 min-h-0">
            <div
              className={`relative w-full aspect-16/9 bg-[#081711] border border-[#1E3F31] rounded-xl overflow-hidden ${
                isExpanded
                  ? 'min-h-[480px] sm:min-h-[540px] xl:min-h-[580px]'
                  : 'min-h-[430px] sm:min-h-[450px]'
              }`}
            >
              {!imgError ? (
                <img
                  key={activeEstate.basemapSrc}
                  src={activeEstate.basemapSrc}
                  alt={activeEstate.basemapAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#0F291E] via-[#133325] to-[#081711] flex flex-col items-center justify-center text-[#94B0A3] gap-2">
                  <Layers className="w-8 h-8 text-[#10B981]" />
                  <span className="text-xs font-mono">Satellite Orthophoto Layer</span>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#07150F]/20 pointer-events-none"
              />

              <svg
                viewBox="0 0 1000 562"
                preserveAspectRatio="xMidYMid slice"
                onClick={handleMapClickForPin}
                className={`absolute inset-0 w-full h-full ${
                  isAddingPin ? 'cursor-crosshair' : 'cursor-pointer'
                }`}
                role="img"
                aria-label="Interactive geospatial parcel map"
              >
                <defs>
                  {activeParcels.map((field) => (
                    <React.Fragment key={`defs-${field.id}`}>
                      <clipPath id={`clip-${field.id}`}>
                        <path d={field.polygonPath} />
                      </clipPath>
                      <linearGradient
                        id={`ndvi-grad-${field.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        {field.ndviGradientStops.map((stop, i) => (
                          <stop key={i} offset={stop.offset} stopColor={stop.color} />
                        ))}
                      </linearGradient>
                      <linearGradient
                        id={`ndmi-grad-${field.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#0284C7" />
                        <stop offset="55%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#2DD4BF" />
                      </linearGradient>
                      <linearGradient
                        id={`ndre-grad-${field.id}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#047857" />
                        <stop offset="55%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#A3E635" />
                      </linearGradient>
                    </React.Fragment>
                  ))}
                </defs>

                {activeParcels.map((field) => {
                  const isSelected = field.id === selectedField.id;
                  const snap = field.snapshots[dateIndex];
                  const ndviOpacity = Math.min(0.82, Math.max(0.28, snap.meanNdvi * 0.92));
                  const moistureSeries = getFieldSoilMoisture30Days(field, dateIndex);
                  const ndmiValue = Math.min(
                    0.68,
                    Math.max(0.05, Number((moistureSeries.currentSurfacePct / 115).toFixed(2)))
                  );
                  const ndreValue = Math.min(
                    0.74,
                    Math.max(
                      0.14,
                      Number((snap.meanNdvi * 0.62 + (snap.nitrogenKgHa / 180) * 0.16).toFixed(2))
                    )
                  );

                  const metricLabel =
                    activeLayer === 'ndmi'
                      ? `NDMI ${ndmiValue.toFixed(2)}`
                      : activeLayer === 'ndre'
                      ? `NDRE ${ndreValue.toFixed(2)}`
                      : `NDVI ${snap.meanNdvi.toFixed(2)}`;

                  return (
                    <g
                      key={field.id}
                      onClick={(e) => {
                        if (isAddingPin) return;
                        e.stopPropagation();
                        setSelectedFieldId(field.id);
                      }}
                    >
                      {activeLayer === 'ndvi' && (
                        <g clipPath={`url(#clip-${field.id})`}>
                          <path
                            d={field.polygonPath}
                            fill={`url(#ndvi-grad-${field.id})`}
                            fillOpacity={ndviOpacity}
                          />
                          <path
                            d={field.zoneSubPolygons.low}
                            fill={snap.meanNdvi < 0.45 ? '#DC2626' : '#F59E0B'}
                            fillOpacity={isSelected ? 0.55 : 0.35}
                          />
                        </g>
                      )}

                      {activeLayer === 'ndmi' && (
                        <g clipPath={`url(#clip-${field.id})`}>
                          <path
                            d={field.polygonPath}
                            fill={`url(#ndmi-grad-${field.id})`}
                            fillOpacity={isSelected ? 0.68 : 0.46}
                          />
                          <path
                            d={field.zoneSubPolygons.low}
                            fill={
                              moistureSeries.status === 'Low Moisture' ? '#EA580C' : '#F59E0B'
                            }
                            fillOpacity={isSelected ? 0.58 : 0.36}
                          />
                        </g>
                      )}

                      {activeLayer === 'ndre' && (
                        <g clipPath={`url(#clip-${field.id})`}>
                          <path
                            d={field.polygonPath}
                            fill={`url(#ndre-grad-${field.id})`}
                            fillOpacity={isSelected ? 0.68 : 0.46}
                          />
                          <path
                            d={field.zoneSubPolygons.low}
                            fill={snap.nitrogenKgHa < 110 ? '#D97706' : '#EAB308'}
                            fillOpacity={isSelected ? 0.56 : 0.34}
                          />
                        </g>
                      )}

                      {(activeLayer === 'zones' || activeLayer === 'vra') && (
                        <g clipPath={`url(#clip-${field.id})`}>
                          <path
                            d={field.polygonPath}
                            fill={activeLayer === 'vra' ? '#3B82F6' : '#84CC16'}
                            fillOpacity={isSelected ? 0.62 : 0.36}
                          />
                          <path
                            d={field.zoneSubPolygons.high}
                            fill={activeLayer === 'vra' ? '#0D9F58' : '#059669'}
                            fillOpacity={isSelected ? 0.72 : 0.42}
                          />
                          <path
                            d={field.zoneSubPolygons.low}
                            fill={activeLayer === 'vra' ? '#F59E0B' : '#EA580C'}
                            fillOpacity={isSelected ? 0.72 : 0.42}
                          />
                        </g>
                      )}

                      <path
                        d={field.polygonPath}
                        fill={
                          activeLayer === 'boundaries' || activeLayer === 'scouting'
                            ? isSelected
                              ? 'rgba(16, 185, 129, 0.14)'
                              : 'rgba(255, 255, 255, 0.04)'
                            : 'transparent'
                        }
                        stroke={
                          isScanningBoundaries
                            ? '#84CC16'
                            : isSelected
                            ? '#FFFFFF'
                            : 'rgba(255,255,255,0.68)'
                        }
                        strokeWidth={isSelected ? 3.2 : 1.8}
                        strokeDasharray={isScanningBoundaries ? '10 6' : undefined}
                      />

                      <g pointerEvents="none">
                        <rect
                          x={field.labelPos.x - 82}
                          y={field.labelPos.y - 18}
                          width="164"
                          height="36"
                          rx="6"
                          fill="rgba(11, 31, 23, 0.84)"
                          stroke={isSelected ? '#10B981' : 'rgba(255,255,255,0.22)'}
                          strokeWidth="1"
                        />
                        <text
                          x={field.labelPos.x}
                          y={field.labelPos.y - 2}
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="11"
                          fontWeight="600"
                          fontFamily="Plus Jakarta Sans, sans-serif"
                        >
                          {field.name[lang]}
                        </text>
                        <text
                          x={field.labelPos.x}
                          y={field.labelPos.y + 12}
                          textAnchor="middle"
                          fill="#A7F3D0"
                          fontSize="10.5"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {field.areaHa.toFixed(1)} ha · {metricLabel}
                        </text>
                      </g>
                    </g>
                  );
                })}

                {activeLayer === 'scouting' &&
                  scoutingNotes.map((pin) => {
                    const isPinSelected = pin.id === selectedPinId;
                    const pinColor =
                      pin.severity === 'High'
                        ? '#EF4444'
                        : pin.severity === 'Moderate'
                        ? '#F59E0B'
                        : '#10B981';

                    return (
                      <g
                        key={pin.id}
                        transform={`translate(${pin.x}, ${pin.y})`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPinId(pin.id);
                          setSelectedFieldId(pin.fieldId);
                        }}
                        className="cursor-pointer"
                      >
                        {isPinSelected && (
                          <circle
                            r="17"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            strokeOpacity="0.85"
                          />
                        )}
                        <circle
                          r="11"
                          fill={pinColor}
                          stroke="#FFFFFF"
                          strokeWidth="2.2"
                        />
                        <circle r="3.5" fill="#FFFFFF" />
                      </g>
                    );
                  })}

                {draftPinCoords && (
                  <g transform={`translate(${draftPinCoords.x}, ${draftPinCoords.y})`}>
                    <circle r="12" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
                  </g>
                )}
              </svg>

              {/* Map Legend Overlay */}
              <div className="absolute top-3 left-3 flex items-center gap-3 px-3 py-1.5 bg-[#0B1F17]/90 border border-[#234838] rounded-lg text-xs text-[#E2EFE8]">
                {activeLayer === 'ndvi' && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-[#94B0A3]">NDVI</span>
                    <span className="font-mono text-[11px] tabular-nums">0.15</span>
                    <div
                      aria-hidden="true"
                      className="w-24 h-2 rounded-sm bg-gradient-to-r from-[#DC2626] via-[#EAB308] to-[#059669]"
                    />
                    <span className="font-mono text-[11px] tabular-nums">0.90</span>
                  </div>
                )}
                {activeLayer === 'ndmi' && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-[#7DD3FC]">NDMI</span>
                    <span className="font-mono text-[11px] tabular-nums">-0.10</span>
                    <div
                      aria-hidden="true"
                      className="w-24 h-2 rounded-sm bg-gradient-to-r from-[#EA580C] via-[#2DD4BF] to-[#0284C7]"
                    />
                    <span className="font-mono text-[11px] tabular-nums">0.65</span>
                  </div>
                )}
                {activeLayer === 'ndre' && (
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] text-[#86EFAC]">NDRE</span>
                    <span className="font-mono text-[11px] tabular-nums">0.12</span>
                    <div
                      aria-hidden="true"
                      className="w-24 h-2 rounded-sm bg-gradient-to-r from-[#D97706] via-[#A3E635] to-[#047857]"
                    />
                    <span className="font-mono text-[11px] tabular-nums">0.72</span>
                  </div>
                )}
                {(activeLayer === 'zones' || activeLayer === 'vra') && (
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" />
                      {t.legend.highZone}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-xs ${
                          activeLayer === 'vra' ? 'bg-[#3B82F6]' : 'bg-[#84CC16]'
                        }`}
                      />
                      {t.legend.targetZone}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-2.5 h-2.5 rounded-xs ${
                          activeLayer === 'vra' ? 'bg-[#F59E0B]' : 'bg-[#EA580C]'
                        }`}
                      />
                      {t.legend.stressZone}
                    </span>
                  </div>
                )}
                {activeLayer === 'boundaries' && (
                  <span className="font-mono text-[11px]">
                    {isScanningBoundaries
                      ? t.legend.scanning
                      : t.legend.activeBoundaries}
                  </span>
                )}
                {activeLayer === 'scouting' && (
                  <span className="font-mono text-[11px]">
                    {isAddingPin
                      ? t.legend.clickToPin
                      : `${scoutingNotes.length} ${t.legend.notesLogged}`}
                  </span>
                )}
              </div>

              {/* Top-Right Map Action Controls */}
              <div className="absolute top-3 right-3 z-20 flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowForecastOverlay((prev) => !prev)}
                  aria-pressed={showForecastOverlay}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showForecastOverlay
                      ? 'bg-[#0B1F17]/95 text-[#86EFAC] border-[#10B981]'
                      : 'bg-[#0B1F17]/90 text-[#E2EFE8] border-[#234838] hover:border-[#10B981]'
                  }`}
                >
                  <Cloud className="w-3.5 h-3.5" />
                  <span>{t.forecast7Day.toggleButton}</span>
                </button>

                {activeLayer === 'scouting' && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingPin((prev) => !prev);
                      setDraftPinCoords(null);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      isAddingPin
                        ? 'bg-white text-[#0B1F17] border-white'
                        : 'bg-[#0D9F58] text-white border-[#10B981] hover:bg-[#0B874B]'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingPin ? t.cancelPin : t.dropPin}</span>
                  </button>
                )}
              </div>

              {/* Unified Bottom Map Overlay Stack: Spraying Safety Alert + 7-Day Forecast */}
              {(showSprayOverlay || showForecastOverlay) && (
                <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
                  {/* Spraying Safety Threshold Notification Overlay */}
                  {showSprayOverlay && (
                    <div
                      role="alert"
                      aria-live="polite"
                      className={`pointer-events-auto sm:max-w-[410px] rounded-xl p-3 bg-[#0B1F17]/95 backdrop-blur-md border shadow-xl transition-opacity duration-150 ${
                        isCriticalSprayHold ? 'border-[#EF4444]' : 'border-[#F59E0B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          {isCriticalSprayHold ? (
                            <XCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <div className="font-display text-xs sm:text-[13px] font-bold text-white">
                              {isCriticalSprayHold
                                ? t.sprayWarning.titleHold
                                : t.sprayWarning.titleMarginal}
                            </div>
                            <div className="text-[11px] font-mono text-[#94B0A3] mt-0.5 truncate tabular-nums">
                              {selectedField.name[lang]} · {activeSnapshot.shortDate}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDismissedWarningKey(snapshotWarningKey)}
                          aria-label={t.sprayWarning.dismiss}
                          className="p-1 rounded-md text-[#94B0A3] hover:text-white hover:bg-[#17382B] transition-colors shrink-0 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-[11px] font-mono tabular-nums">
                        {windExceeded && (
                          <div className="flex items-center justify-between gap-2 text-[#FDE68A]">
                            <span>{t.sprayWarning.windExceeded}</span>
                            <span className="font-semibold text-white shrink-0">
                              {activeSnapshot.windKmh} km/h ({t.sprayWarning.limitLabel} ≤{' '}
                              {MAX_SAFE_WIND_KMH})
                            </span>
                          </div>
                        )}
                        {rainExceeded && (
                          <div className="flex items-center justify-between gap-2 text-[#FCA5A5]">
                            <span>{t.sprayWarning.rainExceeded}</span>
                            <span className="font-semibold text-white shrink-0">
                              {activeSnapshot.rainMm} mm ({t.sprayWarning.limitLabel} ≤{' '}
                              {MAX_SAFE_RAIN_MM})
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="mt-1.5 text-xs text-[#D1E3DA] leading-relaxed">
                        {isCriticalSprayHold
                          ? t.sprayWarning.adviceHold
                          : t.sprayWarning.adviceMarginal}
                      </p>
                    </div>
                  )}

                  {/* 7-Day Weather Forecast Map Overlay */}
                  {showForecastOverlay && (
                    <div
                      aria-label={t.forecast7Day.title}
                      className="pointer-events-auto rounded-xl p-2.5 sm:p-3 bg-[#0B1F17]/92 backdrop-blur-md border border-[#234838] shadow-xl"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#1E3F31]">
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[11px]">
                          <span className="font-display font-bold text-white">
                            {t.forecast7Day.title}
                          </span>
                          <span aria-hidden="true" className="text-[#597769]">
                            ·
                          </span>
                          <span className="font-mono tabular-nums text-[#94B0A3]">
                            {t.forecast7Day.histBaseline}: {outlook.historical7dAvgTempC}°C ·{' '}
                            {outlook.historical7dAvgWindKmh} km/h · {outlook.historical7dRainMm} mm
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-[11px] tabular-nums text-[#86EFAC]">
                            {t.forecast7Day.optimalWindows}: {outlook.optimalDaysCount}/7{' '}
                            {t.forecast7Day.daysUnit}
                          </span>
                          <button
                            type="button"
                            onClick={() => setShowForecastOverlay(false)}
                            aria-label={t.forecast7Day.hideOverlay}
                            className="p-1 rounded-md text-[#94B0A3] hover:text-white hover:bg-[#17382B] transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 7-Day Horizontal Tile Strip */}
                      <div className="mt-2 overflow-x-auto">
                        <div className="grid grid-cols-7 gap-1.5 min-w-[490px] sm:min-w-0">
                          {outlook.days.map((day, idx) => {
                            const isSelectedDay = idx === selectedForecastDayIdx;
                            return (
                              <button
                                key={day.dateLabel}
                                type="button"
                                onClick={() => setSelectedForecastDayIdx(idx)}
                                className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-colors cursor-pointer ${
                                  isSelectedDay
                                    ? 'bg-[#17382B] border-[#10B981] text-white'
                                    : 'bg-[#081711]/75 border-[#1B382B] text-[#C8DBD2] hover:border-[#2E5C48]'
                                }`}
                              >
                                <span className="text-[10px] font-semibold leading-none">
                                  {day.weekday[lang]}
                                </span>
                                <span className="text-[9px] font-mono text-[#83A193] mt-0.5 leading-none tabular-nums">
                                  {day.dateLabel}
                                </span>

                                <div className="my-1.5">
                                  {day.condition === 'clear' && (
                                    <Sun className="w-3.5 h-3.5 text-[#FBBF24]" />
                                  )}
                                  {day.condition === 'cloudy' && (
                                    <Cloud className="w-3.5 h-3.5 text-[#94B0A3]" />
                                  )}
                                  {day.condition === 'windy' && (
                                    <Wind className="w-3.5 h-3.5 text-[#FDE68A]" />
                                  )}
                                  {day.condition === 'rain' && (
                                    <CloudRain className="w-3.5 h-3.5 text-[#60A5FA]" />
                                  )}
                                  {day.condition === 'storm' && (
                                    <CloudLightning className="w-3.5 h-3.5 text-[#F87171]" />
                                  )}
                                </div>

                                <div className="text-[10px] font-mono tabular-nums font-semibold text-white leading-none">
                                  {day.tempMaxC}°/{day.tempMinC}°
                                </div>

                                <div className="mt-1 flex items-center gap-1 text-[9px] font-mono tabular-nums leading-none">
                                  {day.suitability === 'Optimal' && (
                                    <CheckCircle2 className="w-2.5 h-2.5 text-[#10B981] shrink-0" />
                                  )}
                                  {day.suitability === 'Marginal' && (
                                    <AlertTriangle className="w-2.5 h-2.5 text-[#F59E0B] shrink-0" />
                                  )}
                                  {day.suitability === 'Hold' && (
                                    <XCircle className="w-2.5 h-2.5 text-[#EF4444] shrink-0" />
                                  )}
                                  <span className="text-[#B2C7BD]">{day.windKmh}k</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Selected Forecast Day Operation Guidance */}
                      <div className="mt-2 pt-2 border-t border-[#1E3F31] flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-start sm:items-center gap-2 text-[#E2EFE8] min-w-0">
                          <span className="font-mono font-semibold text-[#86EFAC] shrink-0 tabular-nums">
                            {activeForecastDay.weekday[lang]} {activeForecastDay.dateLabel}
                          </span>
                          <span className="text-[#D1E3DA] leading-snug">
                            {activeForecastDay.operationAdvice[lang]}
                          </span>
                        </div>
                        <div className="font-mono tabular-nums text-[#94B0A3] shrink-0">
                          {t.windLabel} {activeForecastDay.windKmh} km/h · {t.rainLabel}{' '}
                          {activeForecastDay.rainMm} mm · {t.forecast7Day.humidityLabel}{' '}
                          {activeForecastDay.humidityPct}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Satellite Pass Date Scrubber */}
            <div className="bg-[#10271E] border border-[#1E3F31] rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingSeason((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#17382B] hover:bg-[#1E4A39] border border-[#285A46] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {isPlayingSeason ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>{t.pauseSeason}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{t.playSeason}</span>
                    </>
                  )}
                </button>
                <div className="text-xs text-[#94B0A3] font-mono tabular-nums whitespace-nowrap">
                  {t.passLabel} <span className="text-white">{activeSnapshot.date}</span> ·{' '}
                  {t.cloudLabel} {activeSnapshot.cloudCover}%
                </div>
              </div>

              <div className="flex items-center gap-1 overflow-x-auto">
                {SEASON_DATES.map((dateLabel, idx) => {
                  const active = idx === dateIndex;
                  return (
                    <button
                      key={dateLabel}
                      type="button"
                      onClick={() => {
                        setIsPlayingSeason(false);
                        setDateIndex(idx);
                      }}
                      className={`px-2.5 py-1.5 text-xs font-mono tabular-nums rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'bg-[#0D9F58] text-white font-semibold'
                          : 'text-[#94B0A3] hover:text-white hover:bg-[#17382B]'
                      }`}
                    >
                      {dateLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {exportToast && (
              <div
                role="status"
                className="px-4 py-2.5 bg-[#0D9F58]/20 border border-[#10B981]/50 rounded-lg text-xs text-[#A7F3D0] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{exportToast}</span>
              </div>
            )}
          </div>

          {/* Right Inspector Panel */}
          <aside className="lg:col-span-3 flex flex-col gap-4 bg-[#10271E] border border-[#1E3F31] rounded-xl p-4 overflow-y-auto">
            <div className="pb-3 border-b border-[#1E3F31]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display text-base font-bold text-white truncate">
                  {selectedField.name[lang]}
                </h3>
                <span className="font-mono text-xs tabular-nums text-[#86EFAC] shrink-0">
                  {selectedField.areaHa.toFixed(1)} ha
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#94B0A3]">
                <span>{selectedField.crop[lang]}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedField.variety}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedField.soilType[lang]}</span>
              </div>
              <div className="mt-2.5 flex items-center gap-2 text-xs text-[#D1E3DA]">
                <Sprout className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                <span>{activeSnapshot.growthStage[lang]}</span>
              </div>
            </div>

            {/* Seasonal NDVI Curve */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-[#C8DBD2]">{t.seasonalNdviCurve}</span>
                <span className="font-mono tabular-nums text-[#86EFAC]">
                  {t.meanLabel} {activeSnapshot.meanNdvi.toFixed(2)}
                </span>
              </div>
              <div className="bg-[#0A1B14] border border-[#1B382B] rounded-lg p-2.5">
                <svg
                  viewBox="0 0 260 76"
                  className="w-full h-20 overflow-visible"
                  aria-label="Seasonal NDVI trend curve"
                >
                  <line
                    x1="10"
                    y1="20"
                    x2="250"
                    y2="20"
                    stroke="#1B382B"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="10"
                    y1="48"
                    x2="250"
                    y2="48"
                    stroke="#1B382B"
                    strokeDasharray="3 3"
                  />
                  <path
                    d={sparklinePath}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {sparklinePoints.map((pt, idx) => (
                    <circle
                      key={idx}
                      cx={pt.x}
                      cy={pt.y}
                      r={idx === dateIndex ? 4.5 : 2.5}
                      fill={idx === dateIndex ? '#FFFFFF' : '#10B981'}
                      stroke={idx === dateIndex ? '#0D9F58' : 'none'}
                      strokeWidth="2"
                      className="cursor-pointer"
                      onClick={() => {
                        setIsPlayingSeason(false);
                        setDateIndex(idx);
                      }}
                    />
                  ))}
                </svg>
                <div className="mt-1 grid grid-cols-3 gap-2 pt-2 border-t border-[#183126] text-[11px] font-mono tabular-nums text-[#94B0A3]">
                  <div>Min: {activeSnapshot.minNdvi.toFixed(2)}</div>
                  <div className="text-center">Max: {activeSnapshot.maxNdvi.toFixed(2)}</div>
                  <div className="text-right">LAI: {activeSnapshot.biomassIndex.toFixed(1)}</div>
                </div>
              </div>
            </div>

            {/* VRA Prescription Controls */}
            {(activeLayer === 'vra' || activeLayer === 'zones') && (
              <div className="pt-3 border-t border-[#1E3F31] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{t.vraTitle}</span>
                  <span className="font-mono text-[11px] text-[#86EFAC] tabular-nums">
                    {vraSummary.savingsPct >= 0
                      ? `-${vraSummary.savingsPct.toFixed(1)}% ${t.vsFlat}`
                      : `+${Math.abs(vraSummary.savingsPct).toFixed(1)}% ${t.vsFlat}`}
                  </span>
                </div>

                <div className="text-[11px] text-[#94B0A3]">
                  {t.productLabel} {selectedField.fertilizerProduct[lang]}
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedField.zones.map((zone) => {
                    const rate = currentRates[zone.id];
                    return (
                      <div
                        key={zone.id}
                        className="bg-[#0A1B14] border border-[#1B382B] rounded-lg p-2.5"
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[#D1E3DA] truncate">{zone.label[lang]}</span>
                          <span className="font-mono tabular-nums text-white font-semibold shrink-0">
                            {rate} kg/ha
                          </span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={240}
                          step={5}
                          value={rate}
                          aria-label={`Target rate for ${zone.label[lang]}`}
                          onChange={(e) => handleRateChange(zone.id, Number(e.target.value))}
                          className="w-full accent-[#10B981] cursor-pointer"
                        />
                        <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#83A193] mt-0.5">
                          <span>
                            {zone.areaHa.toFixed(1)} ha ({zone.sharePct}%)
                          </span>
                          <span>
                            {t.estLabel} {zone.yieldPotentialTHa.toFixed(1)} t/ha
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs font-mono tabular-nums py-1.5 px-2.5 bg-[#0D2119] rounded-md text-[#C8DBD2]">
                  <span>{t.totalApplied}</span>
                  <span>
                    {vraSummary.vraTotalTons.toFixed(2)} t ({t.flatLabel}{' '}
                    {vraSummary.uniformTotalTons.toFixed(2)} t)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleExportGeoJSON}
                  className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-[#0D9F58] hover:bg-[#0B874B] rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.exportGeojson}</span>
                </button>
              </div>
            )}

            {/* Scouting Pin Creator / Inspector */}
            {activeLayer === 'scouting' && (
              <div className="pt-3 border-t border-[#1E3F31] flex flex-col gap-3">
                {draftPinCoords ? (
                  <form onSubmit={handleSaveNewPin} className="flex flex-col gap-2.5">
                    <div className="text-xs font-semibold text-[#86EFAC]">
                      {t.newNoteTitle} ({draftPinCoords.x}, {draftPinCoords.y})
                    </div>
                    <select
                      value={draftCategory}
                      onChange={(e) =>
                        setDraftCategory(e.target.value as ScoutingNote['category'])
                      }
                      aria-label="Issue Category"
                      className="w-full px-2.5 py-1.5 text-xs bg-[#0A1B14] border border-[#244A3A] rounded-md text-white"
                    >
                      <option value="Weed Pressure">{t.categories.weed}</option>
                      <option value="Nitrogen Deficiency">{t.categories.nitrogen}</option>
                      <option value="Pest / Disease">{t.categories.pest}</option>
                      <option value="Emergence Check">{t.categories.emergence}</option>
                    </select>
                    <select
                      value={draftSeverity}
                      onChange={(e) =>
                        setDraftSeverity(e.target.value as ScoutingNote['severity'])
                      }
                      aria-label="Severity Level"
                      className="w-full px-2.5 py-1.5 text-xs bg-[#0A1B14] border border-[#244A3A] rounded-md text-white"
                    >
                      <option value="Low">{t.severities.low}</option>
                      <option value="Moderate">{t.severities.moderate}</option>
                      <option value="High">{t.severities.high}</option>
                    </select>
                    <textarea
                      rows={3}
                      required
                      placeholder={t.notePlaceholder}
                      value={draftNoteText}
                      onChange={(e) => setDraftNoteText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#0A1B14] border border-[#244A3A] rounded-md text-white placeholder:text-[#6E8B7D]"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-1.5 px-3 text-xs font-semibold bg-[#0D9F58] hover:bg-[#0B874B] text-white rounded-md cursor-pointer"
                      >
                        {t.saveNote}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDraftPinCoords(null)}
                        className="py-1.5 px-3 text-xs font-medium text-[#94B0A3] hover:text-white cursor-pointer"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </form>
                ) : activePin ? (
                  <div className="bg-[#0A1B14] border border-[#1B382B] rounded-lg p-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                        <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                        {translateCategory(activePin.category)}
                      </span>
                      <span className="text-[11px] font-mono text-[#94B0A3]">
                        {activePin.date}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#86EFAC]">
                      {t.severityLabel}: {translateSeverity(activePin.severity)} ·{' '}
                      {activePin.author}
                    </div>
                    <p className="text-xs text-[#D1E3DA] leading-relaxed mt-1">
                      {activePin.note[lang]}
                    </p>
                  </div>
                ) : null}
              </div>
            )}

            {/* Field Spraying Weather Window */}
            <div className="mt-auto pt-3 border-t border-[#1E3F31]">
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <span className="font-semibold text-[#C8DBD2]">{t.sprayingWeather}</span>
                <div className="flex items-center gap-2">
                  {isSprayUnsafe && !showSprayOverlay && (
                    <button
                      type="button"
                      onClick={() => setDismissedWarningKey(null)}
                      className="text-[11px] font-medium text-[#FDE68A] hover:text-white underline underline-offset-2 cursor-pointer"
                    >
                      {t.sprayWarning.showWarning}
                    </button>
                  )}
                  <span className="inline-flex items-center gap-1 font-medium text-xs text-white">
                    {!isSprayUnsafe && activeSnapshot.sprayWindow === 'Optimal' && (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#86EFAC]">{t.sprayStatus.optimal}</span>
                      </>
                    )}
                    {isSprayUnsafe && !isCriticalSprayHold && (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span className="text-[#FDE68A]">{t.sprayStatus.marginal}</span>
                      </>
                    )}
                    {isSprayUnsafe && isCriticalSprayHold && (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-[#EF4444]" />
                        <span className="text-[#FCA5A5]">{t.sprayStatus.hold}</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#0A1B14] border border-[#1B382B] rounded-lg p-2.5 text-xs font-mono tabular-nums">
                <div>
                  <div className="text-[10px] text-[#83A193] flex items-center gap-1">
                    <Wind className="w-3 h-3" /> {t.windLabel}
                  </div>
                  <div
                    className={`mt-0.5 ${
                      windExceeded ? 'text-[#FDE68A] font-semibold' : 'text-white'
                    }`}
                  >
                    {activeSnapshot.windKmh} km/h
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#83A193]">{t.tempLabel}</div>
                  <div className="text-white mt-0.5">{activeSnapshot.tempC}°C</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#83A193] flex items-center gap-1">
                    <CloudRain className="w-3 h-3" /> {t.rainLabel}
                  </div>
                  <div
                    className={`mt-0.5 ${
                      rainExceeded ? 'text-[#FCA5A5] font-semibold' : 'text-white'
                    }`}
                  >
                    {activeSnapshot.rainMm} mm
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Analytical Charts Section: Side-by-side when Expanded, Stacked in Standard View */}
        <div
          className={
            isExpanded
              ? 'grid grid-cols-1 xl:grid-cols-2 gap-5 mt-5 pb-4'
              : 'flex flex-col'
          }
        >
          <div className={isExpanded ? '[&>div]:mt-0' : ''}>
            <SoilNutrientChart
              field={selectedField}
              lang={lang}
              activeDateIndex={dateIndex}
              onSelectDateIndex={(idx) => {
                setIsPlayingSeason(false);
                setDateIndex(idx);
              }}
            />
          </div>

          <div className={isExpanded ? '[&>div]:mt-0' : ''}>
            <SoilMoistureChart
              field={selectedField}
              lang={lang}
              activeDateIndex={dateIndex}
            />
          </div>

          <div className={isExpanded ? 'xl:col-span-2 [&>div]:mt-0' : ''}>
            <ExplainableAIPanel
              estateName={activeEstate.regionLabel[lang]}
              field={selectedField}
              lang={lang}
              activeDateIndex={dateIndex}
              vraSavingsPct={vraSummary.savingsPct}
            />
          </div>

          <div className={isExpanded ? 'xl:col-span-2 [&>div]:mt-0' : ''}>
            <FieldActivityLog
              field={selectedField}
              estateName={activeEstate.shortName[lang]}
              lang={lang}
            />
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
}
