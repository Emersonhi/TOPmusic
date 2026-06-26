'use client';
import { useEffect, useRef, useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  src: string;   // URL to .xml / .mxl file
  color?: string;
}

export default function SheetMusicViewer({ src, color = '#8B6FD4' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1.0);

  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;

    async function init() {
      try {
        const { OpenSheetMusicDisplay } = await import('opensheetmusicdisplay');
        if (cancelled || !containerRef.current) return;

        const osmd = new OpenSheetMusicDisplay(containerRef.current, {
          autoResize: true,
          backend: 'svg',
          drawTitle: true,
          drawComposer: true,
        });
        osmdRef.current = osmd;
        await osmd.load(src);
        if (cancelled) return;
        osmd.zoom = zoom;
        osmd.render();
        setLoading(false);
      } catch {
        if (!cancelled) setError('Could not load score. Please ensure the file is in MusicXML format.');
        setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  useEffect(() => {
    if (!osmdRef.current || loading) return;
    osmdRef.current.zoom = zoom;
    osmdRef.current.render();
  }, [zoom, loading]);

  function handleReset() {
    setZoom(1.0);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${color}30` }}>
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3" style={{ background: `${color}15`, borderBottom: `1px solid ${color}20` }}>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ background: `${color}20`, color }}
            disabled={loading || !!error}
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-ui" style={{ color, minWidth: '36px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ background: `${color}20`, color }}
            disabled={loading || !!error}
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-lg transition-all duration-200"
            style={{ background: `${color}20`, color }}
            disabled={loading || !!error}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Score area */}
      <div className="relative" style={{ minHeight: '400px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#fff' }}>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: color, borderTopColor: 'transparent' }} />
              <p className="text-sm font-ui" style={{ color: '#888' }}>Loading score…</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-ui text-center px-8" style={{ color: '#888' }}>{error}</p>
          </div>
        )}
        <div ref={containerRef} className="w-full overflow-x-auto" style={{ padding: '16px' }} />
      </div>
    </div>
  );
}
