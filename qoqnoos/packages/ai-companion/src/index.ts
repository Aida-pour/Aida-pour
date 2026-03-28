export const FRAMEWORKS = {
  GABOR_MATE: 'gabor_mate',
  ESTHER_PEREL: 'esther_perel',
  BYRON_KATIE: 'byron_katie',
  RUMI_SUFI: 'rumi_sufi',
  PERSIAN_CULTURAL: 'persian_cultural',
  CBT_MINDFULNESS: 'cbt_mindfulness',
} as const;

export const CRISIS_RESOURCES = {
  us: { name: '988 Suicide & Crisis Lifeline', phone: '988' },
  iran: { name: 'Behzisti Organization', phone: '1480' },
  global: { name: 'Crisis Text Line', phone: 'Text HOME to 741741' },
} as const;

export function detectCrisisSignals(message: string): boolean {
  const signals = ['suicide', 'kill myself', 'end my life', 'self-harm', 'want to die'];
  const lower = message.toLowerCase();
  return signals.some((s) => lower.includes(s));
}

export function detectLanguage(text: string): 'en' | 'fa' {
  const persianChars = (text.match(/[\u0600-\u06FF]/g) || []).length;
  return persianChars > text.length * 0.3 ? 'fa' : 'en';
}
