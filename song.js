(() => {
  const audio=document.getElementById('backgroundSong');
  const toggle=document.getElementById('songToggle');
  const volume=document.getElementById('songVolume');
  const value=document.getElementById('songVolumeValue');
  if(!audio||!toggle||!volume||!value) return;
  const clamp=n=>Math.max(0,Math.min(100,Number.isFinite(n)?n:35));
  let saved=35; try { const raw=localStorage.getItem('fexozone-song-volume'); if(raw!==null) saved=clamp(Number(raw)); } catch {}
  volume.value=String(saved); audio.volume=saved/100; value.textContent=saved+'%';
  volume.addEventListener('input',()=>{const v=clamp(Number(volume.value));audio.volume=v/100;value.textContent=v+'%';try{localStorage.setItem('fexozone-song-volume',String(v));}catch{}});
  audio.addEventListener('error',()=>{toggle.disabled=true;toggle.textContent='♪ Add SONG.mp3';});
  audio.addEventListener('play',()=>{toggle.disabled=false;toggle.textContent='Ⅱ Pause music';});
  audio.addEventListener('pause',()=>{if(!audio.error){toggle.disabled=false;toggle.textContent='▶ Play music';}});
  toggle.addEventListener('click',async()=>{try{if(audio.paused){await audio.play();}else{audio.pause();}}catch{toggle.textContent='♪ Add SONG.mp3';toggle.disabled=true;}});
  audio.load();
})();
