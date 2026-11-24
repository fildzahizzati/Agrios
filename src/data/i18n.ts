export type Lang = 'en' | 'id';

export interface TranslationBundle {
  nav: {
    monitoring: string;
    capabilities: string;
    outcomes: string;
    pricing: string;
    openPlatform: string;
    closePlatform: string;
  };
  hero: {
    kickerLeft: string;
    kickerRight: string;
    headline: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    highlight1: string;
    highlight2: string;
    highlight3: string;
    captionTitle: string;
    captionFallback: string;
    meanNdviLabel: string;
  };
  proofMetrics: {
    value: string;
    label: string;
    detail: string;
  }[];
  workspace: {
    regionLabel: string;
    mapSelectorLabel: string;
    parcelsLabel: string;
    totalHaLabel: string;
    title: string;
    layers: {
      boundaries: string;
      ndvi: string;
      ndmi: string;
      ndre: string;
      zones: string;
      vra: string;
      scouting: string;
    };
    askAgronomist: string;
    expandMap: string;
    exitFullscreen: string;
    monitoredFields: string;
    autoDetect: string;
    detecting: string;
    hints: {
      ndvi: string;
      ndmi: string;
      ndre: string;
      boundaries: string;
      zones: string;
      vra: string;
      scouting: string;
    };
    legend: {
      highZone: string;
      targetZone: string;
      stressZone: string;
      scanning: string;
      activeBoundaries: string;
      clickToPin: string;
      notesLogged: string;
    };
    dropPin: string;
    cancelPin: string;
    playSeason: string;
    pauseSeason: string;
    passLabel: string;
    cloudLabel: string;
    exportedPrefix: string;
    seasonalNdviCurve: string;
    meanLabel: string;
    vraTitle: string;
    vsFlat: string;
    productLabel: string;
    estLabel: string;
    totalApplied: string;
    flatLabel: string;
    exportGeojson: string;
    newNoteTitle: string;
    categories: {
      weed: string;
      nitrogen: string;
      pest: string;
      emergence: string;
    };
    severities: {
      low: string;
      moderate: string;
      high: string;
    };
    notePlaceholder: string;
    saveNote: string;
    cancel: string;
    severityLabel: string;
    sprayingWeather: string;
    sprayStatus: {
      optimal: string;
      marginal: string;
      hold: string;
    };
    windLabel: string;
    tempLabel: string;
    rainLabel: string;
    sprayWarning: {
      titleMarginal: string;
      titleHold: string;
      windExceeded: string;
      rainExceeded: string;
      limitLabel: string;
      adviceMarginal: string;
      adviceHold: string;
      dismiss: string;
      showWarning: string;
    };
    soilNpk: {
      title: string;
      subtitle: string;
      nitrogen: string;
      phosphorus: string;
      potassium: string;
      unit: string;
      activePass: string;
      soilProfile: string;
      seasonalUptake: string;
    };
    forecast7Day: {
      toggleButton: string;
      title: string;
      histBaseline: string;
      optimalWindows: string;
      daysUnit: string;
      hideOverlay: string;
      humidityLabel: string;
    };
    soilMoisture: {
      title: string;
      subtitle: string;
      surfaceLabel: string;
      rootZoneLabel: string;
      rainfallLabel: string;
      fieldCapacity: string;
      stressThreshold: string;
      optimalBand: string;
      avg30d: string;
      range30d: string;
      netChange30d: string;
      statusOptimal: string;
      statusLow: string;
      statusSaturated: string;
      soilProfile: string;
      windowEnding: string;
    };
    explainableAi: {
      eyebrow: string;
      title: string;
      subtitle: string;
      decisionScoreLabel: string;
      confidenceLabel: string;
      baselineNote: string;
      featureImpactTitle: string;
      positiveDriver: string;
      riskFactor: string;
      ruleTraceTitle: string;
      recommendedActionLabel: string;
      auditButton: string;
      auditingButton: string;
      auditEmptyHint: string;
      causalDriversLabel: string;
      counterfactualLabel: string;
      uncertaintyLabel: string;
      cloudCaveatLabel: string;
      modelAttributionNote: string;
      errorPrefix: string;
    };
    compareFields: {
      toggleButton: string;
      closeButton: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      parcelALabel: string;
      parcelBLabel: string;
      swapButton: string;
      sameParcelNotice: string;
      satellitePassLabel: string;
      matrixTitle: string;
      metricCol: string;
      deltaCol: string;
      metrics: {
        cropSoil: string;
        growthStage: string;
        areaHa: string;
        ndviMean: string;
        biomass: string;
        surfaceMoisture: string;
        meanMoisture30d: string;
        nitrogen: string;
        phosphorus: string;
        potassium: string;
        sprayWeather: string;
        vraDelta: string;
      };
      charts: {
        ndviTitle: string;
        ndviSubtitle: string;
        npkTitle: string;
        npkSubtitle: string;
        moistureTitle: string;
        moistureSubtitle: string;
      };
    };
    manualInput: {
      toggleButton: string;
      closeButton: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      presetsLabel: string;
      formTitle: string;
      fieldNameLabel: string;
      areaHaLabel: string;
      soilTypeLabel: string;
      irrigationLabel: string;
      phLabel: string;
      moistureLabel: string;
      elevationLabel: string;
      rainfallLabel: string;
      tempLabel: string;
      npkSectionLabel: string;
      analyzeButton: string;
      analyzingButton: string;
      topMatchLabel: string;
      soilHealthLabel: string;
      suitabilityChartTitle: string;
      cropTableTitle: string;
      cropCol: string;
      classCol: string;
      scoreCol: string;
      yieldCol: string;
      notesCol: string;
      amendmentsTitle: string;
      aiVerdictTitle: string;
      aiVerdictEmpty: string;
      aiCalendarLabel: string;
      aiStepsLabel: string;
      aiIntercropLabel: string;
      aiErrorPrefix: string;
      classes: {
        s1: string;
        s2: string;
        s3: string;
      };
      healthStates: {
        optimal: string;
        conditioning: string;
        alert: string;
      };
      soilOptions: {
        alluvial: string;
        latosol: string;
        regosol: string;
        andosol: string;
        podsolik: string;
        gambut: string;
      };
      irrigationOptions: {
        irrigated: string;
        rainfed: string;
        well_drained: string;
        tidal_swamp: string;
      };
    };
    activityLog: {
      eyebrow: string;
      title: string;
      subtitle: string;
      addButton: string;
      cancelButton: string;
      saveButton: string;
      resetButton: string;
      filterAll: string;
      types: {
        planting: string;
        irrigation: string;
        fertilization: string;
        pesticide: string;
      };
      kpis: {
        totalOps: string;
        latestPlanting: string;
        irrigationCycles: string;
        pesticidePasses: string;
        avgImpact: string;
        totalSpendHa: string;
      };
      form: {
        typeLabel: string;
        dateLabel: string;
        materialLabel: string;
        materialPlaceholder: string;
        quantityLabel: string;
        quantityPlaceholder: string;
        costLabel: string;
        operatorLabel: string;
        impactLabel: string;
        noteLabel: string;
        notePlaceholder: string;
      };
      chartTitle: string;
      chartSubtitle: string;
      tableHeaders: {
        date: string;
        activity: string;
        material: string;
        dosage: string;
        cost: string;
        impact: string;
        operator: string;
      };
      emptyState: string;
      noPlantingYet: string;
      deleteLabel: string;
      customTag: string;
    };
    fertilizerCalc: {
      toggleButton: string;
      closeButton: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      syncParcelButton: string;
      syncedHint: string;
      inputsTitle: string;
      varietyLabel: string;
      areaLabel: string;
      targetYieldLabel: string;
      currentNpkLabel: string;
      kpis: {
        totalRate: string;
        totalBags: string;
        costPerHa: string;
        totalBudget: string;
      };
      chartTitle: string;
      chartSubtitle: string;
      soilSeries: string;
      demandSeries: string;
      addSeries: string;
      productsTitle: string;
      productCol: string;
      analysisCol: string;
      rateCol: string;
      totalCol: string;
      sacksCol: string;
      costCol: string;
      sacksUnit: string;
      scheduleTitle: string;
      stageCol: string;
      windowCol: string;
    };
    yieldForecast: {
      toggleButton: string;
      closeButton: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      runAiButton: string;
      runningAiButton: string;
      passSelectorLabel: string;
      kpis: {
        forecastVolume: string;
        yieldRate: string;
        daysToHarvest: string;
        grossValue: string;
        confidenceBand: string;
        vs4YrAvg: string;
        readyNow: string;
        daysUnit: string;
      };
      chartTitle: string;
      chartSubtitle: string;
      yieldSeriesLabel: string;
      ndviSeriesLabel: string;
      zoneTableTitle: string;
      zoneCol: string;
      areaCol: string;
      rateCol: string;
      volumeCol: string;
      aiPanelTitle: string;
      aiEmptyHint: string;
      aiDriversLabel: string;
      aiActionsLabel: string;
      aiLogisticsLabel: string;
      aiErrorPrefix: string;
      ndviWeightLabel: string;
    };
  };
  capabilities: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: {
      card1Tag: string;
      card1Metric: string;
      card1Title: string;
      card1Body: string;
      card1Stats: { value: string; label: string }[];
      card2Tag: string;
      card2Title: string;
      card2Body: string;
      card2Foot: string;
      card3Tag: string;
      card3Title: string;
      card3Body: string;
      card3Foot: string;
      card4Tag: string;
      card4Metric: string;
      card4Title: string;
      card4Body: string;
      card4Stats: { value: string; label: string }[];
    };
  };
  outcomes: {
    eyebrow: string;
    title: string;
    ctaLink: string;
    studies: {
      organization: string;
      region: string;
      person: string;
      outcome: string;
      summary: string;
    }[];
  };
  pricing: {
    eyebrow: string;
    title: string;
    annualToggle: string;
    monthlyToggle: string;
    tiers: {
      id: string;
      name: string;
      audience: string;
      monthlyPrice: string;
      annualPrice: string;
      cadenceNote: string;
      ctaLabel: string;
      featured: boolean;
      specs: { label: string; value: string }[];
    }[];
  };
  demo: {
    eyebrow: string;
    title: string;
    subtitle: string;
    coverage: string;
    formats: string;
    receivedTitle: string;
    receivedBodyPrefix: string;
    receivedBodyMid: string;
    submitAnother: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    hectaresLabel: string;
    planLabel: string;
    planOptions: { value: string; label: string }[];
    noteFooter: string;
    submitBtn: string;
    errors: {
      name: string;
      email: string;
      hectares: string;
    };
  };
  footer: {
    tagline: string;
    interactiveMap: string;
    capabilities: string;
    outcomes: string;
    pricing: string;
    requestDemo: string;
    copyright: string;
  };
  chat: {
    buttonLabel: string;
    title: string;
    welcome: string;
    engineLabel: string;
    searchMode: string;
    fastMode: string;
    sourcesHeader: string;
    loadingSearch: string;
    loadingFast: string;
    suggestedLabel: string;
    inputPlaceholder: string;
    resetTitle: string;
  };
}

export const TRANSLATIONS: Record<Lang, TranslationBundle> = {
  en: {
    nav: {
      monitoring: 'Monitoring',
      capabilities: 'Capabilities',
      outcomes: 'Outcomes',
      pricing: 'Pricing',
      openPlatform: 'Open Platform',
      closePlatform: 'Close Fullscreen Map',
    },
    hero: {
      kickerLeft: 'Precision Agriculture Platform',
      kickerRight: 'Indonesia & Southeast Asia',
      headline: 'Satellite precision for every paddy, plantation, and prescription.',
      subtitle:
        'Detect parcel boundaries automatically, monitor tropical crop canopy every five days, and export variable-rate fertilizer maps straight to your field team—built for Indonesia’s food estates and growers.',
      ctaPrimary: 'Explore Live Map',
      ctaSecondary: 'Request Agronomy Demo',
      highlight1: 'ISOXML & Shapefile compatible',
      highlight2: 'Offline mobile field scouting',
      highlight3: 'Sentinel-2 & 2.5m orbital data',
      captionTitle: 'Automated field segmentation & NDVI canopy monitoring',
      captionFallback: 'Multispectral Farmland Orthophoto',
      meanNdviLabel: 'Mean NDVI',
    },
    proofMetrics: [
      {
        value: '14.6M ha',
        label: 'Archipelago Coverage',
        detail: 'Mapped paddy, corn, and plantation blocks across Indonesia',
      },
      {
        value: '2.5 m',
        label: 'Imagery Resolution',
        detail: 'Cloud-masked Sentinel-2 & tropical orbital fusion',
      },
      {
        value: '19.2%',
        label: 'Urea & NPK Savings',
        detail: 'Verified variable-rate input reduction across trial blocks',
      },
      {
        value: '5-Day',
        label: 'Revisit Cadence',
        detail: 'Continuous NDVI canopy tracking & pest stress alerts',
      },
    ],
    workspace: {
      regionLabel: 'Subang & Indramayu Estate · West Java',
      mapSelectorLabel: 'Open Map Region',
      parcelsLabel: 'Parcels',
      totalHaLabel: 'ha Total',
      title: 'Interactive Field & Satellite Workspace',
      layers: {
        boundaries: 'Boundaries',
        ndvi: 'NDVI',
        ndmi: 'Moisture (NDMI)',
        ndre: 'Chlorophyll (NDRE)',
        zones: 'Zones',
        vra: 'VRA Plan',
        scouting: 'Scouting',
      },
      askAgronomist: 'Ask Agronomist',
      expandMap: 'Expand Analysis',
      exitFullscreen: 'Standard View',
      monitoredFields: 'Monitored Blocks',
      autoDetect: 'Auto-Detect',
      detecting: 'Detecting...',
      hints: {
        ndvi: 'Sentinel-2 multispectral index tracks chlorophyll density across each Indonesian parcel. Scrub dates below to inspect crop vigor.',
        ndmi: 'Normalized Difference Moisture Index (NDMI) highlights canopy & topsoil water content to detect dry stress or waterlogging early.',
        ndre: 'Red-Edge Chlorophyll Index (NDRE) penetrates dense mid-season canopies to spot nitrogen deficits before yellowing appears.',
        boundaries:
          'ML contour segmentation detects paddy bunds, sugarcane blocks, and irrigation tracks in seconds.',
        zones:
          'Multi-season productivity zones synthesized from 8 consecutive Indonesian planting cycles (MT1 & MT2).',
        vra: 'Adjust variable Urea or NPK rates by productivity zone on the right panel, then export GeoJSON.',
        scouting:
          'Click any pin on the map to read field observations, or click "Drop Scouting Pin" to log a new note.',
      },
      legend: {
        highZone: 'High Zone',
        targetZone: 'Target Zone',
        stressZone: 'Stress Zone',
        scanning: 'Running edge segmentation...',
        activeBoundaries: '4 automated boundaries active',
        clickToPin: 'Click anywhere inside a parcel to place pin',
        notesLogged: 'geo-referenced notes logged',
      },
      dropPin: 'Drop Scouting Pin',
      cancelPin: 'Cancel Pin Placement',
      playSeason: 'Play Season',
      pauseSeason: 'Pause',
      passLabel: 'Pass:',
      cloudLabel: 'Cloud',
      exportedPrefix: 'Exported VRA prescription (.geojson) for',
      seasonalNdviCurve: 'Seasonal NDVI Curve',
      meanLabel: 'Mean',
      vraTitle: 'Variable-Rate Plan',
      vsFlat: 'vs flat',
      productLabel: 'Product:',
      estLabel: 'Est.',
      totalApplied: 'Total Applied',
      flatLabel: 'Flat',
      exportGeojson: 'Export GeoJSON Prescription',
      newNoteTitle: 'New Scouting Note',
      categories: {
        weed: 'Weed Pressure',
        nitrogen: 'Nitrogen Deficiency',
        pest: 'Pest / Disease',
        emergence: 'Emergence Check',
      },
      severities: {
        low: 'Low Severity',
        moderate: 'Moderate Severity',
        high: 'High Severity',
      },
      notePlaceholder: 'Describe field observation or recommended action...',
      saveNote: 'Save Note',
      cancel: 'Cancel',
      severityLabel: 'Severity',
      sprayingWeather: 'Spraying Weather',
      sprayStatus: {
        optimal: 'Optimal Window',
        marginal: 'Marginal Drift Risk',
        hold: 'Hold · High Wind/Rain',
      },
      windLabel: 'Wind',
      tempLabel: 'Temp',
      rainLabel: 'Rain',
      sprayWarning: {
        titleMarginal: 'Spraying Drift & Wash-off Caution',
        titleHold: 'Unsafe Spraying Conditions',
        windExceeded: 'Wind speed above safe limit',
        rainExceeded: 'Rainfall above safe limit',
        limitLabel: 'Safe limit',
        adviceMarginal: 'Lower boom pressure and switch to coarse drift-reduction nozzles.',
        adviceHold: 'Hold application until wind drops to ≤ 12 km/h and rain clears ≤ 0.5 mm.',
        dismiss: 'Dismiss warning',
        showWarning: 'View alert',
      },
      soilNpk: {
        title: 'Soil Nutrient Levels (NPK) Over Time',
        subtitle:
          'Available macronutrients (kg/ha) tracked across satellite & soil lab intervals for the selected parcel.',
        nitrogen: 'Nitrogen (N)',
        phosphorus: 'Phosphorus (P)',
        potassium: 'Potassium (K)',
        unit: 'kg/ha',
        activePass: 'Active Pass',
        soilProfile: 'Soil Profile',
        seasonalUptake: 'Seasonal Drawdown',
      },
      forecast7Day: {
        toggleButton: '7-Day Forecast',
        title: '7-Day Operations Forecast',
        histBaseline: 'Trailing 7d avg',
        optimalWindows: 'Optimal spray days',
        daysUnit: 'days',
        hideOverlay: 'Hide forecast overlay',
        humidityLabel: 'RH',
      },
      soilMoisture: {
        title: 'Soil Moisture (Last 30 Days)',
        subtitle:
          'Daily volumetric soil moisture (%) across topsoil (0–15 cm) and root zone (15–45 cm) with precipitation events.',
        surfaceLabel: 'Surface (0–15 cm)',
        rootZoneLabel: 'Root Zone (15–45 cm)',
        rainfallLabel: 'Daily Rain (mm)',
        fieldCapacity: 'Field Capacity',
        stressThreshold: 'Stress Threshold',
        optimalBand: 'Optimal Moisture Band',
        avg30d: '30-Day Mean',
        range30d: '30-Day Range',
        netChange30d: '30-Day Net Delta',
        statusOptimal: 'Optimal Moisture',
        statusLow: 'Dry Stress · Irrigate',
        statusSaturated: 'High Saturation',
        soilProfile: 'Soil Profile',
        windowEnding: '30-day window ending',
      },
      explainableAi: {
        eyebrow: 'Transparent Decision Engine',
        title: 'Explainable AI (XAI) Agronomic Audit',
        subtitle:
          'SHAP-style feature weights, explicit safety rules, and live causal reasoning behind the current parcel recommendation.',
        decisionScoreLabel: 'Composite Decision Score',
        confidenceLabel: 'Model Confidence',
        baselineNote: 'Baseline score 62',
        featureImpactTitle: 'Feature Impact Attribution (± pts)',
        positiveDriver: 'Positive Driver',
        riskFactor: 'Risk / Penalty',
        ruleTraceTitle: 'Triggered Decision Rules',
        recommendedActionLabel: 'Prescribed Field Action',
        auditButton: 'Run Gemini XAI Audit',
        auditingButton: 'Auditing Telemetry...',
        auditEmptyHint:
          'Run a live Gemini XAI causal audit to inspect physiological cause-and-effect, counterfactual yield levers, and sensor uncertainty.',
        causalDriversLabel: 'Physiological Causal Drivers',
        counterfactualLabel: 'Counterfactual ("What-If") Lever',
        uncertaintyLabel: 'Data Transparency & Uncertainty',
        cloudCaveatLabel: 'Cloud cover',
        modelAttributionNote: 'Computed via Gemini XAI Auditor',
        errorPrefix: 'Audit unavailable:',
      },
      compareFields: {
        toggleButton: 'Compare Fields',
        closeButton: 'Back to Map',
        eyebrow: 'Side-by-Side Benchmarking',
        title: 'Field Parcel Comparison Dashboard',
        subtitle:
          'Compare vegetation vigor (NDVI), 30-day soil moisture, NPK reserves, and VRA prescriptions across any two Indonesian estate parcels.',
        parcelALabel: 'Parcel A',
        parcelBLabel: 'Parcel B',
        swapButton: 'Swap A ↔ B',
        sameParcelNotice: 'Parcel A and Parcel B are currently the same block. Select a different parcel to view cross-block deltas.',
        satellitePassLabel: 'Satellite Pass',
        matrixTitle: 'Agronomic Telemetry Matrix',
        metricCol: 'Metric',
        deltaCol: 'Delta (A − B)',
        metrics: {
          cropSoil: 'Crop · Soil Profile',
          growthStage: 'Growth Stage',
          areaHa: 'Parcel Area',
          ndviMean: 'Mean NDVI (Min–Max)',
          biomass: 'Dry Biomass Index',
          surfaceMoisture: 'Surface Moisture (0–15 cm)',
          meanMoisture30d: '30-Day Mean Moisture',
          nitrogen: 'Available Nitrogen (N)',
          phosphorus: 'Available Phosphorus (P)',
          potassium: 'Available Potassium (K)',
          sprayWeather: 'Spray Window · Wind / Rain',
          vraDelta: 'VRA Input Delta vs Flat',
        },
        charts: {
          ndviTitle: 'Seasonal NDVI Trajectory',
          ndviSubtitle: 'Cloud-filtered canopy vigor across all 6 satellite passes',
          npkTitle: 'NPK Soil Nutrient Balance (kg/ha)',
          npkSubtitle: 'Available macro-nutrients on selected pass',
          moistureTitle: '30-Day Soil Moisture (%) Overlay',
          moistureSubtitle: 'Topsoil (0–15 cm) volumetric moisture trend',
        },
      },
      manualInput: {
        toggleButton: 'Field Input & Crop Match',
        closeButton: 'Back to Map',
        eyebrow: 'Farmer Soil Survey & Land Suitability',
        title: 'Manual Field Input & Crop Suitability Analyzer',
        subtitle:
          'Enter soil lab or farmer field observations (pH, moisture, elevation, rainfall, NPK) to rank suitable Indonesian crops and generate a tailored planting plan.',
        presetsLabel: 'Load Sample Farm Profile:',
        formTitle: 'Field Soil & Climate Parameters',
        fieldNameLabel: 'Farm / Block Name',
        areaHaLabel: 'Area (ha)',
        soilTypeLabel: 'Soil Type',
        irrigationLabel: 'Irrigation / Drainage',
        phLabel: 'Soil pH (3.5–8.5)',
        moistureLabel: 'Soil Moisture (%)',
        elevationLabel: 'Elevation (masl / mdpl)',
        rainfallLabel: 'Monthly Rain (mm)',
        tempLabel: 'Avg Temp (°C)',
        npkSectionLabel: 'Soil Macro-Nutrients (kg/ha)',
        analyzeButton: 'Analyze Crop Suitability & AI Plan',
        analyzingButton: 'Generating Gemini Plan...',
        topMatchLabel: 'Best Crop Match',
        soilHealthLabel: 'Soil Condition',
        suitabilityChartTitle: 'Crop Suitability Ranking (0–100%)',
        cropTableTitle: 'Recommended Crops & Limiting Factors',
        cropCol: 'Crop & Variety',
        classCol: 'Class',
        scoreCol: 'Match',
        yieldCol: 'Est. Yield',
        notesCol: 'Limiting Factor & Fertilizer Strategy',
        amendmentsTitle: 'Pre-Planting Soil Amendments',
        aiVerdictTitle: 'Gemini Agronomist Planting Verdict',
        aiVerdictEmpty:
          'Adjust your farm soil metrics on the left and click "Analyze Crop Suitability & AI Plan" for cultivar spacing, lime doses, and intercropping guidance.',
        aiCalendarLabel: 'Recommended Variety & Spacing',
        aiStepsLabel: 'Soil Conditioning Action Plan',
        aiIntercropLabel: 'Rotation & Intercropping Strategy',
        aiErrorPrefix: 'AI recommendation unavailable:',
        classes: {
          s1: 'S1 · Highly Suitable',
          s2: 'S2 · Moderately Suitable',
          s3: 'S3 · Marginal',
        },
        healthStates: {
          optimal: 'Optimal Balance',
          conditioning: 'Needs Conditioning',
          alert: 'Acidity / Drainage Alert',
        },
        soilOptions: {
          alluvial: 'Alluvial Clay (Liat Aluvial)',
          latosol: 'Red Latosol (Latosol Merah)',
          regosol: 'Volcanic Regosol (Regosol)',
          andosol: 'Highland Andosol (Andosol)',
          podsolik: 'Red-Yellow Podzolic (Ultisol)',
          gambut: 'Peat / Organosol (Gambut)',
        },
        irrigationOptions: {
          irrigated: 'Technical Irrigation (Irigasi Teknis)',
          rainfed: 'Rainfed (Tadah Hujan)',
          well_drained: 'Well-Drained Upland (Lahan Kering)',
          tidal_swamp: 'Tidal / Swamp (Pasang Surut / Rawa)',
        },
      },
      activityLog: {
        eyebrow: 'Historical Management Ledger',
        title: 'Field Activity Log & Performance Tracker',
        subtitle:
          'Log past planting dates, irrigation cycles, fertilization passes, and pesticide sprays to evaluate operational cost and NDVI vigor response.',
        addButton: '+ Log Field Activity',
        cancelButton: 'Cancel',
        saveButton: 'Save Activity Log',
        resetButton: 'Reset Custom Logs',
        filterAll: 'All Activities',
        types: {
          planting: 'Planting',
          irrigation: 'Irrigation Cycle',
          fertilization: 'Fertilization',
          pesticide: 'Pesticide Spray',
        },
        kpis: {
          totalOps: 'Logged Operations',
          latestPlanting: 'Latest Planting Date',
          irrigationCycles: 'Irrigation Cycles',
          pesticidePasses: 'Pesticide Applications',
          avgImpact: 'Mean Vigor Impact',
          totalSpendHa: 'Cumulative Spend / ha',
        },
        form: {
          typeLabel: 'Activity Type',
          dateLabel: 'Operation Date',
          materialLabel: 'Seed / Water Source / Product',
          materialPlaceholder: 'e.g., Inpari 32 Seed, P3A Canal, Abamectin 18 EC',
          quantityLabel: 'Dosage / Volume',
          quantityPlaceholder: 'e.g., 150 kg/ha or 400 m³/ha',
          costLabel: 'Cost / ha (IDR)',
          operatorLabel: 'Farmer / Operator',
          impactLabel: 'Est. Vigor Delta (%)',
          noteLabel: 'Field Outcome & Observation',
          notePlaceholder: 'Note canopy response, pest reduction, or soil moisture status...',
        },
        chartTitle: 'Vigor Impact (%) by Logged Operation',
        chartSubtitle: 'Track how field interventions lifted crop canopy vigor',
        tableHeaders: {
          date: 'Date',
          activity: 'Activity',
          material: 'Input / Method',
          dosage: 'Dosage',
          cost: 'Cost / ha',
          impact: 'Vigor Δ',
          operator: 'Operator',
        },
        emptyState: 'No management activities match this filter for the active parcel yet.',
        noPlantingYet: 'Not logged',
        deleteLabel: 'Delete entry',
        customTag: 'Farmer entry',
      },
      fertilizerCalc: {
        toggleButton: 'Fertilizer Calculator',
        closeButton: 'Back to Map',
        eyebrow: 'Precision Nutrient Budgeting',
        title: 'NPK Fertilizer Rate Calculator',
        subtitle:
          'Compute exact Urea, NPK Phonska, SP-36, and KCl rates based on active soil NPK telemetry, crop variety, and target yield.',
        syncParcelButton: 'Sync Active Parcel',
        syncedHint: 'Synced from active field pass',
        inputsTitle: 'Parcel & Soil NPK Inputs',
        varietyLabel: 'Crop & Variety',
        areaLabel: 'Field Area (ha)',
        targetYieldLabel: 'Target Yield (t/ha)',
        currentNpkLabel: 'Current Available Soil NPK (kg/ha)',
        kpis: {
          totalRate: 'Total Nutrient Product',
          totalBags: '50 kg Sacks Needed',
          costPerHa: 'Estimated Cost / ha',
          totalBudget: 'Total Field Budget',
        },
        chartTitle: 'Nutrient Mass Balance (kg/ha)',
        chartSubtitle: 'Soil reserve vs. variety target demand & recommended supplement',
        soilSeries: 'Soil Available',
        demandSeries: 'Crop Target Demand',
        addSeries: 'Recommended Add',
        productsTitle: 'Recommended Commercial Fertilizer Mix',
        productCol: 'Fertilizer Product',
        analysisCol: 'Grade',
        rateCol: 'Rate',
        totalCol: 'Field Total',
        sacksCol: 'Sacks (50 kg)',
        costCol: 'Est. Cost',
        sacksUnit: 'bags',
        scheduleTitle: 'Split Application Schedule (kg/ha)',
        stageCol: 'Growth Stage',
        windowCol: 'Window',
      },
      yieldForecast: {
        toggleButton: 'Yield Forecast',
        closeButton: 'Back to Map',
        eyebrow: 'Predictive Harvest Modeling',
        title: 'Predictive Yield & Harvest Volume Forecast',
        subtitle:
          'Combine live satellite NDVI vigor, 30-day soil moisture, and 4-year parcel harvest records with Gemini AI modeling to forecast 2026 crop volume.',
        runAiButton: 'Generate Gemini Harvest Forecast',
        runningAiButton: 'Forecasting with Gemini...',
        passSelectorLabel: 'Reference Satellite Pass',
        kpis: {
          forecastVolume: 'Forecast Harvest Volume',
          yieldRate: 'Projected Yield Rate',
          daysToHarvest: 'Harvest Readiness',
          grossValue: 'Est. Farmgate Value',
          confidenceBand: 'Range',
          vs4YrAvg: 'vs 4-yr avg',
          readyNow: 'Harvest Ready',
          daysUnit: 'days left',
        },
        chartTitle: 'Historical Yield (2022–2025) vs. 2026 Forecast',
        chartSubtitle: 'Annual yield (t/ha) correlated with seasonal peak vegetation index (NDVI)',
        yieldSeriesLabel: 'Yield (t/ha)',
        ndviSeriesLabel: 'Peak NDVI',
        zoneTableTitle: 'Projected Harvest by Management Zone',
        zoneCol: 'Management Zone',
        areaCol: 'Area',
        rateCol: 'Forecast Rate',
        volumeCol: 'Projected Volume',
        aiPanelTitle: 'Gemini Harvest Forecast Intelligence',
        aiEmptyHint:
          'Click "Generate Gemini Harvest Forecast" to analyze physiological yield drivers, pre-harvest actions, and truck/mill logistics for this parcel.',
        aiDriversLabel: 'Key Vegetation & Moisture Yield Drivers',
        aiActionsLabel: 'Pre-Harvest Yield Protection Actions',
        aiLogisticsLabel: 'Harvest & Post-Harvest Logistics',
        aiErrorPrefix: 'Gemini forecast unavailable:',
        ndviWeightLabel: 'NDVI vigor index factor',
      },
    },
    capabilities: {
      eyebrow: 'Platform Architecture',
      title: 'Built for daily field scouting, variable-rate fertilization, and estate scale.',
      subtitle:
        'Every workflow connects satellite telemetry directly to agronomic decisions—eliminating manual boundary drawing and guesswork fertilizer rates.',
      cards: {
        card1Tag: '01. Satellite Monitoring & Field Boundaries',
        card1Metric: '5-Day Revisit',
        card1Title: 'Automatic boundary detection and cloud-filtered NDVI time series',
        card1Body:
          'Machine learning segments exact parcel geometry across Java, Sumatra, Kalimantan, and Sulawesi in seconds. Track chlorophyll dynamics and localized stress weeks before symptoms spread.',
        card1Stats: [
          { value: '< 4 sec', label: 'Parcel contour extraction' },
          { value: '2016–2026', label: 'Multi-year crop & NDVI archive' },
          { value: '30+ Crops', label: 'Paddy, corn, sugarcane & palm' },
        ],
        card2Tag: '02. Mobile Scouting',
        card2Title: 'Geo-referenced notes, offline-ready',
        card2Body:
          'Drop pins on planthopper hotspots, weed patches, or drainage issues with photos and GPS coordinates—even in remote rural areas without cellular signal.',
        card2Foot: 'iOS & Android · Syncs on reconnect',
        card3Tag: '03. Machinery Integration',
        card3Title: 'Direct ISOXML & drone spreader export',
        card3Body:
          'Transfer variable-rate Urea, NPK, and seeding prescriptions directly into tractor terminals or agricultural spreading drones via standard GeoJSON and Shapefile.',
        card3Foot: 'ISOXML · Shapefile · GeoJSON',
        card4Tag: '04. Productivity Zones & Control Strips',
        card4Metric: 'Statistical Validation',
        card4Title: 'Verify variable-rate ROI with side-by-side control strips',
        card4Body:
          'Compare uniform fertilizer application against multi-zone VRA prescriptions using control strips, soil lab test integration, and harvest yield verification.',
        card4Stats: [
          { value: '3–7 Zones', label: 'Configurable management grids' },
          { value: 'Soil Lab Sync', label: 'Targeted grid sampling points' },
          { value: 'Net Margin/ha', label: 'Post-harvest trial reconciliation' },
        ],
      },
    },
    outcomes: {
      eyebrow: 'Measured Agronomic Outcomes',
      title: 'Proven across Indonesian rice cooperatives and commercial estates.',
      ctaLink: 'Inspect live VRA calculator',
      studies: [
        {
          organization: 'Koperasi Tani Pantura Mandiri',
          region: 'Subang, West Java · 3,420 ha Irrigated Rice & Hybrid Corn',
          person: 'Hendra Wijaya, Operations Director',
          outcome: '-21.4% Urea Spend & +0.52 t/ha Yield Lift',
          summary:
            'Replaced uniform Urea broadcasting across 46 blocks with multi-season productivity zones and control-strip trials. Verified higher panicle uniformity across MT1 and MT2 harvests before scaling to all cooperative members.',
        },
        {
          organization: 'Agro Nusantara Perkebunan',
          region: 'Central Lampung · 5,800 ha Sugarcane & Soybeans',
          person: 'Ratna Sari Dewi, Chief Agronomist',
          outcome: '14 Hours/Week Saved on Scouting & Reporting',
          summary:
            'Unified offline mobile scouting pins with automated 5-day NDVI anomaly alerts. Field supervisors inspect flagged stress blocks directly instead of conducting blind perimeter checks.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Plans & Licensing',
      title: 'Start scouting for free, scale to variable-rate automation.',
      annualToggle: 'Annual (Save 20%)',
      monthlyToggle: 'Monthly',
      tiers: [
        {
          id: 'scouting',
          name: 'Field Scouting',
          audience: 'For farmer groups (Gapoktan) starting digital monitoring',
          monthlyPrice: '$0',
          annualPrice: '$0',
          cadenceNote: 'Free up to 500 ha',
          ctaLabel: 'Start Free Workspace',
          featured: false,
          specs: [
            { label: 'Auto-detected field boundaries', value: 'Up to 500 ha' },
            { label: 'Sentinel-2 NDVI monitoring', value: '5-day updates' },
            { label: 'Offline mobile scouting notes', value: 'Unlimited pins & photos' },
            { label: 'Spraying weather windows', value: '5-day hyperlocal forecast' },
            { label: 'VRA prescription maps', value: 'Preview only' },
          ],
        },
        {
          id: 'pro',
          name: 'Precision Pro',
          audience: 'For commercial estates & agronomy advisors',
          monthlyPrice: '$0.48',
          annualPrice: '$0.38',
          cadenceNote: 'per hectare / month',
          ctaLabel: 'Launch Pro Trial',
          featured: true,
          specs: [
            { label: 'Monitored acreage', value: 'Unlimited hectares' },
            { label: 'Historical productivity zones', value: '8-year satellite archive' },
            { label: 'VRA prescriptions & control strips', value: 'ISOXML, SHP & GeoJSON' },
            { label: 'Soil sampling & yield import', value: 'Full machinery & drone sync' },
            { label: 'Team collaboration seats', value: 'Up to 10 agronomists' },
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise & B2B API',
          audience: 'For agribusinesses, plantations & input suppliers',
          monthlyPrice: 'Custom',
          annualPrice: 'Custom',
          cadenceNote: 'Volume & API licensing',
          ctaLabel: 'Request API Access',
          featured: false,
          specs: [
            { label: 'Indonesia & global crop API', value: '2.5 m resolution feed' },
            { label: 'Historical crop rotation archive', value: 'Since 2016 (30+ crops)' },
            { label: 'Multi-island portfolio telemetry', value: 'Bulk GeoJSON / REST' },
            { label: 'Custom ERP & drone telemetry', value: 'Dedicated webhooks' },
            { label: 'Agronomy onboarding SLA', value: 'Dedicated engineer' },
          ],
        },
      ],
    },
    demo: {
      eyebrow: 'Agronomy Onboarding',
      title: 'Schedule a walkthrough with our Indonesian precision agronomy team.',
      subtitle:
        'Share your managed acreage and crop portfolio. We will prepare sample productivity zones and a GeoJSON/ISOXML prescription test file for one of your actual blocks in Indonesia.',
      coverage: 'Coverage: Java, Sumatra, Kalimantan, Sulawesi, Nusa Tenggara & Global',
      formats: 'Formats: ISOXML, Shapefile (.shp), GeoJSON, Drone & Tractor Terminals',
      receivedTitle: 'Demo request received for',
      receivedBodyPrefix: 'We have logged your inquiry for',
      receivedBodyMid: 'and sent confirmation details to',
      submitAnother: 'Submit Another Request',
      fullNameLabel: 'Full Name',
      fullNamePlaceholder: 'Budi Santoso',
      emailLabel: 'Work or Estate Email',
      emailPlaceholder: 'agronomy@nusantara-estate.co.id',
      hectaresLabel: 'Managed Area (Hectares)',
      planLabel: 'Target Plan / Workflow',
      planOptions: [
        { value: 'Field Scouting', label: 'Field Scouting (Free up to 500 ha)' },
        { value: 'Precision Pro', label: 'Precision Pro (VRA & Zones)' },
        { value: 'Enterprise & B2B API', label: 'Enterprise & B2B Crop API' },
      ],
      noteFooter: 'Includes sample ISOXML/GeoJSON prescription test for one parcel.',
      submitBtn: 'Request Sample Walkthrough',
      errors: {
        name: 'Please enter your full name.',
        email: 'Please enter a valid work or estate email address.',
        hectares: 'Please enter your managed acreage in hectares.',
      },
    },
    footer: {
      tagline:
        'Satellite crop monitoring, variable-rate prescriptions, and agronomic analytics for Indonesia.',
      interactiveMap: 'Interactive Map',
      capabilities: 'Capabilities',
      outcomes: 'Outcomes',
      pricing: 'Pricing',
      requestDemo: 'Request Demo',
      copyright: 'AgriOS Agronomy Systems.',
    },
    chat: {
      buttonLabel: 'Ask AgriOS Agronomist',
      title: 'AgriOS Agronomist',
      welcome:
        'I am the AgriOS Agronomist. Ask about your Indonesian block’s NDVI vigor, variable-rate Urea/NPK adjustments, spraying weather windows, or live agricultural advisories.',
      engineLabel: 'Response Engine',
      searchMode: 'Search Grounded',
      fastMode: 'Fast Telemetry',
      sourcesHeader: 'Sources via Google Search',
      loadingSearch: 'Analyzing Indonesian field telemetry & checking Google Search...',
      loadingFast: 'Generating quick agronomic guidance...',
      suggestedLabel: 'Suggested questions:',
      inputPlaceholder: 'Ask about NDVI, Urea/NPK rates, pests, weather...',
      resetTitle: 'Clear chat history',
    },
  },
  id: {
    nav: {
      monitoring: 'Pemantauan',
      capabilities: 'Fitur',
      outcomes: 'Hasil',
      pricing: 'Harga',
      openPlatform: 'Buka Platform',
      closePlatform: 'Tutup Layar Penuh',
    },
    hero: {
      kickerLeft: 'Platform Pertanian Presisi',
      kickerRight: 'Indonesia & Asia Tenggara',
      headline: 'Presisi satelit untuk setiap sawah, kebun, dan dosis pemupukan.',
      subtitle:
        'Deteksi batas lahan otomatis, pantau indeks tajuk tanaman tropis setiap lima hari, dan ekspor peta pemupukan dosis variabel langsung ke tim lapangan—dirancang untuk ketahanan pangan dan agribisnis Indonesia.',
      ctaPrimary: 'Jelajahi Peta Langsung',
      ctaSecondary: 'Jadwalkan Demo Agronomi',
      highlight1: 'Kompatibel ISOXML & Shapefile',
      highlight2: 'Scouting lapangan offline di HP',
      highlight3: 'Data satelit Sentinel-2 & 2,5m',
      captionTitle: 'Segmentasi batas lahan otomatis & pemantauan indeks NDVI',
      captionFallback: 'Citra Ortofoto Lahan Pertanian Multispektral',
      meanNdviLabel: 'Rata-rata NDVI',
    },
    proofMetrics: [
      {
        value: '14,6 Jt ha',
        label: 'Cakupan Nusantara',
        detail: 'Pemetaan sawah, jagung, dan lahan perkebunan di seluruh Indonesia',
      },
      {
        value: '2,5 m',
        label: 'Resolusi Citra',
        detail: 'Fusi satelit Sentinel-2 bebas awan & citra orbital tropis',
      },
      {
        value: '19,2%',
        label: 'Hemat Urea & NPK',
        detail: 'Penghematan pupuk terukur melalui uji dosis variabel (VRA)',
      },
      {
        value: '5 Hari',
        label: 'Siklus Pembaruan',
        detail: 'Pemantauan kesehatan tajuk NDVI & peringatan stres tanaman',
      },
    ],
    workspace: {
      regionLabel: 'Kawasan Subang & Indramayu · Jawa Barat',
      mapSelectorLabel: 'Buka Peta Wilayah',
      parcelsLabel: 'Blok Lahan',
      totalHaLabel: 'ha Total',
      title: 'Ruang Kerja Peta Satelit & Lahan Interaktif',
      layers: {
        boundaries: 'Batas Lahan',
        ndvi: 'NDVI',
        ndmi: 'Kelembapan (NDMI)',
        ndre: 'Klorofil (NDRE)',
        zones: 'Zona Hasil',
        vra: 'Resep VRA',
        scouting: 'Scouting',
      },
      askAgronomist: 'Tanya Agronomis',
      expandMap: 'Perluas Analisis',
      exitFullscreen: 'Tampilan Standar',
      monitoredFields: 'Daftar Blok Terpantau',
      autoDetect: 'Deteksi Otomatis',
      detecting: 'Mendeteksi...',
      hints: {
        ndvi: 'Indeks multispektral Sentinel-2 melacak kerapatan klorofil di tiap blok lahan Indonesia. Geser tanggal di bawah untuk melihat perkembangan tanaman.',
        ndmi: 'Indeks Kelembapan (NDMI) memetakan kadar air tajuk & tanah permukaan untuk mendeteksi stres kering atau genangan lebih awal.',
        ndre: 'Indeks Klorofil Red-Edge (NDRE) menembus tajuk rapat pertengahan musim untuk melacak kekurangan nitrogen sebelum daun menguning.',
        boundaries:
          'Segmentasi AI memetakan pematang sawah, blok tebu, dan jalur irigasi secara otomatis dalam hitungan detik.',
        zones:
          'Zona produktivitas multi-musim disintesis dari 8 siklus tanam berturut-turut (MT1 & MT2) di Indonesia.',
        vra: 'Sesuaikan dosis Urea atau NPK per zona produktivitas di panel kanan, lalu ekspor file GeoJSON.',
        scouting:
          'Klik pin di peta untuk membaca catatan lapangan, atau klik "Tambah Pin Scouting" untuk mencatat temuan baru.',
      },
      legend: {
        highZone: 'Zona Tinggi',
        targetZone: 'Zona Sedang',
        stressZone: 'Zona Stres',
        scanning: 'Menjalankan deteksi batas lahan...',
        activeBoundaries: '4 batas lahan otomatis aktif',
        clickToPin: 'Klik di dalam blok lahan untuk menaruh pin',
        notesLogged: 'catatan geolokasi tercatat',
      },
      dropPin: 'Tambah Pin Scouting',
      cancelPin: 'Batal Tambah Pin',
      playSeason: 'Putar Musim',
      pauseSeason: 'Jeda',
      passLabel: 'Lintasan:',
      cloudLabel: 'Awan',
      exportedPrefix: 'Resep VRA (.geojson) berhasil diekspor untuk',
      seasonalNdviCurve: 'Kurva NDVI Musiman',
      meanLabel: 'Rata-rata',
      vraTitle: 'Rencana Dosis Variabel',
      vsFlat: 'vs dosis rata',
      productLabel: 'Pupuk:',
      estLabel: 'Est.',
      totalApplied: 'Total Aplikasi',
      flatLabel: 'Dosis Rata',
      exportGeojson: 'Ekspor Resep GeoJSON',
      newNoteTitle: 'Catatan Scouting Baru',
      categories: {
        weed: 'Serangan Gulma',
        nitrogen: 'Defisiensi Nitrogen',
        pest: 'Hama / Penyakit OPT',
        emergence: 'Cek Daya Tumbuh',
      },
      severities: {
        low: 'Tingkat Ringan',
        moderate: 'Tingkat Sedang',
        high: 'Tingkat Berat',
      },
      notePlaceholder: 'Tulis kondisi lapangan atau rekomendasi tindakan...',
      saveNote: 'Simpan Catatan',
      cancel: 'Batal',
      severityLabel: 'Tingkat',
      sprayingWeather: 'Cuaca Penyemprotan',
      sprayStatus: {
        optimal: 'Waktu Ideal',
        marginal: 'Waspada Angin',
        hold: 'Tunda · Angin/Hujan',
      },
      windLabel: 'Angin',
      tempLabel: 'Suhu',
      rainLabel: 'Hujan',
      sprayWarning: {
        titleMarginal: 'Peringatan Risiko Penyemprotan',
        titleHold: 'Kondisi Penyemprotan Tidak Aman',
        windExceeded: 'Kecepatan angin melebihi batas aman',
        rainExceeded: 'Curah hujan melebihi batas aman',
        limitLabel: 'Batas aman',
        adviceMarginal: 'Turunkan tekanan semprot dan gunakan nosel anti-drift butiran kasar.',
        adviceHold: 'Tunda penyemprotan hingga angin ≤ 12 km/jam dan hujan ≤ 0,5 mm.',
        dismiss: 'Tutup peringatan',
        showWarning: 'Lihat peringatan',
      },
      soilNpk: {
        title: 'Kadar Unsur Hara Tanah (NPK) Sepanjang Musim',
        subtitle:
          'Ketersediaan hara makro (kg/ha) yang dipantau pada interval satelit dan uji lab tanah untuk blok lahan terpilih.',
        nitrogen: 'Nitrogen (N)',
        phosphorus: 'Fosfor (P)',
        potassium: 'Kalium (K)',
        unit: 'kg/ha',
        activePass: 'Lintasan Aktif',
        soilProfile: 'Jenis Tanah',
        seasonalUptake: 'Penurunan Musiman',
      },
      forecast7Day: {
        toggleButton: 'Prakiraan 7 Hari',
        title: 'Prakiraan Operasi 7 Hari',
        histBaseline: 'Rata-rata 7h lalu',
        optimalWindows: 'Hari ideal semprot',
        daysUnit: 'hari',
        hideOverlay: 'Sembunyikan prakiraan',
        humidityLabel: 'RH',
      },
      soilMoisture: {
        title: 'Kelembapan Tanah (30 Hari Terakhir)',
        subtitle:
          'Kelembapan tanah volumetrik harian (%) pada lapisan atas (0–15 cm) & zona perakaran (15–45 cm) beserta curah hujan.',
        surfaceLabel: 'Permukaan (0–15 cm)',
        rootZoneLabel: 'Zona Akar (15–45 cm)',
        rainfallLabel: 'Hujan Harian (mm)',
        fieldCapacity: 'Kapasitas Lapang',
        stressThreshold: 'Ambang Kering',
        optimalBand: 'Zona Kelembapan Ideal',
        avg30d: 'Rata-rata 30 Hari',
        range30d: 'Rentang 30 Hari',
        netChange30d: 'Selisih 30 Hari',
        statusOptimal: 'Kelembapan Ideal',
        statusLow: 'Stres Kering · Irigasi',
        statusSaturated: 'Jenuh Air Tinggi',
        soilProfile: 'Jenis Tanah',
        windowEnding: 'Periode 30 hari berakhir',
      },
      explainableAi: {
        eyebrow: 'Mesin Keputusan Transparan',
        title: 'Explainable AI (XAI) · Audit Agronomi',
        subtitle:
          'Bobot atribusi fitur ala SHAP, aturan keselamatan eksplisit, dan penalaran kausal langsung di balik rekomendasi blok aktif.',
        decisionScoreLabel: 'Skor Keputusan Komposit',
        confidenceLabel: 'Tingkat Kepercayaan Model',
        baselineNote: 'Skor dasar 62',
        featureImpactTitle: 'Atribusi Dampak Fitur (± poin)',
        positiveDriver: 'Pendorong Positif',
        riskFactor: 'Faktor Risiko / Penalti',
        ruleTraceTitle: 'Jejak Aturan Keputusan',
        recommendedActionLabel: 'Tindakan Lapangan Disarankan',
        auditButton: 'Audit Penalaran Gemini',
        auditingButton: 'Menganalisis Telemetri...',
        auditEmptyHint:
          'Jalankan audit kausal Gemini XAI untuk memeriksa hubungan sebab-akibat fisiologis, simulasi skenario ("what-if"), dan batas ketidakpastian data.',
        causalDriversLabel: 'Faktor Kausal Fisiologis',
        counterfactualLabel: 'Tuas Perbaikan ("What-If")',
        uncertaintyLabel: 'Transparansi & Ketidakpastian Data',
        cloudCaveatLabel: 'Tutupan awan',
        modelAttributionNote: 'Dianalisis via Auditor Gemini XAI',
        errorPrefix: 'Audit tidak tersedia:',
      },
      compareFields: {
        toggleButton: 'Bandingkan Lahan',
        closeButton: 'Kembali ke Peta',
        eyebrow: 'Perbandingan Antar-Blok',
        title: 'Dasbor Perbandingan Blok Lahan',
        subtitle:
          'Bandingkan indeks vegetasi (NDVI), kelembapan tanah 30 hari, cadangan hara NPK, dan efisiensi VRA pada dua petak lahan Indonesia sekaligus.',
        parcelALabel: 'Blok A',
        parcelBLabel: 'Blok B',
        swapButton: 'Tukar A ↔ B',
        sameParcelNotice: 'Blok A dan Blok B saat ini sama. Pilih blok lain untuk melihat selisih performa.',
        satellitePassLabel: 'Lintasan Satelit',
        matrixTitle: 'Matriks Telemetri Agronomi',
        metricCol: 'Metrik',
        deltaCol: 'Selisih (A − B)',
        metrics: {
          cropSoil: 'Komoditas · Jenis Tanah',
          growthStage: 'Fase Pertumbuhan',
          areaHa: 'Luas Petak',
          ndviMean: 'Rata-rata NDVI (Min–Maks)',
          biomass: 'Indeks Biomassa Kering',
          surfaceMoisture: 'Kelembapan Permukaan (0–15 cm)',
          meanMoisture30d: 'Rata-rata Kelembapan 30 Hari',
          nitrogen: 'Nitrogen Tersedia (N)',
          phosphorus: 'Fosfor Tersedia (P)',
          potassium: 'Kalium Tersedia (K)',
          sprayWeather: 'Jendela Semprot · Angin / Hujan',
          vraDelta: 'Selisih Dosis VRA vs Rata',
        },
        charts: {
          ndviTitle: 'Kurva NDVI Sepanjang Musim',
          ndviSubtitle: 'Vitalitas tajuk bebas awan pada 6 lintasan satelit',
          npkTitle: 'Perbandingan Unsur Hara NPK (kg/ha)',
          npkSubtitle: 'Ketersediaan hara makro pada lintasan aktif',
          moistureTitle: 'Tren Kelembapan Tanah 30 Hari (%)',
          moistureSubtitle: 'Kelembapan volumetrik lapisan atas (0–15 cm)',
        },
      },
      manualInput: {
        toggleButton: 'Input Lahan Petani',
        closeButton: 'Kembali ke Peta',
        eyebrow: 'Survei Tanah Petani & Kesesuaian Lahan',
        title: 'Input Data Lahan Manual & Analisis Kecocokan Tanam',
        subtitle:
          'Masukkan hasil cek lahan petani (pH tanah, kelembapan, elevasi, curah hujan, jenis tanah, dan NPK) untuk melihat komoditas yang paling cocok ditanam beserta rekomendasi pembenahan tanah.',
        presetsLabel: 'Muat Contoh Profil Lahan:',
        formTitle: 'Parameter Tanah & Iklim Lahan',
        fieldNameLabel: 'Nama Lahan / Blok Petani',
        areaHaLabel: 'Luas Lahan (ha)',
        soilTypeLabel: 'Jenis Tanah',
        irrigationLabel: 'Kondisi Air / Drainase',
        phLabel: 'pH Tanah (3,5–8,5)',
        moistureLabel: 'Kelembapan Tanah (%)',
        elevationLabel: 'Ketinggian (mdpl)',
        rainfallLabel: 'Curah Hujan (mm/bln)',
        tempLabel: 'Suhu Rata-rata (°C)',
        npkSectionLabel: 'Estimasi Hara Makro NPK (kg/ha)',
        analyzeButton: 'Analisis Kecocokan & Rekomendasi AI',
        analyzingButton: 'Menyusun Rekomendasi AI...',
        topMatchLabel: 'Tanaman Paling Cocok',
        soilHealthLabel: 'Status Kondisi Tanah',
        suitabilityChartTitle: 'Peringkat Kecocokan Komoditas (0–100%)',
        cropTableTitle: 'Daftar Komoditas Cocok & Faktor Pembatas',
        cropCol: 'Komoditas & Varietas',
        classCol: 'Kelas',
        scoreCol: 'Skor',
        yieldCol: 'Potensi Hasil',
        notesCol: 'Faktor Pembatas & Fokus Pemupukan',
        amendmentsTitle: 'Rekomendasi Pembenahan Tanah Pra-Tanam',
        aiVerdictTitle: 'Analisis Agronomis Gemini AI',
        aiVerdictEmpty:
          'Sesuaikan data tanah di panel kiri lalu tekan "Analisis Kecocokan & Rekomendasi AI" untuk mendapatkan rekomendasi varietas unggul, takaran kapur/pupuk, serta pola tumpangsari.',
        aiCalendarLabel: 'Rekomendasi Varietas & Jarak Tanam',
        aiStepsLabel: 'Langkah Pembenahan & Pemupukan',
        aiIntercropLabel: 'Opsi Rotasi & Tumpangsari',
        aiErrorPrefix: 'Rekomendasi AI tidak tersedia:',
        classes: {
          s1: 'S1 · Sangat Cocok',
          s2: 'S2 · Cukup Cocok',
          s3: 'S3 · Kurang Cocok',
        },
        healthStates: {
          optimal: 'Kondisi Ideal',
          conditioning: 'Perlu Pembenahan Ringan',
          alert: 'Peringatan pH / Drainase',
        },
        soilOptions: {
          alluvial: 'Aluvial Liat (Sawah / Dataran Rendah)',
          latosol: 'Latosol Merah (Lahan Kering)',
          regosol: 'Regosol Vulkanik (Gembur)',
          andosol: 'Andosol (Dataran Tinggi Vulkanik)',
          podsolik: 'Podsolik Merah Kuning (Ultisol)',
          gambut: 'Tanah Gambut / Organosol',
        },
        irrigationOptions: {
          irrigated: 'Irigasi Teknis Teratur',
          rainfed: 'Tadah Hujan',
          well_drained: 'Lahan Kering / Drainase Cepat',
          tidal_swamp: 'Rawa / Pasang Surut',
        },
      },
      activityLog: {
        eyebrow: 'Catatan Historis Budidaya',
        title: 'Log Aktivitas Lahan & Kinerja Pengelolaan',
        subtitle:
          'Catat riwayat tanggal tanam, siklus irigasi, pemupukan, dan aplikasi pestisida secara manual untuk melacak biaya serta dampak pertumbuhan tanaman.',
        addButton: '+ Catat Aktivitas',
        cancelButton: 'Batal',
        saveButton: 'Simpan Log Aktivitas',
        resetButton: 'Reset Input Tambahan',
        filterAll: 'Semua Aktivitas',
        types: {
          planting: 'Penanaman',
          irrigation: 'Siklus Irigasi',
          fertilization: 'Pemupukan',
          pesticide: 'Aplikasi Pestisida',
        },
        kpis: {
          totalOps: 'Total Aktivitas Tercatat',
          latestPlanting: 'Tanggal Tanam Terakhir',
          irrigationCycles: 'Siklus Irigasi',
          pesticidePasses: 'Aplikasi Pestisida',
          avgImpact: 'Rata-rata Dampak Vigor',
          totalSpendHa: 'Total Biaya / ha',
        },
        form: {
          typeLabel: 'Jenis Aktivitas',
          dateLabel: 'Tanggal Pelaksanaan',
          materialLabel: 'Benih / Sumber Air / Produk',
          materialPlaceholder: 'cth., Benih Inpari 32, Pintu Air P3A, Abamectin 18 EC',
          quantityLabel: 'Dosis / Volume',
          quantityPlaceholder: 'cth., 150 kg/ha atau 400 m³/ha',
          costLabel: 'Biaya / ha (Rp)',
          operatorLabel: 'Petani / Operator',
          impactLabel: 'Dampak Vigor (%)',
          noteLabel: 'Catatan Hasil Lapangan',
          notePlaceholder: 'Catat respons daun, penurunan hama, atau kecukupan air...',
        },
        chartTitle: 'Dampak Vigor (%) per Aktivitas Tercatat',
        chartSubtitle: 'Evaluasi respons pertumbuhan tajuk setelah tindakan budidaya',
        tableHeaders: {
          date: 'Tanggal',
          activity: 'Aktivitas',
          material: 'Bahan / Metode',
          dosage: 'Dosis',
          cost: 'Biaya / ha',
          impact: 'Δ Vigor',
          operator: 'Operator',
        },
        emptyState: 'Belum ada catatan aktivitas yang sesuai filter untuk blok lahan ini.',
        noPlantingYet: 'Belum dicatat',
        deleteLabel: 'Hapus catatan',
        customTag: 'Input petani',
      },
      fertilizerCalc: {
        toggleButton: 'Kalkulator Pupuk',
        closeButton: 'Kembali ke Peta',
        eyebrow: 'Perhitungan Dosis Hara Presisi',
        title: 'Kalkulator Dosis Pupuk NPK & Varietas',
        subtitle:
          'Hitung takaran pasti NPK Phonska, Urea, SP-36, dan KCl berdasarkan kadar NPK tanah terkini, varietas tanaman, dan target hasil panen.',
        syncParcelButton: 'Ambil Data Blok Aktif',
        syncedHint: 'Disinkronkan dari lintasan blok aktif',
        inputsTitle: 'Parameter Varietas & Kadar NPK Tanah',
        varietyLabel: 'Komoditas & Varietas',
        areaLabel: 'Luas Lahan (ha)',
        targetYieldLabel: 'Target Hasil Panen (t/ha)',
        currentNpkLabel: 'Kadar NPK Tanah Saat Ini (kg/ha)',
        kpis: {
          totalRate: 'Total Dosis Pupuk',
          totalBags: 'Kebutuhan Karung (50 kg)',
          costPerHa: 'Estimasi Biaya / ha',
          totalBudget: 'Total Anggaran Lahan',
        },
        chartTitle: 'Neraca Unsur Hara Makro (kg/ha)',
        chartSubtitle: 'Perbandingan hara tersedia tanah, kebutuhan varietas & tambahan dosis',
        soilSeries: 'Tersedia di Tanah',
        demandSeries: 'Kebutuhan Tanaman',
        addSeries: 'Dosis Tambahan',
        productsTitle: 'Komposisi Pupuk Tunggal & Majemuk Disarankan',
        productCol: 'Jenis Pupuk',
        analysisCol: 'Kandungan',
        rateCol: 'Dosis / ha',
        totalCol: 'Total Lahan',
        sacksCol: 'Karung (50 kg)',
        costCol: 'Estimasi Biaya',
        sacksUnit: 'karung',
        scheduleTitle: 'Jadwal Pemupukan Bertahap (kg/ha)',
        stageCol: 'Tahap Aplikasi',
        windowCol: 'Waktu (HST)',
      },
      yieldForecast: {
        toggleButton: 'Prediksi Panen',
        closeButton: 'Kembali ke Peta',
        eyebrow: 'Pemodelan Prediksi Hasil Panen',
        title: 'Estimasi Volume Panen & Prediksi Produktivitas',
        subtitle:
          'Gabungkan data indeks vegetasi (NDVI) aktif, kelembapan tanah 30 hari, dan riwayat panen 4 tahun bersama AI Gemini untuk memproyeksikan tonase panen 2026.',
        runAiButton: 'Analisis Prediksi Gemini AI',
        runningAiButton: 'Memproses Prediksi Gemini...',
        passSelectorLabel: 'Lintasan Satelit Acuan',
        kpis: {
          forecastVolume: 'Proyeksi Total Tonase',
          yieldRate: 'Estimasi Produktivitas',
          daysToHarvest: 'Kesiapan Panen',
          grossValue: 'Estimasi Nilai Panen',
          confidenceBand: 'Rentang',
          vs4YrAvg: 'vs rata-rata 4 thn',
          readyNow: 'Siap Panen',
          daysUnit: 'hari lagi',
        },
        chartTitle: 'Riwayat Produktivitas (2022–2025) vs Prediksi 2026',
        chartSubtitle: 'Hasil panen tahunan (t/ha) beserta korelasi puncak indeks vegetasi NDVI',
        yieldSeriesLabel: 'Hasil (t/ha)',
        ndviSeriesLabel: 'Puncak NDVI',
        zoneTableTitle: 'Proyeksi Volume Panen per Zona Pengelolaan',
        zoneCol: 'Zona Lahan',
        areaCol: 'Luas',
        rateCol: 'Laju Hasil',
        volumeCol: 'Volume Panen',
        aiPanelTitle: 'Analisis Prediksi Panen Gemini AI',
        aiEmptyHint:
          'Klik "Analisis Prediksi Gemini AI" untuk membedah faktor pendorong hasil panen, langkah pra-panen, serta kesiapan armada angkut/pengeringan.',
        aiDriversLabel: 'Faktor Penentu Hasil (NDVI & Air)',
        aiActionsLabel: 'Tindakan Pengamanan Bobot Pra-Panen',
        aiLogisticsLabel: 'Rekomendasi Logistik & Pasca-Panen',
        aiErrorPrefix: 'Prediksi Gemini tidak tersedia:',
        ndviWeightLabel: 'Faktor pengali vigor NDVI',
      },
    },
    capabilities: {
      eyebrow: 'Arsitektur Platform',
      title: 'Dirancang untuk scouting harian, pemupukan presisi, dan skala perkebunan.',
      subtitle:
        'Setiap alur kerja menghubungkan telemetri satelit langsung ke keputusan agronomi—menghilangkan penggambaran peta manual dan takaran pupuk kira-kira.',
      cards: {
        card1Tag: '01. Pemantauan Satelit & Batas Lahan',
        card1Metric: 'Update 5 Hari',
        card1Title: 'Deteksi batas lahan otomatis dan deret waktu NDVI bebas awan',
        card1Body:
          'Pembelajaran mesin memetakan geometri petak sawah dan kebun di Jawa, Sumatra, Kalimantan, dan Sulawesi dalam hitungan detik. Pantau dinamika klorofil dan deteksi stres tanaman lebih awal.',
        card1Stats: [
          { value: '< 4 dtk', label: 'Ekstraksi kontur petak' },
          { value: '2016–2026', label: 'Arsip historis tanam & NDVI' },
          { value: '30+ Komoditas', label: 'Padi, jagung, tebu & sawit' },
        ],
        card2Tag: '02. Scouting Lapangan',
        card2Title: 'Catatan ber-geotag, siap tanpa sinyal',
        card2Body:
          'Tandai titik serangan wereng, gulma, atau genangan air lengkap dengan foto dan koordinat GPS—tetap berjalan lancar meski di area persawahan tanpa sinyal seluler.',
        card2Foot: 'iOS & Android · Sinkron saat online',
        card3Tag: '03. Integrasi Alat & Drone',
        card3Title: 'Ekspor langsung ke ISOXML & drone penebar',
        card3Body:
          'Kirim peta dosis variabel Urea, NPK, dan benih langsung ke terminal traktor atau drone penyebar pupuk melalui format standar GeoJSON dan Shapefile.',
        card3Foot: 'ISOXML · Shapefile · GeoJSON',
        card4Tag: '04. Zona Produktivitas & Strip Uji',
        card4Metric: 'Validasi Statistik',
        card4Title: 'Buktikan ROI pemupukan variabel dengan jalur kontrol lapangan',
        card4Body:
          'Bandingkan pemupukan dosis rata terhadap resep VRA multi-zona menggunakan strip kontrol, integrasi hasil uji tanah laboratorium, dan data hasil panen.',
        card4Stats: [
          { value: '3–7 Zona', label: 'Grid manajemen fleksibel' },
          { value: 'Uji Tanah Lab', label: 'Titik sampling terarah' },
          { value: 'Margin/ha', label: 'Evaluasi hasil pasca panen' },
        ],
      },
    },
    outcomes: {
      eyebrow: 'Hasil Agronomi Terukur',
      title: 'Terbukti pada koperasi tani padi dan perusahaan agribisnis di Indonesia.',
      ctaLink: 'Coba kalkulator VRA langsung',
      studies: [
        {
          organization: 'Koperasi Tani Pantura Mandiri',
          region: 'Subang, Jawa Barat · 3.420 ha Padi Sawah & Jagung Hibrida',
          person: 'Hendra Wijaya, Direktur Operasional',
          outcome: 'Hemat 21,4% Pupuk Urea & Naik +0,52 t/ha Panen',
          summary:
            'Mengganti tebar Urea merata di 46 blok sawah dengan zona produktivitas multi-musim dan jalur uji kontrol. Terbukti meningkatkan keseragaman malai pada musim tanam MT1 dan MT2 sebelum diterapkan ke seluruh anggota koperasi.',
        },
        {
          organization: 'Agro Nusantara Perkebunan',
          region: 'Lampung Tengah · 5.800 ha Tebu & Kedelai',
          person: 'Ratna Sari Dewi, Kepala Agronomi',
          outcome: 'Hemat 14 Jam/Minggu untuk Scouting & Pelaporan',
          summary:
            'Menyatukan catatan scouting offline di aplikasi dengan peringatan anomali NDVI otomatis setiap 5 hari. Pengawas kebun kini langsung menuju titik blok bermasalah tanpa patroli keliling buta.',
        },
      ],
    },
    pricing: {
      eyebrow: 'Paket & Lisensi',
      title: 'Mulai pemantauan gratis, tingkatkan ke otomasi pemupukan presisi.',
      annualToggle: 'Tahunan (Hemat 20%)',
      monthlyToggle: 'Bulanan',
      tiers: [
        {
          id: 'scouting',
          name: 'Field Scouting',
          audience: 'Untuk Gapoktan & petani mandiri memulai pemantauan digital',
          monthlyPrice: 'Rp 0',
          annualPrice: 'Rp 0',
          cadenceNote: 'Gratis hingga 500 ha',
          ctaLabel: 'Mulai Ruang Kerja Gratis',
          featured: false,
          specs: [
            { label: 'Deteksi batas lahan otomatis', value: 'Hingga 500 ha' },
            { label: 'Pemantauan NDVI Sentinel-2', value: 'Update tiap 5 hari' },
            { label: 'Catatan scouting mobile offline', value: 'Pin & foto tak terbatas' },
            { label: 'Jendela cuaca penyemprotan', value: 'Prakiraan 5 hari lokal' },
            { label: 'Peta resep pupuk VRA', value: 'Pratinjau saja' },
          ],
        },
        {
          id: 'pro',
          name: 'Precision Pro',
          audience: 'Untuk perusahaan tani komersial & konsultan agronomi',
          monthlyPrice: 'Rp 7.500',
          annualPrice: 'Rp 6.000',
          cadenceNote: 'per hektar / bulan',
          ctaLabel: 'Mulai Uji Coba Pro',
          featured: true,
          specs: [
            { label: 'Luas lahan terpantau', value: 'Tanpa batas hektar' },
            { label: 'Zona produktivitas historis', value: 'Arsip satelit 8 tahun' },
            { label: 'Resep VRA & strip kontrol', value: 'ISOXML, SHP & GeoJSON' },
            { label: 'Impor uji tanah & hasil panen', value: 'Sinkron drone & traktor' },
            { label: 'Akun kolaborasi tim', value: 'Hingga 10 agronomis' },
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise & API B2B',
          audience: 'Untuk korporasi perkebunan, pabrik gula & produsen pupuk',
          monthlyPrice: 'Kustom',
          annualPrice: 'Kustom',
          cadenceNote: 'Lisensi volume & API',
          ctaLabel: 'Minta Akses API',
          featured: false,
          specs: [
            { label: 'API komoditas Indonesia & global', value: 'Feed resolusi 2,5 m' },
            { label: 'Arsip rotasi tanam historis', value: 'Sejak 2016 (30+ tanaman)' },
            { label: 'Telemetri portofolio lintas pulau', value: 'Bulk GeoJSON / REST' },
            { label: 'Integrasi ERP & telemetri drone', value: 'Webhook khusus' },
            { label: 'SLA pendampingan agronomi', value: 'Engineer khusus' },
          ],
        },
      ],
    },
    demo: {
      eyebrow: 'Implementasi Agronomi',
      title: 'Jadwalkan sesi demo bersama tim agronomi presisi Indonesia kami.',
      subtitle:
        'Bagikan luas lahan dan komoditas Anda. Kami akan menyiapkan contoh zona produktivitas serta file uji resep GeoJSON/ISOXML untuk salah satu blok lahan Anda di Indonesia.',
      coverage: 'Cakupan: Jawa, Sumatra, Kalimantan, Sulawesi, Nusa Tenggara & Global',
      formats: 'Format: ISOXML, Shapefile (.shp), GeoJSON, Terminal Drone & Traktor',
      receivedTitle: 'Permintaan demo diterima untuk',
      receivedBodyPrefix: 'Kami telah mencatat permintaan Anda untuk paket',
      receivedBodyMid: 'dan mengirimkan detail konfirmasi ke',
      submitAnother: 'Kirim Permintaan Lain',
      fullNameLabel: 'Nama Lengkap',
      fullNamePlaceholder: 'Budi Santoso',
      emailLabel: 'Email Kerja atau Perusahaan',
      emailPlaceholder: 'agronomi@nusantara-estate.co.id',
      hectaresLabel: 'Luas Lahan Dikelola (Hektar)',
      planLabel: 'Paket / Alur Kerja Tujuan',
      planOptions: [
        { value: 'Field Scouting', label: 'Field Scouting (Gratis hingga 500 ha)' },
        { value: 'Precision Pro', label: 'Precision Pro (VRA & Zona)' },
        { value: 'Enterprise & B2B API', label: 'Enterprise & API B2B' },
      ],
      noteFooter: 'Termasuk uji file resep ISOXML/GeoJSON untuk satu petak lahan.',
      submitBtn: 'Ajukan Sesi Demo',
      errors: {
        name: 'Mohon masukkan nama lengkap Anda.',
        email: 'Mohon masukkan alamat email kerja yang valid.',
        hectares: 'Mohon masukkan luas lahan dalam satuan hektar.',
      },
    },
    footer: {
      tagline:
        'Pemantauan tanaman berbasis satelit, resep pemupukan variabel, dan analitik agronomi untuk Indonesia.',
      interactiveMap: 'Peta Interaktif',
      capabilities: 'Fitur',
      outcomes: 'Hasil',
      pricing: 'Harga',
      requestDemo: 'Minta Demo',
      copyright: 'AgriOS Agronomy Systems.',
    },
    chat: {
      buttonLabel: 'Tanya Agronomis AgriOS',
      title: 'Agronomis AgriOS',
      welcome:
        'Saya adalah Agronomis AgriOS. Tanyakan tentang skor NDVI blok lahan Indonesia Anda, penyesuaian dosis pupuk Urea/NPK variabel, cuaca penyemprotan, atau info hama/cuaca terkini.',
      engineLabel: 'Mode Respons',
      searchMode: 'Pencarian Web',
      fastMode: 'Telemetri Cepat',
      sourcesHeader: 'Sumber melalui Google Search',
      loadingSearch: 'Menganalisis data lahan Indonesia & mencari referensi Google Search...',
      loadingFast: 'Menyusun rekomendasi agronomi cepat...',
      suggestedLabel: 'Pertanyaan cepat:',
      inputPlaceholder: 'Tanya NDVI, dosis Urea/NPK, hama, cuaca...',
      resetTitle: 'Hapus riwayat percakapan',
    },
  },
};
