/**
 * Original, locally synthesized mechanical interface click. No network,
 * samples, external audio libraries, autoplay, or persistent permission.
 * The caller must create/resume AudioContext inside a real button gesture.
 */
export function playCinematicClick(ctx: AudioContext) {
  if (ctx.state !== "running") return;
  const t = ctx.currentTime;
  const sampleRate = ctx.sampleRate;
  const n = Math.max(64, Math.floor(sampleRate * 0.031));
  const buffer = ctx.createBuffer(1, n, sampleRate);
  const data = buffer.getChannelData(0);
  // A deterministic, sharply decaying noise impulse (no downloaded assets).
  let seed = 917321;
  for (let i = 0; i < n; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const noise = (seed / 0xffffffff) * 2 - 1;
    data[i] = noise * Math.pow(1 - i / n, 3.3);
  }
  const tick = ctx.createBufferSource();
  tick.buffer = buffer;
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.setValueAtTime(1450, t);
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.035;
  tick.connect(highpass);
  highpass.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  tick.start(t);
  tick.stop(t + 0.034);
  tick.onended=()=>{tick.disconnect();highpass.disconnect();noiseGain.disconnect();};

  const body = ctx.createOscillator();
  body.type = "triangle";
  body.frequency.setValueAtTime(680, t);
  body.frequency.exponentialRampToValueAtTime(270, t + 0.065);
  const bodyGain = ctx.createGain();
  bodyGain.gain.setValueAtTime(0.0001, t);
  bodyGain.gain.exponentialRampToValueAtTime(0.025, t + 0.002);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.073);
  body.connect(bodyGain);
  bodyGain.connect(ctx.destination);
  body.start(t);
  body.stop(t + 0.075);
  body.onended=()=>{body.disconnect();bodyGain.disconnect();};
}
