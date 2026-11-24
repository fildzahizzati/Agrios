import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { InteractivePlatform } from './components/InteractivePlatform';
import {
  CapabilitiesSection,
  DemoRequestSection,
  FooterSection,
  HeroSection,
  OutcomesSection,
  PricingSection,
} from './components/PlatformSections';
import { ActiveFieldContext, AgronomistChat } from './components/AgronomistChat';
import { FIELD_PARCELS } from './data/platformData';
import type { Lang } from './data/i18n';

const DEFAULT_FIELD = FIELD_PARCELS[0];
const DEFAULT_SNAP = DEFAULT_FIELD.snapshots[3];

export default function App() {
  const [lang, setLang] = useState<Lang>('id');
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Precision Pro');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [fieldContext, setFieldContext] = useState<ActiveFieldContext>({
    fieldName: DEFAULT_FIELD.name.id,
    crop: DEFAULT_FIELD.crop.id,
    variety: DEFAULT_FIELD.variety,
    areaHa: DEFAULT_FIELD.areaHa,
    soilType: DEFAULT_FIELD.soilType.id,
    date: DEFAULT_SNAP.date,
    meanNdvi: DEFAULT_SNAP.meanNdvi,
    minNdvi: DEFAULT_SNAP.minNdvi,
    maxNdvi: DEFAULT_SNAP.maxNdvi,
    growthStage: DEFAULT_SNAP.growthStage.id,
    sprayWindow: DEFAULT_SNAP.sprayWindow,
    windKmh: DEFAULT_SNAP.windKmh,
    tempC: DEFAULT_SNAP.tempC,
    rainMm: DEFAULT_SNAP.rainMm,
    fertilizerProduct: DEFAULT_FIELD.fertilizerProduct.id,
    vraSavingsPct: 8.4,
  });

  const handleContextChange = useCallback((ctx: ActiveFieldContext) => {
    setFieldContext(ctx);
  }, []);

  const handleOpenPlatform = () => {
    if (isWorkspaceExpanded) {
      setIsWorkspaceExpanded(false);
      return;
    }
    const el = document.getElementById('interactive-platform');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsWorkspaceExpanded(true);
  };

  const handleLaunchMapFromHero = () => {
    const el = document.getElementById('interactive-platform');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectPlan = (planName: string) => {
    setSelectedPlan(planName);
    const el = document.getElementById('request-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#0F1F18]">
      <Navbar
        lang={lang}
        onOpenPlatform={handleOpenPlatform}
        isWorkspaceExpanded={isWorkspaceExpanded}
      />

      <main className="flex-1">
        <HeroSection
          lang={lang}
          onChangeLang={setLang}
          onLaunchMap={handleLaunchMapFromHero}
        />

        <InteractivePlatform
          lang={lang}
          onChangeLang={setLang}
          isExpanded={isWorkspaceExpanded}
          onToggleExpand={() => setIsWorkspaceExpanded((prev) => !prev)}
          onContextChange={handleContextChange}
          onOpenAgronomist={() => setIsChatOpen(true)}
        />

        <CapabilitiesSection lang={lang} />

        <OutcomesSection lang={lang} />

        <PricingSection lang={lang} onSelectPlan={handleSelectPlan} />

        <DemoRequestSection lang={lang} selectedPlan={selectedPlan} />
      </main>

      <FooterSection lang={lang} onChangeLang={setLang} />

      <AgronomistChat
        lang={lang}
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        fieldContext={fieldContext}
      />
    </div>
  );
}
