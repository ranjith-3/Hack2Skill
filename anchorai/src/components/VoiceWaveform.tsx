// ============================================================
// AnchorAI — Voice Waveform Visualization Component
// Animated waveform displayed during AI speech playback
// ============================================================
'use client';

interface VoiceWaveformProps {
  isActive: boolean;
  barCount?: number;
  color?: string;
}

export default function VoiceWaveform({
  isActive,
  barCount = 24,
  color = '#22c55e',
}: VoiceWaveformProps) {
  return (
    <div className="flex items-center justify-center gap-[3px] h-16" aria-hidden="true">
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar"
          style={{
            height: '48px',
            background: `linear-gradient(to top, ${color}, ${color}88)`,
            animationDelay: `${i * 0.05}s`,
            animationPlayState: isActive ? 'running' : 'paused',
            opacity: isActive ? 1 : 0.3,
            transition: 'opacity 0.3s ease',
          }}
        />
      ))}
    </div>
  );
}
