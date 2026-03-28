'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
export function CTASection() {
  return (<section className="py-24 bg-phoenix-deep relative"><div className="absolute inset-0 bg-gradient-to-t from-phoenix-gold/10 to-transparent" /><div className="relative z-10 container mx-auto px-6 text-center"><motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}><p className="font-nastaliq text-3xl text-phoenix-gold mb-6" dir="rtl">\u0627\u0632 \u062e\u0627\u06a9\u0633\u062a\u0631 \u0628\u0631\u0645\u06cc\u200c\u062e\u06cc\u0632\u06cc\u0645</p><h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Rise from the Ashes</h2><p className="text-white/60 max-w-xl mx-auto mb-10">Your healing journey starts with a single step.</p><Link href="/signup" className="btn-phoenix inline-block">Begin Your Journey — Free</Link></motion.div></div></section>);
}
