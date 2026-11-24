import React, { useEffect, useRef, useState } from 'react';
import {
  ExternalLink,
  Globe,
  MessageSquare,
  RotateCcw,
  Send,
  X,
  Zap,
} from 'lucide-react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

export interface ActiveFieldContext {
  fieldName: string;
  crop: string;
  variety: string;
  areaHa: number;
  soilType: string;
  date: string;
  meanNdvi: number;
  minNdvi: number;
  maxNdvi: number;
  growthStage: string;
  sprayWindow: string;
  windKmh: number;
  tempC: number;
  rainMm: number;
  fertilizerProduct: string;
  vraSavingsPct: number;
}

interface SourceLink {
  uri: string;
  title: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  modelUsed?: string;
  sources?: SourceLink[];
}

interface AgronomistChatProps {
  lang: Lang;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  fieldContext: ActiveFieldContext;
}

export function AgronomistChat({
  lang,
  isOpen,
  onOpen,
  onClose,
  fieldContext,
}: AgronomistChatProps) {
  const t = TRANSLATIONS[lang].chat;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState<'search' | 'fast'>('search');
  const [isLoading, setIsLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInputValue('');
    setErrorBanner(null);
    setIsLoading(true);

    try {
      const apiMessages = nextHistory.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/agronomist-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          fieldContext,
          mode,
          language: lang,
        }),
      });

      const data = (await res.json()) as {
        reply?: string;
        modelUsed?: string;
        sources?: SourceLink[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error || `Request failed with status ${res.status}`);
      }

      const modelMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply || 'No response returned.',
        modelUsed: data.modelUsed,
        sources: data.sources || [],
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to reach the AgriOS Agronomist service.';
      setErrorBanner(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(inputValue);
  };

  const handleReset = () => {
    setMessages([]);
    setErrorBanner(null);
  };

  const suggestedPrompts =
    lang === 'id'
      ? [
          `Evaluasi skor NDVI ${fieldContext.fieldName} (${fieldContext.meanNdvi.toFixed(2)}) & dosis pupuk`,
          `Apakah angin ${fieldContext.windKmh} km/jam aman untuk penyemprotan ${fieldContext.crop}?`,
          `Info hama OPT & cuaca terbaru untuk ${fieldContext.crop} di Jawa Barat`,
        ]
      : [
          `Assess ${fieldContext.fieldName} NDVI (${fieldContext.meanNdvi.toFixed(2)}) & fertilizer rate`,
          `Is ${fieldContext.windKmh} km/h wind safe for ${fieldContext.crop} spraying?`,
          `Latest pest alerts & weather outlook for ${fieldContext.crop} in West Java`,
        ];

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        aria-label={t.buttonLabel}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 text-sm font-semibold text-white bg-[#0B1F17] hover:bg-[#0D9F58] border border-[#1E3F31] rounded-xl shadow-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <MessageSquare className="w-4 h-4 text-[#86EFAC]" />
        <span>{t.buttonLabel}</span>
      </button>
    );
  }

  return (
    <aside
      aria-label={t.title}
      className="fixed bottom-4 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[430px] h-[600px] max-h-[82vh] bg-[#0B1F17] text-[#F1F5F2] border border-[#244A3A] rounded-xl shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3.5 bg-[#10271E] border-b border-[#1E3F31] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-display text-sm font-bold text-white truncate">
            {t.title}
          </div>
          <div className="text-[11px] font-mono text-[#86EFAC] truncate tabular-nums">
            {fieldContext.fieldName} · {fieldContext.crop} · NDVI{' '}
            {fieldContext.meanNdvi.toFixed(2)}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            aria-label={t.resetTitle}
            title={t.resetTitle}
            className="p-1.5 rounded-lg text-[#94B0A3] hover:text-white hover:bg-[#17382B] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close agronomist chat"
            className="p-1.5 rounded-lg text-[#94B0A3] hover:text-white hover:bg-[#17382B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="px-4 py-2 bg-[#0D2119] border-b border-[#1E3F31] flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#94B0A3]">{t.engineLabel}</span>
        <div
          role="group"
          aria-label="Agronomist response mode"
          className="inline-flex items-center gap-1 p-0.5 bg-[#081711] border border-[#1B382B] rounded-lg"
        >
          <button
            type="button"
            onClick={() => setMode('search')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'search'
                ? 'bg-[#0D9F58] text-white'
                : 'text-[#94B0A3] hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>{t.searchMode}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('fast')}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              mode === 'fast'
                ? 'bg-[#0D9F58] text-white'
                : 'text-[#94B0A3] hover:text-white'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>{t.fastMode}</span>
          </button>
        </div>
      </div>

      {/* Scrollable Multi-Turn Thread */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5">
        <div className="flex flex-col items-start">
          <div className="max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed bg-[#132E23] text-[#E6F2EC] border border-[#224637]">
            {t.welcome}
          </div>
        </div>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#0D9F58] text-white'
                    : 'bg-[#132E23] text-[#E6F2EC] border border-[#224637]'
                }`}
              >
                {msg.text}
              </div>

              {!isUser && msg.sources && msg.sources.length > 0 && (
                <div className="mt-2 max-w-[88%] flex flex-col gap-1">
                  <div className="text-[10px] font-mono text-[#83A193]">
                    {t.sourcesHeader}
                  </div>
                  <div className="flex flex-col gap-1">
                    {msg.sources.map((src) => (
                      <a
                        key={src.uri}
                        href={src.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] text-[#86EFAC] hover:text-white underline underline-offset-2 truncate"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">{src.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-[#132E23] border border-[#224637] rounded-xl px-3.5 py-2.5 text-xs text-[#94B0A3]">
              {mode === 'search' ? t.loadingSearch : t.loadingFast}
            </div>
          </div>
        )}

        {messages.length === 0 && !isLoading && (
          <div className="pt-2 flex flex-col gap-2">
            <div className="text-[11px] text-[#83A193]">{t.suggestedLabel}</div>
            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
                className="text-left px-3 py-2 text-xs text-[#D1E3DA] bg-[#10271E] hover:bg-[#17382B] border border-[#1E3F31] rounded-lg transition-colors cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {errorBanner && (
          <div
            role="alert"
            className="px-3 py-2.5 rounded-lg bg-[#451A1A] border border-[#991B1B] text-xs text-[#FECACA]"
          >
            {errorBanner}
          </div>
        )}

        <div ref={scrollEndRef} />
      </div>

      {/* Input Composer */}
      <form
        onSubmit={handleFormSubmit}
        className="p-3 bg-[#10271E] border-t border-[#1E3F31] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={t.inputPlaceholder}
          aria-label={t.title}
          className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm bg-[#081711] border border-[#244A3A] rounded-lg text-white placeholder:text-[#6E8B7D] focus:outline-none focus:border-[#10B981]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          aria-label="Send message"
          className="inline-flex items-center justify-center p-2.5 bg-[#0D9F58] hover:bg-[#10B981] disabled:opacity-45 disabled:hover:bg-[#0D9F58] text-white rounded-lg transition-colors shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </aside>
  );
}
