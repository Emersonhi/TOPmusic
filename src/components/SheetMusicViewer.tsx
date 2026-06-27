'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  src: string;
  midi?: string;
  color?: string;
}

export default function SheetMusicViewer({ src, midi, color = '#8B6FD4' }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const osmdRef       = useRef<any>(null);
  const playerRef     = useRef<any>(null);
  const instrumentRef = useRef<any>(null);
  const acRef         = useRef<AudioContext | null>(null);
  // cursor sync state
  const cursorPositionsRef = useRef<number[]>([]); // notes per cursor step
  const noteCountRef       = useRef(0);
  const cursorConsumedRef  = useRef(0);
  const cursorStepRef      = useRef(0);
  const highlightRectRef   = useRef<SVGRectElement | null>(null);
  const currentMeasureRef  = useRef(-1);

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [zoom,    setZoom]    = useState(1.0);
  const [playing, setPlaying] = useState(false);
  const [tempo,   setTempo]   = useState(100);

  // ── Build cursor position map ──────────────────────────────────────────────
  function buildCursorMap(osmd: any) {
    const positions: number[] = [];
    try {
      osmd.cursor.reset();
      osmd.cursor.show();
      while (!osmd.cursor.iterator.EndReached) {
        const notes = osmd.cursor.GNotesUnderCursor();
        positions.push(notes ? notes.length : 1);
        osmd.cursor.next();
      }
      osmd.cursor.reset();
    } catch {}
    return positions;
  }

  // ── Load OSMD ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    let cancelled = false;
    (async () => {
      try {
        const { OpenSheetMusicDisplay } = await import('opensheetmusicdisplay');
        if (cancelled || !containerRef.current) return;
        const osmd = new OpenSheetMusicDisplay(containerRef.current, {
          autoResize: true,
          backend: 'svg',
          drawTitle: true,
          drawComposer: true,
          followCursor: true,
        });
        osmdRef.current = osmd;
        await osmd.load(src);
        if (cancelled) return;
        osmd.zoom = zoom;
        osmd.render();
        cursorPositionsRef.current = buildCursorMap(osmd);
        setLoading(false);
      } catch {
        if (!cancelled) setError('Could not load score. Please check the file format.');
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // ── Zoom ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!osmdRef.current || loading) return;
    osmdRef.current.zoom = zoom;
    osmdRef.current.render();
    // Rebuild cursor map after re-render
    cursorPositionsRef.current = buildCursorMap(osmdRef.current);
  }, [zoom, loading]);

  // ── Highlight current measure ──────────────────────────────────────────────
  const highlightMeasure = useCallback((measureIndex: number, hlColor: string) => {
    highlightRectRef.current?.remove();
    highlightRectRef.current = null;
    if (measureIndex < 0 || !osmdRef.current || !containerRef.current) return;
    try {
      const measureList = osmdRef.current.graphic.measureList;
      const row = measureList[measureIndex];
      if (!row?.length) return;

      const unitInPx = osmdRef.current.zoom * 10;

      // Combine bounding boxes across all staves in this measure
      let x1 = Infinity, y1 = Infinity, x2 = -Infinity, y2 = -Infinity;
      row.forEach((gm: any) => {
        const ps = gm?.PositionAndShape ?? gm?.positionAndShape ?? gm?.boundingBox;
        if (!ps) return;
        const pos  = ps.AbsolutePosition ?? ps.absolutePosition ?? ps;
        const size = ps.Size ?? ps.size;
        if (!pos || !size) return;
        const mx = (pos.x ?? pos.X ?? 0) * unitInPx;
        const my = (pos.y ?? pos.Y ?? 0) * unitInPx;
        const mw = (size.width ?? size.Width ?? 0) * unitInPx;
        const mh = (size.height ?? size.Height ?? 0) * unitInPx;
        x1 = Math.min(x1, mx);
        y1 = Math.min(y1, my);
        x2 = Math.max(x2, mx + mw);
        y2 = Math.max(y2, my + mh);
      });
      if (!isFinite(x1)) return;

      const svg = containerRef.current.querySelector('svg');
      if (!svg) return;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x',      String(x1 - 4));
      rect.setAttribute('y',      String(y1 - 4));
      rect.setAttribute('width',  String(x2 - x1 + 8));
      rect.setAttribute('height', String(y2 - y1 + 8));
      rect.setAttribute('fill',   hlColor);
      rect.setAttribute('opacity', '0.18');
      rect.setAttribute('rx', '6');
      svg.insertBefore(rect, svg.firstChild);
      highlightRectRef.current = rect;
    } catch {}
  }, []);

  // ── Reset cursor ───────────────────────────────────────────────────────────
  const resetCursor = useCallback(() => {
    highlightRectRef.current?.remove();
    highlightRectRef.current = null;
    currentMeasureRef.current = -1;
    noteCountRef.current    = 0;
    cursorConsumedRef.current = 0;
    cursorStepRef.current   = 0;
    try {
      osmdRef.current?.cursor?.reset();
      osmdRef.current?.cursor?.show();
    } catch {}
  }, []);

  // ── Advance cursor on each Note On ─────────────────────────────────────────
  const advanceCursor = useCallback((hlColor: string) => {
    const positions = cursorPositionsRef.current;
    if (!positions.length || !osmdRef.current) return;

    noteCountRef.current += 1;

    while (
      cursorStepRef.current < positions.length &&
      cursorConsumedRef.current < noteCountRef.current
    ) {
      cursorConsumedRef.current += positions[cursorStepRef.current] || 1;
      cursorStepRef.current += 1;
      try { osmdRef.current.cursor.next(); } catch {}
    }

    // Highlight measure only when it changes
    try {
      const mi = osmdRef.current.cursor.iterator.CurrentMeasureIndex ?? -1;
      if (mi !== currentMeasureRef.current) {
        currentMeasureRef.current = mi;
        highlightMeasure(mi, hlColor);
      }
    } catch {}
  }, [highlightMeasure]);

  // ── Stop ───────────────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    try { playerRef.current?.stop(); } catch {}
    playerRef.current = null;
    resetCursor();
    setPlaying(false);
  }, [resetCursor]);

  // ── Play ───────────────────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (!midi) return;
    if (playing) { stopAll(); return; }

    if (!acRef.current) acRef.current = new AudioContext();
    const ac = acRef.current;
    if (ac.state === 'suspended') await ac.resume();

    if (!instrumentRef.current) {
      try {
        const Soundfont = (await import('soundfont-player')).default;
        instrumentRef.current = await Soundfont.instrument(ac, 'acoustic_grand_piano', {
          format: 'ogg',
          soundfont: 'MusyngKite',
        });
      } catch {
        setError('Could not load instrument sounds.');
        return;
      }
    }

    try {
      const MidiPlayer = (await import('midi-player-js')).default;
      const res = await fetch(midi);
      const buf = await res.arrayBuffer();

      resetCursor();

      const player = new MidiPlayer.Player((event: any) => {
        if (!instrumentRef.current) return;
        if (event.name === 'Note on' && event.velocity > 0) {
          const note = midiNoteToName(event.noteNumber);
          instrumentRef.current.play(note, ac.currentTime, { gain: event.velocity / 127 });
          advanceCursor(color);
        }
      });

      player.on('endOfFile', () => {
        resetCursor();
        setPlaying(false);
      });

      player.loadArrayBuffer(buf);
      player.tempo = tempo;
      player.play();
      playerRef.current = player;
      setPlaying(true);
    } catch {
      setError('Could not load MIDI file.');
    }
  }, [midi, playing, stopAll, resetCursor, advanceCursor, tempo, color]);

  useEffect(() => {
    if (playerRef.current && playing) playerRef.current.tempo = tempo;
  }, [tempo, playing]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${color}30` }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3" style={{ background: `${color}10`, borderBottom: `1px solid ${color}20` }}>
        {midi && (
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              disabled={loading || !!error}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-semibold transition-all duration-200"
              style={{ background: color, color: '#fff', opacity: (loading || !!error) ? 0.4 : 1 }}
            >
              {playing ? <Pause size={14} /> : <Play size={14} />}
              {playing ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={stopAll}
              disabled={!playing}
              className="p-2 rounded-lg transition-all"
              style={{ background: `${color}20`, color, opacity: playing ? 1 : 0.35 }}
            >
              <Square size={14} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-ui" style={{ color: '#888' }}>Speed</span>
              <input
                type="range" min={40} max={200} value={tempo}
                onChange={e => setTempo(Number(e.target.value))}
                style={{ width: '80px', accentColor: color }}
              />
              <span className="text-xs font-ui" style={{ color, minWidth: '32px' }}>{tempo}%</span>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))} disabled={loading || !!error}
            className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
            <ZoomOut size={14} />
          </button>
          <span className="text-xs font-ui" style={{ color, minWidth: '36px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))} disabled={loading || !!error}
            className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
            <ZoomIn size={14} />
          </button>
          <button onClick={() => { stopAll(); setZoom(1.0); }}
            className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Score */}
      <div className="relative" style={{ minHeight: '400px' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#fff' }}>
            <div className="text-center">
              <div className="w-8 h-8 rounded-full border-2 animate-spin mx-auto mb-3"
                style={{ borderColor: color, borderTopColor: 'transparent' }} />
              <p className="text-sm font-ui" style={{ color: '#888' }}>Loading score…</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-ui text-center px-8" style={{ color: '#c00' }}>{error}</p>
          </div>
        )}
        <div ref={containerRef} className="w-full overflow-x-auto" style={{ padding: '16px' }} />
      </div>
    </div>
  );
}

function midiNoteToName(n: number): string {
  const notes = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  return notes[n % 12] + Math.floor(n / 12 - 1);
}
