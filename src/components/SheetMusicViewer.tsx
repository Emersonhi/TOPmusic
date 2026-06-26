'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Props {
  src: string;        // MusicXML / MXL URL
  midi?: string;      // MIDI URL for playback
  color?: string;
}

export default function SheetMusicViewer({ src, midi, color = '#8B6FD4' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const osmdRef      = useRef<any>(null);
  const playerRef    = useRef<any>(null);
  const instrumentRef = useRef<any>(null);
  const acRef        = useRef<AudioContext | null>(null);
  const scheduledRef = useRef<AudioBufferSourceNode[]>([]);

  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [zoom,     setZoom]     = useState(1.0);
  const [playing,  setPlaying]  = useState(false);
  const [tempo,    setTempo]    = useState(100); // playback speed %

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
  }, [zoom, loading]);

  // ── Stop all scheduled notes ───────────────────────────────────────────────
  const stopAll = useCallback(() => {
    scheduledRef.current.forEach(n => { try { n.stop(); } catch {} });
    scheduledRef.current = [];
    if (playerRef.current) {
      try { playerRef.current.stop(); } catch {}
      playerRef.current = null;
    }
    setPlaying(false);
  }, []);

  // ── Play ───────────────────────────────────────────────────────────────────
  const handlePlay = useCallback(async () => {
    if (!midi) return;

    if (playing) { stopAll(); return; }

    // Resume AudioContext on user gesture
    if (!acRef.current) acRef.current = new AudioContext();
    const ac = acRef.current;
    if (ac.state === 'suspended') await ac.resume();

    // Load soundfont once
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

    // Load & play MIDI
    try {
      const MidiPlayer = (await import('midi-player-js')).default;
      const res = await fetch(midi);
      const buf = await res.arrayBuffer();
      const data = Array.from(new Uint8Array(buf));

      const player = new MidiPlayer.Player((event: any) => {
        if (!instrumentRef.current) return;
        if (event.name === 'Note on' && event.velocity > 0) {
          const note = midiNoteToName(event.noteNumber);
          instrumentRef.current.play(note, ac.currentTime, { gain: event.velocity / 127 });
        }
      });

      player.on('endOfFile', () => setPlaying(false));
      player.loadArrayBuffer(buf);
      player.tempo = tempo;
      player.play();
      playerRef.current = player;
      setPlaying(true);
    } catch {
      setError('Could not load MIDI file.');
    }
  }, [midi, playing, stopAll, tempo]);

  // ── Handle tempo change while playing ─────────────────────────────────────
  useEffect(() => {
    if (playerRef.current && playing) playerRef.current.tempo = tempo;
  }, [tempo, playing]);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${color}30` }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-3" style={{ background: `${color}10`, borderBottom: `1px solid ${color}20` }}>
        {midi && (
          <div className="flex items-center gap-2">
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
              className="p-2 rounded-lg transition-all duration-200"
              style={{ background: `${color}20`, color, opacity: playing ? 1 : 0.3 }}
            >
              <Square size={14} />
            </button>
            {/* Tempo */}
            <div className="flex items-center gap-2 ml-2">
              <span className="text-xs font-ui" style={{ color: '#666' }}>Speed</span>
              <input
                type="range" min={40} max={200} value={tempo}
                onChange={e => setTempo(Number(e.target.value))}
                className="w-20 accent-purple-500"
                style={{ accentColor: color }}
              />
              <span className="text-xs font-ui w-8" style={{ color }}>{tempo}%</span>
            </div>
          </div>
        )}

        {/* Zoom controls */}
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
          <button onClick={() => { setZoom(1.0); stopAll(); }} className="p-2 rounded-lg" style={{ background: `${color}20`, color }}>
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Score */}
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
            <p className="text-sm font-ui text-center px-8" style={{ color: '#c00' }}>{error}</p>
          </div>
        )}
        <div ref={containerRef} className="w-full overflow-x-auto" style={{ padding: '16px' }} />
      </div>
    </div>
  );
}

// MIDI note number → note name (e.g. 60 → "C4")
function midiNoteToName(n: number): string {
  const notes = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  return notes[n % 12] + Math.floor(n / 12 - 1);
}
