'use client';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, BookOpen, Music, ShoppingBag } from 'lucide-react';
import { useLang } from '@/context/LanguageContext';
import { shopPageT } from '@/translations';

export default function ShopPage() {
  const { lang } = useLang();
  const tr = shopPageT[lang];

  return (
    <>
      <Navbar />
      <main style={{ background: 'var(--ink)', paddingTop: '80px' }}>

        {/* Hero */}
        <div
          className="relative py-24 px-6 text-center overflow-hidden"
          style={{ background: 'var(--surface)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 70%)',
          }} />
          <div className="relative max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-5 px-4 py-2 rounded-full" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <ShoppingBag size={14} style={{ color: 'var(--gold)' }} />
              <span className="text-xs font-ui tracking-[0.3em] uppercase" style={{ color: 'var(--gold)' }}>{tr.eyebrow}</span>
            </div>
            <h1 className="text-5xl font-display mb-4" style={{ color: 'var(--ivory)' }}>{tr.title}</h1>
            <div className="gold-line w-24 mx-auto mb-5" />
            <p className="font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
            <Link
              href="#categories"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
            >
              {tr.heroCta} <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Categories */}
        <div id="categories" className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-display mb-10 text-center" style={{ color: 'var(--ivory)' }}>{tr.categoriesTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tr.categories.map(cat => (
              <div
                key={cat.id}
                className="p-6 rounded-2xl group cursor-pointer transition-all duration-200"
                style={{ background: 'var(--surface-2)', border: `1px solid ${cat.color}25` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}60`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${cat.color}25`; }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}20` }}>
                    <Music size={18} style={{ color: cat.color }} />
                  </div>
                  <div>
                    <h3 className="font-display text-lg mb-1" style={{ color: 'var(--ivory)' }}>{cat.label}</h3>
                    <p className="text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{cat.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Picks */}
        <div style={{ background: 'var(--surface)' }}>
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <p className="text-xs font-ui tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--gold)' }}>{tr.featuredTitle}</p>
              <h2 className="text-3xl font-display mb-3" style={{ color: 'var(--ivory)' }}>{tr.featuredTitle}</h2>
              <p className="font-ui max-w-xl mx-auto" style={{ color: 'var(--mist)' }}>{tr.featuredSub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tr.products.map(product => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="p-6 rounded-2xl flex flex-col transition-all duration-200 group"
                  style={{ background: 'var(--surface-2)', border: `1px solid rgba(201,168,76,0.1)` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${product.color}50`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                  {/* Book cover */}
                  <div className="w-full h-48 rounded-xl mb-5 overflow-hidden flex items-center justify-center" style={{ background: '#ffffff', border: `1px solid ${product.color}30` }}>
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <BookOpen size={40} style={{ color: product.color, opacity: 0.7 }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-ui px-2 py-0.5 rounded-full" style={{ background: `${product.color}20`, color: product.color }}>{product.category}</span>
                    <span className="text-xs font-ui" style={{ color: 'var(--mist)' }}>{product.level}</span>
                  </div>
                  <h3 className="font-ui font-semibold leading-snug flex-1" style={{ color: 'var(--ivory)' }}>{product.title}</h3>
                  <div className="flex items-center justify-end mt-4 pt-4" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
                    <span className="text-xs font-ui tracking-widest uppercase flex items-center gap-1 transition-all duration-200" style={{ color: product.color }}>
                      {lang === 'fr' ? 'Voir' : 'View'} <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Shop note banner */}
        <div className="px-6 py-8" style={{ background: 'rgba(201,168,76,0.04)', borderTop: '1px solid rgba(201,168,76,0.1)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <p className="max-w-3xl mx-auto text-center text-sm font-ui leading-relaxed" style={{ color: 'var(--mist)' }}>{tr.shopNote}</p>
        </div>

        {/* Callouts */}
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {tr.callouts.map(c => (
            <div
              key={c.title}
              className="p-8 rounded-2xl flex flex-col justify-between"
              style={{ background: 'var(--surface-2)', border: `1px solid ${c.color}25` }}
            >
              <div>
                <div className="w-2 h-8 rounded-full mb-5" style={{ background: c.color }} />
                <h3 className="text-2xl font-display mb-3" style={{ color: 'var(--ivory)' }}>{c.title}</h3>
                <p className="font-ui leading-relaxed mb-6" style={{ color: 'var(--mist)' }}>{c.desc}</p>
              </div>
              <Link
                href={c.href}
                className="inline-flex items-center gap-2 font-ui text-sm tracking-widest uppercase transition-colors duration-200"
                style={{ color: c.color }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '0.75'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                {c.cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="px-6 py-16 text-center" style={{ background: 'var(--surface)' }}>
          <h2 className="text-3xl font-display mb-4" style={{ color: 'var(--ivory)' }}>{tr.requestBtn}</h2>
          <p className="font-ui mb-8 max-w-md mx-auto" style={{ color: 'var(--mist)' }}>{tr.sub}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded font-ui text-sm tracking-widest uppercase transition-all duration-200"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold-light)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--gold)'; }}
          >
            {tr.requestBtn} <ArrowRight size={14} />
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}
