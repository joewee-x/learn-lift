import { useRef, useState } from 'react';
import Icon from './ui/Icon';
import './videoplayer.css';

export default function VideoPlayer({ videoUrl, poster, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [, setFullscreen] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play(); else v.pause();
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (v) setCurrentTime(v.currentTime);
  };

  const onLoaded = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
    setCurrentTime(pct * v.duration);
  };

  const setRate = (r) => {
    const v = videoRef.current;
    if (v) v.playbackRate = r;
    setSpeed(r);
    setShowSpeed(false);
  };

  const toggleFullscreen = () => {
    const el = videoRef.current?.parentElement;
    if (!el) return;
    if (!document.fullscreenElement) { el.requestFullscreen?.(); setFullscreen(true); }
    else { document.exitFullscreen?.(); setFullscreen(false); }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="vp">
      <div className="vp__stage">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          title={title}
          muted={muted}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoaded}
          onClick={togglePlay}
          playsInline
        />
        {!playing && (
          <button className="vp__bigplay" onClick={togglePlay} aria-label="Play">
            <Icon name="play" size={56} />
          </button>
        )}
      </div>
      <div className="vp__controls">
        <div className="vp__scrubber" onClick={seek}>
          <div className="vp__scrubber-track"><div className="vp__scrubber-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="vp__controls-row">
          <div className="vp__group">
            <button className="vp__btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
              <Icon name={playing ? 'x' : 'play'} size={18} />
            </button>
            <span className="vp__time">{fmt(currentTime)} / {fmt(duration)}</span>
          </div>
          <div className="vp__group">
            <div className="vp__speedwrap">
              <button className="vp__btn vp__btn--speed" onClick={() => setShowSpeed((s) => !s)} aria-label="Playback speed">
                {speed}x
              </button>
              {showSpeed && (
                <div className="vp__speedmenu">
                  {[2, 1.5, 1.25, 1, 0.75, 0.5].map((r) => (
                    <button key={r} className={r === speed ? 'vp__speedmenu-item--active' : ''} onClick={() => setRate(r)}>{r}x</button>
                  ))}
                </div>
              )}
            </div>
            <button className="vp__btn" onClick={() => setMuted((m) => !m)} aria-label={muted ? 'Unmute' : 'Mute'}>
              <Icon name={muted ? 'lock' : 'bellOn'} size={18} />
            </button>
            <button className="vp__btn" onClick={toggleFullscreen} aria-label="Fullscreen">
              <Icon name="search" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}