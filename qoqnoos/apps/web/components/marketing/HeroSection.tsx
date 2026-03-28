'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-phoenix-deep overflow-hidden flex items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-phoenix-deep/50 to-phoenix-deep" />
      <div className="relative z-10 container mx-auto px-6 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mb-6">
          <p className="font-nastaliq text-5xl md:text-7xl text-phoenix-gold mb-2" dir="rtl" lang="fa">\u0642\u0642\u0646\u0648\u0633</p>
          <p className="text-phoenix-gold/70 text-sm tracking-widest uppercase">Qoqnoos — The Persian Phoenix</p>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} className="text-4xl md:text-6xl font-bold text-white mb-6">Heal. Rise. Become.</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-xl text-white/70 max-w-2xl mx-auto mb-8">An AI companion that understands your culture, speaks your language, and walks with you through the fire.</motion.p>
        <motion.blockquote initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="border-l-4 border-phoenix-gold pl-4 text-left max-w-lg mx-auto mb-12 italic text-white/60">
          <p dir="rtl" lang="fa" className="font-nastaliq text-xl text-phoenix-gold/80 mb-1">\u0632\u062e\u0645 \u062c\u0627\u06cc\u06cc \u0627\u0633\u062a \u06a9\u0647 \u0646\u0648\u0631 \u0627\u0632 \u0622\u0646 \u0648\u0627\u0631\u062f \u0645\u06cc\u200c\u0634\u0648\u062f</p>
          <p className="text-sm">&quot;The wound is where the light enters.&quot; — Rumi</p>
        </motion.blockquote>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-phoenix">Begin Your Journey</Link>
          <Link href="/companion" className="btn-ghost">Meet Simorgh (AI)</Link>
        </motion.div>
      </div>
    </section>
  );
}
