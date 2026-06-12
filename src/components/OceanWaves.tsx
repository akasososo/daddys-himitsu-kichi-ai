import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Flame } from 'lucide-react';

export default function OceanWaves() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);

  const initAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      // 1. Create a 4-second White Noise Buffer
      const bufferSize = audioCtx.sampleRate * 4;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Generate Pinkish/White noise values
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Simple Pink noise approximation filter
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        data[i] *= 0.11; // normalise volume
        b6 = white * 0.115926;
      }

      // 2. Buffer source
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      sourceNodeRef.current = source;

      // 3. Low Pass Filter (makes the noise sound underwater/beachy)
      const lpFilter = audioCtx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.value = 250; // Deep beachy rumble
      lpFilter.Q.value = 1.0;

      // 4. Main Volume Gain Node
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = volume;
      gainNodeRef.current = gainNode;

      // 5. Wave swell modulator (create a 0.125 Hz LFO - 8-second cycle)
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.125; // 8 seconds per wave cycle (swell & ebb)
      
      // We connect LFO to modulate filter frequency and gain slightly
      const waveModulator = audioCtx.createGain();
      waveModulator.gain.value = 0.15; // depth of volume fluctuation

      // Connect LFO -> Modulator -> Gain Node gain param
      lfo.connect(waveModulator);
      waveModulator.connect(gainNode.gain);
      lfoRef.current = lfo;

      // 6. Connect Nodes: Source -> Filter -> Gain -> Destination
      source.connect(lpFilter);
      lpFilter.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      // Start everything
      source.start(0);
      lfo.start(0);
    } catch (e) {
      console.error('Failed to initialize Web Audio wave synthesizer:', e);
    }
  };

  const handleToggle = async () => {
    if (!audioCtxRef.current) {
      initAudio();
      setIsPlaying(true);
      return;
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      await ctx.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      await ctx.suspend();
      setIsPlaying(false);
    } else {
      await ctx.resume();
      setIsPlaying(true);
    }
  };

  // Adjust volume dynamically
  useEffect(() => {
    if (gainNodeRef.current) {
      // Direct assignment of static base volume
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current?.currentTime || 0);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (sourceNodeRef.current) sourceNodeRef.current.stop();
        if (lfoRef.current) lfoRef.current.stop();
        if (audioCtxRef.current) audioCtxRef.current.close();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return (
    <div id="ocean-waves-container" className="flex items-center gap-3 bg-slate-900/40 backdrop-blur-md border border-amber-500/10 rounded-full px-4 py-2 text-xs text-slate-300">
      <button
        id="toggle-waves-btn"
        onClick={handleToggle}
        className={`flex items-center gap-2 font-display uppercase tracking-wider text-[11px] font-semibold transition-all duration-300 ${
          isPlaying ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
        title={isPlaying ? '波音を止める' : '宮古島の波音を流す（リラックス）'}
      >
        {isPlaying ? (
          <>
            <Volume2 className="h-4 w-4 animate-pulse text-amber-400" />
            <span className="hidden sm:inline">宮古島の波音: ON</span>
          </>
        ) : (
          <>
            <VolumeX className="h-4 w-4" />
            <span className="hidden sm:inline">宮古島の波音: OFF</span>
          </>
        )}
      </button>

      {isPlaying && (
        <div id="waves-volume-slider-container" className="flex items-center gap-2 animate-fade-in w-16 sm:w-24">
          <input
            id="waves-volume-range"
            type="range"
            min="0.05"
            max="0.8"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            title="音量調整"
          />
        </div>
      )}

      {/* Cozy ambient candlelight flame simulation */}
      <div id="candlelight-container" className="flex items-center gap-1.5 border-l border-slate-800 pl-3">
        <Flame className="h-3.5 w-3.5 text-amber-500 candle-flicker" />
        <span className="text-[10px] text-slate-500 select-none hidden md:inline">秘密基地の灯り</span>
      </div>
    </div>
  );
}
