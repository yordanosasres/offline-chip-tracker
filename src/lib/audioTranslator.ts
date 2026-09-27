import { LanguageCode } from '../constants';

const TRANSLATION_MAP: Record<string, Partial<Record<LanguageCode, string>>> = {
  'hello': { es: 'hola', fr: 'bonjour', ar: 'مرحبا', zh: '你好', ja: 'こんにちは', de: 'hallo', pt: 'ola', hi: 'नमस्ते', sw: 'habari', ko: '안녕하세요', ru: 'привет' },
  'thank you': { es: 'gracias', fr: 'merci', ar: 'شكرا', zh: '谢谢', ja: 'ありがとう', de: 'danke', pt: 'obrigado', hi: 'धन्यवाद', sw: 'asante', ko: '감사합니다', ru: 'спасибо' },
  'welcome': { es: 'bienvenido', fr: 'bienvenue', ar: 'اهلا', zh: '欢迎', ja: 'ようこそ', de: 'willkommen', pt: 'bem-vindo', hi: 'स्वागत', sw: 'karibu', ko: '환영', ru: 'добро пожаловать' },
  'lets collaborate': { es: 'colaboremos', fr: 'collaborons', ar: 'لنتعاون', zh: '让我们合作', ja: 'コラボしよう', de: 'lass uns zusammenarbeiten', pt: 'vamos colaborar', hi: 'सहयोग करें', sw: 'tushirikiane', ko: '함께 협력하자', ru: 'давайте сотрудничать' },
  'great idea': { es: 'gran idea', fr: 'super idee', ar: 'فكرة رائعة', zh: '好主意', ja: 'いいアイデア', de: 'groartige Idee', pt: 'otima ideia', hi: 'बहुत अच्छा', sw: 'wazo zuri', ko: '좋은 아이디어', ru: 'отличная идея' },
  'interested': { es: 'interesado', fr: 'interesse', ar: 'مهتم', zh: '感兴趣', ja: '興味がある', de: 'interessiert', pt: 'interessado', hi: 'रुचि', sw: 'nimevutiwa', ko: '흥미 있어', ru: 'заинтересован' },
  'investment': { es: 'inversion', fr: 'investissement', ar: 'استثمار', zh: '投资', ja: '投資', de: 'Investition', pt: 'investimento', hi: 'निवेश', sw: 'uwekezaji', ko: '투자', ru: 'инвестиция' },
  'partnership': { es: 'asociacion', fr: 'partenariat', ar: 'شراكة', zh: '合作伙伴关系', ja: 'パートナーシップ', de: 'Partnerschaft', pt: 'parceria', hi: 'साझेदारी', sw: 'ushirikiano', ko: '파트너십', ru: 'партнерство' },
};

export function translateText(text: string, targetLang: LanguageCode): string {
  if (targetLang === 'en') return text;
  const lower = text.toLowerCase().trim();
  const entry = TRANSLATION_MAP[lower];
  if (entry && entry[targetLang]) return entry[targetLang]!;
  return `[${targetLang.toUpperCase()}] ${text}`;
}

export function speakText(text: string, lang: LanguageCode): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  const langMap: Partial<Record<LanguageCode, string>> = {
    en: 'en-US', es: 'es-ES', fr: 'fr-FR', ar: 'ar-SA', zh: 'zh-CN',
    ja: 'ja-JP', de: 'de-DE', pt: 'pt-BR', hi: 'hi-IN', sw: 'sw-KE',
    ko: 'ko-KR', ru: 'ru-RU', tr: 'tr-TR', it: 'it-IT', nl: 'nl-NL',
  };
  utterance.lang = langMap[lang] || 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeechRecognitionResult {
  transcript: string;
  lang: LanguageCode;
}

type RecognitionCallback = (result: SpeechRecognitionResult) => void;
type ErrorCallback = (error: string) => void;

export function startListening(lang: LanguageCode, onResult: RecognitionCallback, onError?: ErrorCallback) {
  const w = window as any;
  const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!SR) {
    onError?.('Speech recognition not supported in this browser');
    return null;
  }
  const recognition = new SR();
  const langMap: Partial<Record<LanguageCode, string>> = {
    en: 'en-US', es: 'es-ES', fr: 'fr-FR', ar: 'ar-SA', zh: 'zh-CN',
    ja: 'ja-JP', de: 'de-DE', pt: 'pt-BR', hi: 'hi-IN', sw: 'sw-KE',
    ko: 'ko-KR', ru: 'ru-RU', tr: 'tr-TR', it: 'it-IT', nl: 'nl-NL',
  };
  recognition.lang = langMap[lang] || 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult({ transcript, lang });
  };
  recognition.onerror = (event: any) => {
    onError?.(event.error || 'Recognition failed');
  };
  recognition.start();
  return recognition;
}

export function playChime(type: 'success' | 'notification' | 'tip'): void {
  if (typeof window === 'undefined') return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  const freqs = { success: [523, 659, 784], notification: [440, 554], tip: [660, 880, 1100] };
  const selected = freqs[type];
  osc.frequency.value = selected[0];
  gain.gain.value = 0.1;
  osc.start();
  selected.forEach((f, i) => {
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.12);
  });
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.stop(ctx.currentTime + 0.5);
}
