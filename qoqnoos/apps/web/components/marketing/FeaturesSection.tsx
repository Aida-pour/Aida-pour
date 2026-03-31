'use client';
import { motion } from 'framer-motion';
const features = [
  { title: 'AI Companion', titleFa: '\u0633\u06cc\u0645\u0631\u063a', desc: 'Culturally-aware AI speaking Farsi & English', icon: '\ud83e\udd85' },
  { title: 'Live Therapy', titleFa: '\u0631\u0648\u0627\u0646\u200c\u062f\u0631\u0645\u0627\u0646\u06cc', desc: 'Video sessions with Persian-speaking therapists', icon: '\ud83c\udfa5' },
  { title: 'Meditations', titleFa: '\u0645\u062f\u06cc\u062a\u06cc\u0634\u0646', desc: 'Persian-themed breathwork and sound baths', icon: '\ud83e\uddd8' },
  { title: 'Journal', titleFa: '\u062f\u0641\u062a\u0631 \u062e\u0627\u0637\u0631\u0627\u062a', desc: 'AI-analyzed reflections', icon: '\ud83d\udcdd' },
  { title: 'Library', titleFa: '\u06a9\u062a\u0627\u0628\u062e\u0627\u0646\u0647', desc: 'Curated books, podcasts, exercises', icon: '\ud83d\udcda' },
  { title: 'Community', titleFa: '\u062d\u0644\u0642\u0647\u200c\u0647\u0627', desc: 'Group healing sessions', icon: '\ud83e\udd1d' },
];
export function FeaturesSection() {
  return (<section className="py-24 bg-phoenix-deep"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-white text-center mb-16">Your Healing Toolkit</h2><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">{features.map((f, i) => (<motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="card-phoenix"><div className="text-4xl mb-4">{f.icon}</div><h3 className="text-xl font-bold text-white mb-1">{f.title}</h3><p className="text-phoenix-gold/60 text-sm mb-3 font-nastaliq" dir="rtl">{f.titleFa}</p><p className="text-white/60">{f.desc}</p></motion.div>))}</div></div></section>);
}
