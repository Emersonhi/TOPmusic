'use client';
import { use } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, BookOpen, Check } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { shopPageT } from '@/translations';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { lang } = useLang();
  const tr = shopPageT[lang];

  const product = tr.products.find(p => String(p.id) === id);

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ background: 'var(--ink)', paddingTop: '80px', minHeight: '60vh' }} className="flex items-center justify-center">
          <div className="text-center">
            <p className="font-ui text-xl mb-6" style={{ color: 'var(--mist)' }}>Product not found.</p>
            <Link href="/shop" className="font-ui text-sm tracking-widest uppercase" style={{ color: 'var(--gold)' }}>← Back to Shop</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const highlights = {
    en: ['Recommended by our faculty', 'Available at major retailers', 'Suitable for private lessons', 'Ask your teacher for guidance'],
    fr: ['Recommandé par nos enseignants', 'Disponible chez les grands détaillants', 'Adapté aux cours particuliers', 'Demandez conseil à votre enseignant'],
  };

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>

        {/* Back link */}
        <div className="max-w-5xl mx-auto px-6 pt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-ui text-sm tracking-widest uppercase transition-colors duration-200"
            style={{ color: 'var(--mist)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--mist)'; }}
          >
            <ArrowLeft size={14} /> {lang === 'fr' ? 'Retour à la boutique' : 'Back to Shop'}
          </Link>
        </div>

        {/* Product detail */}
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Cover image */}
            <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: '#ffffff', border: `1px solid ${product.color}30`, minHeight: '380px' }}>
              {product.image ? (
                <img src={product.image} alt={product.title} className="w-full h-full object-cover" style={{ minHeight: '380px' }} />
              ) : (
                <BookOpen size={80} style={{ color: product.color, opacity: 0.5 }} />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-ui px-3 py-1 rounded-full" style={{ background: `${product.color}20`, color: product.color }}>{product.category}</span>
                <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{product.level}</span>
              </div>

              <h1 className="text-4xl font-display mb-4 leading-tight" style={{ color: 'var(--ivory)' }}>{product.title}</h1>
              <div className="gold-line w-16 mb-6" />

              <ul className="space-y-3 mb-8">
                {highlights[lang].map(h => (
                  <li key={h} className="flex items-center gap-3 font-ui text-sm" style={{ color: 'var(--mist)' }}>
                    <Check size={14} style={{ color: product.color, flexShrink: 0 }} /> {h}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-ui text-sm tracking-widest uppercase transition-all duration-200"
                style={{ background: product.color, color: '#fff' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {lang === 'fr' ? 'Demander à un enseignant' : 'Ask a Teacher'}
              </Link>

              <Link
                href="/enroll"
                className="mt-3 inline-flex items-center justify-center gap-2 py-4 px-8 rounded-xl font-ui text-sm tracking-widest uppercase transition-all duration-200"
                style={{ background: 'transparent', color: product.color, border: `1px solid ${product.color}40` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${product.color}15`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                {lang === 'fr' ? "S'inscrire au programme" : 'Enroll in a Program'}
              </Link>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
