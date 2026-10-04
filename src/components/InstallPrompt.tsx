'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') dismiss();
  };

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('pwa-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 lg:bottom-6 lg:left-auto lg:right-6 lg:w-80">
      <div className="rounded-2xl p-4 flex items-center gap-3 shadow-2xl"
        style={{ background: 'var(--surface-2)', border: '1px solid rgba(221,118,52,0.4)' }}>
        <Image src="/logo.webp" alt="TOPmusic" width={40} height={40} className="h-10 w-10 object-contain flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-display font-bold" style={{ color: 'var(--ivory)' }}>Install TOPmusic</p>
          <p className="text-xs font-ui mt-0.5" style={{ color: 'var(--mist)' }}>Add to your home screen for the full app experience</p>
        </div>
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button onClick={install}
            className="px-3 py-1.5 rounded-lg font-ui text-xs font-bold"
            style={{ background: 'var(--gold)', color: 'var(--ink)' }}>
            Install
          </button>
          <button onClick={dismiss} className="flex items-center justify-center" style={{ color: 'var(--mist)' }}>
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
