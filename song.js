
(() => {
  const audio = document.getElementById('backgroundSong');
  const toggle = document.getElementById('songToggle');
  const volume = document.getElementById('songVolume');
  const value = document.getElementById('songVolumeValue');

  if (!audio || !toggle || !volume || !value) return;

  const clamp = n => Math.max(0, Math.min(100, Number(n) || 0));

  let saved = 35;

  try {
    const raw = localStorage.getItem('fexozone-song-volume');
    if (raw !== null) saved = clamp(raw);
  } catch {}

  volume.value = String(saved);
  audio.volume = saved / 100;
  value.textContent = saved + '%';

  toggle.disabled = false;
  toggle.textContent = '▶ Play Music';

  volume.addEventListener('input', () => {
    const v = clamp(volume.value);
    audio.volume = v / 100;
    value.textContent = v + '%';

    try {
      localStorage.setItem('fexozone-song-volume', String(v));
    } catch {}
  });

  audio.addEventListener('play', () => {
    toggle.textContent = 'Ⅱ Pause Music';
  });

  audio.addEventListener('pause', () => {
    toggle.textContent = '▶ Play Music';
  });

  audio.addEventListener('error', () => {
    toggle.textContent = '♪ Music Error';
  });

  toggle.addEventListener('click', async () => {
    try {
      if (audio.paused) {
        await audio.play();
      } else {
        audio.pause();
      }
    } catch (error) {
      toggle.textContent = '♪ Tap to Retry';
    }
  });

  audio.load();
  console.log('FEXOZONE audio:', audio.currentSrc);
console.log('Audio ready state:', audio.readyState);
console.log('Audio error:', audio.error);
})();
