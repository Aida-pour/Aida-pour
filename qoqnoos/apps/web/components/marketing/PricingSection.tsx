'use client';
import { motion } from 'framer-motion';
const tiers = [
  { name: 'Free', nameFa: '\u0631\u0627\u06cc\u06af\u0627\u0646', price: '$0', features: ['AI companion (3/week)', 'Basic content', 'Mood tracking'], cta: 'Start Free', hl: false },
  { name: 'Premium', nameFa: '\u0648\u06cc\u0698\u0647', price: '$19.99/mo', features: ['Unlimited AI', 'Full library', 'Journal + AI', 'Group circles'], cta: 'Start Trial', hl: true },
  { name: 'Clinical', nameFa: '\u0628\u0627\u0644\u06cc\u0646\u06cc', price: '$49.99/mo', features: ['Everything in Premium', '2 therapy sessions/mo', 'Video AI companion'], cta: 'Start Trial', hl: false },
  { name: 'Retreat', nameFa: '\u062e\u0644\u0648\u062a', price: '$199.99/mo', features: ['Everything in Clinical', 'Monthly 1:1', 'Retreat access'], cta: 'Contact Us', hl: false },
];
export function PricingSection() {
  return (<section className="py-24 bg-phoenix-purple"><div className="container mx-auto px-6"><h2 className="text-3xl font-bold text-white text-center mb-16">Choose Your Path</h2><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">{tiers.map((t, i) => (<motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className={`rounded-2xl p-6 ${t.hl ? 'bg-phoenix-gold text-phoenix-deep' : 'card-phoenix'}`}><h3 className={`text-xl font-bold ${t.hl ? '' : 'text-white'}`}>{t.name}</h3><p className="text-sm font-nastaliq mb-4" dir="rtl">{t.nameFa}</p><p className={`text-3xl font-bold mb-6 ${t.hl ? '' : 'text-white'}`}>{t.price}</p><ul className="space-y-2 mb-8">{t.features.map(f => <li key={f} className="text-sm">&#10003; {f}</li>)}</ul><button className={`w-full py-3 rounded-full font-bold ${t.hl ? 'bg-phoenix-deep text-white' : 'bg-phoenix-gold text-phoenix-deep'}`}>{t.cta}</button></motion.div>))}</div></div></section>);
}
