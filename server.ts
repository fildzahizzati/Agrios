import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

interface FieldContextPayload {
  fieldName?: string;
  crop?: string;
  variety?: string;
  areaHa?: number;
  soilType?: string;
  date?: string;
  meanNdvi?: number;
  minNdvi?: number;
  maxNdvi?: number;
  growthStage?: string;
  sprayWindow?: string;
  windKmh?: number;
  tempC?: number;
  rainMm?: number;
  fertilizerProduct?: string;
  vraSavingsPct?: number;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/agronomist-chat', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Add your API key in Settings > Secrets to use the AgriOS Agronomist.',
        });
        return;
      }

      const {
        messages,
        fieldContext,
        mode = 'search',
        language = 'id',
      }: {
        messages?: ChatTurn[];
        fieldContext?: FieldContextPayload;
        mode?: 'search' | 'fast';
        language?: 'en' | 'id';
      } = req.body ?? {};

      if (!Array.isArray(messages) || messages.length === 0) {
        res.status(400).json({ error: 'Conversation messages array is required.' });
        return;
      }

      const sanitizedHistory = messages
        .filter(
          (m): m is ChatTurn =>
            (m.role === 'user' || m.role === 'model') &&
            typeof m.text === 'string' &&
            m.text.trim().length > 0
        )
        .slice(-14);

      if (sanitizedHistory.length === 0) {
        res.status(400).json({ error: 'At least one non-empty message is required.' });
        return;
      }

      const contextSummary = fieldContext
        ? [
            `Region: Subang & Indramayu Estate, West Java, Indonesia`,
            `Active Parcel: ${fieldContext.fieldName ?? 'Unknown'} (${fieldContext.areaHa ?? 0} ha)`,
            `Crop & Variety: ${fieldContext.crop ?? 'N/A'} (${fieldContext.variety ?? 'N/A'}), Soil: ${fieldContext.soilType ?? 'N/A'}`,
            `Selected Satellite Pass: ${fieldContext.date ?? 'N/A'} · Growth Stage: ${fieldContext.growthStage ?? 'N/A'}`,
            `NDVI Telemetry: Mean ${fieldContext.meanNdvi?.toFixed(2) ?? 'N/A'} (Min ${fieldContext.minNdvi?.toFixed(2) ?? 'N/A'}, Max ${fieldContext.maxNdvi?.toFixed(2) ?? 'N/A'})`,
            `Weather & Spray Window: ${fieldContext.sprayWindow ?? 'N/A'} (Wind ${fieldContext.windKmh ?? 0} km/h, Temp ${fieldContext.tempC ?? 0}°C, Rain ${fieldContext.rainMm ?? 0} mm)`,
            `VRA Fertilizer Plan: ${fieldContext.fertilizerProduct ?? 'N/A'} (${fieldContext.vraSavingsPct !== undefined ? `${fieldContext.vraSavingsPct.toFixed(1)}% delta vs flat` : 'N/A'})`,
          ].join('\n')
        : 'Region: Indonesia. No specific field parcel selected.';

      const preferredLanguageInstruction =
        language === 'id'
          ? 'Default language is Bahasa Indonesia (natural agronomic Indonesian), unless the user writes in English.'
          : 'Default language is English, unless the user writes in Bahasa Indonesia.';

      const systemInstruction = [
        'You are the AgriOS Senior Agronomist, an expert precision agriculture advisor specializing in Indonesian and tropical farming systems (irrigated paddy rice, hybrid corn, soybeans, sugarcane, and plantation crops).',
        'Your role is to help Indonesian farmers, Gapoktan, agronomists, and estate managers interpret satellite NDVI telemetry, optimize variable-rate fertilization (Urea, NPK Phonska, SP-36, ZA), evaluate spraying weather windows, and address tropical pests (wereng, penggerek batang), weeds, and nutrient deficiencies.',
        preferredLanguageInstruction,
        'Answer clearly, concisely, and practically. Ground advice in the active field telemetry below whenever relevant, and cite sources when Google Search grounding is active.',
        '',
        'ACTIVE FIELD CONTEXT:',
        contextSummary,
      ].join('\n');

      const useSearch = mode === 'search';
      const selectedModel = useSearch ? 'gemini-4-hydrogen' : 'gemini-3.1-flash-lite';

      const contents = sanitizedHistory.map((turn) => ({
        role: turn.role,
        parts: [{ text: turn.text }],
      }));

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents,
        config: {
          systemInstruction,
          ...(useSearch
            ? {
                tools: [{ googleSearch: {} }],
              }
            : {
                thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
              }),
        },
      });

      const replyText =
        response.text?.trim() ||
        'Unable to generate an agronomic response for that query. Please try rephrasing.';

      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
      const sources = rawChunks
        .map((chunk) => chunk.web)
        .filter((web): web is { uri: string; title?: string } => Boolean(web?.uri))
        .map((web) => ({
          uri: web.uri,
          title: web.title || web.uri,
        }))
        .filter(
          (item, index, arr) => arr.findIndex((other) => other.uri === item.uri) === index
        )
        .slice(0, 5);

      res.json({
        reply: replyText,
        modelUsed: selectedModel,
        sources,
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message =
        errObj?.message || 'Unexpected error communicating with Gemini Agronomist service.';

      if (status === 403 || status === 400) {
        res.status(status).json({
          error: `Gemini API configuration issue (${status}): Please verify your GEMINI_API_KEY in Settings > Secrets. ${message}`,
        });
        return;
      }

      if (status === 429) {
        res.status(429).json({
          error:
            'Rate limit reached on the Gemini API key. Wait a moment or check your quota in Settings > Secrets.',
        });
        return;
      }

      res.status(500).json({ error: message });
    }
  });

  app.post('/api/explain-decision', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Add your API key in Settings > Secrets to generate AI explanations.',
        });
        return;
      }

      const {
        telemetry,
        language = 'id',
      }: {
        telemetry?: {
          estateName?: string;
          fieldName?: string;
          crop?: string;
          soilType?: string;
          date?: string;
          cloudCover?: number;
          meanNdvi?: number;
          moisturePct?: number;
          moistureStatus?: string;
          nitrogenKgHa?: number;
          phosphorusKgHa?: number;
          potassiumKgHa?: number;
          windKmh?: number;
          rainMm?: number;
          sprayWindow?: string;
          vraSavingsPct?: number;
          decisionScore?: number;
          topContributors?: Array<{ label: string; impactPct: number }>;
        };
        language?: 'en' | 'id';
      } = req.body ?? {};

      if (!telemetry || !telemetry.fieldName) {
        res.status(400).json({ error: 'Field telemetry payload is required.' });
        return;
      }

      const langPrompt =
        language === 'id'
          ? 'Respond strictly in clear, professional Bahasa Indonesia suitable for Indonesian agronomists and estate managers.'
          : 'Respond strictly in clear, concise English suitable for agronomists and estate managers.';

      const prompt = [
        'Explain why the AgriOS precision agriculture model produced this agronomic decision and VRA fertilizer plan based on the exact parcel telemetry below.',
        langPrompt,
        'Be concrete, transparent about cause-and-effect, and cite exact numbers from the telemetry.',
        '',
        `Estate: ${telemetry.estateName ?? 'Indonesia'}`,
        `Parcel: ${telemetry.fieldName} (${telemetry.crop ?? 'Crop'}, Soil: ${telemetry.soilType ?? 'N/A'})`,
        `Satellite Pass: ${telemetry.date ?? 'N/A'} (Cloud cover: ${telemetry.cloudCover ?? 0}%)`,
        `NDVI: ${telemetry.meanNdvi ?? 0} | Soil Moisture (0-15cm): ${telemetry.moisturePct ?? 0}% (${telemetry.moistureStatus ?? 'Optimal'})`,
        `Available NPK: N=${telemetry.nitrogenKgHa ?? 0} kg/ha, P=${telemetry.phosphorusKgHa ?? 0} kg/ha, K=${telemetry.potassiumKgHa ?? 0} kg/ha`,
        `Weather & Spraying: Wind ${telemetry.windKmh ?? 0} km/h, Rain ${telemetry.rainMm ?? 0} mm (${telemetry.sprayWindow ?? 'Optimal'})`,
        `VRA Savings vs Flat: ${telemetry.vraSavingsPct ?? 0}% | Composite Health Score: ${telemetry.decisionScore ?? 0}/100`,
        `Feature Attribution Weights: ${(telemetry.topContributors ?? []).map((c) => `${c.label}: ${c.impactPct > 0 ? '+' : ''}${c.impactPct}%`).join(', ')}`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an Explainable AI (XAI) Agronomic Auditor. Break down model decisions into clear causal drivers, a practical counterfactual ("what-if") recommendation, and an honest data-uncertainty caveat.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description:
                  '2-sentence clear explanation of why the current score and VRA recommendation were generated.',
              },
              keyDrivers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exactly 3 short causal bullets linking specific measured telemetry numbers to crop physiology.',
              },
              counterfactualAction: {
                type: Type.STRING,
                description:
                  '1 concrete what-if action showing what adjustment improves yield or reduces risk most.',
              },
              uncertaintyNote: {
                type: Type.STRING,
                description:
                  '1 short transparency caveat noting satellite cloud cover, sensor intervals, or ground-truth checks needed.',
              },
            },
            required: ['summary', 'keyDrivers', 'counterfactualAction', 'uncertaintyNote'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as {
        summary?: string;
        keyDrivers?: string[];
        counterfactualAction?: string;
        uncertaintyNote?: string;
      };

      res.json({
        summary: parsed.summary || '',
        keyDrivers: Array.isArray(parsed.keyDrivers) ? parsed.keyDrivers : [],
        counterfactualAction: parsed.counterfactualAction || '',
        uncertaintyNote: parsed.uncertaintyNote || '',
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message =
        errObj?.message || 'Unexpected error generating Explainable AI audit.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/crop-suitability', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Add your API key in Settings > Secrets to generate AI planting recommendations.',
        });
        return;
      }

      const {
        input,
        rankedCrops,
        language = 'id',
      }: {
        input?: {
          fieldName?: string;
          areaHa?: number;
          soilType?: string;
          ph?: number;
          moisturePct?: number;
          elevationM?: number;
          rainfallMmMonth?: number;
          tempC?: number;
          irrigation?: string;
          nitrogenKgHa?: number;
          phosphorusKgHa?: number;
          potassiumKgHa?: number;
        };
        rankedCrops?: Array<{ cropName: string; score: number; status: string }>;
        language?: 'en' | 'id';
      } = req.body ?? {};

      if (!input || typeof input.ph !== 'number' || typeof input.moisturePct !== 'number') {
        res.status(400).json({ error: 'Valid soil pH, moisture, and field parameters are required.' });
        return;
      }

      const langPrompt =
        language === 'id'
          ? 'Respond strictly in practical, farmer-friendly Bahasa Indonesia (istilah agronomi Indonesia yang jelas dan mudah dipahami petani & penyuluh).'
          : 'Respond strictly in practical, clear English suitable for agronomists and estate farmers.';

      const topCropsText = (rankedCrops ?? [])
        .slice(0, 4)
        .map((c) => `${c.cropName}: ${c.score}% (${c.status})`)
        .join(', ');

      const prompt = [
        'Analyze this Indonesian farmer manual soil & climate survey and recommend what crops are best suited to plant, required soil remediation, and planting strategy.',
        langPrompt,
        '',
        `Field Name: ${input.fieldName || 'Manual Farm Block'} (${input.areaHa ?? 1} ha)`,
        `Soil Type: ${input.soilType ?? 'Alluvial'} | pH: ${input.ph} | Soil Moisture: ${input.moisturePct}%`,
        `Elevation: ${input.elevationM ?? 0} mdpl | Monthly Rainfall: ${input.rainfallMmMonth ?? 0} mm | Avg Temp: ${input.tempC ?? 28}°C`,
        `Irrigation / Drainage: ${input.irrigation ?? 'Rainfed'}`,
        `Soil NPK: N=${input.nitrogenKgHa ?? 0} kg/ha, P=${input.phosphorusKgHa ?? 0} kg/ha, K=${input.potassiumKgHa ?? 0} kg/ha`,
        `Quantitative Crop Match Ranking: ${topCropsText}`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are a Senior Indonesian Agronomist specializing in Land Suitability Classification (Kesesuaian Lahan BPTP / Kementan RI). Provide concrete cultivar suggestions, dolomite/fertilizer doses, and intercropping advice.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bestCropVerdict: {
                type: Type.STRING,
                description:
                  '2-sentence clear verdict explaining which top crops match this land and why based on pH, moisture, elevation, and soil type.',
              },
              plantingCalendarNote: {
                type: Type.STRING,
                description:
                  'Concrete recommended Indonesian cultivar/variety, planting spacing, and optimal planting window.',
              },
              soilRemediationSteps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exactly 3 practical soil treatment or fertilization action steps (including concrete doses like Dolomite tons/ha or Urea/NPK kg/ha).',
              },
              intercroppingOption: {
                type: Type.STRING,
                description:
                  '1 practical crop rotation or intercropping (tumpangsari) pairing suited to preserve soil fertility.',
              },
            },
            required: [
              'bestCropVerdict',
              'plantingCalendarNote',
              'soilRemediationSteps',
              'intercroppingOption',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as {
        bestCropVerdict?: string;
        plantingCalendarNote?: string;
        soilRemediationSteps?: string[];
        intercroppingOption?: string;
      };

      res.json({
        bestCropVerdict: parsed.bestCropVerdict || '',
        plantingCalendarNote: parsed.plantingCalendarNote || '',
        soilRemediationSteps: Array.isArray(parsed.soilRemediationSteps)
          ? parsed.soilRemediationSteps
          : [],
        intercroppingOption: parsed.intercroppingOption || '',
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message =
        errObj?.message || 'Unexpected error generating crop suitability analysis.';
      res.status(status).json({ error: message });
    }
  });

  app.post('/api/yield-forecast', async (req: Request, res: Response) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        res.status(500).json({
          error:
            'GEMINI_API_KEY is not configured. Add your API key in Settings > Secrets to run Gemini Harvest Forecast AI.',
        });
        return;
      }

      const {
        payload,
        language = 'id',
      }: {
        payload?: {
          estateName?: string;
          fieldName?: string;
          crop?: string;
          variety?: string;
          areaHa?: number;
          date?: string;
          growthStage?: string;
          meanNdvi?: number;
          biomassIndex?: number;
          moisturePct?: number;
          moistureStatus?: string;
          forecastYieldTHa?: number;
          forecastTotalTons?: number;
          forecastLowTons?: number;
          forecastHighTons?: number;
          histAvgTHa?: number;
          deltaVsHistoryPct?: number;
          confidencePct?: number;
          daysToHarvest?: number;
        };
        language?: 'en' | 'id';
      } = req.body ?? {};

      if (!payload || !payload.fieldName) {
        res.status(400).json({ error: 'Field vegetation index and historical yield payload is required.' });
        return;
      }

      const langPrompt =
        language === 'id'
          ? 'Respond strictly in clear, professional Bahasa Indonesia tailored for Indonesian farmers, Gapoktan, and plantation managers.'
          : 'Respond strictly in clear, concise English tailored for agronomists and farm estate managers.';

      const prompt = [
        'Produce a data-backed predictive harvest volume analysis based on current satellite vegetation telemetry (NDVI & biomass) and multi-year historical crop performance.',
        langPrompt,
        'Cite exact numbers from the field telemetry below.',
        '',
        `Estate: ${payload.estateName ?? 'Indonesia'} | Parcel: ${payload.fieldName} (${payload.areaHa ?? 0} ha)`,
        `Crop & Variety: ${payload.crop ?? 'Crop'} (${payload.variety ?? 'N/A'})`,
        `Current Satellite Pass: ${payload.date ?? 'N/A'} | Stage: ${payload.growthStage ?? 'N/A'}`,
        `Vegetation Telemetry: Mean NDVI ${payload.meanNdvi ?? 0}, Biomass Index ${payload.biomassIndex ?? 0} t/ha`,
        `Soil Moisture: ${payload.moisturePct ?? 0}% (${payload.moistureStatus ?? 'Optimal'})`,
        `Historical 4-Year Mean Yield: ${payload.histAvgTHa ?? 0} t/ha`,
        `2026 Forecast Output: ${payload.forecastYieldTHa ?? 0} t/ha (${payload.forecastTotalTons ?? 0} tons total, confidence band ${payload.forecastLowTons ?? 0}–${payload.forecastHighTons ?? 0} tons)`,
        `Delta vs 4-Yr Avg: ${(payload.deltaVsHistoryPct ?? 0) >= 0 ? '+' : ''}${payload.deltaVsHistoryPct ?? 0}% | Model Confidence: ${payload.confidencePct ?? 0}% | Est. Days to Harvest: ${payload.daysToHarvest ?? 0} days`,
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'You are the AgriOS Senior Harvest Forecasting & Yield Modeling Specialist. Synthesize NDVI canopy vigor, soil moisture balance, and historical crop trends into an actionable harvest forecast and post-harvest logistics plan.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              executiveForecast: {
                type: Type.STRING,
                description:
                  '2-sentence clear executive summary explaining the projected total harvest tonnage and yield variance versus historical seasons.',
              },
              yieldRiskDrivers: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exactly 3 concise bullets citing NDVI, biomass, or moisture metrics that drive yield upside or downside risk.',
              },
              preHarvestActions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description:
                  'Exactly 2 concrete agronomic steps before harvest to maximize grain/cane/tuber weight and quality.',
              },
              harvestLogisticsNote: {
                type: Type.STRING,
                description:
                  '1 practical harvesting and transport readiness note (e.g., truck/combine scheduling or drying capacity for projected tonnage).',
              },
            },
            required: [
              'executiveForecast',
              'yieldRiskDrivers',
              'preHarvestActions',
              'harvestLogisticsNote',
            ],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText) as {
        executiveForecast?: string;
        yieldRiskDrivers?: string[];
        preHarvestActions?: string[];
        harvestLogisticsNote?: string;
      };

      res.json({
        executiveForecast: parsed.executiveForecast || '',
        yieldRiskDrivers: Array.isArray(parsed.yieldRiskDrivers) ? parsed.yieldRiskDrivers : [],
        preHarvestActions: Array.isArray(parsed.preHarvestActions) ? parsed.preHarvestActions : [],
        harvestLogisticsNote: parsed.harvestLogisticsNote || '',
      });
    } catch (error: unknown) {
      const errObj = error as { status?: number; message?: string };
      const status = typeof errObj?.status === 'number' ? errObj.status : 500;
      const message =
        errObj?.message || 'Unexpected error generating Gemini harvest forecast.';
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AgriOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start AgriOS server:', err);
  process.exit(1);
});
