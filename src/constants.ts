// Yordnos: Types & Constants

export type ZodiacSign = 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';
export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type BusinessCategory = 'Tech' | 'Creative' | 'E-commerce' | 'Agriculture' | 'Real Estate' | 'Consulting' | 'Finance' | 'Health';
export type LanguageCode = 'en' | 'es' | 'fr' | 'ar' | 'zh' | 'ja' | 'de' | 'pt' | 'hi' | 'sw' | 'ko' | 'ru' | 'tr' | 'it' | 'nl' | 'pl' | 'sv' | 'no' | 'da' | 'fi';
export type TabId = 'radar' | 'live' | 'ideas' | 'wallet';

export interface UserProfile {
  id: string;
  name: string;
  zodiac: ZodiacSign;
  country: string;
  flag: string;
  category: BusinessCategory;
  bio: string;
  avatar: string;
  online: boolean;
}

export interface LiveStream {
  id: string;
  host: UserProfile;
  title: string;
  viewers: number;
  isLive: boolean;
  category: BusinessCategory;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
  translatedText?: string;
  lang?: LanguageCode;
}

export interface BusinessIdea {
  id: string;
  title: string;
  description: string;
  author: UserProfile;
  category: BusinessCategory;
  upvotes: number;
  funding: number;
  country: string;
  createdAt: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'transfer' | 'tip' | 'pledge';
  amount: number;
  currency: string;
  description: string;
  timestamp: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface BankAccount {
  id: string;
  label: string;
  iban: string;
  swift: string;
  country: string;
  currency: string;
}

export interface WalletState {
  balance: number;
  currency: string;
  transactions: Transaction[];
  bankAccounts: BankAccount[];
}

// Zodiac Data
export const ZODIAC_SIGNS: ZodiacSign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

export const ZODIAC_ELEMENTS: Record<ZodiacSign, Element> = {
  Aries: 'Fire', Taurus: 'Earth', Gemini: 'Air', Cancer: 'Water',
  Leo: 'Fire', Virgo: 'Earth', Libra: 'Air', Scorpio: 'Water',
  Sagittarius: 'Fire', Capricorn: 'Earth', Aquarius: 'Air', Pisces: 'Water',
};

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const ELEMENT_COLORS: Record<Element, string> = {
  Fire: 'text-orange-400', Earth: 'text-emerald-400', Air: 'text-sky-400', Water: 'text-violet-400',
};

export const COMPATIBILITY_MATRIX: Record<Element, Record<Element, number>> = {
  Fire: { Fire: 72, Earth: 45, Air: 88, Water: 40 },
  Earth: { Fire: 45, Earth: 78, Air: 50, Water: 72 },
  Air: { Fire: 88, Earth: 50, Air: 82, Water: 55 },
  Water: { Fire: 40, Earth: 72, Air: 55, Water: 80 },
};

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '' },
  { code: 'GB', name: 'United Kingdom', flag: '' },
  { code: 'FR', name: 'France', flag: '' },
  { code: 'DE', name: 'Germany', flag: '' },
  { code: 'JP', name: 'Japan', flag: '' },
  { code: 'BR', name: 'Brazil', flag: '' },
  { code: 'NG', name: 'Nigeria', flag: '' },
  { code: 'IN', name: 'India', flag: '' },
  { code: 'AU', name: 'Australia', flag: '' },
  { code: 'KE', name: 'Kenya', flag: '' },
  { code: 'MX', name: 'Mexico', flag: '' },
  { code: 'KR', name: 'South Korea', flag: '' },
  { code: 'SA', name: 'Saudi Arabia', flag: '' },
  { code: 'ZA', name: 'South Africa', flag: '' },
  { code: 'CA', name: 'Canada', flag: '' },
];

export const CATEGORIES: BusinessCategory[] = ['Tech', 'Creative', 'E-commerce', 'Agriculture', 'Real Estate', 'Consulting', 'Finance', 'Health'];

export const LANGUAGES: { code: LanguageCode; name: string; native: string }[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'es', name: 'Spanish', native: 'Espanol' },
  { code: 'fr', name: 'French', native: 'Francais' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'zh', name: 'Mandarin', native: '中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Portugues' },
  { code: 'hi', name: 'Hindi', native: 'Hindi' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'tr', name: 'Turkish', native: 'Turkce' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands' },
  { code: 'pl', name: 'Polish', native: 'Polski' },
  { code: 'sv', name: 'Swedish', native: 'Svenska' },
  { code: 'no', name: 'Norwegian', native: 'Norsk' },
  { code: 'da', name: 'Danish', native: 'Dansk' },
  { code: 'fi', name: 'Finnish', native: 'Suomi' },
];

// Seed Data
export const SEED_PROFILES: UserProfile[] = [
  { id: 'u1', name: 'Yuki Tanaka', zodiac: 'Leo', country: 'Japan', flag: '', category: 'Tech', bio: 'AI startup founder, Tokyo-based. Building the future of creative automation.', avatar: 'YT', online: true },
  { id: 'u2', name: 'Amara Okafor', zodiac: 'Scorpio', country: 'Nigeria', flag: '', category: 'Finance', bio: 'Fintech innovator connecting African markets to global capital.', avatar: 'AO', online: true },
  { id: 'u3', name: 'Lucas Rivera', zodiac: 'Gemini', country: 'Mexico', flag: '', category: 'Creative', bio: 'Digital artist and UX designer blending Mesoamerican art with modern interfaces.', avatar: 'LR', online: false },
  { id: 'u4', name: 'Priya Sharma', zodiac: 'Pisces', country: 'India', flag: '', category: 'Health', bio: 'Telemedicine pioneer bringing healthcare to rural communities.', avatar: 'PS', online: true },
  { id: 'u5', name: 'Erik Johansson', zodiac: 'Capricorn', country: 'Germany', flag: '', category: 'Real Estate', bio: 'Sustainable property developer focused on green urban architecture.', avatar: 'EJ', online: true },
  { id: 'u6', name: 'Fatima Al-Rashid', zodiac: 'Aries', country: 'Saudi Arabia', flag: '', category: 'E-commerce', bio: 'Leading cross-border luxury marketplace connecting Middle East to Asia.', avatar: 'FA', online: false },
  { id: 'u7', name: 'Kwame Mensah', zodiac: 'Sagittarius', country: 'Kenya', flag: '', category: 'Agriculture', bio: 'AgriTech entrepreneur using satellite data to empower small farmers.', avatar: 'KM', online: true },
  { id: 'u8', name: 'Sofia Chen', zodiac: 'Taurus', country: 'Australia', flag: '', category: 'Consulting', bio: 'Strategic advisor helping startups navigate Asia-Pacific expansion.', avatar: 'SC', online: true },
  { id: 'u9', name: 'Jean-Pierre Dubois', zodiac: 'Libra', country: 'France', flag: '', category: 'Creative', bio: 'Fashion-tech fusion designer, bridging haute couture and wearable tech.', avatar: 'JD', online: false },
  { id: 'u10', name: 'Min-Jun Park', zodiac: 'Aquarius', country: 'South Korea', flag: '', category: 'Tech', bio: 'Blockchain architect building decentralized social platforms.', avatar: 'MP', online: true },
];

export const SEED_STREAMS: LiveStream[] = [
  { id: 's1', host: SEED_PROFILES[0], title: 'AI-Powered Creative Tools: Live Demo & Q&A', viewers: 1247, isLive: true, category: 'Tech' },
  { id: 's2', host: SEED_PROFILES[1], title: 'Fintech in Africa: Opportunities & Risks', viewers: 892, isLive: true, category: 'Finance' },
  { id: 's3', host: SEED_PROFILES[6], title: 'Satellite Farming: Growing Food with Data', viewers: 634, isLive: true, category: 'Agriculture' },
  { id: 's4', host: SEED_PROFILES[7], title: 'APAC Market Entry Strategy Masterclass', viewers: 445, isLive: true, category: 'Consulting' },
  { id: 's5', host: SEED_PROFILES[9], title: 'Web3 Social: Building Decentralized Communities', viewers: 1102, isLive: true, category: 'Tech' },
];

export const SEED_IDEAS: BusinessIdea[] = [
  { id: 'i1', title: 'Cross-Border Crypto Payment Gateway for SMEs', description: 'A platform enabling small businesses in emerging markets to accept crypto payments and instantly convert to local currency with zero fees.', author: SEED_PROFILES[1], category: 'Finance', upvotes: 42, funding: 12500, country: 'Nigeria', createdAt: Date.now() - 86400000 * 3 },
  { id: 'i2', title: 'AI Crop Disease Detection via SMS', description: 'Farmers send photos of diseased crops via basic SMS. An AI model diagnoses and recommends treatment - no smartphone needed.', author: SEED_PROFILES[6], category: 'Agriculture', upvotes: 38, funding: 8200, country: 'Kenya', createdAt: Date.now() - 86400000 * 5 },
  { id: 'i3', title: 'Virtual Co-Working with Zodiac Icebreakers', description: 'A VR workspace that matches remote workers by complementary zodiac signs for natural team chemistry.', author: SEED_PROFILES[9], category: 'Tech', upvotes: 27, funding: 5600, country: 'South Korea', createdAt: Date.now() - 86400000 * 2 },
  { id: 'i4', title: 'Sustainable Fashion Marketplace', description: 'Peer-to-peer platform for upcycled and vintage fashion with carbon-neutral shipping across borders.', author: SEED_PROFILES[8], category: 'E-commerce', upvotes: 31, funding: 9800, country: 'France', createdAt: Date.now() - 86400000 * 7 },
  { id: 'i5', title: 'Telehealth for Rural Communities', description: 'Offline-first medical consultation app with AI triage, connecting village health workers to specialists via satellite.', author: SEED_PROFILES[3], category: 'Health', upvotes: 55, funding: 18400, country: 'India', createdAt: Date.now() - 86400000 * 1 },
  { id: 'i6', title: 'Green Building Certification Platform', description: 'SaaS tool that helps property developers in Southeast Asia achieve green certifications faster with AI-guided compliance.', author: SEED_PROFILES[4], category: 'Real Estate', upvotes: 19, funding: 4200, country: 'Germany', createdAt: Date.now() - 86400000 * 10 },
];

export const DEFAULT_WALLET: WalletState = {
  balance: 5000,
  currency: 'USD',
  transactions: [
    { id: 't1', type: 'deposit', amount: 2000, currency: 'USD', description: 'Initial deposit via card', timestamp: Date.now() - 86400000 * 14, status: 'completed' },
    { id: 't2', type: 'tip', amount: 50, currency: 'USD', description: 'Tipped Yuki Tanaka during live stream', timestamp: Date.now() - 86400000 * 7, status: 'completed' },
    { id: 't3', type: 'pledge', amount: 200, currency: 'USD', description: 'Pledged to AI Crop Disease Detection', timestamp: Date.now() - 86400000 * 5, status: 'completed' },
    { id: 't4', type: 'transfer', amount: 150, currency: 'USD', description: 'Sent to Amara Okafor', timestamp: Date.now() - 86400000 * 3, status: 'completed' },
    { id: 't5', type: 'withdraw', amount: 500, currency: 'EUR', description: 'Withdrawal to Deutsche Bank', timestamp: Date.now() - 86400000 * 2, status: 'completed' },
  ],
  bankAccounts: [
    { id: 'b1', label: 'Main Checking', iban: 'DE89 3704 0044 0532 0130 00', swift: 'DEUTDEFF', country: 'Germany', currency: 'EUR' },
    { id: 'b2', label: 'Business Account', iban: 'GB33 BUWB 1234 5678 9012 34', swift: 'BUWBGB2L', country: 'United Kingdom', currency: 'GBP' },
  ],
};

export const STORAGE_KEY = 'yordnos_state';

export function getCompatibilityScore(a: ZodiacSign, b: ZodiacSign): number {
  const elA = ZODIAC_ELEMENTS[a];
  const elB = ZODIAC_ELEMENTS[b];
  const base = COMPATIBILITY_MATRIX[elA][elB];
  const bonus = a === b ? 5 : 0;
  return Math.min(99, base + bonus);
}

export function getChemistryLabel(score: number): string {
  if (score >= 85) return 'Cosmic Union';
  if (score >= 70) return 'Strong Resonance';
  if (score >= 55) return 'Growing Potential';
  return 'Challenging Dynamics';
}